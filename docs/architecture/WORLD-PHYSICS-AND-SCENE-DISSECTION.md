# VisionWeaver World Physics & Scene Dissection Architecture

**Status:** ACTIVE DESIGN BASELINE  
**Date:** 2026-10-03  
**Primary system:** VisionWeaver  
**Purpose:** Convert generated media from a flat prompt/output artifact into a persistent, spatially coherent, causally consistent production world.

## Core principle

VisionWeaver scenes are not independent generated backgrounds. A scene is a persistent world volume with geometry, entities, environmental conditions, sound sources, off-screen state, camera state, avatar state, and temporal continuity.

The governing rule is:

> Nothing meaningful moves without a cause, and every meaningful cause may produce secondary effects.

## Scene decomposition layers

Every generated shot or clip is decomposed into synchronized layers:

1. **Visible World Map**
   - avatars
   - props
   - architecture
   - roads, sidewalks, vegetation, vehicles, signage
   - weather effects
   - lighting and shadows
   - reflections
   - moving and fixed objects

2. **Off-Screen World Map**
   - inferred entities revealed by sound, shadow, reflection, reaction, or continuity
   - estimated direction and distance
   - persistence state
   - uncertainty/confidence
   - camera relevance
   - avatar relevance

3. **Acoustic World Map**
   - rain, wind, traffic, voices, footsteps, splashes, horns, birds, insects, machinery, HVAC, sirens, phones, background activity
   - source identity
   - direction
   - distance
   - intensity
   - motion
   - occlusion
   - environmental reflection/reverb
   - avatar detectability

4. **Avatar Conditioning / Perception**
   - visual field
   - hearing range
   - gaze behavior
   - attention switching
   - reflex/startle behavior
   - posture
   - body orientation
   - locomotion
   - social response
   - interaction distance
   - recovery after stimulus
   - whether a stimulus is ignored, noticed, or escalated

5. **Camera Perception & Response**
   - camera position/orientation
   - focal subject
   - lens/framing state
   - pan/tilt/track/orbit/crane behavior
   - whether the camera follows avatar attention or narrative salience
   - camera movement must reveal the established world rather than invent a contradictory one

6. **Environmental Physics Field**
   - light and shadow
   - cloud cover
   - rain intensity/direction
   - water accumulation/runoff/splash
   - wind speed/direction/gusts
   - temperature/humidity
   - haze/condensation
   - air displacement
   - turbulence and wake
   - localized disturbances from bodies, wings, vehicles, doors, fans, explosions, fast-moving objects, etc.

7. **Temporal / Continuity State**
   - time of day
   - time period
   - weather progression
   - object state
   - avatar pose and emotion
   - lighting continuity
   - wetness state
   - motion carryover
   - audio tail
   - camera carryover
   - world changes caused by prior events

## Causal chain

The engine should evaluate scenes using the following chain:

**World geometry → weather/light field → environmental physics → event/object movement → sound propagation → sensory perception → avatar reaction → camera response → continuity update**

Example:

**wind gust → leaves move → rustling sound → balloon drifts → string angle changes → rain trajectory changes → clothing moves → avatar reacts → camera may compensate**

Example:

**bird swoop → wing motion → local air displacement → nearby vegetation/fur disturbance → sound field change → prey/avatar perception → reaction**

## Uncertainty rule

Never invent a precise unseen object when only partial evidence exists.

Example:

If a horn is audible but vehicle type is unknown, store:

`VEHICLE_HORN_SOURCE_01 — class uncertain`

Do not silently resolve it to "truck" or another vehicle until evidence supports that conclusion.

## 360° Scene World Volume

Each scene maintains persistent spatial coordinates for visible and unseen elements.

The camera should be able to rotate, orbit, or move through the environment while preserving:
- object placement
- environmental geometry
- sound direction
- light direction
- weather continuity
- avatar orientation
- prior event state

A new camera angle is a new view of the same world, not a newly invented background.

## Director's Guild integration

This architecture belongs under the existing VisionWeaver Directors Guild.

Relevant guild responsibilities:
- **Design:** world geometry, spatial coherence, persistent assets
- **Motion:** avatar movement, causal motion, environmental effects
- **Sound:** visible and off-screen source mapping, propagation, ambience
- **Edit:** temporal continuity and scene-state preservation
- **Automation:** scene dissection, world reconstruction, continuity capsule creation

Director approval remains the authority gate for consequential production changes.

## Scene Dissection Engine

The Scene Dissection Engine reconstructs a generated clip into a world model.

For each shot/segment, capture:
- avatar layer
- prop layer
- visible environment
- hidden/off-screen environment
- acoustic sources
- weather physics
- lighting
- camera position/movement
- character perception
- character reactions
- object interactions
- temporal state
- 360° world coordinates
- continuity state
- uncertainty/confidence

## Initial test bed

Use the existing **Boy and the Red Balloon** material as the first validation target.

Baseline continuity requirements:
- one seven-year-old Black boy
- medium-brown skin
- short dark curls
- brown eyes
- mustard-yellow hooded raincoat
- navy trousers
- black rubber boots
- one red spherical helium balloon
- thin white string in right hand
- quiet brick residential sidewalk
- steady rain
- cool overcast daylight
- no duplicate balloon

Validation should prove:
1. the environment remains spatially consistent across camera movement;
2. off-screen sound sources persist logically;
3. avatar reactions match stimulus direction/intensity;
4. weather and wind cause secondary effects;
5. the camera does not invent contradictory geography;
6. the same avatar/props persist through continuation;
7. uncertainty is preserved instead of hallucinated away.

## Deferred adjacent item

Carbon/emissions tracking is acknowledged as a future logistics integration and is intentionally out of scope for this pass.
