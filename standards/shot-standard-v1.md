# VisionWeaver Shot Standard v1

**Status:** LOCKED by Sire on 2026-09-24. This is the house format for every shot in every episode, across every project built in VisionWeaver.
**First used in:** Crossroads of Identity, Book 1, Episode 1, PART 3 (`projects/creative-ip/crossroads-of-identity/production/book-01-convergence/episode-01-the-news/part-03/lock-sheet.md`).

## Why this exists
Think of it like the tape marks on a theater stage. Every actor and every camera has a numbered spot, and they go back to that same spot every time. That keeps faces, rooms and light the same from shot to shot, and from episode to episode, which is what makes AI-generated footage read as one continuous, photoreal world.

## The four kinds of locks
- **Map pins** (letters like `A`, `E`, `B3`) mark where the camera stands. Every location used in an episode gets a top-down map (north up) with pins and view cones.
- **Face locks** (codes like `FL-MR15` = character initials + age) say what must never change about a face (identity anchors) and what changes with age (age differences). The character board is always the master. The words describe the board and never override it. If they disagree, the picture wins and the words get fixed.
- **Light locks** (codes like `LK-2006-PM` = era + time of day) give the key light direction, the color temperature, the practical lights and the grade. Light direction must obey the location's compass lock and real sun position for that place and season.
- **Plates** are the backdrop images built in Runway. Each one has a task ID and a verbatim prompt stored in the repo.

## Shot fields (required for every shot)

| Field | What it means |
|---|---|
| **Shot ID** | `E01-P3-S07` = Episode 1, PART 3, Shot 7. Inserts get a letter suffix (`S03a`). |
| **Plate** | The Runway backdrop task ID, or `NEEDED` if it hasn't been built yet |
| **Pin** | Where the camera stands on the map |
| **Lens** | Full-frame equivalent in mm. 24 = wide room, 35 = walking, 50 = natural eye, 85 = face close-up, 100 macro = small object inserts |
| **Height and angle** | Camera height in feet. Angle is eye-level, low (looking up), or high (looking down) |
| **Move** | Locked (no movement), push-in, pull-out, track (follow), tilt, or handheld |
| **Framing** | WS wide · MS medium (waist up) · MCU chest up · CU face · ECU eyes or detail · INSERT object only · OTS over-the-shoulder |
| **Face lock** | Which face code applies, and the expression for this shot |
| **Light lock** | Which light code applies, plus notes for this shot |
| **Sound** | Key sounds or dialogue |

## Rules
1. **Dual-format safe.** Compose for 16:9 (YouTube full episode), but keep the subject inside the **center 9:16 strip** so every shot can be cropped for TikTok and Instagram without re-shooting.
2. **Locked plates are never regenerated to match a map.** If a saved picture disagrees with the map, the map is flipped to match the picture.
3. **Relights keep the architecture.** A time-of-day variant of a plate is made by editing the original plate (as a reference image), changing only the light.
4. **Age variants keep identity anchors.** A younger or older board is made by using the existing board as a reference image and changing only the age differences.
5. **Transitions are specified.** Match cuts state what matches (eyes, hands, framing) and how the grade shifts on the cut.
6. **Verbatim prompts are stored.** Every generated image's exact prompt and task ID go into the repo, so it can be reproduced after its signed link expires.
7. **Dialogue is verbatim** from the approved manuscript unless Sire approves a change.
8. **Real-world grounding, never copying.** Research the real setting, disclose the inspiration in the repo, and never name or copy a real source in the art itself.
