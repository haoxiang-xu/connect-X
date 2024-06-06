# [Connect-X](http://143.110.216.120:3000/)

## [ About the Project ]

<img width="755" alt="Screenshot 2024-06-06 at 17 12 13" src="https://github.com/haoxiang-xu/connect-X/assets/59581718/4c19a6a5-9768-4d84-8168-bc3b53c4b7b9">

## [ To Developers ]

### LOCAL SETUP

#### DOCKER SETUP

<span style="opacity: 0.32">Setup the whole application in a docker container</span>

- run `docker-compose up --build`

#### OR SETUP SEPARATELY

<span style="opacity: 0.32">Run the frontend and backend applications separately</span>

- **Setup the Frontend React Application**

  - To Frontend Testing Application Directory `cd FRONT`
  - To install required modules `npm install`
  - Run Frontend Testing Application `npm start`
  - Heading to the Application `http://localhost:3000/`

- **Setup the Backend Flask Application**

  - To Backend File Server Directory `cd BACK`
  - (Optional) Create a python venv for this flask application `python -m venv [VENV_NAME]` (Windows)
  - (Optional) Run the python venv `[VENV_NAME]\Scripts\activate` (Windows)
  - To install required dependencies `pip install -r requirements.txt`
  - Run Backend File Server `python BACK.py`
  - Server will running on `http://localhost:5000/` in development mode

### DEPLOYMENT PROCESS

<span style="opacity: 0.64">1. Build Local Project into Docker images and push to Docker hub, Notice that [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO] and [VERSION NUMBER] needs to be replaced.</span>

- `docker buildx create --use`

- To Frontend React Application Dir `cd FRONT`

- Build the Frontend React App in linux/amd64 ENV and push to docker hub `docker buildx build --platform linux/amd64 -t [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO]:v[VERSION_NUMBER] --push .`

- To Backend Python Flask Application Dir `cd BACK`

- Build the Backend Python Flask Application in linux/amd64 ENV and push to docker hub `docker buildx build --platform linux/amd64 -t [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO]:v[VERSION_NUMBER] --push .`

<span style="opacity: 0.64">2. After Server started, you should login into your docker account, pull your docker hub repo and build start the docker images.</span>

- To login your docker account `docker login`

- To pull Both frontend and backend Applications `docker pull [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO]:v[VERSION_NUMBER]`

- To run the Frontend React Application `docker run -d -p 3000:3000 --name connect-x-frontend [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO]:v[VERSION_NUMBER]`

- To run the Backend Python Flask Application
  `docker run -d -p 5000:5000 --name connect-x-backend [YOUR_DOCKER_USERNAME/DOCKER_HUB_REPO]:v[VERSION_NUMBER]`

- Check Both Docker Containers are running `docker ps`
