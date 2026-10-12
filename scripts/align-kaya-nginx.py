#!/usr/bin/env python3
"""Point only the kaya.theglobalorbit.com server block at this app's port."""

import re
import sys
from pathlib import Path

PRIMARY_DOMAIN = "kaya.theglobalorbit.com"
EXTRA_DOMAINS = ("kayahealingspa.com.np", "www.kayahealingspa.com.np")
ALL_MARKERS = (PRIMARY_DOMAIN, *EXTRA_DOMAINS)
APP_UPLOADS = "/var/www/kaya-healing-spa/public/uploads/"
SEARCH_DIRS = (
    Path("/etc/nginx/sites-enabled"),
    Path("/etc/nginx/sites-available"),
    Path("/etc/nginx/conf.d"),
)


def rewrite(text: str, port: str) -> tuple[str, str]:
    """Return updated text and a status: updated, aligned, or missing."""
    lines = text.splitlines(keepends=True)
    depth = 0
    server_base = None
    in_kaya = False
    upstreams: list[str] = []
    saw_proxy = False
    changed = False
    out: list[str] = []

    for line in lines:
        if server_base is None and re.search(r"^\s*server\s*\{", line):
            server_base = depth
            in_kaya = False

        if server_base is not None and "server_name" in line and any(d in line for d in ALL_MARKERS):
            in_kaya = True
        if in_kaya and "server_name" in line and PRIMARY_DOMAIN in line:
            missing = [d for d in EXTRA_DOMAINS if d not in line]
            if missing:
                line = line.rstrip("\n")
                if line.endswith(";"):
                    line = line[:-1] + " " + " ".join(missing) + ";\n"
                else:
                    line = line + " " + " ".join(missing) + "\n"
                changed = True

        if in_kaya and "client_max_body_size" in line:
            new_line, count = re.subn(
                r"client_max_body_size\s+[^;]+",
                "client_max_body_size 120m",
                line,
            )
            if count and new_line != line:
                line = new_line
                changed = True

        if in_kaya and re.search(r"^\s*proxy_buffer_size\s+", line):
            new_line, count = re.subn(
                r"proxy_buffer_size\s+[^;]+",
                "proxy_buffer_size 128k",
                line,
            )
            if count and new_line != line:
                line = new_line
                changed = True

        if in_kaya and "proxy_pass" in line:
            saw_proxy = True
            named = re.search(r"proxy_pass\s+http://([A-Za-z0-9_.-]+)\s*;", line)
            if named and named.group(1) not in ("127.0.0.1", "localhost"):
                upstreams.append(named.group(1))
            new_line, count = re.subn(
                r"(proxy_pass\s+http://(?:127\.0\.0\.1|localhost):)\d+",
                rf"\g<1>{port}",
                line,
            )
            if count and new_line != line:
                line = new_line
                changed = True

        out.append(line)
        depth += line.count("{") - line.count("}")
        if server_base is not None and depth <= server_base:
            server_base = None
            in_kaya = False

    updated = "".join(out)
    if upstreams:
        for name in dict.fromkeys(upstreams):
            pattern = re.compile(
                rf"(upstream\s+{re.escape(name)}\s*\{{.*?server\s+(?:127\.0\.0\.1|localhost):)\d+",
                re.S,
            )

            def repl(match: re.Match[str], new_port: str = port) -> str:
                return f"{match.group(1)}{new_port}"

            updated, count = pattern.subn(repl, updated, count=1)
            if count and updated != text:
                changed = True
                saw_proxy = True

    if PRIMARY_DOMAIN in updated and "client_max_body_size 120m" not in updated:
        updated, count = re.subn(
            r"(server_name[^\n]*" + re.escape(PRIMARY_DOMAIN) + r"[^\n]*\n)",
            r"\1        client_max_body_size 120m;\n        proxy_read_timeout 300s;\n        proxy_send_timeout 300s;\n        proxy_buffer_size 128k;\n        proxy_buffers 8 256k;\n        proxy_busy_buffers_size 512k;\n",
            updated,
            count=1,
        )
        if count:
            changed = True

    if PRIMARY_DOMAIN in updated and "location ^~ /uploads/" not in updated:
        upload_block = (
            f"        location ^~ /uploads/ {{\n"
            f"            alias {APP_UPLOADS};\n"
            f'            add_header Cache-Control "public, max-age=2592000";\n'
            f"            access_log off;\n"
            f"        }}\n"
        )
        updated, count = re.subn(
            r"(server_name[^\n]*" + re.escape(PRIMARY_DOMAIN) + r"[^\n]*\n)",
            r"\1" + upload_block,
            updated,
            count=1,
        )
        if count:
            changed = True

    if changed:
        return updated, "updated"
    if saw_proxy:
        return updated, "aligned"
    return updated, "missing"


def strip_extra_domains_from_foreign_blocks(text: str) -> tuple[str, bool]:
    """Remove .np hostnames from server blocks that are not the Kaya primary vhost."""
    lines = text.splitlines(keepends=True)
    depth = 0
    server_base: int | None = None
    block_has_primary = False
    block_has_extra = False
    changed = False
    out: list[str] = []

    def flush_server_end() -> None:
        nonlocal server_base, block_has_primary, block_has_extra

        server_base = None
        block_has_primary = False
        block_has_extra = False

    for line in lines:
        if server_base is None and re.search(r"^\s*server\s*\{", line):
            server_base = depth
            block_has_primary = False
            block_has_extra = False

        if server_base is not None and "server_name" in line:
            if PRIMARY_DOMAIN in line:
                block_has_primary = True
            if any(d in line for d in EXTRA_DOMAINS):
                block_has_extra = True
            if block_has_extra and not block_has_primary:
                new_line = line
                for d in EXTRA_DOMAINS:
                    new_line = re.sub(rf"\s*{re.escape(d)}", "", new_line)
                new_line = re.sub(r"server_name\s+;", "server_name _;", new_line)
                new_line = re.sub(r"\s+;", ";", new_line)
                if new_line != line:
                    line = new_line
                    changed = True

        out.append(line)
        depth += line.count("{") - line.count("}")
        if server_base is not None and depth <= server_base:
            flush_server_end()

    return "".join(out), changed


def find_ssl_directives(files: list[Path]) -> list[str]:
    """Copy ssl listen/cert lines from the Kaya primary server block when present."""
    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if PRIMARY_DOMAIN not in text:
            continue
        lines = text.splitlines()
        depth = 0
        in_primary = False
        collected: list[str] = []
        for line in lines:
            if re.search(r"^\s*server\s*\{", line):
                depth = line.count("{") - line.count("}")
                in_primary = False
                collected = []
                continue
            if "server_name" in line and PRIMARY_DOMAIN in line:
                in_primary = True
            if in_primary:
                stripped = line.strip()
                if stripped.startswith("listen ") and "443" in stripped:
                    collected.append(stripped)
                if stripped.startswith("ssl_certificate"):
                    collected.append(stripped)
                if stripped.startswith("ssl_certificate_key"):
                    collected.append(stripped)
            depth += line.count("{") - line.count("}")
            if depth <= 0 and in_primary and collected:
                return collected
    return []


def extra_domains_routed_to_port(files: list[Path], port: str) -> bool:
    """True if a server block lists .np hostnames and proxies to the Kaya port."""
    needle = f"127.0.0.1:{port}"
    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if not any(d in text for d in EXTRA_DOMAINS):
            continue
        blocks = re.split(r"(?=\nserver\s*\{)", text)
        for block in blocks:
            if not any(d in block for d in EXTRA_DOMAINS):
                continue
            if needle in block or f"localhost:{port}" in block:
                return True
    return False


def extra_domains_present_in_nginx(files: list[Path]) -> bool:
    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if any(d in text for d in EXTRA_DOMAINS):
            return True
    return False


def write_extra_domain_sidecar(port: str, ssl_lines: list[str]) -> Path | None:
    """When .np hostnames are not routed to Kaya, add a dedicated vhost (avoids default_server)."""
    target = Path("/etc/nginx/sites-available/kaya-healing-spa-extra-hosts.conf")
    names = " ".join(EXTRA_DOMAINS)
    ssl_block = ""
    if ssl_lines:
        ssl_block = "    " + "\n    ".join(ssl_lines) + "\n"
    else:
        print("WARN: no ssl directives found on primary Kaya vhost; sidecar listens on :80 only")
    body = f"""# Managed by align-kaya-nginx.py — Kaya Healing Spa extra hostnames
server {{
    listen 80;
    listen [::]:80;
{ssl_block}    server_name {names};
    client_max_body_size 120m;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_buffer_size 128k;
    proxy_buffers 8 256k;
    proxy_busy_buffers_size 512k;

    location ^~ /uploads/ {{
        alias {APP_UPLOADS};
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }}

    location / {{
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""
    try:
        target.write_text(body, encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: cannot write {target}: {exc}")
        return None
    enabled = Path("/etc/nginx/sites-enabled/kaya-healing-spa-extra-hosts.conf")
    try:
        if not enabled.exists():
            enabled.symlink_to(target)
    except OSError as exc:
        print(f"WARN: could not symlink {enabled}: {exc}")
    print(f"wrote sidecar {target} -> 127.0.0.1:{port}")
    return target


def main() -> int:
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        print("usage: align-kaya-nginx.py PORT", file=sys.stderr)
        return 2
    port = sys.argv[1]
    files = []
    for directory in SEARCH_DIRS:
        if directory.is_dir():
            files.extend(path for path in directory.rglob("*") if path.is_file())

    touched = 0
    ssl_lines = find_ssl_directives(files)
    for path in files:
        try:
            original = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            print(f"skip {path}: {exc}")
            continue
        if not any(d in original for d in ALL_MARKERS):
            continue
        stripped, strip_changed = strip_extra_domains_from_foreign_blocks(original)
        if strip_changed:
            print(f"removed .np hostnames from foreign vhost in {path}")
            original = stripped
        updated, status = rewrite(original, port)
        if status == "missing":
            print(f"no kaya proxy_pass in {path}")
            continue
        if "client_max_body_size 120m" not in updated:
            updated = updated.replace(
                f"server_name {PRIMARY_DOMAIN}",
                f"server_name {PRIMARY_DOMAIN} {' '.join(EXTRA_DOMAINS)};\n        client_max_body_size 120m;\n        proxy_read_timeout 300s;\n        proxy_send_timeout 300s",
                1,
            )
        if updated == original:
            print(f"already aligned {path}")
            touched += 1
            continue
        try:
            path.write_text(updated, encoding="utf-8")
        except OSError as exc:
            print(f"ERROR: cannot write {path}: {exc}")
            return 3
        touched += 1
        print(f"updated {path} -> 127.0.0.1:{port}")

    if not extra_domains_routed_to_port(files, port):
        print(".np hostnames not proxied to Kaya port; writing sidecar server block")
        if write_extra_domain_sidecar(port, ssl_lines):
            touched += 1
            files = []
            for directory in SEARCH_DIRS:
                if directory.is_dir():
                    files.extend(path for path in directory.rglob("*") if path.is_file())

    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if not any(d in text for d in EXTRA_DOMAINS):
            continue
        for d in EXTRA_DOMAINS:
            count = len(re.findall(rf"server_name[^;]*{re.escape(d)}", text))
            if count > 1:
                print(f"WARN: duplicate server_name for {d} in {path} ({count} occurrences)")

    if touched == 0:
        print(f"ERROR: no nginx proxy_pass updated for {PRIMARY_DOMAIN}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
