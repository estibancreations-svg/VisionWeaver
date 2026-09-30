# VisionWeaver Studio (director control surface)

**Version:** v6 · 2026-09-29 · **Production:** Crossroads of Identity, Book 1 *Convergence*, Episode 1 "The News"

Where Sire, the director, makes every decision in the pipeline: from the books and locks through pictures, motion, sound, the edit, delivery and publishing. Departments bring finished work to the **Directors Guild queue**; nothing moves until Sire decides. Two gates never move: **key frames are approved before any video is made**, and **the word APPROVED is required before anything goes public**.

## Build and run

```bash
python3 apps/director-studio/build.py      # writes apps/director-studio/index.html
```

The build reads the episode's production records straight from this repo, so the page always matches them:

| Page section | Built from |
|---|---|
| Shot bible (88 shots + S05b, S03b inserts) | `…/part-01-02/lock-sheet.md`, `part-03/`, `part-04/`, `part-05/` shot tables |
| Narration booth (25 cues, subtitle cards) | `…/narration/narration-cue-sheet-v1.md` |
| Camera maps | each PART's `camera-maps.svg` |
| Captions | `…/part-01-02/part1-captions.srt` |

`index.html` is a build output and isn't committed. Run the build to make it. The live copy is published as a Claude artifact with these capabilities:

| Capability | What it does on the page |
|---|---|
| `db` | Shared saved data: `studio/state` (PART 2 picks, narration recorded, deliverables, setup steps, shot status and notes, release calendar), `queue/*` (Guild queue items), `log/main` (activity feed). Claude reads and writes it directly. |
| `user` (profile) | Shows who approved what. Stores ids only, never names. |
| `sample` | "Ask the studio" side panel and one-click caption drafts. Uses the viewer's Claude usage. |
| `downloads` | Saves the edit list, captions, job card, publish packet, reading script and shot list as files. |
| `mcp` | **Live check** on Setup & connections: read-only calls to Runway (`show_plans_and_credits`), Supabase (`execute_sql`), Zapier (`inspect_zapier_actions`) and GitHub (`get_file_contents`) with the viewer's own logins. See `connections/README.md` §5b. Makes the page private-only. |

Opened as a plain file, the page still works and saves to that browser only.

## Source layout

```
src/markup.html            page shell: top bar, search, stage menu, Ask panel
src/base.css, extra.css    design tokens (tungsten 3000K accent, daylight 5600K info), light + dark
src/records.js             production records: PARTS, faces, lights, plates, frames, stills, audio, cues, ledger, connections
src/core.js                saved-data layer (db / browser fallback), helpers, derived status, stage menu
src/views-pipeline.js      Run of show, Guild queue, Books & script, Locks & maps, Shot bible, Pictures, Motion
src/views-production.js    Narration booth, Sound, Edit timelines (PART 1 edit list, PART 2 draft), Deliver, Publish, Setup, Uploads, Ledger
src/runtime.js             downloads, search, Ask the studio, rendering and events
build.py                   stitches the above with the records into index.html
history/                   earlier UI rounds (v1 mockups → v3), kept for reference
```

## Pages

| Stage | Page | What Sire does there |
|---|---|---|
| — | Run of show | See every PART across 8 stages, what's waiting, credits, activity |
| — | Guild queue | Approve or send back department work with a note; add items |
| 1 | Books & script | 7 books, script versions, PART stories |
| 2 | Locks & maps | Camera maps, face locks, light locks, plates, props |
| 2 | Shot bible | Every shot's plate, pin, lens, move, framing, face, light, sound; status and notes |
| 3 | Pictures | Gate 1: approve or redo PART 2 key frames; memorial stills |
| 4 | Motion | Build a job card for the Studio bot with a live credit estimate |
| 5 | Narration booth | Teleprompter paced in words per minute, timer, subtitle cards |
| 5 | Sound & music | Voice lock, PART 1 sound kit, what PART 2 still needs |
| 6 | Edit | Playable multi-track timelines; click any block for CapCut steps |
| 7 | Deliver | Files ready per PART |
| 8 | Publish & social | Release calendar, packet builder, Gate 2, platform rules |
| — | Setup & connections | One-click live check of Runway, Supabase, Zapier and GitHub; recorded status; one-time bot setup steps |
| — | Uploads | Filename matching checks off cues and deliverables |
| — | Credit ledger | Every recorded spend and the live balance |

## Versions

| Version | Date | What changed |
|---|---|---|
| v1 | 2026-09-28 | First mockups: director approval + operator dashboard (`history/v1a–v1d`) |
| v2 | 2026-09-29 | Director control suite with lock sheets, face/light locks, stills queue (`history/v2`) |
| v3 | 2026-09-29 | Fixed the nav click bug; right sidebar panels (`history/v3`). Had made-up credit and location figures, corrected in v4. |
| v4 | 2026-09-29 | Rebuilt from the repo records: the full pipeline, edit timeline, sound, delivery, publishing, uploads. Real credits (36,738). |
| v5 | 2026-09-29 | Shared saved data, Guild queue, shot bible for all 5 PARTS, camera maps, narration booth, PART 2 draft timeline, release calendar, caption drafting, setup & connections, search, Ask the studio. |
| v6 | 2026-09-29 | Live connection check (artifact `mcp` capability): Runway credits, Supabase registry and log, Zapier apps, GitHub repo; top-bar credits update from the live answer. Supabase `ec_connectors` registry applied (46 connectors, 12 active). |
