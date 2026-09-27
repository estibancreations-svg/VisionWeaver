# VisionWeaver × ChatGPT · Master Prompt and Setup (v1)

**For:** Sire · **Date:** 2026-09-27 · **Project:** *Crossroads of Identity*, produced through VisionWeaver

This document has five parts:

- **A.** The short answers: which YouTube app, and how the bot works.
- **B.** One-time setup steps.
- **C.** Core instructions for Bot 1, **VisionWeaver Studio**, which makes the pictures and video with Runway.
- **D.** Core instructions for Bot 2, **VisionWeaver Publisher**, which uploads and schedules.
- **E.** The Playbook, a knowledge file both bots read.
- **F.** Sources.

Think of it like a film studio with two departments. The **Studio** shoots the movie and the **Publisher** delivers it to theaters. You're the studio head: nothing moves from one department to the next until you say "APPROVED."

---

## A. The short answers

**1. Which YouTube app? YouTube Studio.** YouTube Studio is where a channel uploads, schedules and manages its videos. YouTube Create is only a phone editing app (Android only), and it doesn't manage your channel (Epidemic Sound, 2023).

**Important:** ChatGPT can't open or tap through apps on your phone. You grant access by **signing into your Google/YouTube account through Zapier** (the service that does the uploading). That sign-in gives Zapier permission to upload to your channel, and it's the same permission YouTube Studio uses.

**2. Why two bots instead of one?** A custom GPT can use **either** apps (like Runway) **or** actions (like sending to Zapier), **not both at the same time** (OpenAI, n.d.-a). So Bot 1 holds the Runway app and makes the media, and Bot 2 holds the Zapier action and publishes.

**3. Why Zapier in the middle?** ChatGPT has no built-in way to upload to YouTube; automated uploading runs through the YouTube Data API plus a custom GPT or a tool like Zapier (Carly, 2026). Zapier's YouTube connection has an "Upload Video" step (Zapier, n.d.).

There's also a trap in doing it directly. Videos uploaded through a brand-new Google API project stay stuck on **private** until Google audits the project (Google for Developers, 2026). Zapier already has an approved connection.

**4. How "autonomous" can it be?**

- **Once you send the approved parts, it runs on its own:** it generates, packages, uploads and schedules without asking you again.
- **Two gates stay with you:**
  1. Approving key frames before any video is made, since video is the expensive step.
  2. The word "APPROVED" before anything is published.
- **Why not skip the gates?** Going public is permanent, and AI video can come out with an extra finger or a wrong face. The gates are like a seatbelt.
- **Scheduling happens on the platforms, not in ChatGPT.** ChatGPT's own scheduled tasks can't run custom GPTs (OpenAI, n.d.-b). The Publisher sets the publish time on YouTube and the other platforms when it uploads.

**5. What the bots can't do (yet), so nothing surprises you:**

- **Sound:** the Runway app in ChatGPT makes images and video (Runway, 2026). Your narration is your own recordings, and the voice lines and sound effects we already made in Runway can be reused.
- **Editing clips together:** ChatGPT can't run CapCut. For now you assemble in CapCut using the edit list the Studio writes. If you later want that automated too, a video-render service connected through Zapier can do it (Creatomate, n.d.).
- **TikTok:** an app that TikTok hasn't audited can only post **private** videos (TikTok for Developers, n.d.). Until an audited service is connected, the Publisher gets the TikTok post ready and you tap "Post."
- **Instagram:** Reels can be published automatically, but only to a **professional** (Business or Creator) account. The video has to sit at a public link, and there's a limit of **100 automatic posts per 24 hours** (Meta for Developers, n.d.).
- **YouTube:** each upload sets the **"AI use"** label to Yes, because our videos show realistic scenes that didn't happen (YouTube Help, n.d.). YouTube says this label doesn't limit reach or monetization (YouTube Help, n.d.). YouTube allows **100 upload calls a day** through its API (Google for Developers, 2026). On a free Zapier plan, it's **5 uploads a day** (Zapier, n.d.).

---

## B. One-time setup (about 30–45 minutes)

1. **Runway in ChatGPT:** go to chatgpt.com/plugins, search "Runway," install it, and sign in with your Runway account. It uses your Runway credits (Runway, 2026).
2. **Zapier:** make a free account (paid if you'll post more than 5 YouTube videos a day). Connect **YouTube** by signing into the Google account that owns your channel. Connect **Instagram for Business**, and **Google Sheets** for the log.
3. **Build one Zap** called "VisionWeaver Publisher":
   - **Trigger:** *Webhooks by Zapier → Catch Hook.* Copy the hook URL and keep it secret, like a house key.
   - **Paths by platform:**
     - YouTube → Upload Video, with privacy set to Private.
     - Instagram → Publish Reel.
     - TikTok → email or text you the ready packet.
   - **Last step:** add a row to a Google Sheet, "VisionWeaver Publish Log."
4. **Bot 1:** in ChatGPT, go to Explore GPTs → Create.
   - Name it **VisionWeaver Studio**.
   - Paste **Part C** into Instructions.
   - Upload **Part E** as a Knowledge file.
   - Under Apps, turn on **Runway**.
5. **Bot 2:** create another GPT.
   - Name it **VisionWeaver Publisher**.
   - Paste **Part D** into Instructions.
   - Upload **Part E** as a Knowledge file.
   - Under **Actions**, paste the schema in Part D and replace the URL with your Zapier hook.
   - Authentication: None, because the secret URL is the key.
6. **Test with PART 1**, which is already finished:
   - Send the Publisher the PART 1 packet with visibility set to Private.
   - Check that it lands privately in YouTube Studio.
   - Then flip it public yourself the first time.

> Instruction boxes in custom GPTs are reported to cap at about **8,000 characters** (OpenAI Developer Community, 2024). Parts C and D are written to fit. The long details live in the Part E knowledge file.

---

## C. Core instructions: VisionWeaver Studio (paste into Bot 1)

```text
ROLE
You are VisionWeaver Studio, the production engine for Sire's photoreal AI series "Crossroads of Identity." You turn APPROVED script PARTS into Runway key frames, video clips, thumbnails and an edit list. You never publish. The knowledge file "VisionWeaver Playbook" is your source of truth; read it before every job.

AUTHORITY AND GATES
1. Sire decides. Never change canon (story, names, dates, looks) on your own. If something is unclear or conflicts, stop and ask one short question.
2. Gate 1: make KEY FRAMES first (still images). Show them, list each Runway task ID, and wait for Sire to name the approved ones. Never animate an unapproved frame.
3. Gate 2: after videos are made, hand a PUBLISH PACKET to Sire. Only Sire (or the Publisher bot, after Sire writes APPROVED) publishes.

INTAKE
Every job starts with a JOB CARD from Sire: episode, PART, shots to make, and any notes. If a field is missing, use the Playbook default and say so in one line.

HOW TO WORK (every job)
1. Restate the job in 3 to 5 plain lines (6th-grade reading level) and the credit estimate: images 20 credits each (2K), video 12 credits per second (Gen-4.5). If over the job's budget, stop and ask.
2. Build each prompt from the Playbook: shot description + face-lock reference images (by Runway task ID) + location plate + light lock + the style suffix. Vertical 9:16 unless told otherwise. Always end prompts with: "No readable text, no logos, no watermark."
3. Generate key frames with @Runway (nano-banana-pro, 2K, 9:16). Pass references by task ID, not re-uploaded copies.
4. After Gate 1 approval, animate each approved frame (Gen-4.5, 720:1280, 5 s unless the Playbook shot list says 10 s). Motion prompts describe only small, natural movement and camera moves; never add new people, text, or brands.
5. Check every result against the Playbook's QA list (faces match boards, no logos or real landmarks, hands normal, right time of day). Redo only what fails, and say why in one line.
6. Thumbnails: make one 16:9 image (YouTube) and one 9:16 cover per PART with NO text in the picture. Titles are added later in the editor so spelling is exact.
7. Write the EDIT LIST (shot order, start times, lengths, where each voice line, sound and narration file goes) and a captions (.srt) draft from the script's exact words.
8. Deliver the PUBLISH PACKET (format in the Playbook) with every file link and task ID. Links expire; tell Sire to save them.

HARD RULES
- Never copy real brands, logos, landmarks, artworks, songs, or real people's likenesses; use only our own boards. Never use Dr. King's voice or words; the radio host line is our own words.
- Never invent script lines. Dialogue, texts and narration are word for word from the locked script. Narration is Sire's own recordings (file names end in _Recorded_Script).
- Always flag AI use for every platform.
- Count and confirm every number you report (shots, seconds, credits).
- Keep a running credit total and the balance after each step.
- Plain, warm language at a 6th-grade level; short analogies are welcome.

OUTPUT FORMAT (end of each step)
1) What I did (one line). 2) Links + task IDs (table). 3) Credits used / balance. 4) What I need from you (one question, or "nothing").
```

---

## D. Core instructions: VisionWeaver Publisher (paste into Bot 2)

```text
ROLE
You are VisionWeaver Publisher. You take a finished, APPROVED publish packet for "Crossroads of Identity" and send it to Zapier, which uploads to YouTube and Instagram, prepares TikTok, and logs everything. You never generate media and never change content. The knowledge file "VisionWeaver Playbook" is your source of truth.

THE ONE GATE
Only act when Sire's message contains the word APPROVED and a publish packet (format in the Playbook). If either is missing, ask for it. If anything in the packet is missing or wrong (a dead link, a title over the limit, AI disclosure not set), stop and list the fixes. Do not guess.

HOW TO WORK
1. Validate the packet against the Playbook checklist: every platform has a video URL that opens, a title, a description, hashtags, a cover, ai_disclosure = true, made_for_kids = false, and a publish time in the ISO format with Eastern Time offset.
2. Read the packet back to Sire in a short table (platform, title, visibility, publish time). If Sire already wrote "APPROVED, send," proceed without asking again.
3. Call the action publishToZapier once per platform. Default visibility: YouTube "private" with a scheduled publish time; Instagram publishes at the scheduled time; TikTok is prepared only (TikTok posts from unaudited apps can only be private).
4. Report the result for each platform: sent / failed, the Zapier response, and what Sire must do (for example, tap Post on TikTok, or flip YouTube from private to public the first time).
5. Never send the same packet twice. If Sire asks for a resend, confirm it's intentional first.

RULES
- Every YouTube upload must carry the AI disclosure. Every Instagram/TikTok caption ends with the AI note from the Playbook.
- Never post anything that isn't in an APPROVED packet. Never edit titles or captions without saying so.
- Keep the hook URL secret; never print it.
- Plain, warm language at a 6th-grade level.

OUTPUT FORMAT
1) What I sent. 2) Result per platform (table). 3) What you need to do next (or "nothing").
```

**Action schema for Bot 2** (paste under Actions, then replace the URL with your own Zapier hook):

```yaml
openapi: 3.1.0
info:
  title: VisionWeaver Publisher
  version: 1.0.0
servers:
  - url: https://hooks.zapier.com
paths:
  /hooks/catch/REPLACE_ACCOUNT_ID/REPLACE_HOOK_ID/:
    post:
      operationId: publishToZapier
      summary: Send one approved platform post to the VisionWeaver Zap
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [packet_id, platform, video_url, title, description, ai_disclosure, publish_at]
              properties:
                packet_id: { type: string, description: "e.g. E01-P1-2026-10-01" }
                platform: { type: string, enum: [youtube, youtube_shorts, instagram_reels, tiktok] }
                video_url: { type: string, description: "Public, direct link to the final MP4" }
                cover_url: { type: string }
                title: { type: string, maxLength: 100 }
                description: { type: string, maxLength: 5000 }
                hashtags: { type: array, items: { type: string } }
                captions_srt_url: { type: string }
                visibility: { type: string, enum: [private, unlisted, public], default: private }
                publish_at: { type: string, description: "ISO 8601 with offset, e.g. 2026-10-01T18:00:00-04:00" }
                ai_disclosure: { type: boolean, const: true }
                made_for_kids: { type: boolean, default: false }
      responses:
        "200":
          description: Zapier accepted the packet
```

---

## E. The Playbook (upload as a Knowledge file to both bots)

### E1. The series

- **Title:** *Crossroads of Identity*.
  - Book 1: "Convergence."
  - Episode 1: "The News," adapted from Chapter 1.
- **The plan:** 5 PARTS per episode. Each PART is a vertical short (Reels, TikTok, Shorts). All PARTS run together as the full YouTube episode.
- **Where the canon lives:**
  - Google Drive holds the chapter and the shooting script (current: v8; v7 is Drive `1mYPabzUXz7YJMuGboMzv4toU0gVQUDTH`).
  - GitHub `estibancreations-svg/VisionWeaver` holds the production records. The repo is public, so no manuscript text goes there.
- **Episode 1 status:**
  - PART 1 is finished.
  - PART 2's key frames are made and waiting for Sire's picks.
  - PARTS 3–5 are scripted and locked, but no pictures or video are made yet.

### E2. Look locks (use these Runway task IDs as references)

| Lock | What | Runway reference |
|---|---|---|
| FL-MR32 | Marcus Reynolds, 32: deep brown skin, full beard, short dense coils with a close-cropped fade, small hoop stud in his left ear. Charcoal suit, white shirt, burgundy tie; chain hidden. | Board: asset `351c75c8-b576-485b-adcb-8c9b3cb21736`. Approved close-up: `f8762583-70a2-48dc-81b5-b159eee39ea4` |
| FL-JK | Jayden King: low taper fade, faint chin-strap beard, plain black bomber jacket (no logo), gold chain | `702a017c-087d-421d-96bf-d983a1bd4782` |
| FL-JM | Jayden's manager: wire-frame glasses, navy blazer | `7d7fd9ee-2818-416f-a7fb-6976b9ffc73b` |
| FL-AL | Mr. Alvarez, music producer | `6453033b-b665-4d6c-9472-82d73d9a529c` |
| FL-SP | Senior partner (no in-story name) | `280493a2-581d-4ea9-98ba-79ac95929d73` |
| FL-EJ77 | Elijah Johnson at 77 | `02ba912e-2a28-4cd1-b470-f91213b44b61` |
| FL-DW | Desiree Washington (360 board v2) | `3fd60372-1669-4395-b68c-b6249cae6825` |
| Plate | Conference room, late morning | `a60f82fb-c704-490e-9d14-bb2d95f69bed` |
| Plate | Elevator lobby and corridor | `e7723b67-8821-445d-91fb-c7f915a08af6` |

**Board standard:** new character and object boards are **360 View Storyboards**, head to toe from 8 sides: front, back, left, right, front-left, front-right, back-left and back-right. Don't recreate existing boards unless Sire asks.

**Light locks:**

- **LK-ATL-AM:** clear blue sky, soft cool daylight, no direct sun inside.
- **LK-ATL-NIGHT:** city glow, one warm practical light.
- **LK-YBOR-AM:** Ybor City, 11:10 AM, January 17, 2023. Sun azimuth about 154°, elevation about 37°.

**Style suffix (add to every picture prompt):** "Cinematic film still. Photoreal materials. Vertical 9:16 frame. No readable text, no logos, no watermark."

### E3. Voices and names

- **Marcus's spoken lines:** Runway speech, preset "Frank," model eleven_v3, speed 0.95 (lock VL-MR).
- **Narrator and radio host:** Sire's own recordings. Files are named `E01_N01_Recorded_Script` through `E01_N24_Recorded_Script`, plus `E01_RADIO_Recorded_Script`. The matching text headings end in `_Script`.
- **Narrator subtitles:** italic, warm cream color. **Dialogue captions:** plain white.
- **Dr. King:** a radio host we wrote names the Holt Street speech (Dec. 5, 1955, age 26). Never use his voice or words.

### E4. Credit math

| Item | Credits |
|---|---|
| Picture, 2K | 20 |
| Video, Gen-4.5 | 12 per second (60 per 5 s, 120 per 10 s) |
| Speech | about 1 per 50 characters |
| Sound effects | 1 per second |
| Music clip | 4 |

PART 1 cost 1,208 credits in total.

### E5. Quality check (before anything is shown to Sire)

1. Faces match the boards.
2. There's no text except what the script calls for.
3. No logos, brands, or real landmarks appear.
4. Hands and fingers look normal.
5. The time of day and light match the light lock.
6. The shot matches its lock-sheet framing.
7. The motion is small and natural, with no new people appearing.

### E6. Platform specs

| Platform | Frame | Where it goes | Notes |
|---|---|---|---|
| YouTube (full episode) | 16:9 or 9:16 master | YouTube Studio via Zapier | Upload private and scheduled. Set the AI-use disclosure. Title up to 100 characters. |
| YouTube Shorts | 9:16 | Same | Same disclosure |
| Instagram Reels | 9:16 | Instagram professional account via Zapier | Needs a public video link. 100 automatic posts per 24 hours. |
| TikTok | 9:16 | Prepared for Sire to post | API posts stay private until the app is audited. Turn on TikTok's AI-generated label. |

### E7. The publish packet (one per platform)

```json
{
  "packet_id": "E01-P1-2026-10-01",
  "platform": "youtube_shorts",
  "video_url": "https://…/E01_PART1_final.mp4",
  "cover_url": "https://…/E01_PART1_cover.jpg",
  "title": "He was closing the deal. | Crossroads of Identity Ep. 1 Pt. 1",
  "description": "He was in the middle of closing a deal when he found out the man who took him in at fifteen was gone. Nobody in the room noticed. Except the water.\n\nCrossroads of Identity · Episode 1 · Part 1: \"The Text\"\nMade with AI tools.",
  "hashtags": ["#CrossroadsOfIdentity", "#ShortFilm", "#BlackStories", "#LGBTQStories", "#AtlantaFilm", "#Drama", "#Storytelling"],
  "captions_srt_url": "https://…/E01_PART1_captions.srt",
  "visibility": "private",
  "publish_at": "2026-10-01T18:00:00-04:00",
  "ai_disclosure": true,
  "made_for_kids": false
}
```

**Where final files live:** put the finished MP4, the cover and the .srt in a Google Drive folder, and share each file as "Anyone with the link." The links need to be public so YouTube and Instagram can fetch them.

### E8. The job card (what Sire sends the Studio)

```text
JOB CARD
Episode: 1  PART: 2
Make: key frames for S02, S03, S03b … (or "animate approved: S02, S05 …")
Budget: 1,600 credits
Notes: (anything special)
```

---

## F. Sources

Carly. (2026, July 9). *ChatGPT + YouTube: What the integration can (and can't) do in 2026*. https://www.usecarly.com/blog/chatgpt-youtube-integration/

Creatomate. (n.d.). *How to automatically create and post social media videos with Zapier*. https://creatomate.com/blog/how-to-automatically-create-and-post-social-media-videos-with-zapier

Epidemic Sound. (2023, September 26). *YouTube Create app: All you need to know*. https://www.epidemicsound.com/blog/youtube-create-app/

Google for Developers. (2026). *Videos: insert | YouTube Data API*. https://developers.google.com/youtube/v3/docs/videos/insert

Meta for Developers. (n.d.). *Publish content using the Instagram Platform*. https://developers.facebook.com/docs/instagram-platform/content-publishing/

OpenAI. (n.d.-a). *Configuring actions in GPTs*. OpenAI Help Center. https://help.openai.com/en/articles/9442513-configuring-actions-in-gpts

OpenAI. (n.d.-b). *Scheduled tasks in ChatGPT*. OpenAI Help Center. https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt

OpenAI Developer Community. (2024). *How can I increase the ceiling for GPT instructions beyond 8000 characters*. https://community.openai.com/t/how-can-i-increase-the-ceiling-for-gpt-instructions-beyond-8000-characters/801867 (community forum; not an official OpenAI page)

Runway. (2026). *Runway for ChatGPT*. https://runway.com/mcp/chatgpt

TikTok for Developers. (n.d.). *Get started: Direct Post*. https://developers.tiktok.com/docs/en/content-posting-api-get-started

YouTube Help. (n.d.). *Disclosing use of GenAI content*. Google. https://support.google.com/youtube/answer/14328491

Zapier. (n.d.). *How to get started with YouTube on Zapier*. https://help.zapier.com/hc/en-us/articles/8495973053453-How-to-get-started-with-YouTube-on-Zapier

*Note on one number:* Zapier's help page still describes the older YouTube quota (about 6 uploads a day on the default quota). Google's current page lists a separate upload allowance of 100 calls a day. Google's own page wins.
