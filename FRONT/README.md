# Connect-X-ReactJS-APP V0.2

## [ Table of Contents ]
- To Developers
  - [Local setup](#local-setup)
  - [deployment process](#deployment-process)

## [ To Developers ]

### LOCAL SETUP

- **Setup the Frontend React Application**

  - To Frontend Testing Application Directory `cd FRONT`
  - To install required modules `npm install`
  - Run Frontend Testing Application `npm start`
  - Heading to the Application `http://localhost:3000/`

### DEPLOYMENT PROCESS

<span style="opacity: 0.64">Notice: This deployment process will only works for the project owner in a Digital Ocean linux AMD server, You can use this as a reference. To deploy the project on your own server please check out [PROJECT README](../README.md)</span>

<span style="opacity: 0.64">1. Build Local Project into Docker images and push to Docker hub, Notice that [VERSION NUMBER] needs to be replaced.</span>

- `docker buildx create --use`

- To Frontend React Application Dir `cd FRONT`

- Build the Frontend React App in linux/amd64 ENV and push to docker hub `docker buildx build --platform linux/amd64 -t bananamilkt/connect-x-frontend:v[VERSION_NUMBER] --push .`

<span style="opacity: 0.64">2. After Server started, you should login into your docker account, pull your docker hub repo and build start the docker images.</span>

- To login your docker account `docker login`

- (Optional) Stop and remove current running container if necessary `docker stop connect-x-frontend` -> `docker rm connect-x-frontend`

- To pull Both frontend and backend Applications `docker pull bananamilkt/connect-x-frontend:v[VERSION_NUMBER]`

- To run the Frontend React Application `docker run -d -p 3000:3000 --name connect-x-frontend bananamilkt/connect-x-frontend:v[VERSION_NUMBER]`

- (Optional) Check if the container is running `docker ps`