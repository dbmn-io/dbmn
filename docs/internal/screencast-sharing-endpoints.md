# Screencast: Sharing Endpoints — Production Guide

**Target:** 60–90 second screencast showing the Share/Paste workflow end-to-end.

---

## Recording Tools

| Tool | Platform | Notes |
|------|----------|-------|
| **OBS Studio** | Windows/Mac/Linux | Free, full control, records to MP4. Best quality. |
| **Loom** | Browser extension | Free tier (25 videos, 5 min each). Records + hosts + gives embed link in one step. Easiest option. |
| **Windows Game Bar** | Windows | Win+G → Record. Zero setup, decent quality. No editing. |
| **ShareX** | Windows | Free, lightweight, GIF or MP4, good for short clips. |

**Recommendation:** Use **Loom** if you want zero editing and instant hosting. Use **OBS** if you want to edit or add captions afterwards.

### OBS Quick Setup
1. Install OBS Studio
2. Add a "Window Capture" source → select VS Code
3. Set output to 1920x1080 (or your monitor resolution)
4. Audio: add "Audio Output Capture" if you want system sounds, "Audio Input Capture" for mic
5. Settings → Output → Recording Format: MP4, Encoder: x264, CRF 18

### Loom Quick Setup
1. Install Loom browser extension or desktop app
2. Select "Screen Only" (no webcam) or "Screen + Cam" if you want a face bubble
3. Select VS Code window
4. Hit Record
5. When done, Loom gives you the embed URL immediately

---

## Pre-Recording Setup

### VS Code Preparation
- [ ] Open VS Code with Dobermann installed
- [ ] Have an environment already configured (so the endpoint can reference `ENV:` variables)
- [ ] Have a **saved endpoint** ready (the "sender" endpoint) — something recognisable like "Create Order" with a few headers and a JSON body with template variables
- [ ] Close all other VS Code tabs/panels to reduce visual noise
- [ ] Set VS Code to a clean dark theme
- [ ] Zoom VS Code to ~120-140% so text is readable on video (Ctrl+= to zoom in)
- [ ] Hide the VS Code activity bar sidebar if not needed (Ctrl+B)

### Screen Preparation
- [ ] Close all notifications / system tray popups
- [ ] Set display to 1920x1080 if possible
- [ ] Hide taskbar or set to auto-hide
- [ ] Close Slack/Teams/email to avoid notification popups during recording

---

## Shot List & Script

The video has **two acts**: the Sender and the Receiver. One continuous recording, no cuts needed.

### Act 1 — The Sender (30–40 seconds)

| # | Action | Duration | What viewer sees |
|---|--------|----------|-----------------|
| 1 | Open the saved endpoint | 3s | Endpoint webview loads showing "Create Order" with method, path, headers, body |
| 2 | Pause — let viewer read the endpoint | 3s | Viewer absorbs the full configuration |
| 3 | Click **Share** button | 2s | Click the Share button in the toolbar |
| 4 | Success notification appears | 2s | Footer notification: "Endpoint copied to clipboard" |
| 5 | Switch to Microsoft Teams (or Outlook) | 3s | Alt-Tab to a Teams chat window |
| 6 | Paste (Ctrl+V) into a Teams message | 3s | Rich HTML renders — styled DBMN header, formatted code block |
| 7 | Pause — let viewer see the Teams rendering | 5s | The endpoint looks professional in Teams |
| 8 | (Optional) Also paste into Notepad to show plain text format | 5s | JSONC with metadata comments visible |

**Narration (if using audio):**
> "I have an endpoint configured in Dobermann — Create Order, with headers, template variables, and a JSON body. I click Share... and paste it into Teams. My colleague sees the full configuration, formatted and ready to use."

### Act 2 — The Receiver (30–40 seconds)

| # | Action | Duration | What viewer sees |
|---|--------|----------|-----------------|
| 9 | Switch back to VS Code | 2s | Back in Dobermann |
| 10 | Create a **new endpoint** | 3s | Click "+" or "New Endpoint" — empty endpoint form appears |
| 11 | Point out the **Paste** button | 2s | Mouse hovers over the Paste button (only visible on new endpoints) |
| 12 | Click **Paste** | 2s | Click it |
| 13 | Endpoint populates | 3s | Name, method, path, headers, body all fill in automatically |
| 14 | (If header modal appears) Confirm new headers | 3s | Click confirm on the header confirmation modal |
| 15 | Scroll through the populated endpoint | 5s | Show that everything matches — same headers, same body, same variables |
| 16 | Click **Save** | 2s | Endpoint saved — ready to use |

**Narration (if using audio):**
> "On the other side, I create a new endpoint and click Paste. Everything comes across — name, method, headers, the full request body with all the template variables. Save it, and I'm ready to go."

### Closing (5 seconds)

| # | Action | Duration | What viewer sees |
|---|--------|----------|-----------------|
| 17 | (Optional) Show both endpoints side by side or end on the saved endpoint | 5s | Clean ending shot |

**Narration (if using audio):**
> "Share any endpoint with your team in seconds. Dobermann."

---

## Post-Recording

### If Using Loom
1. Trim start/end in Loom editor (drag the handles)
2. Copy the embed URL
3. Paste into `docs/sharing-endpoints.md` replacing the video placeholder comment

### If Using OBS / Other
1. Trim in a free editor (DaVinci Resolve, Clipchamp, or even Windows Video Editor)
2. Export as MP4 (H.264, 1080p)
3. Upload to YouTube (unlisted) or Loom
4. Get embed URL and update `docs/sharing-endpoints.md`

### Embedding the Video

In `docs/sharing-endpoints.md`, replace the placeholder comment block with:

**YouTube:**
```html
<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
  <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    frameborder="0" allowfullscreen>
  </iframe>
</div>
```

**Loom:**
```html
<div style="position:relative;padding-bottom:56.25%;height:0;">
  <iframe src="https://www.loom.com/embed/YOUR_VIDEO_ID"
    frameborder="0" allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;">
  </iframe>
</div>
```

---

## Tips for a Clean Recording

- **Move the mouse deliberately** — slow, purposeful movements. Don't flick the cursor around.
- **Pause after each action** — give viewers 2-3 seconds to absorb what just happened.
- **No audio is fine** — the visual flow is self-explanatory. Captions or text overlays can be added later.
- **If you make a mistake**, just pause, then redo the action. Trim in post.
- **Record at 1x speed** — don't rush. You can speed up sections in editing if needed.
