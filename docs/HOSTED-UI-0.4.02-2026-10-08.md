# Hosted VisionWeaver UI 0.4.02

Production launch: https://visionweaver-design-studio.vercel.app/
Standalone editor: https://visionweaver-design-studio.vercel.app/design-studio/

The root hosts the canonical Director Studio navigation and production records. The shared Design Studio editor is 0.4.02. The host shell exposes the approved navigation groups, sidebar account directly above THELMA, Search / Create / Notifications, and canonical per-page visual choices. This replaces the former deployment of only the standalone 0.2.02 editor.

Source: apps/director-studio/src/hosted-shell.js and hosted-shell.css, included by build.py. The DESIGN_STUDIO host preserves a generated snapshot with a provenance manifest. Regenerate the embedded editor with DESIGN_STUDIO/scripts/embed.mjs, then run build.py and DESIGN_STUDIO/scripts/sync-director.mjs.

This hosted browser deployment saves its Director Studio state locally when Claude artifact capabilities are unavailable. It does not configure Claude capabilities or supersede the separately activated Supabase avatar records. BOY-001 RAIN v02, existing Red Balloon Shot 01 bindings, the avatar review gate, and Phase 2 authority remain governed by current canonical records. No new provider execution, billing balance, or production approval is asserted by the UI repair.
