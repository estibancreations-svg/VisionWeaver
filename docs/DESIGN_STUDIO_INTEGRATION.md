# VisionWeaver | Design Studio 0.2.02

The standalone source lives in [DESIGN_STUDIO](https://github.com/estibancreations-svg/DESIGN_STUDIO), source commit `e23c29e475dad5c50fd22aadcf0052d981676b2e`.

The application is available at https://visionweaver-design-studio.vercel.app/ . Vercel reported deployment `dpl_A3sqiCEsXQRdBkM7V1KQhLJjVd4Q` READY for that exact source. This is an authoring release: cloud sign-in is unconfigured, and rendering, uploads, checkout, and publication are closed.

## Embedded page

Design Studio is added to the Director Studio Pipeline navigation after Cast & avatars. `apps/director-studio/src/design-studio.js` is generated from the standalone bundle. `build.py` includes it in the single-file Director Studio output.

The JavaScript and CSS are embedded in the frame; the four preserved concept images load from commit-pinned GitHub URLs. Browser drafting works without an external app deployment. The frame allows scripts, same-origin local persistence, downloads, product-reference popups, and local form submission. The editor suppresses standalone hash navigation within the frame. Cloud operations remain disabled in embedded mode pending a deliberate account handoff.

Refresh procedure from a DESIGN_STUDIO checkout:

```sh
npm ci
npm run check
node scripts/embed.mjs /absolute/path/to/VisionWeaver
python3 /absolute/path/to/VisionWeaver/apps/director-studio/build.py
```

Do not edit the generated module by hand. The built `apps/director-studio/index.html` is a generated artifact. This integration commit changes source and navigation; it does not establish a new hosted deployment of the entire VisionWeaver application.

## Shared workflows

- Avatar identity/voice/appearance direction, 16-view wardrobe variants, 16/24/32/64 reference planning, camera calibration, and explicit lineage.
- Multi-scene, multi-character blocking with props, world/camera/continuity controls, and revision warnings.
- Five-track cues, prerequisite validation, event timing rehearsal, sound/environment layers, and time-stretch duration calculation.
- Derived review queue, direction brief, private package and rights records, provider setup notes, history comparisons, draft restore, and project import/export.
- Creator / Studio / Enterprise planning tiers. No billing or paid entitlements are enabled.

## Evidence

Local standalone build and 20 tests passed. Browser checks covered all eleven pages at desktop and phone sizes without page errors. The integrated page was tested after dismissing VisionWeaver’s welcome dialog: a character save persisted in browser storage, scene navigation worked, and no page JavaScript errors were reported. These checks do not certify cloud OAuth, generated media, geometry, asset licenses, provider execution, or commerce.

Avatar State remains the immediate foundation. Return to the approved balloon clip’s world-state dissection and continuation after Avatar State acceptance. Existing production records, approved shots, and voice/audio/media assets were not regenerated or replaced.
