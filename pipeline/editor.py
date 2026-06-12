"""
editor.py - Compose the final video.

Pipeline:
1. Take B-roll clips + voiceover MP3
2. Build a sequence of segments with the voiceover as the base
3. Lay B-roll over each section (crossfades every 4-7 seconds)
4. Add a background music track (optional)
5. Render with ffmpeg

Requires:
- ffmpeg installed and in PATH
"""
from __future__ import annotations

import json
import random
import re
import subprocess
from pathlib import Path
from typing import Optional

from . import config


# ============================================================
# PROBE
# ============================================================

def _ffprobe_duration(path: Path) -> float:
    """Return duration in seconds via ffprobe."""
    try:
        out = subprocess.check_output(
            [
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", str(path),
            ],
            text=True,
        )
        return float(out.strip())
    except Exception as e:
        print(f"  [WARN] ffprobe failed for {path}: {e}")
        return 0.0


def _ffprobe_has_audio(path: Path) -> bool:
    try:
        out = subprocess.check_output(
            [
                "ffprobe", "-v", "error", "-select_streams", "a",
                "-show_entries", "stream=index", "-of", "csv=p=0", str(path),
            ],
            text=True,
        )
        return out.strip() != ""
    except Exception:
        return False


def _font_path() -> str:
    """Return a path to a bold TTF, or empty string for default."""
    for c in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        if Path(c).exists():
            return c
    return ""


# ============================================================
# CONCAT + LOOP B-ROLL TO MATCH VOICEOVER LENGTH
# ============================================================

def _concat_clips_to_length(clips: list[Path], target_seconds: float, out_path: Path) -> Optional[Path]:
    """
    Concatenate (and loop if needed) the B-roll clips until we reach `target_seconds`.
    Each clip is trimmed to a max of 5-7 seconds and re-encoded for consistency.
    """
    if not clips:
        print("  [WARN] No B-roll clips provided.")
        return None

    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Build the concat list, looping clips until we hit target
    work_dir = out_path.parent / "_work"
    work_dir.mkdir(exist_ok=True)
    segment_files: list[Path] = []

    accumulated = 0.0
    i = 0
    while accumulated < target_seconds:
        clip = clips[i % len(clips)]
        # Trim/normalize each segment
        seg_path = work_dir / f"seg_{len(segment_files):04d}.mp4"
        # Each segment is 5 seconds
        seg_dur = 5.0
        if accumulated + seg_dur > target_seconds:
            seg_dur = target_seconds - accumulated
        if seg_dur <= 0.2:
            break
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", "0", "-i", str(clip),
            "-t", f"{seg_dur:.2f}",
            "-vf", f"scale={config.VIDEO_WIDTH}:{config.VIDEO_HEIGHT}:force_original_aspect_ratio=increase,crop={config.VIDEO_WIDTH}:{config.VIDEO_HEIGHT},fps={config.VIDEO_FPS},format=yuv420p",
            "-an",
            "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            str(seg_path),
        ]
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=60)
            if seg_path.exists() and seg_path.stat().st_size > 0:
                segment_files.append(seg_path)
                accumulated += seg_dur
        except Exception as e:
            print(f"  [WARN] Failed to build segment from {clip}: {e}")
        i += 1
        if i > 200:
            break  # safety

    if not segment_files:
        return None

    # Concat with ffmpeg concat demuxer
    list_file = work_dir / "concat_list.txt"
    list_file.write_text("\n".join(f"file '{p.resolve()}'" for p in segment_files))
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-c", "copy",
        str(out_path),
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=300)
    except Exception as e:
        print(f"  [WARN] Concat failed: {e}")
        return None

    return out_path if out_path.exists() else None


# ============================================================
# COMBINE VIDEO + VOICEOVER + OPTIONAL MUSIC
# ============================================================

def compose_video(
    voiceover: Path,
    broll_clips: list[Path],
    out_path: Path,
    music: Optional[Path] = None,
) -> Optional[Path]:
    """
    Final render:
    1. Concatenate B-roll to match voiceover length.
    2. Mux with voiceover audio.
    3. If music is provided, mix it at -18dB under the voiceover.
    """
    out_path.parent.mkdir(parents=True, exist_ok=True)
    duration = _ffprobe_duration(voiceover)
    if duration <= 0:
        print("  [WARN] Invalid voiceover duration. Using default 10s simulation.")
        duration = 10.0
    print(f"  [Editor] Voiceover duration: {duration:.1f}s")

    work = out_path.parent / "_work"
    work.mkdir(exist_ok=True)

    # 1. Build video track
    video_track = work / "video_track.mp4"
    print("  [Editor] Building video track from B-roll...")
    res = _concat_clips_to_length(broll_clips, duration, video_track)
    if not res:
        print("  [WARN] Could not build video track.")
        return None

    # 2. Mux with voiceover
    muxed = work / "muxed.mp4"
    print("  [Editor] Muxing with voiceover...")
    cmd_mux = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(video_track),
        "-i", str(voiceover),
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", config.AUDIO_BITRATE,
        "-ar", str(config.AUDIO_SAMPLE_RATE),
        "-shortest",
        str(muxed),
    ]
    try:
        subprocess.run(cmd_mux, check=True, capture_output=True, timeout=300)
    except Exception as e:
        print(f"  [WARN] Mux failed: {e}")
        return None

    # 3. Add background music (optional)
    if music and music.exists():
        print("  [Editor] Adding background music...")
        cmd_music = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(muxed),
            "-stream_loop", "-1", "-i", str(music),
            "-filter_complex", "[1:a]volume=0.12,afade=t=in:st=0:d=2,afade=t=out:st=" + f"{duration-3}" + ":d=3[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0[a]",
            "-map", "0:v", "-map", "[a]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", config.AUDIO_BITRATE,
            "-shortest",
            str(out_path),
        ]
        try:
            subprocess.run(cmd_music, check=True, capture_output=True, timeout=300)
        except Exception as e:
            print(f"  [WARN] Music mix failed: {e}, using no-music version.")
            shutil_move(muxed, out_path)
    else:
        shutil_move(muxed, out_path)

    if out_path.exists():
        size_mb = out_path.stat().st_size / (1024 * 1024)
        print(f"  [OK] Final video: {out_path} ({size_mb:.1f} MB, {duration:.0f}s)")
        return out_path
    return None


def shutil_move(src: Path, dst: Path):
    import shutil
    shutil.move(str(src), str(dst))


# ============================================================
# SHORTS (VERTICAL 9:16) RENDERER
# ============================================================

def compose_short(
    voiceover: Path,
    broll_clips: list[Path],
    out_path: Path,
    caption_text: str = "",
) -> Optional[Path]:
    """Render a 9:16 Short from the same B-roll + voiceover (re-encoded for vertical)."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    duration = _ffprobe_duration(voiceover)
    if duration <= 0:
        print("  [WARN] Invalid voiceover duration. Using default 10s simulation.")
        duration = 10.0
    # For Shorts, target 30-60s. If voiceover is longer, trim it.
    target = min(duration, float(config.SHORTS_DURATION_SECONDS))
    work = out_path.parent / "_work_short"
    work.mkdir(exist_ok=True)

    # Build vertical video
    video_track = work / "video_track_v.mp4"
    if not broll_clips:
        return None

    # Loop B-roll, then vertical crop
    accumulated = 0.0
    segment_files = []
    i = 0
    while accumulated < target:
        clip = broll_clips[i % len(broll_clips)]
        seg_path = work / f"vseg_{len(segment_files):04d}.mp4"
        seg_dur = min(5.0, target - accumulated)
        if seg_dur <= 0.2:
            break
        # Vertical 9:16 (1080x1920)
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", "0", "-i", str(clip),
            "-t", f"{seg_dur:.2f}",
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
            "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            str(seg_path),
        ]
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=60)
            if seg_path.exists() and seg_path.stat().st_size > 0:
                segment_files.append(seg_path)
                accumulated += seg_dur
        except Exception as e:
            print(f"  [WARN] Failed to build segment from {clip}: {e}")
        i += 1
        if i > 200:
            break

    if not segment_files:
        return None

    # Concat vertical video
    list_file = work / "concat_list_v.txt"
    list_file.write_text("\n".join(f"file '{p.resolve()}'" for p in segment_files))
    concat_video = work / "concat_v.mp4"
    cmd_concat = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-c", "copy",
        str(concat_video),
    ]
    try:
        subprocess.run(cmd_concat, check=True, capture_output=True, timeout=300)
    except Exception as e:
        print(f"  [WARN] Concat failed: {e}")
        return None

    # Apply text overlay captions if caption_text is provided
    with_captions = work / "with_captions_v.mp4"
    if caption_text:
        font = _font_path()
        font_arg = f":fontfile={font}" if font else ""
        text_escaped = caption_text.replace(":", "\\:").replace("'", "\\'")
        vf = (
            f"drawtext=text='{text_escaped}':fontcolor=0xFFD700:fontsize=72{font_arg}"
            f":x=(w-text_w)/2:y=(h-text_h)/2-180"
        )
        cmd_text = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(concat_video),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            str(with_captions),
        ]
        try:
            subprocess.run(cmd_text, check=True, capture_output=True, timeout=120)
        except Exception as e:
            print(f"  [WARN] Shorts captioning overlay failed: {e}")
            with_captions = concat_video
    else:
        with_captions = concat_video

    # Mux with voiceover
    final_mux = work / "final_short_mux.mp4"
    cmd_mux = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(with_captions),
        "-ss", "0", "-i", str(voiceover),
        "-t", f"{target:.2f}",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", config.AUDIO_BITRATE,
        "-ar", str(config.AUDIO_SAMPLE_RATE),
        "-shortest",
        str(final_mux),
    ]
    try:
        subprocess.run(cmd_mux, check=True, capture_output=True, timeout=300)
        shutil_move(final_mux, out_path)
    except Exception as e:
        print(f"  [WARN] Shorts mux failed: {e}")
        shutil_move(with_captions, out_path)

    # Cleanup temp work dir
    try:
        import shutil
        shutil.rmtree(work)
    except Exception:
        pass

    return out_path if out_path.exists() else None
