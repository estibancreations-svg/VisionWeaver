# VisionWeaver · Connections (API, MCP, OAuth)

**Updated:** 2026-09-29 · **Scope:** VisionWeaver Studio and the Crossroads of Identity production pipeline. Other EstibanCreations systems (CEO Dashboard, AABOS, The Arc) get the same treatment later.

Think of this folder as the building's wiring diagram. It says which service is plugged in, which plug it uses (a Claude connector, Zapier, or a direct API key), and where the key is kept. **No secret values ever go in this repo.** It is public. Only secret *names* appear here.

## 1. What is connected today (checked live 2026-09-29)

| Service | How it's reached | Status | Used for |
|---|---|---|---|
| Runway | Claude connector (MCP) | **Live**: Pro plan, 36,738 credits | Key frames, video (Gen-4.5), speech, effects, music |
| Zapier | Claude connector (MCP) | **Live** | The Publisher's route to the platforms |
| ↳ YouTube | Zapier app | **Authorized** | Upload private + scheduled, AI-use label on |
| ↳ Instagram for Business | Zapier app | **Authorized**, check it's the show's account | Publish Reels |
| ↳ Google Drive | Zapier app | **Authorized** | Final files at public links |
| TikTok | none yet | **Not connected** | Publisher prepares the packet; Sire taps Post |
| Supabase · Master Dashboard (`yqealeekngxooyoemfba`) | Claude connector (MCP) + REST | **Live** | `production_log` (2 rows), `social_post_queue`, `social_connections`, `oauth_flow_state`, `vw_review_decisions`, `ec_connectors` |
| Supabase · MASTER_CEO_DASHBOARD (`azoqszhhmmkyqztubgem`) | Claude connector | Live, **no tables yet** | Reserved |
| GitHub | Claude connector | **Live** | This repo (public: records only) |
| Google Drive | Claude connector | **Live**, new-file uploads sometimes refused | Manuscripts, scripts, delivery folder |
| Vercel, Canva, Figma, Notion, Lovable, Netlify, Hugging Face, DocuSign, Shopify | Claude connectors | Available | Not yet wired into VisionWeaver |
| VisionWeaver Studio | Claude artifact with shared saved data | **Live** | Director decisions (see `apps/director-studio/`) |

Supabase edge functions already deployed in Master Dashboard: `oauth-callback`, `visionweaver-orchestrator`, `visionweaver-studio`, `dashboard-data`, `ec-fabric-dispatcher`, `thelma-ai`, `ecosystem-watch`, `resource-intelligence`, `gemini-connection-test`, `sync-world-signals`.

## 2. The three kinds of plug

1. **Claude connectors (MCP).** Signed in once in claude.ai → Settings → Connectors. Claude, the Studio page and Claude Code sessions all use them with *your* login. Nothing to store. This is the preferred plug.
2. **Zapier.** For platforms that need an approved app to post publicly (YouTube uploads from a brand-new Google API project stay private until Google audits it). Zapier's apps are already approved. The Publisher bot sends a packet to a Zapier **Catch Hook**; the hook URL is a secret.
3. **Direct API / OAuth.** For server code in Supabase edge functions. Keys live in Supabase **Edge Function secrets** (or Vault) under the names in `.env.example`. OAuth tokens land in `social_connections` (token *references* only) via the `oauth-callback` function, with PKCE state in `oauth_flow_state`.

## 3. OAuth settings for direct connections

Redirect URI to register in each developer console:

```
https://yqealeekngxooyoemfba.supabase.co/functions/v1/oauth-callback
```

`system_settings.oauth_redirect_base` currently points at `…/auth/v1/callback` (Supabase Auth's own callback). If platform logins should land in the `oauth-callback` function instead, update that setting to the URL above. Check the function code before switching.

| Platform (`social_connections.platform`) | Scopes to request | Console | Notes |
|---|---|---|---|
| `youtube` | `https://www.googleapis.com/auth/youtube.upload`, `https://www.googleapis.com/auth/youtube.readonly` | Google Cloud Console → OAuth consent screen | New projects upload **private only** until Google's audit. Zapier avoids this. |
| `instagram` | Instagram API with Instagram Login: `instagram_business_basic`, `instagram_business_content_publish` | Meta for Developers | Professional account only. 100 API posts / 24 h. Video must be at a public URL. |
| `tiktok` | `user.info.basic`, `video.upload`, `video.publish` | TikTok for Developers | Direct Post stays private until the app passes audit. |
| Google Drive (server use) | `https://www.googleapis.com/auth/drive.file` | Google Cloud Console | Only files the app creates or opens. |
| GitHub (server use) | fine-grained token, repo contents read/write on `VisionWeaver` | GitHub → Settings → Developer settings | The Claude connector covers normal use. |

Scope names are from each platform's current docs as of this writing. Confirm them in the console when you register, because platforms rename scopes.

## 4. MCP config for Claude Code / Claude Desktop

`mcp.json` in this folder lists the remote MCP servers VisionWeaver uses, so a Claude Code session in this repo can reach them. Each asks you to sign in the first time. Servers whose address is personal (Zapier) or not published use a placeholder you fill in locally. **Don't commit the filled-in copy.**

## 5. Registry in Supabase

`supabase/2026-09-29_ec_connectors_visionweaver_studio.sql` adds or updates rows in `ec_connectors` for everything above: Zapier, YouTube, Instagram, TikTok, the Runway connector, the Drive and GitHub connectors, the other Claude connectors, and the Studio itself. It stores no secrets and is safe to re-run.

**Applied 2026-09-29.** The registry now holds **46 connectors, 12 active** (18 rows added or updated by this file).

## 5b. Live check from the Studio

The Studio's **Setup & connections** page has a **Check all connections now** button. It uses the artifact `mcp` capability to make four read-only calls with the viewer's own connector logins:

| Connector | Tool | What it reads |
|---|---|---|
| Runway | `show_plans_and_credits` | Plan and credit balance (also updates the top-bar credits) |
| Supabase | `execute_sql` (a single `select`) | `production_log` rows and last run, active vs. total `ec_connectors`, queued posts |
| Zapier | `inspect_zapier_actions` | Which apps the Publisher can use |
| GitHub | `get_file_contents` | That this repo and the Studio source are reachable |

The result is saved to `studio/state.live` with who ran it and when. The first time, claude.ai asks the viewer to allow each connector. If one needs signing in again, the row says so instead of failing. Nothing is written to any service. Declaring `mcp` means the page can't be shared publicly, which is fine: it's a private director tool.

## 6. Things to fix (found while wiring)

- `runway` API-key row is **degraded**. The Runway connector works, so production isn't blocked, but refresh `RUNWAY_API_ACCESS` before the orchestrator calls Runway directly.
- `system_settings.runway_image_model` = `gen4_image_turbo`, but Episode 1 key frames are made with **nano-banana-pro**. Pick one so the orchestrator matches the Studio bot.
- `kling` and `elevenlabs` rows are **degraded**; `higgsfield` is a placeholder (see the Higgsfield-Integration-Layer repo).
- `deployment_mode` is **demo**, with open row-level security (single user). Tighten it before anyone else gets access.
- Instagram in Zapier: confirm the connected login owns the show's professional account.
