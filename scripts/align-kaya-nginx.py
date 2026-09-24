#!/usr/bin/env python3
"""Point only the kaya.theglobalorbit.com server block at this app's port."""

import re
import sys
from pathlib import Path

DOMAIN = "kaya.theglobalorbit.com"
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

        if server_base is not None and "server_name" in line and DOMAIN in line:
            in_kaya = True

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

    if changed:
        return updated, "updated"
    if saw_proxy:
        return updated, "aligned"
    return updated, "missing"


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
    for path in files:
        try:
            original = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            print(f"skip {path}: {exc}")
            continue
        if DOMAIN not in original:
            continue
        updated, status = rewrite(original, port)
        if status == "missing":
            print(f"no kaya proxy_pass in {path}")
            continue
        if status == "aligned":
            print(f"already pointing at 127.0.0.1:{port} in {path}")
            touched += 1
            continue
        try:
            path.write_text(updated, encoding="utf-8")
        except OSError as exc:
            print(f"ERROR: cannot write {path}: {exc}")
            return 3
        touched += 1
        print(f"updated {path} -> 127.0.0.1:{port}")

    if touched == 0:
        print(f"ERROR: no nginx proxy_pass updated for {DOMAIN}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
