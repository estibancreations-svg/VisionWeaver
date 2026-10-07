# VisionWeaver UI chat decision feed — applicable checkpoint

Date: 2026-10-07
Purpose: preserve the Architect's applicable design decisions so future work does not drift.

## Architect directives preserved from this review
- "Option one works for me set the other two as options to choose from in the settings and move forward to the next page."
- "Don't use Canva create here. We don't need Canva."
- "IT Option 2 with the others as options. Move to the next page generation and options. Lock in the choices."
- "Option 2 for resources. Set the others as choices in settings."
- "Assets - option 2. Save the others as options."
- "Option 2 and the others saved in settings for options."
- "You now know the style and flow I like and want. Finish out the buildouts and give me what you created AFTER locking in the desired layouts and we can move forward."

## Process contract derived from those directives
1. Three approved visual views exist per reviewed page.
2. One view is the locked default/primary.
3. Other approved views remain user-selectable in Settings > Visual Views.
4. A selected page is not regenerated unless redesign is explicitly requested.
5. The persistent VisionWeaver shell remains consistent across views.
6. Canva is not used for this UI review/buildout workflow.
7. Notebook/legal-pad styling is retired.
8. Design decisions are committed before moving the pointer forward.
9. Rejected duplicate/misrouted renders are never treated as approved designs.

## Canonical implementation references
- apps/director-studio/src/ui-board-registry.ts
- apps/director-studio/src/navigation-buildouts.js
- apps/director-studio/src/navigation-buildouts.css
- docs/design-decisions/VISIONWEAVER-UI-REVIEW-CHECKPOINT-2026-10-07.md
- docs/design-decisions/VISIONWEAVER-UI-VISUAL-LOCK-SHEET.svg

This is a decision-focused transcript, not a verbatim export of unrelated conversation content.
