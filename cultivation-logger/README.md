**Requirements**: [uv](https://astral.sh/blog/uv)

### Install Python 3.12
```bash
uv python install 3.12
```

### Create virtual environment and install dependencies
```bash
uv venv
source .venv/bin/activate
uv sync
```

### Run the application
```bash
uv run main.py
```