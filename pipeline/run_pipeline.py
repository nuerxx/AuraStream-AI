"""
run_pipeline.py - Orchestrates the entire offline video generation pipeline.
Usage: python3 -m pipeline.run_pipeline <topic> <num_clips> <output_type> <caption_text>
"""
from __future__ import annotations

import sys
import re
import subprocess
from pathlib import Path

from . import config
from . import demo_assets
from . import editor

def generate_mock_voiceover(duration: float, out_path: Path) -> Path:
    """Generate a placeholder silent audio track with beep signals via ffmpeg for offline testing."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    # Using ffmpeg's sine sound generator to construct a clean target 10s audio track for voiceover
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "lavfi", "-i", f"sine=frequency=220:sample_rate={config.AUDIO_SAMPLE_RATE}:duration={duration}",
        "-c:a", "aac", "-b:a", config.AUDIO_BITRATE,
        str(out_path)
    ]
    subprocess.run(cmd, check=True, capture_output=True, timeout=30)
    return out_path

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 -m pipeline.run_pipeline <topic> <num_clips> <output_type> <caption_text>")
        sys.exit(1)

    topic = sys.argv[1]
    n_clips = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    out_type = sys.argv[3] if len(sys.argv) > 3 else "short" # "video" or "short"
    caption = sys.argv[4] if len(sys.argv) > 4 else "WORLD CUP SPECTACLE"

    print(f"[Pipeline] Starting orchestration for topic: '{topic}'")
    safe_topic = re.sub(r"[^a-zA-Z0-9_]+", "_", topic)[:30].strip("_")
    
    # 1. Generate B-roll
    broll_dir = config.BASE_DIR / "assets" / "broll_demo" / safe_topic
    print(f"[Pipeline] Generating {n_clips} synthetic B-rolls in {broll_dir}")
    brolls = demo_assets.generate_demo_broll(topic, broll_dir, n_clips)
    if not brolls:
        print("[Error] Failed to generate B-roll clips.")
        sys.exit(1)
    print(f"[Pipeline] Successfully generated {len(brolls)} B-rolls.")

    # 2. Generate Voiceover
    voiceover_path = config.BASE_DIR / "assets" / "temp_voiceover.aac"
    duration = 10.0 if out_type == "short" else 20.0
    print(f"[Pipeline] Synthesizing mock audio voiceover tracks ({duration}s)")
    generate_mock_voiceover(duration, voiceover_path)

    # 3. Compile output
    out_dir = config.BASE_DIR / "assets" / "rendered"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    if out_type == "short":
        final_video = out_dir / f"{safe_topic}_short.mp4"
        print(f"[Pipeline] Rendering 9:16 vertical short: {final_video}")
        res = editor.compose_short(voiceover_path, brolls, final_video, caption)
    else:
        final_video = out_dir / f"{safe_topic}_video.mp4"
        print(f"[Pipeline] Rendering 16:9 cinematic video: {final_video}")
        res = editor.compose_video(voiceover_path, brolls, final_video)

    if res and res.exists():
        print(f"[OK_PIPELINE] rendered_path={res.resolve()}")
    else:
        print("[Error] Rendering failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
