<p align="center">
  <img src="./public/images/guardBot-1db954-circle.png" width="120" alt="Guard Bot Logo" />
</p>
<p align="center">A guard bot for your collaborative playlists on Spotify.</p>
  
# Spotify Playlist Guard
This is a project of a bot guard for collaborative playlist on Spotify. Test the bot in action:
- Use the [Test playlist](https://open.spotify.com/playlist/5wkdAzv8ZArH5cyvXQTRYe) by adding a song to it and wait for it to be removed once every minute;
- Check if the bot is up and running accessing its [status webpage](https://spotify-playlist-guard.herokuapp.com/).

## Context

Spotify defines playlists as collaborative, private and public. The collaborative status is given to playlists which users want to share with friends or trusty people. However, once the playlists is set to collaborative, any user with access to the URL that leads to that playlist is able to edit it, adding or deleing tracks. At the day of the publication of this project - 07/03/2022 - there is no official available way of limiting access to collaborative playlists.

More discussions can be found in the official Spotify community forum:

-   [Spotify commnunity #5208607 - Playlists Limit Editing Access in Collaborative Playlists](https://community.spotify.com/t5/Live-Ideas/Playlists-Limit-Editing-Access-in-Collaborative-Playlists/idi-p/5208607).

## The application

This is the codebase for the bot server which performs a guard routine removing, from selected playlists, tracks added by unauthorized users. Please check the other app related to this project:

-   [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api): An API for registering to the Spotify Playlist Guard and add playlists to be guarded.

### Guard routine

The guard routine performed by the application consists of:

1. Retrieving the active playlists registered in the service from the [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api);
2. Fetch the current state of the playlist from the [Spotify Web API](https://developer.spotify.com/documentation/web-api/);
3. Compare the two states of the playlists in terms of its [snapshot_id](https://developer.spotify.com/documentation/general/guides/working-with-playlists/#version-control-and-snapshots) and track's property 'added_by' which declares the related user;
4. Once tracks added by unauthorized users are detected, the application:
    1. Removes these tracks from the Spotify playlist ;
    2. Updates it in the Spotify Playlist Guard API service.

Each guard routine performed for a playlist is published and consumed by a message queue.

**Notes:**

-   Ideally, taking into account the architecture of this application, the producer and consumer of the queues should be hosted in differente servers to avoid loops to block the server instance, but for the current size of the project, these two parts of the application are being exectued in the same server.
-   At the day of the publication of this project, the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) does not provide a two-way communication protocol for access to state changes such as playlist update, player update, etc. Therefore, the alternative presented by this project, as described above, consists of periodic calls to the Spotify API in order to get changes in the state of the playlists. More discussions about this topic can be found in the resources:

    -   [Spotify commnunity #4955299 - Access to websockets](https://community.spotify.com/t5/Spotify-for-Developers/Access-to-websockets/td-p/4955299);
    -   [Github Issue #1558](https://github.com/spotify/web-api/issues/1558).

### Technologies and libraries

-   [TypeScript](https://www.typescriptlang.org/) as language;
-   [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api) to interact with the application data using [axios](https://axios-http.com/) as HTTP client;
-   [Spotify Web API](https://developer.spotify.com/documentation/web-api/) with [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) as client wrapper;
-   [node-cron](https://github.com/node-cron/node-cron) for scheduling a cron job to execute the guard routine;
-   [RabbitMQ](https://www.rabbitmq.com/) for message queuing of the routine using [amqplib](https://github.com/amqp-node/amqplib) as client;
-   [Express](https://expressjs.com/) as web framework to expose a status endpoint of the application.
-   [Heroku](https://www.heroku.com/) as cloud server host;

Also , the tools used in the development environment:

-   [Docker](https://www.docker.com/) for a containerized instance of [RabbitMQ](https://hub.docker.com/_/rabbitmq).

## Usage - Run this app in your machine

Requirements:

-   [Docker for deskop](https://www.docker.com/products/docker-desktop) installed in your machine;
-   [Docker Compose](https://docs.docker.com/compose) (The Windows and Mac versions of Docker Desktop include Docker Compose in their installation, so you only need to install it separately if you are using the Linux version);
-   [NodeJS and npm](https://nodejs.org/en/) installed in your machine;
-   [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api) runnind on your machine - see the project`s repo for instructions on how to run it and its dependencies services as containers on your machine;
-   A terminal of your choice.

Steps:

1. Clone this repo on your local directory;
2. In the terminal, enter the created directory and run the following command to install all the dependencies:

```
npm install -y
```

### Run this app in your machine in a containerized environment in development mode:

3. Create a .env file based on the .env.example in this project and insert the values of the vars based on your development environment.

Note: **When running both the app and the message broker as a containers, the RABBITMQ_HOST env var must be set to 'rabbitmq'**;

4. Initialize the Docker app in your machine and run the following command at the root of your directory to build the image of the app, start the containers and intialize the them:

```
docker-compose up --build -V -d
```

The application will then be available at 'http://localhost:3030'

5. Once the containers and volumes are created in your machine, simply use the commands to start and stop them:

```
docker-compose start
```

```
docker-compose stop
```

### Run this app in your machine locally using only the DB container:

3. Create a .env file based on the .env.example in this project and insert the values of the vars based on your development environment. 

Note: **When running the the app locally, the RABBITMQ_HOST env var must be set to 'localhost'**;

4. Remove the 'main' service of the docker-compose.yml file;

5. Initialize the Docker app in your machine and run the following command at the root of your directory to intialize the containers of the external services:

```
docker-compose up -d
```

6. Run the following command to run the app in development mode:

```
npm run dev
```

7. For a production-like running app, run the following commands:

```
npm run build
```

```
npm run start
```

The application will then be available at 'http://localhost:3030'

# Development and contributions

## Commit Message Guidelines

This project uses [Convention Commit](https://www.conventionalcommits.org/) with [ AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) specifications for standard commit messages.

## License

Spotify Playlist Guard is published under [MIT license](https://github.com/marcus-castanho/spotify_playlist_guard/blob/main/LICENSE)
