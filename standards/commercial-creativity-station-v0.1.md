# VisionWeaver Commercial Creativity Station v0.1

**Status:** implementation branch `feature/commercial-creativity-station`

## Purpose
Create a dedicated commercial and advertising workspace inside VisionWeaver Director Studio. The station must produce concrete, repeatable commercial plans rather than generic AI concepts.

## Non-negotiable rules
1. **Hero-object lock:** the product, package, plate, logo placement, color, geometry, label, wardrobe, location, and other approved anchors must remain consistent across every shot unless an explicit change is authored.
2. **Opening + closing frame rule:** every shot block has an approved first frame and last frame before motion generation.
3. **No silent substitutions:** if a referenced product or prop cannot be matched, the render is blocked rather than replaced with a lookalike.
4. **Low-AI appearance:** default toward photoreal materials, believable physics, real lens behavior, natural lighting, controlled depth of field, and restrained motion. Reject waxy skin, malformed packaging, warped lettering, floating utensils, impossible reflections, over-smoothed food, excessive glow, and synthetic crowd repetition.
5. **Commercial relevance:** every template must have a defined audience, selling objective, hero object, proof/payoff moment, CTA, and intended placement.
6. **Continuity before speed:** a generation that drifts from the approved object, cast, location, or food state fails QC even if it is visually attractive.
7. **Claims discipline:** do not invent prices, nutrition claims, awards, client results, affiliation, availability, or product specifications.

## Catalog size
The station exposes **2,000 curated commercial template options** built from:
- **40 ad structures**
- **25 commercial verticals**
- **2 creative modes**: Cinematic / Direct Response

40 × 25 × 2 = 2,000 base templates.

Duration, aspect ratio, platform, edit rhythm, CTA style, and visual finish are variants of a base template and are not used to inflate the 2,000 count.

## 25 commercial verticals
1. Family dining
2. Steakhouse
3. Seafood
4. Barbecue
5. Fast casual
6. Quick service
7. Grocery
8. Beverage
9. Snacks / packaged food
10. Automotive
11. Real estate
12. Hospitality / hotels
13. Travel / tourism
14. Retail
15. Apparel
16. Beauty / skincare
17. Home / furniture
18. Consumer electronics
19. Fitness
20. Financial services
21. Professional services
22. Healthcare services
23. Education
24. Entertainment / events
25. Nonprofit / community

## 40 ad structures
1. Hero Product Reveal
2. Craving → Product
3. Problem → Solution
4. Before → After
5. Family Table
6. Occasion / Celebration
7. Product Ritual
8. Macro Sensory
9. Ingredient / Craft
10. Demonstration
11. Testimonial
12. Social Proof
13. Three Reasons
14. Comparison
15. Transformation
16. Day in the Life
17. Point of View
18. UGC-Style
19. Founder / Maker
20. Staff / Service
21. Environment / Atmosphere
22. Destination
23. Limited Offer
24. New Launch
25. Seasonal
26. Countdown
27. Story Mini-Arc
28. Humor Setup / Payoff
29. Emotional Memory
30. Generational / Family Legacy
31. Behind the Scenes
32. Process / How It’s Made
33. Feature Stack
34. Benefit Stack
35. Objection / Rebuttal
36. FAQ
37. Product Lineup
38. Choose Your Favorite
39. Sound-First / ASMR
40. Cinematic Brand Film

## Editing capability vocabulary
Templates may call for edit behaviors common to CapCut-style and other template-driven editors, including:
- beat cuts
- speed ramps
- match cuts
- push-ins / pull-outs
- split screen
- before/after wipes
- kinetic titles
- masked reveals
- photo-to-video motion
- product freeze frames
- subtitle-first UGC layouts
- countdown cards
- montage grids
- parallax stills
- macro cutaways
- whip transitions
- rack-focus transitions
- sound-led cuts
- logo/end-card builds
- platform-safe reframing
- auto-caption-safe composition

These are **editing patterns**, not permission to copy another platform’s proprietary templates or visual assets.

## Anchor example — Pepsi Zero Sugar / “Kick the Crave”
Reference operating pattern:
- 30-second master
- six 5-second blocks
- approved opening and closing image for each block
- exact can/label lock in every frame
- food context remains coherent
- macro pull-tab / condensation / carbonation as sensory proof
- group reaction and consumption payoff
- final hero can and tagline
- create 15s, 6–10s, 9:16, 1:1, reel-cover, still, and alternate-hook derivatives from the approved master

### Recommended 30-second slot logic
1. 0:00–0:05 — Craving / food trigger
2. 0:05–0:10 — Product interruption / hero arrival
3. 0:10–0:15 — Reach / label / anticipation
4. 0:15–0:20 — Pull-tab / carbonation release
5. 0:20–0:25 — Consumption / group payoff
6. 0:25–0:30 — Hero packshot / memory / CTA

## Family dining anchor
Commercials in this category should sell **food + hospitality + environment + family ritual**.

Required food-detail vocabulary:
- steam
- sizzle
- crust
- butter melt
- sauce movement
- knife cut
- fork lift
- bread tear
- cheese pull where appropriate
- beverage pour
- first bite
- table reaction

Dining-room environment is not filler. Lighting, tableware, booths, wood/stone surfaces, service choreography, spacing, and acoustics must make the food feel more valuable.

## Template record schema
Each base template should resolve to:
- template_id
- vertical
- structure
- creative_mode
- objective
- audience
- offer_type
- hero_object_type
- required_locks
- shot_count
- slot_plan
- opening_frame_requirement
- closing_frame_requirement
- camera_language
- lighting_language
- sound_language
- edit_language
- proof_moment
- CTA_type
- default_durations
- default_aspect_ratios
- platform_notes
- rights_notes
- claims_notes
- rejection_conditions

## Product continuity gate
Before motion generation:
- hero reference uploaded
- package/label/shape approved
- object checksum/reference ID stored
- first frame approved
- last frame approved
- scene environment approved
- cast state approved where present

After each shot:
- compare hero object to reference
- compare label and package geometry
- compare color/material state
- compare relative scale
- compare placement/orientation
- compare lighting/reflection plausibility
- compare food/prop continuity
- reject if material drift is visible

## Acceptance criteria for v1
- Commercial Creativity Station appears in Director Studio navigation.
- Template count reads exactly 2,000 base options.
- Filters work for vertical, structure, and creative mode.
- Selecting a template displays its objective, hook, proof moment, CTA, and six-slot starter plan.
- Pepsi Zero Sugar is present as an anchor example, clearly marked as a user-owned/spec reference rather than an official brand affiliation.
- Family Dining has dedicated sensory and environment requirements.
- Continuity rules are visible in the station.
- No generation or publishing is claimed until the corresponding runtime action is actually connected and verified.
