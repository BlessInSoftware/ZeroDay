#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-blessinsoftware}"
IMAGE_NAME="${IMAGE_NAME:-zeroday}"
TAG="${TAG:-latest}"
CONTAINER_NAME="${CONTAINER_NAME:-zeroday}"
RESTART_POLICY="${RESTART_POLICY:-unless-stopped}"
PORT="${PORT:-3000}"

FULL_IMAGE_NAME="${OWNER}/${IMAGE_NAME}:${TAG}"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --image)
      [ "$#" -lt 2 ] && echo "Missing value for --image" && exit 1
      FULL_IMAGE_NAME="$2"
      shift 2
      ;;
    --name)
      [ "$#" -lt 2 ] && echo "Missing value for --name" && exit 1
      CONTAINER_NAME="$2"
      shift 2
      ;;
    --restart)
      [ "$#" -lt 2 ] && echo "Missing value for --restart" && exit 1
      RESTART_POLICY="$2"
      shift 2
      ;;
    --port)
      [ "$#" -lt 2 ] && echo "Missing value for --port" && exit 1
      PORT="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: ./docker/development/run.sh [--image <image>] [--name <container>] [--restart <policy>] [--port <host_port>]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Use --help to see available options."
      exit 1
      ;;
  esac
done

if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  echo "Container ${CONTAINER_NAME} already exists. Removing it first..."
  docker rm -f "${CONTAINER_NAME}"
fi

echo "Starting container ${CONTAINER_NAME} from ${FULL_IMAGE_NAME} on port ${PORT}->3000..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:3000" \
  --restart "${RESTART_POLICY}" \
  "${FULL_IMAGE_NAME}"

echo "Container ${CONTAINER_NAME} is up at http://localhost:${PORT}"
