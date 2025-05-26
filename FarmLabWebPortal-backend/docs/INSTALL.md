# Installing project for developing on local PC

You have to have the following tools installed prior initializing the project:

- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [poetry](https://python-poetry.org/docs/#installation)
- [docker](https://docs.docker.com/engine/install/)

## Prepare python env

Create separate python virtual environment if you are going to run it in local:

```bash
uv venv --python 3.12 --prompt farmlab-webportal --seed
source .venv/bin/activate && poetry install
```

## Prepare environment

Please create a new local `.env` file based on `.env.local`

## Run database and redis

```bash
docker compose up
```

## Run pre-commit

Install pre-commit:

```bash
pre-commit install
```

Run pre-commit for code linting:

```bash
pre-commit
```
