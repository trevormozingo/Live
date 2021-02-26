docker build . -t live
docker tag live:latest mozingo.jfrog.io/live-docker/live:0.1.0
docker push mozingo.jfrog.io/live-docker/live:0.1.0