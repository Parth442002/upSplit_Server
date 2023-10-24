#!bin/bash

# Build the Docker image

docker build -t parth404/upsplit_server:1.0 .

# Push the Docker image to Docker Hub
docker push docker.io/parth404/upsplit_server:1.0
