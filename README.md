# [Connect-X Playground](http://143.110.216.120:3000/)

## [ Table of Contents ]
- About the Project
  - [Introduction](#intro)
  - [built with](#built-with)
  - [Kaggle Submission](#kaggle-submission)
- To Everyone
- To Developers
  - [Local setup](#local-setup)
  - [current implemented agents](#current-implemented-agents)
  - [implement and test your own agent](#implement-and-test-your-own-agent)
  - [deployment process](#deployment-process)

## [ About the Project ]

### INTRO

This project features a user-friendly UI that allows players to engage with classic AI algorithms or pit them against each other in the famed Kaggle Connect-X competition setting. It includes:

1. Interactive UI: Play the Connect X game directly or watch AI algorithms compete.
2. Multiple AI Algorithms: Dive into a variety of classic AI algorithms used in competitive gaming, including [one](DEMOs/submission.py) that was entered into [Kaggle's Connect-X competition](https://www.kaggle.com/competitions/connectx/overview) and achieved a notable 16th place ranking.
   
<img width="1152" alt="Screenshot 2024-06-10 at 12 31 44" src="https://github.com/haoxiang-xu/connect-X/assets/59581718/41273866-55aa-4cc7-b110-5db8ef2c7a80">

4. Custom Agent Development: Follow an easy-to-understand guide to develop your own AI agent, visually test it, and compete against existing algorithms.
5. Deployment Instructions: Comprehensive deployment guidelines are provided for those looking to host this as a web application.

<img width="316" alt="Screenshot 2024-06-06 at 18 12 42" src="https://github.com/haoxiang-xu/connect-X/assets/59581718/f9a796d9-9470-4d17-ba37-4af3eb666297">

### BUILT WITH

[![Node][Node-download-shield]][Node-install]
[![Docker][Docker-download-shield]][Docker-install]
[![vscode][vscode-download-shield]][vscode-install]

### KAGGLE SUBMISSION

Check the [Kaggle Submission](DEMOs/submission.py)

## [ To Everyone ]

[TRY IT OUT](http://143.110.216.120:3000/)

## [ To Developers ]

<span style="opacity: 0.32">This web application provides a comprehensive platform for testing and interacting with various AI agents developed for the ConnectX game. Built with a React frontend and a Python Flask backend, this platform offers a visually engaging interface that allows users to easily interact with and evaluate the performance of different game AI agents.</span>

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



### CURRENT IMPLEMENTED AGENTS 

#### RANDOM
<span style="opacity: 0.64">This agent's strategy is straightforward: it selects its moves purely at random from the set of available columns. This means it doesn't follow any tactical approach or attempt to block the opponent's moves. While this agent may not provide challenging gameplay for human players or sophisticated AI opponents, it serves as a useful baseline for testing the game mechanics and for comparing the performance of more advanced agents developed later in the project.</span>


#### GREEDY
<span style="opacity: 0.64">The Greedy Agent in the ConnectX game employs a more strategic approach than the Random Agent. It selects its moves based on a scoring system it evaluates for each possible move, always choosing the one with the highest score. The default scoring mechanism involves calculating the move that enables the longest possible connection of tokens. This includes considering both the current move's potential to extend a line of consecutive tokens and the surrounding growable space up to the required "inarow" length. If a move directly leads to a win, it is assigned an infinite score, symbolizing an immediate game-winning opportunity. Conversely, if a move would allow the opponent to win on their next turn, it receives a negative infinite score to avoid such scenarios. This method helps the Greedy Agent to make decisions that maximize its chances of winning while blocking potential threats from the opponent.</span>

#### MIN_MAX
<span style="opacity: 0.64">The Minimax Agent in the ConnectX game utilizes the classic minimax algorithm, a decision-making tool used in game theory and artificial intelligence to minimize the possible loss for a worst-case scenario. This agent adopts the same scoring system as described for the Greedy Agent, evaluating each potential move based on the ability to create the longest connections and considering the implications of each move in terms of immediate wins or losses.<br><br>The essence of the minimax approach is to look several moves ahead, calculating the best move by assuming that the opponent also plays optimally. At each decision point, the algorithm simulates both the player's and the opponent's moves, assessing the maximum benefit the player can achieve while minimizing the opponent's best possible response. This recursive evaluation continues until a terminal state (win, loss, or draw) is reached or until a specified depth limit is achieved, making it a powerful method for strategic planning in ConnectX.</span>

#### MONTE CARLO (USED IN KAGGLE CONNECT-X COMPETITION)

<span style="opacity: 0.64">The Monte Carlo Agent in the ConnectX game leverages the Monte Carlo Tree Search (MCTS) algorithm, a probabilistic model widely used in AI for making optimal decisions in problem spaces with a high degree of complexity. This agent performs 384 simulations for each possible move to statistically determine the most promising move based on the outcomes of these simulations.<br><br>In each simulation, the agent plays out random moves from the current state to the end of the game. The results of these simulations are then aggregated to estimate the likelihood of winning for each potential move. Moves that frequently lead to winning outcomes in the simulations are prioritized, while less successful moves are considered less favorable. This method allows the Monte Carlo Agent to make informed decisions even in the face of uncertain or highly variable game scenarios, effectively balancing exploration of new moves with the exploitation of known successful strategies.</span>


<span style="opacity: 0.64">To enhance the Monte Carlo Agent's decision-making process in the ConnectX game, we can refine its scoring system to account more explicitly for immediate game outcomes:</span>

<span style="opacity: 0.64">1. Immediate Win Detection: If a simulation reveals that a move directly leads to a win on the agent's next turn, that move is assigned a score of 1. This indicates a guaranteed victory, and such moves are given the highest priority.</span>

<span style="opacity: 0.64">2. Immediate Loss Prevention: Conversely, if a move would allow the opponent to win on their next turn, the move is scored as 0. This discourages the agent from making moves that would lead directly to a loss, ensuring defensive strategies are considered.</span>

<span style="opacity: 0.64">3. Probabilistic Scoring: For all other scenarios where the move does not immediately result in a win or prevent a loss, the score is calculated based on the probability of winning derived from the simulations. These scores range between 0 and 1, with higher scores reflecting a greater likelihood of winning as observed in the simulated play-outs. This probabilistic approach allows the agent to assess the potential long-term benefits of each move, not just the immediate outcomes.</span>

<span style="opacity: 0.64">By adopting this scoring system, the Monte Carlo Agent can make more nuanced decisions that effectively balance between securing immediate advantages and strategically positioning for future game states. This method helps in optimizing both offensive and defensive plays, making the agent robust against a variety of opponent strategies.</span>

### IMPLEMENT AND TEST YOUR OWN AGENT

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


[Node-download-shield]: https://img.shields.io/badge/Node.js-v21.6.2-222222?style=for-the-badge&logo=Node.js&logoColor=FFFFFF&labelColor=339933
[Node-install]: https://nodejs.org/en/download

[Docker-download-shield]: https://img.shields.io/badge/Docker-v4.28.0-222222?style=for-the-badge&logo=Docker&logoColor=FFFFFF&labelColor=2496ED
[Docker-install]: https://www.docker.com/products/docker-desktop/

[vscode-download-shield]: https://img.shields.io/badge/Visual_Studio_Code-v1.87.0-222222?style=for-the-badge&logo=VisualStudioCode&logoColor=FFFFFF&labelColor=007ACC
[vscode-install]: https://code.visualstudio.com/download
