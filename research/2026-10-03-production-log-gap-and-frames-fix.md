# The `production_log` gap, and the PART 2 frames fix (2026-10-03)

Two items from Sire, in his order: THELMA's logging task first, then the frames.

## 1. Why `production_log` stopped filling

THELMA sent this through the Claude uplink on 2026-09-30. The check was read-only. Nothing in Supabase was changed.

**Finding: the pipe is not broken. There is no pipe.** Nothing in the system writes to `production_log` on its own. Both rows in it were written by hand.

| Row | Date | What it is |
|---|---|---|
| 1 | 2026-07-19 | Manual backfill for gauntlet run 9 (DRIFT-010): both scenes failed at submit, no render started, no credits spent |
| 2 | 2026-08-13 | Manual launch-gate record (`LAUNCH-20260813`, partial pass) |

### What was checked

| Checked | Result |
|---|---|
| The old writer: the n8n workflow steps "Supabase Log Intake" and "Log Run Complete" | Their Supabase login broke on Jul 19 (DRIFT-010). n8n was retired on Jul 24 (DRIFT-011). |
| The old dashboard button (`history/v1c-director-approval-live.html`) | It inserts columns the table doesn't have (`project`, `episode`, `manuscript_url`, `memorial_stills_approved`), so the table would refuse it. |
| All 10 edge functions | None mentions `production_log`, to read or to write. |
| Database functions, triggers, timed jobs | None mentions `production_log`. |
| Zapier | Google Drive, Instagram for Business and YouTube only. There is no Zapier-to-Supabase step. |
| Table permissions | Fine. The `id` fills itself, and signed-in users and the service role can insert. |
| Timed jobs | 15 active. 14 are healthy. `social-commerce-monthly-close` failed on both of its runs (Sep 1, Oct 1); that is a separate problem. |

### Where the work is being recorded instead

- **Work made inside the Supabase studio function** (`visionweaver-studio`) goes to `vw_generations`, and a trigger copies the cost to `resource_usage_events`. This works: 15 generations from Aug 22 to Oct 2 (13 complete, 2 failed), and 13 matching usage rows.
- **Work made through the Runway connector in Claude chat** passes no Supabase recorder at all. PART 1 (13 clips, 11 sounds, 1,208 credits), the memorial stills and the PART 2 key frames were all made this way. Their records are in this repo and in Runway.
- `production_jobs` and `production_scenes` (the orchestrator's tables) have 0 rows. The orchestrator still ticks every minute on an empty table.

### The connector count

12 of 46 active is by design, and is not part of the logging problem.

| State | Count | Notes |
|---|---|---|
| Active | 12 | 6 configured, 3 healthy, 3 marked "not configured" (`github`, `supabase`, `vercel`: the label is stale) |
| Staged | 22 | 8 configured, 8 placeholder, 3 degraded, 3 not configured |
| Deferred | 12 | 4 need partner access, 3 are templates, 3 not configured, 2 placeholder |

### DRIFT-010

It is already in the log as row 1. The register still lists DRIFT-010 and DRIFT-011 as open. One dead letter from Aug 24 ("Vision intake requires project_title and concept") is also still open.

### Proposed fixes (not done; each one writes to the database and waits for Sire's yes)

- **A. Backfill.** Add rows for PART 1, the memorial stills and the PART 2 frame batches, each marked `MANUAL_BACKFILL` with its source file in this repo. Insert only; nothing deleted or edited.
- **B. A real writer.** A trigger so every finished `vw_generations` row also adds a `production_log` row, plus a standing rule that any Claude session that generates through the Runway connector writes its own row when the batch ends.
- **C. Tidy the register.** Mark DRIFT-010 as replaced by DRIFT-011, and record this finding as a new drift entry.

## 2. The PART 2 frames fix (Studio v8.1)

### What went wrong

- On Sep 30, the queue card "PART 2 key frames, batch 2: 11 frames need your picks" was swiped right in Decide. That approved the reminder card only. No frame changed, but it looked like Gate 1 was done.
- Earlier that day, the four frames already approved in batch 1 (S01, S04, S07, S08) went "back to waiting". On the Pictures page, tapping **Approve** on a frame that was already approved un-approved it.
- Result: all 15 frames were waiting while the card said approved.

### What changed (`src/frames.js`, `src/v8.css`, `build.py`)

1. The batch card can't be approved or sent back while any frame is waiting. Trying it opens Decide and says why. THELMA's action card is refused the same way.
2. In Decide, the frames come first, one card each, under a progress line ("3 of 15 picked"). The batch card is no longer a card.
3. The batch card follows the frames by itself: every frame picked closes it (approved, or "changes" when some are marked redo); a frame going back to waiting reopens it.
4. On Pictures, tapping Approve on an approved frame keeps it approved. Redo changes it.
5. The progress line has a **Copy ID** button for the top frame's Runway task ID, because the page can't show Runway pictures.

Gate 1 still belongs to the owner. Nothing here approves a frame without a tap or swipe on that frame.

### Live data change

The card `q01-p2-picks` was reopened and retitled "PART 2 key frames: pick each frame", with an Activity log line saying why. No frame was changed: the 15 picks are Sire's to make.

### Tests (headless, stand-in services)

- 37 of 37 new checks: self-heal of the live case, Decide order and progress, the refusals, auto-close and reopen, undo, Pictures, view-only, another project, phone width.
- Earlier suites still pass: 42 of 42, 18 of 18, 14 of 14, 25 of 25, 36 of 36. One v8 check was updated because the batch card is no longer in the stack.

### Open

- Frames still have no picture on the page. Showing them needs one more Runway connector permission on the page (`get_task`, read-only). That is a connection change, so it waits for Sire's yes.
