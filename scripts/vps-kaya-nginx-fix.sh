#!/usr/bin/env bash
# Run on the Hostinger VPS as root (or sudo). Backs up nginx, aligns Kaya hostnames, validates, reloads.
set -euo pipefail

APP_DIR="/var/www/kaya-healing-spa"
PM2_APP="kaya-healing-spa"
BACKUP_ROOT="/var/backups/kaya-nginx"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_ROOT}/${STAMP}"

if [ ! -d "${APP_DIR}" ]; then
  echo "ERROR: ${APP_DIR} not found"
  exit 1
fi

detect_port() {
  if command -v pm2 >/dev/null 2>&1; then
    local script
    script="$(pm2 describe "${PM2_APP}" 2>/dev/null | awk -F'│' '/script args/ {gsub(/ /,"",$4); print $4}')"
    if [ -n "${script}" ]; then
      local p
      p="$(echo "${script}" | grep -oE '\\-p[[:space:]]+[0-9]+' | awk '{print $2}')"
      if [ -n "${p}" ]; then
        echo "${p}"
        return 0
      fi
    fi
  fi
  if ss -ltn 2>/dev/null | grep -q ':3005'; then
    echo "3005"
    return 0
  fi
  echo "3005"
}

PORT="$(detect_port)"
echo "Using Kaya app port: ${PORT}"

mkdir -p "${BACKUP_DIR}"
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/sites-enabled" 2>/dev/null || true
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/sites-available" 2>/dev/null || true
cp -a /etc/nginx/conf.d "${BACKUP_DIR}/conf.d" 2>/dev/null || true
echo "Backed up nginx to ${BACKUP_DIR}"

python3 "${APP_DIR}/scripts/align-kaya-nginx.py" "${PORT}"

if nginx -t; then
  systemctl reload nginx
elif sudo nginx -t; then
  sudo systemctl reload nginx
else
  echo "ERROR: nginx -t failed; restore from ${BACKUP_DIR}"
  exit 1
fi

echo "Origin routing checks (Host header):"
for host in kayahealingspa.com.np www.kayahealingspa.com.np kaya.theglobalorbit.com; do
  code="$(curl -sS -o /tmp/kaya-origin-check.html -w '%{http_code}' -H "Host: ${host}" "http://127.0.0.1/" || true)"
  title="$(grep -o '<title>[^<]*' /tmp/kaya-origin-check.html | head -1 || true)"
  echo "  ${host} -> HTTP ${code} ${title}"
done
