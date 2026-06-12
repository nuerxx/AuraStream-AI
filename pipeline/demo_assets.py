"""
demo_assets.py - Generate synthetic B-roll for testing without API keys.

Produces short colored clips with text overlays to simulate
"downloads" so the full pipeline (editor, voice, render) can be
tested end-to-end offline.
"""
from __future__ import annotations

import random
import re
import subprocess
from pathlib import Path

from . import config


# Generate colorful test clips with text overlays
CLIPS = [
    {"name": "stadium_intro",  "bg": "0x0A1A3A", "text": "WORLD CUP 2026",     "duration": 5, "color": "0xFFD700"},
    {"name": "crowd_hype",     "bg": "0xDC143C", "text": "THE STADIUM",        "duration": 4, "color": "0xFFFFFF"},
    {"name": "tactical_board", "bg": "0xFFD700", "text": "TACTICAL ANALYSIS",  "duration": 5, "color": "0x000000"},
    {"name": "match_action",   "bg": "0x1E40AF", "text": "MATCH HIGHLIGHTS",   "duration": 4, "color": "0xFFFFFF"},
    {"name": "player_focus",   "bg": "0x000000", "text": "STAR PLAYER",        "duration": 4, "color": "0xFFD700"},
    {"name": "data_chart",     "bg": "0x0F7A3D", "text": "STAT BREAKDOWN",     "duration": 5, "color": "0xFFFFFF"},
    {"name": "fan_reaction",   "bg": "0x7C0A24", "text": "FAN REACTION",       "duration": 4, "color": "0xFFD700"},
    {"name": "highlight_reel", "bg": "0x6B21A8", "text": "TOP MOMENTS",        "duration": 5, "color": "0xFFFFFF"},
    {"name": "training_ground","bg": "0xFF8C00", "text": "PRE-MATCH PREP",     "duration": 4, "color": "0x000000"},
    {"name": "trophy_lift",    "bg": "0xFFD700", "text": "TROPHY",             "duration": 5, "color": "0x000000"},
]


def _font_path() -> str:
    """Return a path to a bold TTF, or empty string for default."""
    for c in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        if Path(c).exists():
            return c
    return ""


def generate_demo_broll(topic: str, out_dir: Path, n: int = 8) -> list[Path]:
    """
    Generate `n` synthetic B-roll clips using ffmpeg color source.
    Each clip is a solid-color background with centered text.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    safe = re.sub(r"[^a-zA-Z0-9_]+", "_", topic)[:30].strip("_")
    font = _font_path()
    paths: list[Path] = []

    for i, spec in enumerate(CLIPS[:n]):
        out_path = out_dir / f"demo_{i:02d}_{spec['name']}.mp4"

        # Step 1: generate the solid color background
        bg_path = out_dir / f"_bg_{i:02d}.mp4"
        cmd_bg = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "lavfi",
            "-i", f"color=c={spec['bg']}:s={config.VIDEO_WIDTH}x{config.VIDEO_HEIGHT}:d={spec['duration']}:r={config.VIDEO_FPS}",
            "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
            "-pix_fmt", "yuv420p", "-an",
            str(bg_path),
        ]
        try:
            subprocess.run(cmd_bg, check=True, capture_output=True, timeout=60)
        except Exception as e:
            print(f"  [WARN] BG generation failed for clip {i}: {e}")
            continue

        # Step 2: overlay text using drawtext (escape colons in the text)
        text_escaped = spec["text"].replace(":", "\\:").replace("'", "\\'")
        font_arg = f":fontfile={font}" if font else ""
        vf = (
            f"drawtext=text='{text_escaped}':fontcolor={spec['color']}:fontsize=120{font_arg}"
            f":x=(w-text_w)/2:y=(h-text_h)/2-60"
        )
        cmd_txt = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(bg_path),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
            "-pix_fmt", "yuv420p", "-an",
            str(out_path),
        ]
        try:
            subprocess.run(cmd_txt, check=True, capture_output=True, timeout=60)
            if out_path.exists() and out_path.stat().st_size > 0:
                paths.append(out_path)
        except Exception as e:
            # If drawtext fails, fall back to the no-text bg
            if bg_path.exists():
                bg_path.replace(out_path)
                paths.append(out_path)
            else:
                print(f"  [WARN] text overlay failed for clip {i}: {e}")
        finally:
            if bg_path.exists():
                try:
                    bg_path.unlink()
                except Exception:
                    pass

    return paths


# ============================================================
# CLI
# ============================================================

if __name__ == "__main__":
    import sys
    topic = sys.argv[1] if len(sys.argv) > 1 else "World Cup 2026"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    out = config.ASSETS_DIR / "broll_demo" / re.sub(r"[^a-zA-Z0-9_]+", "_", topic)[:30]
    paths = generate_demo_broll(topic, out, n)
    print(f"\n[OK] Generated {len(paths)} demo B-roll clips in {out}")
    for p in paths:
        print(f"  - {p.name} ({p.stat().st_size // 1024} KB)")
