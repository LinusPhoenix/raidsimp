# RaidSIMP (**S**imple **I**nterface for **M**anagement **P**urposes)

Try it at https://raidsimp.com/.

## Wanna contribute?

Grab something from `todos.md` and submit a pull request!

## Local Development

See the READMEs in the backend and frontend directories for more information.

## Deployment

1. Build the docker containers locally with the correct version tag:

```
cd backend/
docker build -t raidsimp-backend:<version>

cd frontend/
docker build -t raidsimp-frontend:<version>
```

2. Save the docker containers in a tarball:

```
docker save raidsimp-backend:<version> -o ../docker/raidsimp-backend.tar
docker save raidsimp-frontend:<version> -o ../docker/raidsimp-frontend.tar
```

3. Copy the tarballs to the server:

```
scp -i <path to ssh key> <your workspace>\wow-raid-manager\docker <user>@<server ip>:/dockerexp
```

4. On the server, import the tarballs as docker images:

```
docker load -i /dockerexp
```

5. Clone the github repo and check out the release that you want to run.

6. `docker-compose up -d`
