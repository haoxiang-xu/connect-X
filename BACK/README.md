# Connect-X-Flask-APP V0.2

## [ Table of Contents ]
- To Developers
  - [Local setup](#local-setup)
  - [deployment process](#deployment-process)

## [ To Developers ]

### LOCAL SETUP

- **Setup the Backend Flask Application**

  - To Backend File Server Directory `cd BACK`
  - (Optional) Create a python venv for this flask application `python -m venv [VENV_NAME]` (Windows)
  - (Optional) Run the python venv `[VENV_NAME]\Scripts\activate` (Windows)
  - (Optional) Run the python venv `source [VENV_NAME]/bin/activate` (Mac or Linux)
  - To install required dependencies `pip install -r requirements.txt`
  - Run Backend File Server `python BACK.py`
  - Server will running on `http://localhost:5000/` in development mode

### DEPLOYMENT PROCESS

<span style="opacity: 0.64">Notice: This deployment process will only works for the project owner in a Digital Ocean linux AMD server, You can use this as a reference. To deploy the project on your own server please check out [PROJECT README](../README.md)</span>

<span style="opacity: 0.64">1. Build Local Project into Docker images and push to Docker hub, Notice that [VERSION NUMBER] needs to be replaced.</span>

- `docker buildx create --use`

- To Frontend React Application Dir `cd FRONT`

- Build the Frontend React App in linux/amd64 ENV and push to docker hub `docker buildx build --platform linux/amd64 -t bananamilkt/connect-x-backend:v[VERSION_NUMBER] --push .`

- To Backend Python Flask Application Dir `cd BACK`

- Build the Backend Python Flask Application in linux/amd64 ENV and push to docker hub `docker buildx build --platform linux/amd64 -t bananamilkt/connect-x-backend:v[VERSION_NUMBER] --push .`

<span style="opacity: 0.64">2. After Server started, you should login into your docker account, pull your docker hub repo and build start the docker images.</span>

- To login your docker account `docker login`

- (Optional) Stop and remove current running container if necessary `docker stop connect-x-backend` -> `docker rm connect-x-backend`

- To pull Both frontend Applications `docker pull bananamilkt/connect-x-backend:v[VERSION_NUMBER]`

- To run the Frontend React Application `docker run -d -p 5000:5000 --name connect-x-backend bananamilkt/connect-x-backend:v[VERSION_NUMBER]`

- (Optional) Check if the container is running `docker ps`