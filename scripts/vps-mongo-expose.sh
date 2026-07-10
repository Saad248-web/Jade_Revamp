#!/bin/bash
# Run on VPS as root/sudo — temporarily expose MongoDB for Vercel (port 27017).
# Revert with: sudo bash scripts/vps-mongo-lockdown.sh
set -euo pipefail

CONF="${MONGOD_CONF:-/etc/mongod.conf}"
BACKUP="${CONF}.bak.$(date +%Y%m%d%H%M%S)"

if [[ ! -f "$CONF" ]]; then
  echo "mongod.conf not found at $CONF"
  exit 1
fi

sudo cp "$CONF" "$BACKUP"
echo "Backed up to $BACKUP"

# Set bindIp to all interfaces (YAML or legacy)
if grep -q '^[[:space:]]*bindIp:' "$CONF"; then
  sudo sed -i 's/^[[:space:]]*bindIp:.*/  bindIp: 0.0.0.0/' "$CONF"
else
  echo "  bindIp: 0.0.0.0" | sudo tee -a "$CONF" >/dev/null
fi

sudo systemctl restart mongod
sleep 2
sudo systemctl is-active mongod

echo ""
echo "MongoDB now listening on 0.0.0.0:27017"
echo "Firewall (if ufw): sudo ufw allow 27017/tcp"
echo "Vercel URI:"
echo "  mongodb://jadeapp_user:Stack%402026@YOUR_VPS_PUBLIC_IP:27017/jadeapp?authSource=jadeapp"
echo ""
echo "After Vercel cutover / VPS app deploy, run: sudo bash scripts/vps-mongo-lockdown.sh"
