import os
import cv2
import numpy as np
import subprocess
import imageio_ffmpeg

# Paths
INPUT_VIDEO = r"C:\Users\santo\.gemini\antigravity\brain\520fb908-905e-4602-9082-aa4155428c2e\.user_uploaded\media_1793286848434_ad2f04d8.mp4"
TEMP_DIR = r"C:\Users\santo\.gemini\antigravity\brain\520fb908-905e-4602-9082-aa4155428c2e\scratch\video_process"
os.makedirs(TEMP_DIR, exist_ok=True)
FRAMES_DIR = os.path.join(TEMP_DIR, "frames")
os.makedirs(FRAMES_DIR, exist_ok=True)

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

print("1. Opening input video...")
cap = cv2.VideoCapture(INPUT_VIDEO)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# We trim right before the explosion: frame 90 (exactly 3.0 seconds at 30fps)
MAX_FRAMES = 90
print(f"Video specs: {width}x{height} @ {fps}fps, total frames={total_frames}. Processing first {MAX_FRAMES} frames (3.00s)...")

# Kernel for dilation
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
kernel_sm = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))

# Sharpening kernel for subtle high-quality crispness
sharpen_kernel = np.array([
    [0, -0.2, 0],
    [-0.2, 1.8, -0.2],
    [0, -0.2, 0]
], dtype=np.float32)

frame_idx = 0
while frame_idx < MAX_FRAMES:
    ret, frame = cap.read()
    if not ret:
        break

    # Build per-frame inpainting mask
    mask = np.zeros((height, width), dtype=np.uint8)

    # 1. Subtitle below SANTO STARK STUDIO (y=345..425, x=200..1080)
    sub_crop = frame[345:425, 200:1080]
    gray_sub = cv2.cvtColor(sub_crop, cv2.COLOR_BGR2GRAY)
    _, th_sub = cv2.threshold(gray_sub, 140, 255, cv2.THRESH_BINARY)
    th_sub_dil = cv2.dilate(th_sub, kernel, iterations=1)
    mask[345:425, 200:1080] = th_sub_dil

    # 2. Watermark in bottom right corner (y=570..715, x=990..1270)
    wm_crop = frame[570:715, 990:1270]
    gray_wm = cv2.cvtColor(wm_crop, cv2.COLOR_BGR2GRAY)
    # Detect bright watermark elements
    _, th_wm = cv2.threshold(gray_wm, 120, 255, cv2.THRESH_BINARY)
    th_wm_dil = cv2.dilate(th_wm, kernel, iterations=1)
    mask[570:715, 990:1270] = th_wm_dil

    # Inpaint subtitle and watermark
    inpainted = cv2.inpaint(frame, mask, 5, cv2.INPAINT_TELEA)

    # High quality enhancement:
    # Blend subtle sharpening (60% sharpened, 40% original) to keep solar surface smooth while making Stark title razor-sharp
    sharpened = cv2.filter2D(inpainted, -1, sharpen_kernel)
    enhanced = cv2.addWeighted(sharpened, 0.45, inpainted, 0.55, 0)

    # Soft fade out in the last 6 frames (frames 84 to 90) for seamless transition into 3D
    if frame_idx >= 84:
        fade_factor = (90 - frame_idx) / 6.0
        enhanced = (enhanced.astype(np.float32) * fade_factor).astype(np.uint8)

    out_frame_path = os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.png")
    cv2.imwrite(out_frame_path, enhanced)

    if frame_idx % 15 == 0:
        print(f"  Processed frame {frame_idx}/{MAX_FRAMES}")

    frame_idx += 1

cap.release()
print(f"All {frame_idx} frames processed and saved.")

# Extract and trim audio with 0.4s fade-out at end
TEMP_AUDIO = os.path.join(TEMP_DIR, "trimmed_audio.aac")
cmd_audio = [
    FFMPEG_EXE, "-y",
    "-i", INPUT_VIDEO,
    "-t", "3.00",
    "-af", "afade=t=out:st=2.6:d=0.4",
    "-c:a", "aac", "-b:a", "192k",
    TEMP_AUDIO
]
print("2. Extracting & trimming audio with smooth fade-out...")
subprocess.run(cmd_audio, check=True)

# Encode final clean MP4
OUTPUT_MP4 = os.path.join(TEMP_DIR, "studio-welcome.mp4")
cmd_encode = [
    FFMPEG_EXE, "-y",
    "-framerate", str(fps),
    "-i", os.path.join(FRAMES_DIR, "frame_%04d.png"),
    "-i", TEMP_AUDIO,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "slow",
    "-crf", "17",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    "-shortest",
    OUTPUT_MP4
]
print("3. Encoding final high-quality H.264 video...")
subprocess.run(cmd_encode, check=True)

print(f"Success! Reconstructed video saved at: {OUTPUT_MP4}")
size_bytes = os.path.getsize(OUTPUT_MP4)
print(f"File size: {size_bytes / (1024*1024):.2f} MB")
