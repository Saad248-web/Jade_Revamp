#!/bin/bash
# Run on VPS after Next.js is on same host — lock Mongo to localhost only.
set -euo pipefail

CONF="${MONGOD_CONF:-/etc/mongod.conf}"
BACKUP="${CONF}.bak.$(date +%Y%m%d%H%M%S)"

sudo cp "$CONF" "$BACKUP"
sudo sed -i 's/^[[:space:]]*bindIp:.*/  bindIp: 127.0.0.1/' "$CONF"
sudo systemctl restart mongod

echo "MongoDB bound to 127.0.0.1 only. Backup: $BACKUP"
echo "Optional: sudo ufw delete allow 27017/tcp"
