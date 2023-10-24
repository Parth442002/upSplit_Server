echo "Running Docker Build Script"

docker build --platform linux/amd64 --tag parth404/upsplit_server:latest  --label upsplit_label .
docker image prune --force --filter='label=my-label'
docker push parth404/upsplit_server:latest
echo "Process Completed"
