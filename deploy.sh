#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  AI机器人·成长营 - 部署脚本
#  部署目标：阿里云服务器 120.76.98.45
#  根目录：/www/wwwroot/airobot.zengqi.site
# ============================================================

REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_HOST="${REMOTE_HOST:-120.76.98.45}"
REMOTE_PATH="${REMOTE_PATH:-/www/wwwroot/airobot.zengqi.site}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "  AI机器人·成长营 部署脚本"
echo "=========================================="
echo "目标服务器: ${REMOTE_USER}@${REMOTE_HOST}"
echo "目标路径: ${REMOTE_PATH}"
echo ""

# 1. 在远程服务器创建目录
echo "[1/3] 在远程服务器创建目录..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p '${REMOTE_PATH}'"

# 2. 复制文件到远程服务器
echo "[2/3] 复制文件到远程服务器..."
scp -r "${SCRIPT_DIR}/"* "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

# 3. 设置文件权限
echo "[3/3] 设置文件权限..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" "chown -R www:www '${REMOTE_PATH}' 2>/dev/null || chown -R ${REMOTE_USER}:${REMOTE_USER} '${REMOTE_PATH}'"
ssh "${REMOTE_USER}@${REMOTE_HOST}" "find '${REMOTE_PATH}' -type d -exec chmod 755 {} \\; 2>/dev/null; find '${REMOTE_PATH}' -type f -exec chmod 644 {} \\; 2>/dev/null"

echo ""
echo "=========================================="
echo "  ✅ 部署完成！"
echo "=========================================="
echo "  网站地址: http://airobot.zengqi.site"
echo "  服务器: ${REMOTE_HOST}"
echo "  路径: ${REMOTE_PATH}"
echo "=========================================="
echo ""
echo "如果使用 Nginx，请确保配置："
echo "  server {"
echo "      listen 80;"
echo "      server_name airobot.zengqi.site;"
echo "      root ${REMOTE_PATH};"
echo "      index index.html;"
echo "      location / {"
echo "          try_files \$uri \$uri/ =404;"
echo "      }"
echo "  }"