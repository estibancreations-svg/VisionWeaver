# VisionWeaver Studio · Build log and findings (2026-09-29)

What was reviewed, what was found, and what was decided while building the director studio (v2 → v6). It's kept so the next build starts from facts, not from memory.

## 1. Sources reviewed

| Source | What it gave the build |
|---|---|
| This repo, Episode 1 production records | Lock sheets for PARTS 1–5 (88 shots), camera maps, keyframe records (PART 1, PART 2 batches 1–2), memorial stills (M01–M13), PART 1 video/sound record, CapCut edit list v1.1, captions, checklist, narration cue sheet (24 cues + radio line), approvals log, social shoot plan, ChatGPT master prompt (Studio + Publisher bots, Playbook) |
| Runway (Claude connector, live) | Pro plan, **36,738 credits** on 2026-09-29 |
| Zapier (Claude connector, live) | YouTube, Instagram for Business and Google Drive authorized; TikTok not connected |
| Supabase · Master Dashboard (live, read-only) | 100+ tables incl. `production_log` (2 rows), `social_connections` (0), `oauth_flow_state`, `social_post_queue` (0), `vw_review_decisions` (0), `ec_connectors` (31 rows), `system_settings`; 10 edge functions incl. `oauth-callback`, `visionweaver-orchestrator`, `visionweaver-studio` |
| Supabase · MASTER_CEO_DASHBOARD | No tables yet |
| GitHub | `VisionWeaver` is **public**; `Higgsfield-Integration-Layer` is private |
| Earlier research | `2026-09-29-runway-canva-ui-research.md` (Runway and Canva for UI mockups) |

## 2. Corrections made along the way

| Earlier claim (v3) | What the records show | Fixed in |
|---|---|---|
| "600 credits allocated" | Invented. PART 1 cost **1,208** (measured); the live balance is 36,738 | v4 |
| 6 of 13 memorial stills approved | **11 approved, 2 kept in the library** (M09, M10); M04 v2 approved per the approvals log | v4 |
| Parts 3–5 locations (e.g. "Corporate Office", "Ybor safe house, winter 2006 evening") | PART 3 bathroom + fall 2006 flashback; PART 4 condo at night; PART 5 porch (late March 2022) → kitchen | v4 |
| Supabase "Connect" showed success | It connected to nothing. Replaced by real saved data (Claude artifact `db`) | v5 |
| Nav click used `event.target` | Broke on nested clicks. Fixed with `data-view` | v3 |

## 3. Credit ledger as recorded

39,005 (09-25) → 38,505 after PART 2 batch 1 (80) → memorial stills ≈ 280 → 37,477 after PART 1 (1,088) → 37,257 after PART 2 batch 2 (220) → S05b 120 → **36,738 live (09-29)**. **519** credits were used after the last written record; S05b explains 120 of them.

## 4. Decisions carried into the studio

- Two gates stay with Sire: key frames before video; APPROVED before publishing.
- Studio bot (Runway) makes media and never publishes; Publisher bot (Zapier) only posts approved packets, private and scheduled.
- TikTok: prepared packet, Sire taps Post, until an audited app is connected.
- All narration and the radio host line are Sire's own voice; Marcus's "Frank" voice (VL-MR) is dialogue only.
- Never Dr. King's voice or words; the radio host names the Holt Street address.
- The public repo holds records only. The studio's narration text is the same text already published in the narration cue sheet. The two account emails shown on the private live page were removed from the repo copy.

## 5. Found while wiring connections (see `connections/README.md`)

- `ec_connectors.runway` API key **degraded** while the Runway connector is healthy.
- `system_settings.runway_image_model` = `gen4_image_turbo`, but key frames use nano-banana-pro.
- `system_settings.oauth_redirect_base` points at Supabase Auth's callback, not the `oauth-callback` function.
- `deployment_mode` = demo with open row-level security (single user).
- Zapier's Instagram login should be confirmed as the show's professional account.

## 6. Limits of the studio today

- The page can't load Runway images (links expire and the page can't fetch other sites), so frames show shot numbers.
- Uploaded files stay on the device; uploading only marks items done.
- The Publisher hook URL is not stored in the page; packets are copied to the Publisher bot.

## 7. v6 (same day)

- Applied the `ec_connectors` registry SQL: 46 connectors, 12 active.
- Added a read-only live check to the Studio (artifact `mcp` capability). Tested headless with stand-in answers, including a connector that needs signing in again. No page errors.
- Made each of the four calls once for real to confirm the answer shapes the page reads: Runway Pro, 36,738 credits; Supabase 2 `production_log` rows (last 2026-08-13), 12 of 46 connectors active, 0 queued posts; Zapier apps Google Drive, Instagram for Business, YouTube; GitHub 8 studio source files. This caught one bug: Supabase wraps its rows in a `result` text field, so the parser now reads that field first.
- Zapier's Instagram for Business connection uses a different login from its Google Drive connection. Confirm it's the account that owns the show's professional Instagram.
