# VisionWeaver

Complete AI-powered video and image generation platform - parallel system architecture to Runway AI with Vercel + Supabase integration.

VisionWeaver runs Sire's productions under a **Directors Guild** structure: Design, Motion, Sound, Edit, Marketing and Automation bring triple-checked work to the director in a timestamped queue, and nothing moves until he decides.

## What's here

| Path | What it is |
|---|---|
| [`apps/director-studio/`](apps/director-studio/) | **VisionWeaver Studio**, the director control surface. Built from the production records by `build.py`. Checks Runway, Supabase, Zapier and GitHub live. |
| [`connections/`](connections/) | API, MCP and OAuth settings: what's connected, how, secret names (no values), the Supabase connector registry SQL, and an MCP config for Claude Code. |
| [`projects/creative-ip/`](projects/creative-ip/) | Production records for Crossroads of Identity, This Is Your Life and The Arc (pointers; each property's canon lives in its own repo and Drive). |
| [`standards/`](standards/) | House standards: Shot Standard v1, 360 View Storyboard. |
| [`research/`](research/) | Research and build logs. |

## The pipeline

```
Books (Drive) → Locks (faces, light, camera pins) → Pictures (key frames)
   → GATE 1: Sire approves key frames
   → Motion (Runway Gen-4.5) → Sound (voices, effects, score, Sire's narration)
   → Edit (CapCut from the edit list) → Deliver (masters, covers, captions)
   → GATE 2: Sire writes APPROVED
   → Publish (Publisher bot → Zapier → YouTube, Instagram; TikTok prepared)
```

## Current production

**Crossroads of Identity · Book 1 *Convergence* · Episode 1 "The News"**, 5 PARTS, 88 locked shots.

| PART | Status (2026-09-29) |
|---|---|
| 1 "The Text" | Finished: 13 clips, 11 sounds, edit list, captions. Sire assembles in CapCut. 1,208 credits. |
| 2 "The Performance" | 4 of 15 key frames approved; 11 waiting on Sire's picks. Memorial stills approved. |
| 3 "The Bathroom" · 4 "The Box" · 5 "The Porch" | Scripted and locked; no pictures yet. |

Runway balance: 36,738 credits (live, 2026-09-29).

## Infrastructure

- **Supabase** "Master Dashboard" (`yqealeekngxooyoemfba`): `production_log`, `social_connections`, `social_post_queue`, `vw_*` tables, `ec_connectors` registry (46 connectors, 12 active); edge functions `visionweaver-orchestrator`, `visionweaver-studio`, `oauth-callback` and others.
- **Vercel**: hosting (team "Estibancreations").
- **Runway, Zapier, Google Drive, GitHub**: live as Claude connectors. See [`connections/README.md`](connections/README.md).

## Rules for this repo

1. It's **public**. Production records only: no manuscript text beyond what's already published, no secret values, no personal account details.
2. Original manuscripts outrank production mappings. Crossroads, This Is Your Life and The Arc are separate canons.
3. Every generated asset is logged with its Runway task ID so it can be rebuilt.
