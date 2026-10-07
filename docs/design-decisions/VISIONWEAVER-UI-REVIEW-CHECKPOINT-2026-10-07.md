# VisionWeaver UI Review Checkpoint — 2026-10-07

Status: CANONICAL DESIGN-REVIEW CHECKPOINT
Owner: The Architect / Estiban Creations
Purpose: Prevent page-generation drift, duplicate reviews, and loss of selected UI states.

## Locked global UI rules
- Every page review uses three view options: V1, V2, V3.
- The Architect explicitly selects the primary view.
- Non-primary approved views remain selectable in Settings > Visual Views.
- Persistent left sidebar remains visible on every board, with collapse/minimize control.
- Top command bar: Search, Create, notification bell. No decorative plus sign.
- User/account block belongs in sidebar immediately above THELMA AI.
- Notebook / legal-pad / yellow-paper styling is permanently retired.
- Page styling must match VisionWeaver.
- Color schemes are selectable in Settings.
- Do not regenerate a completed page unless The Architect explicitly requests a redesign.

## Canonical selections
| Page | Primary | Settings alternates | Status |
|---|---|---|---|
| Worlds & Locations | V2 Interactive Map | V1, V3 | LOCKED |
| Design Studio | V2 | V1, V3 | LOCKED |
| Design & Commercial | V1 | V2, V3 | LOCKED |
| Scene & Production | V1 | V2 Timeline & Continuity, V3 | LOCKED |
| Post Production | V1 | V2, V3 | LOCKED |
| Distribution & Growth | V2 Content Pipeline | V1, V3 | LOCKED — supersedes earlier V1 selection |
| Quality & Audit | V1 | V2, V3 | LOCKED |
| Finance & Accounting | V1 Financial Command Center | V2, V3 | LOCKED |
| IT & Security | V2 Infrastructure & Connections | V1, V3 | LOCKED |
| Resources | V2 Advanced Search & Filter | V1, V3 | LOCKED |
| Assets & Knowledge | V2 Advanced Search & Filter | V1, V3 | LOCKED |

## Existing special cases
- Avatar Engineering: three approved versions retained; no new primary should be invented without an explicit Architect selection.
- Book Creation: existing approved page; do not regenerate unless requested.
- VisionWeaver Home: existing approved baseline; do not regenerate unless requested.

## Review sequence checkpoint
Completed through:
1. Worlds & Locations
2. Design Studio
3. Design & Commercial
4. Scene & Production
5. Post Production
6. Distribution & Growth
7. Quality & Audit
8. Finance & Accounting
9. IT & Security
10. Resources
11. Assets & Knowledge

NEXT PAGE: Reports & Insights.

After Reports & Insights, remaining navigation-level review:
- Programs & Projects
- Strategic Planner
- Initiatives
- AI Co-Pilot
- CMI
- Directors Guild
- Teams / C-Suite
- Settings
Then reconcile any architecture-only pages not exposed in the current nav.

## Drift / correction log
- A Post Production generation accidentally repeated Scene & Production. Rejected.
- A Distribution & Growth generation was repeated after its selection. Rejected as duplicate.
- An IT & Security request accidentally produced Imaging & Asset Creation. Rejected; not part of the approved sequence.
- Do not treat rejected duplicate/misrouted renders as approved pages.
- Current next-page pointer is Reports & Insights.

## Conversation decision record
The Architect repeatedly established the same operating rule:
1. Review the three visual options.
2. Select one primary.
3. Keep the other two available in Settings.
4. Lock the selection before moving forward.
5. Generate the next page in sequence.
6. Do not use Canva for this workflow.
7. Preserve visual references and coded selection state to prevent drift.

This file is the checkpoint to consult before any future VisionWeaver page generation.
