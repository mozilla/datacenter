## Build

1. Install Docker
    * [Mac](https://docs.docker.com/docker-for-mac/)
2. `docker build -t datacenter .`

## Run

1. `PORT=3000 docker run -e PORT -p 3000:3000 datacenter`
2. Navigate to [localhost:3000](http://localhost:3000)
