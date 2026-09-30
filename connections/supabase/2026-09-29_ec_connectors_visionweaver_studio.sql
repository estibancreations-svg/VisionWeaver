-- VisionWeaver Studio · connector registry update (2026-09-29)
-- Project: Master Dashboard (yqealeekngxooyoemfba) · table public.ec_connectors
-- Purpose: register every service the Studio, the Studio bot and the Publisher bot use,
-- and record how each one is reached today (Claude connector / Zapier / direct API).
-- No secrets are stored here. Secret NAMES only; values live in Supabase Vault / Edge Function secrets.
-- Safe to re-run: upserts on the primary key (organization_id, connector_key).

with org as (select '20e10428-4443-4324-b36a-e68d64ec26ed'::uuid as id)
insert into public.ec_connectors
  (organization_id, connector_key, display_name, category, connection_state, transport, capabilities,
   credential_mode, credential_status, required_secrets, docs_url, endpoint_url, is_template, notes, updated_at)
select org.id, v.* , now() from org, (values
  ('zapier','Zapier','automation','active','mcp',
   '{"apps":["YouTube","Instagram for Business","Google Drive"],"used_by":["Publisher bot","VisionWeaver Studio"],"actions":["upload_video","publish_reel","drive_files"]}'::jsonb,
   'zapier_managed_oauth','configured','{}'::text[],'https://help.zapier.com','', false,
   'Connected as a Claude connector. YouTube, Instagram for Business and Google Drive authorized inside Zapier (checked 2026-09-29). Publisher Zap (Catch Hook → YouTube / Instagram / TikTok packet → Sheets log) still to build; hook URL is a secret.'),
  ('youtube','YouTube (Data API v3)','social_publishing','active','zapier',
   '{"upload":true,"schedule":true,"ai_disclosure":true,"quota_note":"API: 100 upload calls/day; Zapier free: 5 uploads/day"}'::jsonb,
   'oauth2_via_zapier','configured','{}'::text[],'https://developers.google.com/youtube/v3/docs/videos/insert','', false,
   'Reached through Zapier (approved Google app, avoids the private-until-audit rule for new API projects). Direct OAuth path: social_connections + oauth-callback edge function, scope youtube.upload.'),
  ('instagram','Instagram for Business','social_publishing','active','zapier',
   '{"publish_reel":true,"limit":"100 automatic posts per 24 hours","needs_public_video_url":true}'::jsonb,
   'oauth2_via_zapier','configured','{}'::text[],'https://developers.facebook.com/docs/instagram-platform/content-publishing/','', false,
   'Reached through Zapier. Confirm the connected Instagram account is the professional account that owns the show.'),
  ('tiktok','TikTok (Content Posting API)','social_publishing','deferred','manual',
   '{"direct_post":false,"reason":"unaudited apps can only post private"}'::jsonb,
   'not_configured','not_configured','{"TIKTOK_CLIENT_KEY","TIKTOK_CLIENT_SECRET"}'::text[],'https://developers.tiktok.com/docs/en/content-posting-api-get-started','', false,
   'Not connected. Publisher prepares the TikTok packet and Sire taps Post. Connect after app audit.'),
  ('runway_mcp','Runway (Claude connector)','creative_ai','active','mcp',
   '{"generate_image":true,"generate_video":true,"speech":true,"sound_effects":true,"music":true,"credits":true}'::jsonb,
   'connector_oauth','healthy','{}'::text[],'https://docs.dev.runwayml.com','', false,
   'Live 2026-09-29: Pro plan, 36,738 credits. This is how Episode 1 media is made today. The separate runway API-key row stays degraded until RUNWAY_API_ACCESS is refreshed.'),
  ('google_drive_connector','Google Drive (Claude connector)','documents','active','mcp',
   '{"read":true,"search":true,"create":"refused for new files in some folders (2026-09-27)"}'::jsonb,
   'connector_oauth','configured','{}'::text[],'https://developers.google.com/drive','', false,
   'Holds manuscripts, scripts and final delivery files. Script v8 upload was refused from Claude on 2026-09-27; Sire adds it by hand.'),
  ('github_connector','GitHub (Claude connector)','source_control','active','mcp',
   '{"push_files":true,"repos":["estibancreations-svg/VisionWeaver"]}'::jsonb,
   'connector_oauth','configured','{}'::text[],'https://docs.github.com','', false,
   'VisionWeaver repo is public: production records only, no manuscript text beyond what is already published.'),
  ('notion','Notion','documents','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://developers.notion.com','', false,
   'Available as a Claude connector. Not yet used by VisionWeaver.'),
  ('figma','Figma','creative','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://help.figma.com','', false,
   'Available as a Claude connector for UI design handoff.'),
  ('lovable','Lovable','application_runtime','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://docs.lovable.dev','', false,
   'Available as a Claude connector.'),
  ('netlify','Netlify','deployment','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://docs.netlify.com','', false,
   'Available as a Claude connector. Vercel stays the primary host.'),
  ('hugging_face','Hugging Face','ai_model','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://huggingface.co/docs','', false,
   'Available as a Claude connector.'),
  ('docusign','DocuSign','documents','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://developers.docusign.com','', false,
   'Available as a Claude connector (licensing and talent releases later).'),
  ('shopify','Shopify','commerce','staged','mcp','{}'::jsonb,'connector_oauth','configured','{}'::text[],'https://shopify.dev','', false,
   'Available as a Claude connector (VisionWeaver Décor merchandising).'),
  ('claude_artifact_studio','VisionWeaver Studio (Claude artifact)','application_runtime','active','native',
   '{"db":["studio/state","queue","log/main"],"sample":true,"downloads":true,"user":"profile"}'::jsonb,
   'claude_session','configured','{}'::text[],'','', false,
   'Director control surface. Shared saved data: PART 2 picks, narration recorded, deliverables, setup steps, shot status and notes, release calendar, Guild queue, activity log. Claude reads it directly.')
) as v(connector_key, display_name, category, connection_state, transport, capabilities, credential_mode,
       credential_status, required_secrets, docs_url, endpoint_url, is_template, notes)
on conflict (organization_id, connector_key) do update set
  display_name = excluded.display_name, category = excluded.category, connection_state = excluded.connection_state,
  transport = excluded.transport, capabilities = excluded.capabilities, credential_mode = excluded.credential_mode,
  credential_status = excluded.credential_status, required_secrets = excluded.required_secrets,
  docs_url = excluded.docs_url, notes = excluded.notes, updated_at = now();

-- Existing rows: record how they are reached today without touching their credential status.
update public.ec_connectors set notes = coalesce(notes,'') ||
  ' | 2026-09-29: also reachable as a Claude connector (Canva MCP).', updated_at = now()
 where connector_key = 'canva' and organization_id = '20e10428-4443-4324-b36a-e68d64ec26ed'
   and coalesce(notes,'') not like '%2026-09-29%';
update public.ec_connectors set notes = coalesce(notes,'') ||
  ' | 2026-09-29: Drive is live through Zapier and the Claude connector (see google_drive_connector).', updated_at = now()
 where connector_key = 'google_drive' and organization_id = '20e10428-4443-4324-b36a-e68d64ec26ed'
   and coalesce(notes,'') not like '%2026-09-29%';
update public.ec_connectors set notes = coalesce(notes,'') ||
  ' | 2026-09-29: API key degraded, but the Runway Claude connector is healthy (see runway_mcp). system_settings.runway_image_model is gen4_image_turbo while Episode 1 key frames use nano-banana-pro.', updated_at = now()
 where connector_key = 'runway' and organization_id = '20e10428-4443-4324-b36a-e68d64ec26ed'
   and coalesce(notes,'') not like '%2026-09-29%';
