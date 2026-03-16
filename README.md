# LTX-Desktop-WanGP — Pinokio Launcher

> **One-click installer and launcher for [LTX-Desktop-WanGP](https://github.com/deepbeepmeep/LTX-Desktop-WanGP) via [Pinokio](https://pinokio.computer).**

This repo provides Pinokio launcher scripts for the [LTX Desktop](https://github.com/deepbeepmeep/LTX-Desktop-WanGP) project — a desktop AI video generation app powered by the LTX-2 engine with a [WanGP](https://github.com/deepbeepmeep/Wan2GP) backend for local GPU-accelerated generation.

## Features

- **1-click install** — clones the upstream repo and sets up the Python backend with `uv sync`
- **Auto-detects WanGP** — if you have [Wan2GP](https://github.com/deepbeepmeep/Wan2GP) installed as a sibling Pinokio app, it's detected automatically
- **FastAPI backend server** — launches the LTX-2 generation server with SageAttention acceleration
- **Standalone Electron launcher** — includes `launch.bat` for running the full desktop app outside Pinokio

## Install via Pinokio

1. Open Pinokio
2. Click **Download** and paste this URL:
   ```
   https://github.com/hoodtronik/LTX-Desktop-WanGP-Pinokio
   ```
3. Click **Install** to set up dependencies
4. Click **Start** to launch the backend server

## WanGP Integration

For local video generation (no API keys needed), install [Wan2GP](https://github.com/deepbeepmeep/Wan2GP) as a sibling Pinokio app. The launcher auto-detects it and sets `WANGP_ROOT` automatically.

If your Wan2GP is in a non-standard location, set the `WANGP_ROOT` environment variable to the folder containing `wgp.py`.

## Standalone Desktop App

To run the full Electron desktop app (with React UI), double-click **`launch.bat`** in the project root. This installs pnpm/Node.js dependencies on first run and launches the app via `pnpm dev`.

## Upstream

This is a Pinokio launcher fork of **[deepbeepmeep/LTX-Desktop-WanGP](https://github.com/deepbeepmeep/LTX-Desktop-WanGP)**. All core application code lives in the upstream repo.

## API Usage

The backend exposes a FastAPI server. Once running, access the interactive API docs at `http://127.0.0.1:<PORT>/docs`.

### Python
```python
import requests
BASE_URL = "http://127.0.0.1:<PORT>"

# Health check
requests.get(f"{BASE_URL}/health").json()

# Generate video
requests.post(f"{BASE_URL}/api/generate", json={
    "prompt": "A cinematic mountain landscape at sunset",
    "num_frames": 65, "width": 768, "height": 512
}).json()
```

### cURL
```bash
curl http://127.0.0.1:<PORT>/health
curl -X POST http://127.0.0.1:<PORT>/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cinematic mountain landscape", "num_frames": 65}'
```

## License

See the [upstream repository](https://github.com/deepbeepmeep/LTX-Desktop-WanGP) for license details.
