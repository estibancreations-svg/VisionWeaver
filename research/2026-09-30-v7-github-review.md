# VisionWeaver Studio v7 · GitHub review and build notes (2026-09-30)

Before building v7, Sire asked for a review of material uploaded to GitHub from his other systems: THELMA AI, settings, and the avatar system. This log records what was found, so the next build starts from facts.

## 1. Repos reviewed (read-only)

| Repo | What it gave v7 |
|---|---|
| `-THELMA-AI` | Canonical scope and recovery package: THELMA's orchestrator role, mission lifecycle, what she may not do |
| `MASTER_CEO_DASHBOARD` | `thelma-ai` edge function system prompt and specialist roster; ThelmaAIConsole UI; VisionWeaver workspace (PR #54: Create / Books / Cast / Library); provider health and routing; `system_settings` keys; Think (legal pad) theme; Auth gate |
| `THELMA-Global-Link-Logistics` | The name T.H.E.L.M.A. (Tactical Holistic Enforcement Learning Management Architecture); Guardian Co-Pilot rules; AUTHORIZE / DENY cards |
| `Master-dashboard-` | Estiban Systems Desktop: Request → Work → Review → Return, dark / legal-pad modes |
| `Master-System-Buildout` | 17-system registry; status words; VisionWeaver's next build (Story Core, locks, timeline, audio, mastering, rights) |
| `-Five-Stations-Learning-Serie` | Character lock record fields, calibration ladder, pilot-mode pause gates, status words (`verified`, `verified_with_hold`, `needs_revision`, `blocked`, `not_applicable`) |
| `VisionWeaver` (this repo) | Shot Standard v1, 360 View Storyboard, Episode 1 face locks and board registry |

## 2. What v7 took from each

- **THELMA AI:** the CEO OS lineage (evidence-first, approval-required for destructive / external / financial / publishing work), rewritten for the studio. It addresses the director as Sire, which is his own choice; THELMA's canon says "the CEO" or "the Architect". Answers keep facts, meaning, recommendation and approval-needed work separate. Specialists shown: THELMA, L.I.L.Y., H.E.N.R.Y., V.E.R.I.T.A.S., Canon Keeper, The Auditor, P.E.R.C.Y. In the page she runs on Claude (artifact `sample` with page tools), because the `thelma-ai` function only accepts the CEO Dashboard's web origin (CORS). She reads `thelma_alerts` and `thelma_approval_requests` directly.
- **Appearance:** the Systems Desktop's Think (legal pad) mode became a theme alongside Tungsten, Daylight, Auto and High contrast.
- **Cast & avatars:** Five Stations' lock-record fields, calibration ladder and pause gates, joined with Crossroads' face-lock rules and 360 board checks.
- **Rights & provenance:** the registry's "rights / provenance" next build plus the show's standing rules (no Dr. King voice or words, no real brands or actor likeness, AI disclosure).

## 3. Findings to act on

1. **Localized Avatar + Historical Space Framework is not in GitHub.** Searches found no files for it. v7 builds its fields (time, place, people, world) from Sire's description. Upload the original so the fields can be matched.
2. **CEO Dashboard VisionWeaver screen vs. server.** `VisionWeaverWorkspace.tsx` (PR #54) calls `import_book`, `save_character` and `register_asset`, but the committed `visionweaver-studio` function only handles create / list / refresh / retry / tick. Either the live function is newer than GitHub, or Books, Cast and Upload fail in production.
3. **`vw_characters` exists in Supabase with 0 rows** (fields: name, visual_anchor, bible, reference_image_urls, runway_seed, elevenlabs_voice_id). The Studio's cast records could sync there later (a write, so it needs approval).
4. **Two THELMA lineages** (logistics / Gemini vs. CEO OS / multi-provider) and two Architect identities in the docs. v7 follows the CEO OS lineage.
5. **Five Stations manifest mismatch:** the 2026-09-28 continuity manifest points at `momo-character-board.png`-style names; the real files are `*-board-v1.png`.
6. **Status labels disagree:** the studio function reports version 6 while commits say Studio v22.

## 4. v7 build facts

- New source files: `records-v7.js`, `views-system.js`, `thelma.js`, `v7.css`. Changed: `markup.html`, `core.js`, `runtime.js`, `views-production.js`, `build.py`.
- 22 pages. Tested headless with stand-in services: every page opened, every settings tab, all five themes; THELMA ran tools (status, propose, character, database); Drive send, download, printable page; database list, table read, and a blocked non-SELECT; uplink send; rights; uploads with file storage; palette; THELMA off and on. No page errors. Phone width 390 px: no sideways scroll.
- Published with capabilities `db`, `user` (profile), `sample`, `downloads`, `assets`, `mcp` (Runway, Supabase ×2, Zapier, GitHub, Google Drive, Claude Code Remote).
- Real calls were confirmed earlier for Runway, Supabase, Zapier and GitHub. The Google Drive `create_file` result shape is unconfirmed (testing it would create a real file); the page reads it loosely.
- The uplink wake-up is a scheduled task with no schedule: it runs only when Sire presses "Wake Claude now". It answers threads and never publishes, pushes, spends credits or writes to Supabase.
