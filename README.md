# RaidSIMP (**S**imple **I**nterface for **M**anagement **P**urposes)

RaidSIMP is a web application to help you visualize and manage the roster of your raiding guild or community.

Try it at [raidsimp.com](https://raidsimp.com/)!

## Contributions Welcome!

Have a look at the issues in the repository and submit a PR when you have something.

## Local Development

The project is split into backend and frontend; The backend is a REST API powered by NestJS, the frontend is a React single page application.

See the READMEs in the backend and frontend directories for more information.

## Deployment for raidsimp.com

The backend runs as a docker container, the frontend is a static build that Caddy serves from a folder on the server.

### Prepare Deployment

- Bump the version number in `backend/package.json` and `frontend/package.json`.
- Run `npm install` in both the backend and frontend directory.
- Bump the backend image version in `docker-compose.yml`.
- Create a release preparation commit on the develop branch.
- Create a pull request to merge develop into main.
  - Description should be a changelog of the release.
  - Copy description to merge message.
- Merge the pull request.
- Push a version tag to that main branch commit.
- Close any issues that were fixed by that release.

### Build

Run the script from the repository root. The version defaults to the one in `backend/package.json`.

```bash
./prepare_containers.sh [version]
```

This creates two things in `./docker/`:

- `raidsimp-backend-<version>.tar`: the backend docker image.
- `raidsimp-frontend-<version>/`: the production build of the frontend. It is built with the settings from `frontend/.env.build`, regardless of any local `.env` files such as `.env.local`.

### Deploy the backend

1. Copy the tarball to the server:

```bash
scp -i <path to ssh key> ./docker/raidsimp-backend-<version>.tar <user>@<server ip>:~/
```

2. On the server, import it as a docker image:

```bash
docker load -i ~/raidsimp-backend-<version>.tar
```

3. Bump the image version of `raidsimp-backend` in `docker-compose.yml` on the server.

4. Restart the container. Database migrations run automatically on startup.

```bash
docker-compose down
docker-compose up -d
```

### Deploy the frontend

1. Copy the build folder to the server's user directory:

```bash
scp -i <path to ssh key> -r ./docker/raidsimp-frontend-<version> <user>@<server ip>:~/
```

2. On the server, move it to the Caddy directory:

```bash
sudo mv ~/raidsimp-frontend-<version> /app/caddy/srv/
```

3. Point the `raidsimp` symlink at the new version. Use a relative target, so that the link also resolves inside the Caddy container, and `-n` so an existing link is replaced instead of followed.

```bash
cd /app/caddy/srv
ln -sfn raidsimp-frontend-<version> raidsimp
```

No restart is needed. To roll back, point the symlink at the previous `raidsimp-frontend-<version>` folder.

Old frontend versions are not deleted automatically, remove them from `/app/caddy/srv` when you no longer need them.
