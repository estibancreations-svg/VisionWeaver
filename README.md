# VisionWeaver

Complete AI-powered video and image generation platform - parallel system architecture to Runway AI with Vercel + Supabase integration.

VisionWeaver runs Sire's productions under a **Directors Guild** structure: Design, Motion, Sound, Edit, Marketing and Automation bring triple-checked work to the director in a timestamped queue, and nothing moves until he decides.

## What's here

| Path | What it is |
|---|---|
| [`apps/director-studio/`](apps/director-studio/) | **VisionWeaver Studio**, the director control surface. Built from the production records by `build.py`. v7: THELMA AI assistant, Cast & avatars, Settings, Database, Claude uplink, live connector checks. |
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


## Advanced production system

VisionWeaver is being extended from a generation workspace into a governed, cross-format production system. The foundation remains the **Directors Guild** process: human approval controls creative locks, every generated asset has a reproducible record, and no publication occurs merely because a render finished.

### Stock and reusable asset catalog

The planned **Stock** workspace is a first-class asset catalog, not a loose media folder. It will cover owned and licensed footage, stills, generated media, music, sound effects, voice assets, graphics, character and environment references, production templates, and approved reusable copy.

Every placement in a shot, timeline, print layout, or marketing composition must retain:

- source and supplier identity;
- immutable asset and version identifiers;
- license/rights status, permitted uses, attribution and restrictions;
- project/scene placement and derivative lineage;
- review, approval, provider, prompt, cost and export provenance.

Search and preview do not equal a publication license. The system must distinguish searchable, previewable, acquired, cleared, restricted and placed assets; final export checks the combined rights requirements for its actual intended destinations.

### Long-form and cross-format delivery

A long episode is represented by a timed shot plan and a versioned edit decision list: approved key frames and locks → discrete clips/stock/live assets → extensions where needed → assembly → sound, captions, QC → mastered outputs and approved distribution handoff. The dashboard must show planned duration and actual encoded duration separately. A successful short generation never constitutes a completed 10- or 20-minute production.

The same persistent Story Core—canon, characters, environments, scenes, style and voice bibles—will support film/episodes, social cutdowns, books, storyboards, audio, magazines and marketing. Format renderers are distinct so print, audio and video have their own quality checks while drawing from the same approved sources.

### Control gates

- Character, environment, camera, light, voice and product locks are versioned and selected per project.
- Automated checks cover missing media, continuity, technical profile, captions/loudness, rights/attribution, cost and target-duration compliance.
- Editorial, technical, rights and release approvals are independent decisions.
- T.H.E.L.M.A. may dispatch authorized jobs, monitor failures and escalate exceptions. VisionWeaver retains the creative source, asset, review and render records; the CEO Dashboard receives governed status, cost and approval evidence.

Read the full [Stock and Production Buildout Review](docs/VISIONWEAVER-STOCK-AND-PRODUCTION-BUILDOUT-REVIEW-2026-09-27.md). It is a design and acceptance specification—not evidence that every capability is deployed. Audio-source requirements remain provisional until the associated recordings receive a genuine transcript.


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


## Character identity board standard

New character work follows [Character Identity Board System v1](standards/character-board-system-v1.md): **A Cast Board** for multi-character scene fallout, a **Character Detail Specifications Board** as the canonical detail source, and a **360 View Board** for individual character anchoring. The default is a 32-view master for new or materially changed appearances. A 16-view state board is used for clothing-only or limited non-identity changes. Scene-specific states are versioned and then referenced by the Cast Board.
