# LTX Desktop - WanGP Backend Launcher

LTX Desktop powered by WanGP — a local AI video generation server using the LTX-2 engine with WanGP bridge for enhanced model support.

## What it does

This launcher runs the **Python FastAPI backend** of [LTX-Desktop-WanGP](https://github.com/deepbeepmeep/LTX-Desktop-WanGP), which provides:

- **Video generation** via LTX-2 models (text-to-video, image-to-video)
- **Image generation** through the WanGP bridge
- **WanGP integration** for local GPU-accelerated generation using your existing Wan2GP installation
- **Model management** with automatic downloading from HuggingFace
- **SageAttention acceleration** for faster inference on supported GPUs

## How to use

1. Click **Install** to clone the repository and set up Python dependencies
2. Click **Start** to launch the backend FastAPI server
3. The server URL will appear in Pinokio — use it to access the API

### WanGP Integration

If you have [Wan2GP](https://github.com/deepbeepmeep/Wan2GP) installed as a sibling Pinokio app (at `../wan.git/app/`), it will be automatically detected. The backend delegates video/image generation to WanGP when available.

## API Documentation

The backend exposes a FastAPI server. Once running, visit the server URL for the API.

### Python

```python
import requests

BASE_URL = "http://127.0.0.1:<PORT>"  # Replace with actual port from Pinokio

# Check health
r = requests.get(f"{BASE_URL}/health")
print(r.json())

# Generate video
payload = {
    "prompt": "A cinematic shot of a mountain landscape at sunset",
    "num_frames": 65,
    "width": 768,
    "height": 512
}
r = requests.post(f"{BASE_URL}/api/generate", json=payload)
print(r.json())
```

### JavaScript

```javascript
const BASE_URL = "http://127.0.0.1:<PORT>"; // Replace with actual port

// Check health
const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
console.log(health);

// Generate video
const response = await fetch(`${BASE_URL}/api/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "A cinematic shot of a mountain landscape at sunset",
    num_frames: 65,
    width: 768,
    height: 512
  })
});
const result = await response.json();
console.log(result);
```

### cURL

```bash
# Health check
curl http://127.0.0.1:<PORT>/health

# Generate video
curl -X POST http://127.0.0.1:<PORT>/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cinematic shot of a mountain landscape at sunset", "num_frames": 65, "width": 768, "height": 512}'
```
