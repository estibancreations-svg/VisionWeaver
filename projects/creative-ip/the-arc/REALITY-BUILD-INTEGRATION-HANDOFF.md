# THE ARC — VisionWeaver Digital Twin / Reality-Build Integration Handoff — 2026-09-18

**Project:** PRJ-ARC-001  
**Canon authority:** The-Arc project + WORLD_01_MASTER / The Passover  
**Purpose:** Define what VisionWeaver must consume from the Arc Digital Twin so generation is constrained by world truth rather than freeform prompt drift.

## Source-of-truth order

1. The-Arc dedicated project/index repository
2. Google Drive Arc creative masters
3. Master-System-Buildout Arc governance/backup
4. VisionWeaver cached/indexed production data

VisionWeaver is a consumer and production engine. It does not silently redefine canon.

## Current Arc data available

- 5 vessel classes
- ARC-01 canonical production base
- 134 ARC-01 zones
- 491 seeded entities
- 14 entity classes
- entity-to-zone assignment set
- canonical production states:
  - open Arc
  - shield closure
  - green lock
  - aquatic activation
  - stable living Arc
- approved production assets and Runway task IDs
- Reality Calculation Framework

## Required VisionWeaver ingest model

For every generated shot, resolve:
- vessel_class
- zone_id
- state
- canonical entities visible
- dimensions/scale when available
- materials
- biological occupants
- water class
- atmosphere class
- gravity orientation
- lighting/environment
- allowed motions
- prohibited continuity changes
- canonical reference asset IDs
- screenplay scene ID when applicable

## Stage-2 engineering fields to support

VisionWeaver should be prepared to consume or display:
- quantity
- dimensions
- mass
- volume
- composition
- dependencies
- utility flows
- failure modes
- maintenance
- replacement stock
- construction stage
- manufacturing route
- biological environmental envelope
- source/evidence/confidence

## Generation validation

A render should fail continuity QA if it:
- changes the five-branch ARC-01 geometry without explicit class switch;
- changes protected ring geometry;
- loses four stabilizing quadrants;
- relocates the centered spire;
- creates rounded/tapered branch ends;
- floods dry left/right ring sectors;
- mixes potable/weather/aquatic water classes without an explicit system reason;
- introduces unregistered major architecture as canon;
- changes a locked character/location identity without versioned approval.

## Forward implementation

1. create Arc project selector;
2. load zone/entity/state facts before prompt construction;
3. generate prompt context from IDs, not prose memory alone;
4. save generated asset back with zone/entity/state/source IDs;
5. run continuity validator;
6. record approval/rejection;
7. expose the Arc Digital Twin as a searchable production workspace.

The intended end state is a bidirectional loop:
`Digital Twin truth → generation → QA → approved asset → Digital Twin provenance`.
