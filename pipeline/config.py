from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = BASE_DIR / "assets"
WORKSPACE_DIR = BASE_DIR / "workspace"

# Video Configuration
VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080
VIDEO_FPS = 30

# Audio Configuration
AUDIO_SAMPLE_RATE = 44100
AUDIO_BITRATE = "192k"

# Shorts Configuration
SHORTS_DURATION_SECONDS = 30
