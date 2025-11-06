FROM python:3.10-slim

RUN pip install uv
WORKDIR /app
COPY . .
RUN uv sync --locked || pip install -r requirements.txt
CMD ["uv", "run", "src/agent.py", "start"]
