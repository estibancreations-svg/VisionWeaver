# VisionWeaver — Commercial Creativity Station Baseline
**Date:** 2026-10-06
**Status:** baseline checkpoint after merge of PR #3
**Main merge SHA before this checkpoint:** `4eae930aaa7d9508c0f9f174529446e50553aba9`

## Current committed capability

Commercial Creativity Station is part of Director Studio and currently includes:

- 2,000 base commercial/ad template combinations
- 40 ad structures
- 25 commercial verticals
- 2 creative modes: Cinematic and Direct Response
- Pepsi Zero Sugar / “Kick the Crave” anchor workflow
- Family Dining anchor workflow
- explicit object/package/label continuity rules
- required opening and closing frame approval for every shot block
- low-AI appearance rejection criteria
- platform/duration derivatives treated as variants rather than fake extra template counts
- Director Studio navigation + build integration
- specification: `standards/commercial-creativity-station-v0.1.md`

## Baseline smoke run A — Beverage / Craving → Product / Cinematic

**Template:** Beverage × Craving → Product × Cinematic  
**Purpose:** validate a product-led 30-second structure using the Pepsi Zero Sugar spec-commercial anchor.

### Six-slot board
1. 0:00–0:05 — Craving trigger
   - food/action first
   - product not yet fully revealed
2. 0:05–0:10 — Product interruption
   - exact package enters frame
   - package becomes the hero
3. 0:10–0:15 — Anticipation
   - reach
   - label glide
   - condensation
   - hand/object contact
4. 0:15–0:20 — Release
   - pull-tab/open/pour/carbonation
   - sound-led macro moment
5. 0:20–0:25 — Experience
   - consumption
   - natural social reaction
6. 0:25–0:30 — Memory frame
   - exact hero packshot
   - tagline
   - one CTA

### Continuity checks
- exact can/package geometry
- exact label orientation
- stable scale and proportions
- believable condensation
- no letter/logo deformation
- hand anatomy passes
- food continuity passes
- opening and closing frames approved before motion
- final packshot matches master object reference

## Baseline smoke run B — Family Dining / Family Table / Cinematic

**Template:** Family Dining × Family Table × Cinematic  
**Purpose:** validate the classic family-dining commercial lane.

### Six-slot board
1. 0:00–0:05 — Arrival or immediate food hook
   - warm exterior/room context
   - one irresistible food detail
2. 0:05–0:10 — Hospitality
   - seating
   - service
   - table setup
3. 0:10–0:15 — Hero entrée reveal
   - steam
   - crust
   - butter/sauce movement
   - grill/plating detail
4. 0:15–0:20 — Sensory proof
   - knife cut
   - bread tear
   - fork lift
   - beverage pour
   - sizzle / first bite
5. 0:20–0:25 — Family payoff
   - natural reaction
   - conversation
   - no posed stock-photo behavior
6. 0:25–0:30 — Memory frame
   - hero spread
   - restaurant identity
   - one CTA

### Continuity checks
- food plating is stable shot-to-shot
- doneness and surface texture do not mutate
- tableware remains in position unless moved on camera
- restaurant environment remains geometrically stable
- cast appearance/wardrobe is stable
- no duplicated AI-looking background people
- service action follows physical continuity
- lighting enhances food rather than creating artificial glow
- final table composition matches approved hero frame

## Baseline acceptance gate

A commercial template is not considered production-ready merely because it renders attractively.

It must pass:

1. **Object truth** — hero product/service is the approved thing, not a generated substitute.
2. **Frame truth** — approved opening and closing frames exist for each block.
3. **Continuity truth** — object, food, cast, environment, lighting and props remain coherent.
4. **Physics truth** — hands, liquids, steam, reflections, utensils and movement behave believably.
5. **Claims truth** — prices, offers, nutrition, awards, affiliation and performance claims are sourced.
6. **Commercial truth** — the audience, desire/problem, proof moment and CTA are explicit.
7. **Visual truth** — reject obvious synthetic artifacts even when composition is attractive.

## Update rule

This file is the current commercial-station checkpoint. Future work should update or supersede this record as the station gains:
- runtime generation
- asset-reference ingestion
- automated object comparison
- template previews
- scoring/ranking
- analytics feedback
- user-created template saving
- campaign packaging
- publishing integration

The current station is an authoring + QC layer. It must not claim autonomous generation, publishing, or continuity verification until those runtime actions are connected and tested.
