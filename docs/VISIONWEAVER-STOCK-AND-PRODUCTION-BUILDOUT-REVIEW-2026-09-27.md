# VisionWeaver: stock catalog and production buildout review

**Date:** 2026-09-27  
**Status:** Provisional design assessment. The two source recordings have **not been transcribed** in this environment. No statement below is represented as a quote or finding from their spoken contents.  
**Audio sources awaiting verbatim transcription:** `Reuter Strasse Cir 34.m4a` (6:55.6) and `Reuter Strasse Cir 35.m4a` (3:04.0). Their order of recording and speakers remain unverified.  
**Direct new requirement supplied in the accompanying message:** An entire catalog of “Stock” belongs in VisionWeaver.

## 1. Executive decision

Make **Stock** a first-class, governed asset system across VisionWeaver, rather than a folder of files or a provider-specific search box. A filmmaker should be able to search footage, images, music, sound effects, graphics, voice elements, templates, character references, environments, and reusable production elements, then place an eligible asset into a scene or another output. Each placement must retain source, license, project scope, version, attribution, and provenance through export and distribution.

This extends VisionWeaver's established workflow—intake, plan, decompose, prepare assets, route provider, execute, record output, review, package, distribute, archive—at **prepare assets**, the timeline/editor, QC, packaging, and distribution. It supports the existing ambition to render films, short social clips, books, audio, magazines, storyboards, and marketing from persistent project and character records. The stock catalog is shared infrastructure for those outputs, not a separate creative silo.

Do not claim that Stock or the features below have already been implemented. The August canonical recovery package describes asset/version management and provenance as domains, and identifies asset lineage, review decisions, prompt versions, and integration receipts as reconciliation work. It does not prove a functioning catalog.

## 2. Evidence boundary and sources

The canonical recovery package `VISIONWEAVER_CANONICAL_RECOVERY_PACKAGE_2026-08-08` in the `04-VISIONWEAVER` Drive folder defines VisionWeaver as the enterprise creative media production and orchestration system. It lists the existing `vw_templates`, `vw_characters`, `vw_environments`, `vw_projects`, `vw_scenes`, `vw_renders`, `vw_distribution_log`, `production_jobs`, and `production_scenes` as implementation evidence. Those table names are historical evidence, not a fresh database inspection. It calls for provenance, asset lineage, RLS, protected secrets, and human review gates. [Drive source](https://docs.google.com/document/d/1Ffune73mLFV1BSd9kiRbE1NoA_s6cBjMRkmUkXPDeUM/edit)

The VisionWeaver conversation archive records the Architect's definition of a cross-format studio for print, audio, storyboarding, character preservation, movies, magazines, and marketing. The archive argues for a persistent story core and format-specific renderers. Its claims about past deployments are historical assertions, not live verification. [Drive source](https://drive.google.com/file/d/1MXBPhtKSAAA0ensaMVzd_YiwtUbl83oT/view)

Another organized findings document describes several divergent VisionWeaver implementations and past credential exposure concerns. It is a record of that earlier review, not evidence of today's runtime state. [Drive source](https://drive.google.com/file/d/1vo-LTqjkJ_h5YzJfdkURDPjMM5-cONZC/view)

## 3. What “Stock” should mean

### 3.1 Inventory classes

| Class | Examples | Useful search facets | Composition use |
| --- | --- | --- | --- |
| Video footage | Establishing shots, B-roll, aerials, green screen, loops | Shot size, movement, subject, location, duration, frame rate, resolution, release status | Timeline video track, scene reference |
| Still photography | Portraits, textures, places, objects, editorial images | Subject, orientation, crop safety, age, location, release | Scene background, cover, print spread |
| Generated visuals | AI images, frames, video shots, motion graphics | Model, prompt version, seed, reference asset, disclosure flag | Scene, thumbnail, storyboard |
| Audio and music | Beds, stems, loops, songs, ambience | BPM, key, duration, mood, instruments, vocal/instrumental, cue points | Music and ambience tracks |
| Sound effects | Foley, transitions, room tone, nature, interface sounds | Sound source, transient/tail, loopability, channels | Effects tracks and sound design |
| Voice assets | Narration takes, approved character voices, pronunciation guides | Speaker identity, language, consent, permitted projects, emotion | Dialogue and narration tracks |
| Design elements | Lower thirds, titles, logos, fonts, overlays, LUTs, motion presets | Aspect ratio, brand, editable format, safe area | Compositions, marketing, print |
| Story and world assets | Character sheets, reference boards, locations, props, wardrobe, style bibles | Universe, character, scene, continuity version | Storyboards and generation references |
| Production templates | Shot lists, prompt patterns, episode structures, export presets | Genre, audience, target platform, duration | Intake and project setup |
| Stock text | Cleared taglines, captions, calls to action, disclaimers | Campaign, audience, language, review state | Marketing and publishing |

**Distinct ownership classes:** (1) owned originals; (2) commissioned work with documented rights; (3) externally licensed stock; (4) public domain material whose status has been verified for the use and jurisdiction; (5) Creative Commons or other conditional grants; (6) provider-generated outputs governed by their terms; (7) reference-only material that cannot be exported. Labels such as “free” are never sufficient evidence of reuse permission.

### 3.2 Catalog experience

The Stock workspace needs unified search, media-type tabs, a visual grid, waveform preview, audio audition, video scrub preview, detailed rights panel, duplicate detection, collections, saved searches, favorites, and a clear **Add to project/scene** action. Users can filter by project, universe, aspect ratio, duration, resolution, language, mood, subject, rights status, availability, and cost. Every result shows its real origin: internal library, selected external provider, generated output, or a team upload. Search does not imply entitlement to download or publish.

Offer a **Stock Cart** for a production: candidate assets remain separate from approved assets. A storyboard card may hold alternatives; the production lead selects a candidate, QC verifies fit and rights, and the selected immutable asset version is pinned to the scene. Search query and selection history remain inspectable. Editors must see the difference between a proxy and a licensed master.

Use provider adapters for external catalogs. Search and previews can be federated where terms allow; store only permitted metadata and thumbnails. Licensing, acquisition, and download must call the provider's documented flow and record a receipt. A catalog with 100,000 searchable external items must not be marketed as 100,000 assets the user owns.

### 3.3 Rights ledger

Each acquired item needs a rights record with licensor, external asset ID, asset type, purchase/license ID, acquisition date, license text or durable receipt, allowed media, commercial/editorial scope, territory, term, audience restrictions, attribution requirements, modification permissions, exclusivity, talent/property release evidence when relevant, and status (pending, cleared, restricted, expired, revoked, disputed). Preserve the original license document and immutable checksums. Human review resolves ambiguous terms; the system does not infer rights merely from a stock site's search result.

Before placement, show restrictions; before final export, calculate the union of rights across all assets in the export. If a track or image is cleared for one platform but not another, create a platform-specific replacement task instead of silently stripping it. For derivative assets, maintain the parent lineage so edits, crops, scene extensions, and stitched films inherit relevant restrictions. This matters especially for books, paid ads, client campaigns, children's media, merchandise, and music.

## 4. Production path from idea to deliverable

1. **Intake:** choose project/universe, deliverable set (film, episode, social cutdowns, audiobook, book, magazine, campaign), audience, target lengths, aspect ratios, publication targets, rights profile, budget, and approval owner. Accept existing manuscripts and storyboards.
2. **Canon and planning:** assemble the approved source story, character identities, environment references, style and voice bibles, scene list, and revision baseline. Highlight conflicts between imported material and locked canon for a human decision.
3. **Asset plan:** for each scene, classify what is already owned, what can be generated, what stock could fill, what needs live production, and what must be commissioned. Budget time and credits. Search Stock for candidate footage, stills, music, sound, and production design.
4. **Storyboard and shot design:** produce opening and closing frames or visual references for each timed shot, camera movement, dialogue, narration, music cue, source asset, continuity rule, and intended edit. Record an expected duration for each shot and a target total runtime.
5. **Generation/production:** route tasks to available providers using capability, duration limits, quality, availability, privacy, credits, and estimated cost. Generate discrete shots rather than pretending a single provider call makes a 10- or 20-minute work. Retain the prompt, model, version, input references, job ID, output checksum, and review outcome.
6. **Extension and continuity:** when extending a shot, extract a boundary reference from the end of the approved take (the Architect's prior example uses the last two seconds). Specify the next action and continuity constraints. Measure visual and audio transition quality; a last frame alone may not preserve motion, speech, blocking, or lighting. Keep the prior clip intact and treat the extension as a new versioned segment.
7. **Assembly:** place approved generated shots, stock, live footage, dialogue, music, effects, titles, and captions on a timeline. Support multiple aspect ratios and platform variants linked to one canonical edit decision list. The deliverable runtime is computed from the assembly, never inferred from the prompt's requested duration.
8. **Review:** automated checks for missing media, technical defects, loudness, captions, shot continuity, rights and attribution, intended length, and format compliance; editorial checks for story, character, pacing, and factual or brand claims. Reviewers can approve a shot, request a local revision, or block a release.
9. **Packaging:** output masters, social cuts, captions, thumbnails, posters, book layouts, audio masters, metadata, credits, attribution, rights report, and provenance manifest. Each export carries the exact composition and asset versions used.
10. **Distribution and learning:** publication is a distinct approved action. Store publication receipts, platform IDs, errors, takedown notices, and performance metrics. Reuse learned preferences as suggested templates only after review, while preserving source and user consent.

## 5. System modules and boundaries

### 5.1 Persistent creative core

Project, universe, characters, environments, source texts, scripts, scenes, shots, and continuity rules must be independent records. A character lock is a reviewed identity package with images, descriptions, voice direction, wardrobe ranges, prohibitions, and version history—not merely a prompt copied across calls. A project selects exact versions of those records. Existing storyboards remain first-class imports, linked to shots rather than discarded during prompt generation.

### 5.2 Media asset service

Store immutable originals and licensed masters in object storage; derive lower-cost proxies, thumbnails, waveforms, transcripts, frame indexes, and print previews. Keep metadata and access controls in a relational store. Store embeddings only for permitted descriptive search; a vector index is a retrieval aid, not the source of truth. Hash originals and deduplicate by checksum, then detect visually similar duplicates for curator review. Content-addressed files need stable logical asset IDs and version IDs so users can rename items without breaking timelines.

### 5.3 Timeline and renderer

Separate the project plan, shot generation, and composition. A render service receives an immutable edit decision list with asset references, trims, layer order, transitions, audio automation, subtitles, target profile, and output destination. Render attempts are idempotent and resumable. Long-form output is composed from segments with explicit media validation at each join. Preserve audio sync, color consistency, frame rate, aspect ratio, and aspect-safe typography. Print and audiobook renderers consume the same story core but have separate layout and audio-specific QC.

### 5.4 Orchestration and governance

T.H.E.L.M.A. can dispatch and monitor authorized production jobs, retry recoverable failures, notify the right reviewer, log usage, and surface exceptions. VisionWeaver owns creative state and execution receipts. The CEO Dashboard receives project status, budget, approvals, exceptions, and links to workspaces through governed interfaces. n8n or an alternative orchestrator moves events and invokes workers; the creative data model should not be trapped inside one workflow execution. Provider keys stay in protected credentials or server-side secrets. Users see actual job state, not a static success card.

### 5.5 Collaboration and review

Roles should distinguish owner, producer, editor, reviewer, rights manager, contributor, and viewer. A review decision targets an exact project/shot/render/asset version. Comments anchor to timestamps, pages, or spatial regions. Approval of a storyboard does not automatically approve a final export. Version diffs should show changed assets, prompts, durations, rights, and costs.

## 6. Suggested data additions and contracts

Extend the existing `vw_*` schema after a live migration audit rather than assuming its exact columns. Candidate entities: `vw_assets`, `vw_asset_versions`, `vw_asset_files`, `vw_asset_sources`, `vw_stock_providers`, `vw_stock_search_receipts`, `vw_licenses`, `vw_release_documents`, `vw_asset_lineage`, `vw_collections`, `vw_collection_items`, `vw_shots`, `vw_shot_assets`, `vw_compositions`, `vw_timeline_items`, `vw_render_profiles`, `vw_render_attempts`, `vw_reviews`, `vw_approvals`, `vw_usage_events`, and `vw_publication_receipts`. Separate external provider ID from internal asset ID; never put secrets in a provider row. Scope all project-specific data to tenant/workspace and enforce RLS server-side.

Minimal event contracts: `asset.ingested`, `asset.cleared`, `asset.restricted`, `shot.approved`, `render.requested`, `render.completed`, `render.failed`, `export.preflight_failed`, `export.approved`, `publication.completed`, `license.expiring`. Include event ID, actor, tenant, object ID/version, timestamp, correlation ID, and payload schema version. Downstream retries must not create duplicate licenses, purchases, exports, or posts.

Search endpoint returns catalog metadata plus availability and restrictions. Acquisition endpoint returns the provider transaction/receipt and internal asset version. Placement endpoint validates eligibility for the project and use. Export preflight takes composition version plus intended distribution targets and returns blockers and a manifest. These four surfaces are the narrowest useful Stock API contract.

## 7. Product changes I recommend

| Current conceptual risk | Change | User-visible result |
| --- | --- | --- |
| A “generate” request suggests a completed long film from one short provider job | Show shot generation, timeline assembly, target and achieved runtime separately | The user can tell whether an episode is actually assembled to its planned length |
| Character references may be transient | Lock approved identity packages by version and pass them to every eligible shot | A returning character remains recognizable across episodes |
| Stock can be mistaken for licensed inventory | Label searchable, previewable, acquired, cleared, and placed states distinctly | The editor knows which media can be published |
| Provider credentials may leak into workflows | Server-side adapters and secret references; audit historical plaintext | Keys stay out of exports and source files |
| One generic QC checkbox hides separate risks | Split story, continuity, technical, rights, and release approval decisions | A work can pass creative review while still waiting for music clearance |
| A source file can disappear after rendering | Archive originals, proxies, project snapshots, receipts, and export manifests | Teams can revise or prove how a delivered film was made |
| One universal render path constrains print and audio | Renderer interfaces with format-specific profiles and QC | Books, podcasts, and film share canon but get proper output controls |

## 8. Acceptance scenarios and release sequence

**Scenario A: 20-minute Crossroads episode.** Import approved Book 1 chapter materials and artwork; lock Marcus and other character identities; create an episode beat sheet and timed scene/shot plan; select eligible stock ambience and music; generate short shots, extend when justified, assemble to at least 20 minutes, perform continuity and rights reviews, export a master and social cutdowns. Success means the actual encoded master duration meets the approved plan, all selected assets are resolvable and cleared for the intended targets, and every review references an exact version.

**Scenario B: commercial.** Start with the locked product design, produce two visual endpoints and copy for each slot, select stock only where it preserves the established product and characters, produce timed variants, and deliver a rights-cleared ad package. Product identity and packaging must be checked frame by frame at selected critical points.

**Scenario C: children’s science story.** Select a template for the age band, tie approved scientific explanation to source notes, lock recurring character art and voice, use searchable stock textures/sounds where appropriate, render video plus companion print and short clips. Editorial science review and child audience suitability are separate from video technical QC.

**Build order:**

1. Audit the live VisionWeaver repository, deployed routes, current Supabase schema/RLS, storage, render workers, provider contracts, and existing asset sources. Record actual behavior and failing tests. Prior historical documents cannot replace this inspection.
2. Specify Stock inventory, rights ledger, asset lineage, ingestion, preview, and search; implement owned/team assets first with one validated external stock adapter. Migrate existing assets without losing identity.
3. Make scene placement and immutable versions work in a usable storyboard/timeline. Wire license preflight and review decisions before external publication.
4. Reconcile long-form segmentation, extension, assembly, and truthful runtime reporting. Demonstrate an end-to-end longer piece with production artifacts, not just a successful short clip.
5. Add format renderers and distribution adapters incrementally, each with receipts and per-format QC.

**Minimum proof for declaring Stock production-ready:** a searchable catalog with owned and licensed examples; one genuine acquisition/receipt path; restricted assets blocked at placement or export as appropriate; inherited rights on a derivative; versioned scene placement; a completed output manifest; tested tenant isolation; cost and error telemetry; and a recovery path for an unavailable provider.

## 9. Questions for the audio review and the Architect

These are gaps to resolve from the recordings before turning this provisional design into audio-derived requirements:

1. Does “entire catalog of Stock” refer to all media classes above, a particular provider catalog, an existing personal stock archive, or all three?
2. Should Stock be searchable across external services without purchase, and which providers or accounts are already licensed?
3. Which media can be used for client deliverables, paid ads, books, children's work, and merchandise? Who approves a rights exception?
4. Are the recordings describing a current app screen, an intended screen, a reference product, or a planned workflow? What exact labels or controls are named?
5. Which decisions should T.H.E.L.M.A. make automatically, and which must be handed to the Architect or a producer?
6. Should the first release prioritize episode assembly, commercials, or the cross-format book-to-screen workflow?

**Transcript status:** The provided M4A files are present and their durations were verified. No verbatim transcription, speaker identification, or timecoded quote was obtained. This review must be reconciled line by line after a genuine speech-to-text pass or a user-provided transcript; only then should newly heard statements be promoted to confirmed requirements.
