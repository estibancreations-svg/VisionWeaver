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

## Representation and historical locations

The authorized [Representation and Place-Time Standard v1](standards/representation-and-place-time-v1.md) governs new character defaults: intentional inclusive casting, normal representation of Black and fat people, preservation of approved appearance, and evidence-backed scene location/date accuracy. The current balloon-film boy is Black and fat. Runtime enforcement and end-to-end verification remain open release gates.

## Founding pitch and next production design

[Preserved founding pitch](strategy/2026-10-02-VISIONWEAVER-FOUNDING-PITCH.md) and [Production Design v2](strategy/VISIONWEAVER-PRODUCTION-DESIGN-v2.md) connect canon,avatars,voices,editable worlds,continuity,physics,autonomy,books and publishing. The revised design contains30 concrete improvements and evidence gates. **Proposal only: awaiting the Architect's approval to build.**

## Avatar State and animated production — October 3, 2026

- [Avatar State v1.1](standards/avatar-state-board-specification-v1.1.md): the three boards, 16/24/32/full coverage, avatar reference lineage, changes, camera/world anchors, stimulus/contact/reaction, spacecraft/enclosure continuity and acceptance/source gaps.
- [Children's animation and teaching v1.0](standards/children-animation-production-standard-v1.md): YouTube assessment, original style/performance/lesson contracts, exact text/audio, animation/world continuity, workflow and acceptance.

These are documented implementation contracts. Runtime deployment, completed animation and calibrated full coverage are not certified here. Existing accepted production and paused balloon continuation work are preserved.

## Avatar Catalog

[Avatar Catalog v1](standards/avatar-catalog-v1.md) is the dedicated VisionWeaver section and implementation contract for reusable character identity, appearance, coverage, voice, scenes, and product-linked wardrobe. It defines a provisional African American Chicago-origin man (47, 5 ft 11 in, 302 lb, trimmed haircut and beard, glasses, sweat suit, white active shoes) with a user-supplied Poramea shopping link. Visual likeness, shoe variant, camera calibration, and commercial affiliation remain explicit verification gates. The Catalog and purchase path are specifications; their runtime behavior has not been deployed or certified.

## Design Studio — connected authoring 0.2.02

[VisionWeaver | Design Studio](https://visionweaver-design-studio.vercel.app/) now provides eleven connected authoring pages, including reusable character states and wardrobe variants, reference coverage/calibration, multi-cast scenes, performance cues, environment/time direction, a review queue, rights/package preparation, history, and proposed Creator / Studio / Enterprise tiers. The [canonical source](https://github.com/estibancreations-svg/DESIGN_STUDIO) owns the shared module.

A **Design Studio** page is now part of the Director Studio source navigation. See the [integration record](docs/DESIGN_STUDIO_INTEGRATION.md) for generation, verified behavior, source revision, and deployment boundaries. Cloud login, generated media, checkout, and public asset publication are not certified by this authoring release. The existing approved production and paused balloon continuation are preserved.


## Global Place + People Reference Catalog — October 4, 2026

[Global Place + People Reference Catalog v1](standards/GLOBAL_PLACE_PEOPLE_REFERENCE_CATALOG-v1.md) defines the worldwide reference architecture for believable scenes and original avatar/crowd creation. It covers travel/maps, lodging, cruise/transport, event/community, tourism, open geographic data, licensed photography and social discovery sources through a rights-aware source router.

Each Location Pack pins geography, architecture, transport, population/casting ranges, wardrobe, seasonal/weather state, lighting, ambience, animals/insects, signage/language, activities, camera references and provenance. Source content is classified before reuse; public availability and attribution alone do not grant training or redistribution rights.

This is an implementation contract. Provider credentials, automated ingestion, runtime rights enforcement and generated Location Packs remain open build/verification gates.
