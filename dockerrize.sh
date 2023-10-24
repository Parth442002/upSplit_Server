echo "Running Docker Build Script"

docker build -t parth404/upsplit_server:1.0 .
docker push parth404/upsplit_server:1.0