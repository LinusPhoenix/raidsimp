#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo 'prepare_containers.sh $version'
    exit 1
fi

version=$1
set -x

cd backend
docker build --build-arg RAIDSIMP_VERSION=$1 -t raidsimp-backend:$version .
docker save raidsimp-backend:$version -o ../docker/raidsimp-backend-$version.tar

cd ../frontend
docker build --build-arg RAIDSIMP_VERSION=$1 -t raidsimp-frontend:$version .
docker save raidsimp-frontend:$version -o ../docker/raidsimp-frontend-$version.tar
