#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-blessinsoftware}"
IMAGE_NAME="${IMAGE_NAME:-zeroday}"
TAG="${TAG:-latest}"

FULL_IMAGE_NAME="${OWNER}/${IMAGE_NAME}:${TAG}"

echo "Building image ${FULL_IMAGE_NAME}..."
docker build -t "${FULL_IMAGE_NAME}" .
echo "Build completed: ${FULL_IMAGE_NAME}"
