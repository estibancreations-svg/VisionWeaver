# VisionWeaver production design v2
Date:2026-10-02 America/Chicago
Status: PROPOSED / AWAITING ARCHITECT APPROVAL TO BUILD
Scope of this change: documentation and research only. No product implementation, schema migration, paid render, deployment or publication authorized by this proposal.

## Pitch
VisionWeaver turns an idea or existing work into a connected body of books, performances, films and publishable media. It preserves approved characters, voices, places and story facts, directs how they interact, and carries their state through every scene. Once the creator approves the look and feel, it executes repeatable production within agreed quality, budget and release rules, while preserving editable assets, provenance and creative control.
Original approved wording: [founding pitch](2026-10-02-VISIONWEAVER-FOUNDING-PITCH.md).

## Evidence reviewed and current state
Primary repositories reviewed: VisionWeaver, MASTER_CEO_DASHBOARD, Master-System-Buildout. Owner-wide code search covered CMGIO, Stock and Reality Gate; this is a targeted review, not certification of every repository or runtime.

- [Character board standard](https://github.com/estibancreations-svg/VisionWeaver/blob/main/standards/character-board-system-v1.md): existing32-view master,16-view limited variant,detail board and cast board standard; includes voice,skin texture and prohibited drift.
- [Publishing & Media Studio](https://github.com/estibancreations-svg/Master-System-Buildout/blob/main/02-SYSTEM-SPECIFICATIONS/Publishing-Media-Studio/README.md): initial specification, not a demonstrated autonomous publisher. Canon,manuscripts,editions,voice library,adaptations,rights and author gates already defined.
- [PUB-001](https://github.com/estibancreations-svg/Master-System-Buildout/blob/main/07-DOCUMENTATION/Runbooks/PUB-001-BOOK-SERIES-PUBLICATION-TRANSMEDIA.md): ingest,canon,developmental edit,author decision,revision,continuity,production,release,publication,adaptation,CMGIO distribution and learning.
- [Capability registry](https://github.com/estibancreations-svg/Master-System-Buildout/blob/main/00-CENTRAL-HUB/Registries/AGENT-CAPABILITY-REGISTRY.json): Book Co-Author,Narratologist,Visual Storyteller,Audio Strategist and Draft Publisher are largely adapted_design; Canon Keeper is an Estiban extension. Registry entries do not establish deployed execution.
- [CMGIO code](https://github.com/estibancreations-svg/MASTER_CEO_DASHBOARD/blob/main/src/components/CmgioWorkspace.tsx): campaign and signal reads/writes,optimization staging and publishing authorization; explicitly avoids claiming external publication without a connector. No book-specific sales forecasting pipeline was established by this code review.
- [Discovery & Learning](https://github.com/estibancreations-svg/Master-System-Buildout/blob/main/02-SYSTEM-SPECIFICATIONS/Ecosystem-Discovery-Learning-Engine/README.md): already defines discover,verify,score,compare,adapt and test upstream capabilities.
- [Historical v7 review](https://github.com/estibancreations-svg/VisionWeaver/blob/main/research/2026-09-30-v7-github-review.md): records missing original localized avatar framework and prior UI/server mismatch; historical findings require current runtime revalidation.
- User now reports layout accepted,first rendition successful and character saved. These are user-observed outcomes,not independent proof of all durability/handoffs.
- Deferred defects: Library Refresh lacks visible response; reference carousel needed; Save Character should follow complete form; voice and avatar retrieval need clearer integration.
- No completed end-to-end published film or autonomous book mission is certified here.

## Thirty material improvements
| # | Design requirement | Evidence required to close it |
|---|---|---|
|1|One project owns linked manuscript,avatars,scenes,shots,audio,editions and deliveries.|Navigate all views and reload without losing links.|
|2|Identity is registered before rendering; approved reference selection reuses or creates an identified avatar.|No repeated manual re-description; duplicate detection suggests rather than silently merges.|
|3|Appearance,performance,voice and knowledge states version independently.|Clothing or emotion edits preserve identity and show affected uses.|
|4|Voice setup includes sample,language,delivery range,pronunciation and provider mapping.|Same identity across whisper/shout and authorized localization; age does not change accidentally.|
|5|Canonical complexion includes approved hyperpigmentation,scars,freckles and undertones.|Neutral-reference and production-lighting review preserve marks without smoothing or lightening them.|
|6|32-view boards remain mandatory references; geometry has a separate verification status.|Do not claim calibrated3D or unseen anatomy from a montage.|
|7|World records carry geography,date,local timezone,season,weather and evidence.|No date-incompatible landmark; unknown exact site is marked unset.|
|8|Ecology selects locally plausible species,activity and density.|Species/time/weather evidence before a factual scene is certified.|
|9|Background events have IDs,paths,timing,purpose and sound sources.|A car,pedestrian,baby cry or truck remains consistent across cuts.|
|10|Every editable element declares its available layers.|UI distinguishes independent track from baked-in content.|
|11|Visual,audio and causal toggles are separate.|Mute truck versus remove truck yields different,correct changes.|
|12|An interaction graph links source events to shadows,reflections,splashes,reactions and sound.|Remove a truck; affected consequences are identified and rebuilt or reviewed.|
|13|State extraction separates observed,inferred,authored,simulated and unknown values.|Every consequential inference has confidence/evidence; unknown depth is not invented as measured.|
|14|A capsule stores approved trim endpoint,clean terminal frame and adaptive motion/audio tail.|Continuation follows the edited ending,not discarded source footage.|
|15|Provider inputs are selected by capability and reference role.|Log actual transmitted assets; unsupported references cannot be silently dropped.|
|16|Hard requirements fail preflight or QC; descriptive prompts remain soft controls.|Unsupported exact physics routes to another method or becomes explicitly approximate.|
|17|Camera direction follows the story's attention target.|Focus shifts boy→string→balloon deliberately; off-screen subject persists.|
|18|Editing grammar controls cuts,eyelines,screen direction and rhythm.|New-angle shots preserve world state without blindly repeating the last frame.|
|19|Physics has cinematic,constrained and validated modes.|Each shot declares evidence level and uses appropriate tools.|
|20|Animal motion uses species,rig,anatomy,contacts and load changes.|Eagle pickup sequence checks grip,load,wing motion and feasible exit path.|
|21|Fast events use event time separately from playback time.|Motion blur,sound timing and slow motion remain consistent.|
|22|Acoustics track emitter,listener,occlusion,distance and mix.|Passing vehicles,baby cries,footsteps and rain agree with scene timing/position.|
|23|Visible sound/force fields are optional explanatory overlays.|Legend states represented quantity and scale; overlay cannot masquerade as naturally visible sound.|
|24|Mastering records native resolution,crop,upscale,color pipeline and delivery.|4K/16K claims distinguish pixel dimensions from captured/generated detail.|
|25|Canon is immutable by version; changes invalidate only dependent artifacts.|Approved earlier output remains intact; stale downstream shots are visibly flagged.|
|26|Retries are bounded,idempotent and budget-aware.|Disconnect/reload does not duplicate charge or generation; failed attempts logged.|
|27|Independent QC uses golden references,negative tests and group-aware review.|Known defects detected; no universal face-score threshold claimed reliable.|
|28|Calibrated autonomy uses a versioned production policy.|Known work continues automatically; exceptions stop with evidence and resume safely.|
|29|Book opportunity intelligence feeds author-controlled creation and publication.|Observed revenue,estimates,rank proxies and creative judgment stay distinguishable.|
|30|Reuse existing engines through portable contracts and a maintained evaluation ledger.|Candidates earn adoption through license,round-trip,quality,cost and failure tests.|

## The scene is an event system
Every event records: stable ID,start/end time,participants,preconditions,action,expected consequences,visual layer,audio stem,occlusion/depth,importance,dependencies and approval.
Example TRUCK-PASS-01: vehicle follows a lane; tires traverse water; splash particles hit nearby surfaces; shadow/reflection move; engine/tire sound passes the listening point; nearby pigeons may react only if that response is directed.
A phone user is an actor with path,gaze,hand occupancy and collision avoidance. A baby cry is linked to an on-screen or off-screen emitter. Off-screen sources need not force an additional visible person into the shot.
Atmosphere has a density budget. Selecting realism does not mean enabling every effect. A quiet scene can be realistic. Bugs/birds are enabled only where plausible for locality,season,time,weather and shot scale; many need not be visible or audible.

## Meaning of the editing toggles
Three user intents:
- Mute: sound only.
- Hide visual contribution: compositing choice; warning if dependent visual effects remain.
- Remove event from story: recompute its consequences and mark dependent shots stale.

Track states: visible,audible,participates in interaction,locked,solo,level,frequency,spatial path.
Editable contract: clean plate + subject/background layers + masks/depth where available + audio stems + event timing. No claim that a flat AI video can be perfectly decomposed. With baked footage, disclose required inpainting/regeneration and preview cost before the edit. Cache unchanged layers and preserve the original take.
Display practical controls: Rain,Puddles,Traffic,Pedestrians,Birds,Insects,City ambience,Dialogue,Music. An Advanced panel reveals event dependencies. Do not expose implementation jargon in the ordinary workflow.

## Camera and attention
Story priority drives framing,not a simplistic “always center character” rule. For the balloon release,attention can shift from grip to slipping string to balloon ascent; the boy's gaze and camera tilt remain coordinated. A reaction cut may tell the story better than a continuous tilt. Define alternative approved shot patterns.
There are two clocks: story/event time and editorial timeline time. Trimming,retiming and rearranging footage changes edit timing and can invalidate old continuity capsules.
A terminal frame with blur,transition or occlusion may be a poor starting reference. Preserve the terminal frame and a nearby clean anchor with time offsets; do not silently substitute a different ending. An adaptive tail can exceed two seconds when an action requires it.

## Physics and behavior
Cinematic plausibility: perceptually convincing,not a simulation claim.
Constrained production: authored trajectories,rigs,contacts,masses and event timing guide generation/compositing.
Validated simulation: documented inputs,solver settings,reference measurements and tolerances support specific physical claims.

Eagle example: select species and body/prey mass estimates with sources; approach,deceleration,talon contact,load acquisition and climb are separate events. Added payload changes the load to support. Feasibility also depends on speed,wind,wing geometry and grip. Do not promise straight-up ascent just because a prompt asks for it; propose a supported path or label stylization. Detailed biomechanical parameters remain a specialist validation task.
A fast projectile effect requires timeline scale,motion blur,occlusion and sound-arrival consistency. Keep this a visual-effects specification; this proposal supplies no weapon design or operational ballistics instructions.
Ordinary sound should not automatically appear as rings. An educational overlay can visualize pressure variation with a declared legend,time scale and medium. Stylized visible waves are a separate creative mode. Air sound,water surface ripples and wake effects must not share one universal animation.

## Skin,voice and accessibility
Identity stores approved texture and pigmentation by location,not a uniform color swatch. Separate material/complexion from illumination and grading. Avoid inferring ethnicity or accent from a face; director-approved casting and voice choices are authoritative. Consent/source records travel with reusable voice/likeness assets.
Review dark skin under overcast,backlight and exposure changes; retain freckles,hyperpigmented patches and scars. Color management cannot itself guarantee representation fidelity; compare approved references and inspect frames.
Captions,transcripts,readable graphics,alt descriptions where appropriate,language versions and reduced-intensity variants belong in delivery profiles.

## Resolution honesty
4K and16K are output categories requiring explicit width,height,frame rate,color space,bit depth,codec and destination. Sony documents16K-capable displays; this does not establish native16K generation by any provider.
For illustration,a15360×8640 frame has16times the pixels of3840×2160. Compute,storage and quality need actual benchmarks; do not assume all costs scale exactly16times.
Keep native render size,separate upscale stages and delivered size in provenance. Upscaling can change apparent detail but is not evidence that original texture was captured. Validate a4K workflow first;16K is conditional on destination and tested capacity.

## Autonomous production is the original purpose
Calibrate once on representative examples,then reuse a versioned production policy containing: approved look/feel,character/voice locks,world rules,accepted shot patterns,quality tolerances,allowed providers,budget caps,retry caps,rights scope and publishing destinations/permissions.
Modes:
1. Calibration: director approves reference/look and several representative scene tests.
2. Supervised batch: automatic draft→render→QC→assembly; consolidated review.
3. Bounded autopilot: routine work proceeds within policy; only exceptions need attention.
4. Delegated release: external distribution only within explicit channel/content/budget authority and with receipts.
No approval prompt for each known background sound or routine planned transition. New identity,unapproved canon change,uncertain rights,spend over cap or repeated quality failure creates an exception.
Autonomy must survive task retries,provider failures,restarts and concurrent edits. Operator can pause/cancel; an in-flight provider job may still consume credits,which must be reported.

## Books,market intelligence and publication
Ownership:
Publishing & Media Studio: story/manuscript/series canon,author voice,editorial and editions.
VisionWeaver: audiovisual performance,scene/shot production and derivatives.
CMGIO: audience/category opportunity,positioning,launch,distribution and performance.
T.H.E.L.M.A.: mission orchestration and exception routing.
Quality Control Agency: independent evidence and acceptance.
Architect: creative authority and final policy control.

Proposed new mission begins with idea + intended reader + author voice + constraints. CMGIO provides a sourced opportunity brief; Publishing plans outline/series bible; drafting occurs in chapter batches with continuity and independent editorial passes; author approves material canon decisions; formats/covers/metadata/rights are validated; destination adapters submit; platform receipts and subsequent performance link to the exact edition.
Opportunity report includes comparable titles,category/country/format,date window,reader needs,competition,price range,discovery routes,costs and confidence. A recommendation score is decision support,not a sales probability.
Actual owned royalty/transaction reports outrank estimates. Bestseller rank,reviews and engagement are proxies,not competitor profit. Missing data remains missing. Do not copy an author's prose or alter the creator's approved story to chase a trend.
Profit scenarios account for realized receipts,print/distributor costs,returns,advertising,editing/production and attributable overhead; distinguish cash timing from profit and avoid counting royalties twice.
Validate predictive recommendations on held-out later periods and report errors. Optimize fit and sustainable outcomes,not just gross sales or clickbait.

## Existing engines to evaluate
These are research candidates,not installed/certified integrations.
- [OpenUSD](https://github.com/PixarAnimationStudios/OpenUSD): scene layering,composition and variants. It organizes a world; it is not a physics engine or proof of real geometry.
- [Blender](https://github.com/blender/blender): modeling,rigging,animation and simulation. Use for shots requiring explicit spatial/physical control; no need to rebuild these engines.
- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO): edit decision interchange. It is not a renderer; test preservation of timing,transitions,effects and media links in each adapter.
- [FFmpeg](https://github.com/FFmpeg/FFmpeg): media inspection,frame/tail extraction,encoding,compositing and audio processing. Document codec/license choices.
- [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO): consistent color transforms across participating tools.
- [Agency Agents](https://github.com/msitarzewski/agency-agents): already cited in the Publishing specification; adapt role/runbook patterns,do not equate a role prompt with a working publishing integration.
Retain Adobe and existing provider paths as candidates alongside these engines. A real export/import round-trip is required before promising interoperability. Review full licenses,dependencies,maintenance and fit before implementation; GitHub NOASSERTION is not a license approval.

## Proposed data boundaries
Use existing records first; reconcile actual schema before creating tables.
Candidate entities: Work,Edition,Avatar,AppearanceState,VoiceProfile,World,Entity,Event,Scene,ShotContract,AssetVersion,GenerationAttempt,ContinuityCapsule,TimelineRevision,QualityReview,ProductionPolicy,MarketEvidence,DeliveryReceipt.
Each carries stable identity,version,organization,source,approval and timestamps. Foreign-key lineage links assets to parents. Immutable approved snapshots coexist with mutable working drafts.
A completion event imports media into controlled storage,checks checksum and media metadata,updates a generation attempt,creates review tasks and only after approval advances canon. A task callback alone does not mean the film is approved.
Cross-shot change impact is a dependency graph. Editing source appearance marks descendants stale; it never silently rewrites existing masters.

## Visual workspace proposal
Top: Project / Canon / Scenes / Timeline / Review / Deliver.
Left: avatar,voice,world,prop and reusable stock libraries with searchable carousels.
Center: shot preview with start/end comparison and camera framing overlay.
Right: selected actor/event controls,scene reality settings and continuity inspector.
Bottom: layered video/audio timeline with visible/audible/interaction controls.
Persistent status: saved/syncing/failed,last updated,estimated cost,approved policy and job progress.
Mobile/tablet uses collapsible panels without narrowing forms to a fixed strip. Save Character sits after visual,voice and reference fields. Library retains its accepted layout; Refresh gains visible loading,success,empty/no-change and error feedback.

## Proof before expansion
A. Continuation: take approved boy clip; persist edited endpoint/tail; produce next shot; compare identity,hand,string,world,weather and motion.
B. Causal edit: add a single background vehicle as a separate event; mute it; remove it and its effects; verify unchanged layers survive.
C. Attention: balloon release,boy reaction and upward framing; check event order and screen direction.
D. Recovery: reload/disconnect/retry; ensure no duplicate generation and durable assets.
E. Autonomy: approved policy runs a small batch and stops on an intentionally injected canon/budget mismatch.
F. Publishing: a short original book mission through editorial/export validation and a staged distribution package; actual publication waits on authorized destination setup.
G. Physics stress tests: eagle load change and high-speed/sound visualization are separate test fixtures after the simple chain works.
Capture pass/fail,artifacts,cost,latency,retries,manual interventions and defects. No arbitrary universal numerical threshold; calibrate per task/provider and approved examples.

## Architect's core questions — candid design review
Does it work? The initial rendition and layout are user-accepted. This expanded architecture is unbuilt; full operation cannot yet be called verified.
Are connections correct? Responsibilities and contracts are mapped; runtime adapters still require tests.
Is it at least30percent better? Thirty concrete improvements are specified. No measured multiplier is claimed; compare approved-shot rate,manual steps,cost per usable second,continuity defects and publishing completion against baseline.
Is it what was asked? Yes: preserved pitch,editable believable worlds,avatars/voices,continuity,physics,sound,camera,books,market intelligence,reuse,autonomy and approval-before-build.
Would the Architect consider it done? The proposal is reviewable. Product completion requires the proof tests and the Architect's acceptance.
Is this the best I can do now? Yes as the current evidence-backed design proposal,after correcting prompt-lock guarantees,flattened-edit assumptions,physics claims,sales inference and autonomy boundaries. It remains revisable when tests supply new evidence.

## Source notes
Reviewed2026-10-02. Primary references:
- OpenUSD introduction: https://openusd.org/release/intro.html
- Blender simulation: https://www.blender.org/features/simulation/
- OpenTimelineIO: https://github.com/AcademySoftwareFoundation/OpenTimelineIO
- FFmpeg filters: https://ffmpeg.org/ffmpeg-filters.html
- OpenColorIO: https://opencolorio.org/
- Sony16K display announcement: https://pro.sony/ue_US/press/crystalledcedia2019
- Amazon KDP Sales Ranking: https://kdp.amazon.com/en_US/help/topic/G201648140
- Amazon KDP Reports: https://kdp.amazon.com/en_US/help/topic/GVTTXHKHVPAPBEDQ
- Cornell Rock Pigeon identification: https://www.allaboutbirds.org/guide/Rock_Pigeon/id
Species evidence supports general ecological selection,not a verified particular Chicago street/date or eagle load model.

## Latest conversation requirements
The Architect approved preservation of the preceding pitch,requested background cars,phone-using pedestrians,baby cries,splashes,garbage trucks,birds and bugs with location accuracy,editing toggles,camera attention to the departing balloon,autonomous execution after look/feel approval,book ideation/review/market intelligence/publication and reuse of existing technology. Requested deep consideration of sound,picture quality4K/16K,hyperpigmentation,high-speed events,sound visualization and load-sensitive eagle motion. Requested repository notes and a revised proposal before saying yes to building.
These are requirements/proposals,not claims of shipped features. Existing no-extra-people/no-extra-balloons walking-shot instructions remain valid for that approved take; richer environment variants must be versioned.
