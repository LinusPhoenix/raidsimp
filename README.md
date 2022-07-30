# RaidSIMP (**S**imple **I**nterface for **M**anagement **P**urposes)

RaidSIMP is a web application to help you visualize and manage the roster of your raiding guild or community.

Try it at [raidsimp.com](https://raidsimp.com/)!

## Contributions Welcome!

Have a look at the issues in the repository and submit a PR when you have something.

## Local Development

The project is split into backend and frontend; The backend is a REST API powered by NestJS, the frontend is a React single page application.

See the READMEs in the backend and frontend directories for more information.

## Deployment for raidsimp.com

### Prepare Deployment

- Bump the version numbers in `backend/package.json` and `frontend/package.json`.
- Run `npm install` in both the backend and frontend directory.
- Bump the version numbers in `docker-compose.yml`.
- Create a release preparation commit on the develop branch.
- Create a pull request to merge develop into main.
  - Description should be a changelog of the release.
  - Copy description to merge message.
- Merge the pull request.
- Push a version tag to that main branch commit.
- Close any issues that were fixed by that release.

### Execute Deployment

1. Build the docker containers locally with the correct version tag:

```bash
./prepare_containers.sh <version>
```

2. Copy the tarballs to the server:

```bash
scp -i <path to ssh key> -r ./docker/ <user>@<server ip>:~/dockerexp
```

3. On the server, import the tarballs as docker images:

```bash
docker load -i ~/dockerexp
```

4. Clone the github repo on the server and check out the release that you want to run.

5. `docker-compose up -d`
