#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PACKAGE_DIR}"

echo "Building @clankgster/sync package artifacts..."
pnpm run build

echo "Packing npm tarball..."
PACK_OUTPUT="$(pnpm pack --config.ignore-scripts=true)"
TARBALL_FILENAME="$(printf '%s\n' "${PACK_OUTPUT}" | awk '/\.tgz$/ {print $0}' | awk 'END{print}')"
if [[ -z "${TARBALL_FILENAME}" ]]; then
  echo "Failed to determine tarball filename from pnpm pack output."
  exit 1
fi
TARBALL_PATH="${PACKAGE_DIR}/${TARBALL_FILENAME}"

echo ""
echo "Tarball ready:"
echo "${TARBALL_PATH}"
echo ""
echo "Install in a test project:"
echo "npm install \"${TARBALL_PATH}\""
