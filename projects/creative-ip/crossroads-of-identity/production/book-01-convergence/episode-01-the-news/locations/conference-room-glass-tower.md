# Location — Law Firm Glass Conference Room (Atlanta)

**Used in:** Episode 1, opening scene (Marcus closing the Jayden King deal).
**Status:** Approved by Sire on 2026-09-23 — "This is PERFECT!" **Late-morning relight built 2026-09-25 for the locked PARTS 1–2 (pending Sire's visual check).**

## Why this setup
Marcus is a senior associate on partnership track at a high-end entertainment law firm, now based in Atlanta. The scene called for a room that reads as expensive, high-stakes, and impersonal — a fitting place for Marcus to receive devastating news while unable to show it.

## Research used for grounding
- Modern high-end law firm interior design conventions: floor-to-ceiling glass walls, walnut/oak paneling, white marble or quartz accents, brushed black metal, cream/tan leather high-back chairs, statement lighting. Drawn from published case studies and design roundups covering firms including Alston & Bird, Nelson Mullins Riley & Scarborough, and Greenberg Traurig.
  - https://www.armstrongceilings.com/commercial/en/case-study/office/alston-and-bird-modern-office-design.html
  - https://www.smallwood-us.com/work/case-study/nelson-mullins-riley-scarborough
  - https://nelsonworldwide.com/project/greenberg-traurig/
  - https://legalmindsdaily.com/aesthetic/law-firm-interior-design/
- Atlanta Midtown skyline character: 1180 Peachtree ("Symphony Tower"), 41 stories / ~657 ft, known for two illuminated glass fins. Used only as a distant, blurred skyline silhouette for city authenticity — not reproduced as the building itself.
  - https://en.wikipedia.org/wiki/1180_Peachtree

## What was generated
An original, empty establishing shot (no characters placed yet — this locks the room before character blocking): long dark walnut conference table, cream/tan leather high-back chairs, marble accent wall, frosted interior glass wall, brass pendant light, polished concrete floor, warm golden-hour light through floor-to-ceiling windows, Atlanta skyline (with a distant fin-topped tower silhouette) in the background.

**Model:** Runway, nano-banana-pro, 16:9, 2K.
**Runway task ID:** 40faad4e-d8ba-4890-af31-0ee7f3a83df6

**Full prompt used:**
```
Photorealistic cinematic establishing shot of an empty high-end law firm glass conference room on a high floor of a modern Midtown Atlanta skyscraper, shot on a full-frame cinema camera, 35mm lens. Floor-to-ceiling curtain-wall glass on two sides revealing the Atlanta skyline at golden-hour, including a distant glass tower with two illuminated vertical fin-like spires. Long rectangular conference table in dark walnut with a matte black steel base, seating for ten in cream and tan leather high-back chairs. One glass interior wall separates the room from a hallway, etched with a subtle frosted geometric privacy pattern. Accent wall of honed white marble behind the head of the table. Recessed LED cove lighting, a sculptural brass pendant light fixture centered over the table, polished light-grey concrete floor. Warm afternoon sunlight streaming through the windows casting long soft shadows across the table. No people in frame. Ultra-detailed, realistic materials, true-to-life reflections in the glass, natural film grain, shallow depth of field on the skyline background.
```

## Locks (Sire, 2026-09-25, PARTS 1–2)
- **The meeting is late morning:** Tuesday, January 17, 2023, about 10:00–11:10 AM (the texts land at 10:52 AM). The golden-hour look of the first plate doesn't fit, so **Episode 1 uses the late-morning relight `a60f82fb-c704-490e-9d14-bb2d95f69bed`**. Same room, only the light and sky changed. The first plate `40faad4e…` stays on file as the approved design master but isn't used in Episode 1.
- **Orientation:** the floor-to-ceiling glass faces **north and west**, and the distant fin-topped tower sits in the north view. The frosted glass wall to the corridor is on the east, with the door in the southeast corner. The honed white marble wall is on the south, behind the head of the table.
- **Light lock LK-ATL-AM:** the sun is in the southeast (about 138°–155°, 22°–31° high; NOAA solar-position equations), behind the building. No direct sun comes inside. The room gets bright, soft, cool daylight, and the skyline is front-lit and gleaming under a cloudless sky.
- **Seating:** Marcus and Alvarez sit on the west side, with the skyline behind them. Jayden and his manager sit on the east side, with the frosted wall behind them. The senior partner waits outside the frosted wall for Marcus's nod.
- **Camera pins C1–C7:** see `../part-01-02/camera-maps.svg` (Map 7) and `../part-01-02/lock-sheet.md`.
- **The firm stays unnamed.** There's no logo or lettering anywhere.

**Late-morning relight (task `a60f82fb-c704-490e-9d14-bb2d95f69bed`; reference image `40faad4e-d8ba-4890-af31-0ee7f3a83df6` tagged `@conf`; nano-banana-pro, 16:9, 2K). Full prompt (verbatim):**
> @conf relit for late morning in January — keep the exact same camera position, framing, architecture, conference table, chairs, marble accent wall, frosted glass interior wall, brass pendant, floor, and skyline composition, changing only the light and the sky. A photorealistic film backdrop plate, empty of people. It is about 10:30 AM on a clear, cloudless winter day: the sky outside is a crisp, deep, clear blue with no clouds and no warm sunset or golden-hour color. The sun is behind the building, so no direct sunbeams enter the room and there are no long shadows; the floor-to-ceiling glass fills the room with bright, soft, cool daylight, even and nearly shadowless. Outside, the Atlanta skyline is front-lit by the morning sun, the glass towers gleaming and reflecting the blue sky, sharp and clear. Inside, the recessed cove lights and the brass pendant are on at a low level, adding only a slight warm accent. Clean, expensive, controlled, impersonal. Ultra-detailed, photoreal materials and reflections, no text, no logos, no people.

## Note on the image file itself
The rendered PNG lives in Runway's asset library under the task ID above. This session could not download the binary into this repo directly (an outbound network restriction blocked the Runway CDN host), so only the recipe (prompt + sources + reasoning) is committed here for now, not the image file. Once we set up the automated storage bot Sire mentioned, this gap goes away — until then, the image can be pulled from the Runway workspace directly by task ID.
