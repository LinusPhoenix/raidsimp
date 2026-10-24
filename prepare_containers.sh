#!/bin/bash
# Builds everything that gets deployed, into ./docker:
#   raidsimp-backend-<version>.tar   docker image of the backend
#   raidsimp-frontend-<version>/     production build of the frontend (static files)
#
# The version defaults to the one in backend/package.json.
set -euo pipefail

if [ "$#" -gt 1 ]; then
    echo 'prepare_containers.sh [version]'
    exit 1
fi

root=$(cd "$(dirname "$0")" && pwd)
version=${1:-$(node -p "require('$root/backend/package.json').version")}
set -x

mkdir -p "$root/docker"

cd "$root/backend"
docker build --build-arg RAIDSIMP_VERSION="$version" -t "raidsimp-backend:$version" .
docker save "raidsimp-backend:$version" -o "$root/docker/raidsimp-backend-$version.tar"

# Variables from .env.build are exported into the shell, which takes precedence over any
# .env files in the frontend directory. Otherwise a local .env.local would end up in the build.
cd "$root/frontend"
(
    set -a
    . ./.env.build
    set +a
    npm run build
)
rm -rf "$root/docker/raidsimp-frontend-$version"
cp -r build "$root/docker/raidsimp-frontend-$version"
