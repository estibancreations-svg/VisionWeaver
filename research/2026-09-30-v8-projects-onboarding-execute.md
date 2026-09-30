# Studio v8: projects, onboarding, and THELMA "ask first, then do it" (2026-09-30)

Sire asked for three things before the editing work: more than one project, onboarding for new people, and having THELMA *do* things after he says yes.

## 1. Projects

- **Projects** page (Home): one card per project, showing its type, stage progress, the stage it's on now, the next step and how many decisions are waiting. On a phone the cards scroll sideways as a carousel.
- **This project** page shows three things: where you are, what's done, and what's next. Below that is the stage board: add tasks, check them off, start a stage, finish a stage.
- **The gates hold in every project:**
  - A Gate 1 stage finishes only with the owner's "I approve these visuals" button.
  - A Gate 2 stage finishes only when someone types exactly `APPROVED`.
- **Project types and their stages:**
  - Film or series episode
  - Social media piece (Cut 9:16 · 1:1 · 16:9, captions, schedule)
  - Kids video or book
  - Podcast episode
  - Document or book
  - Something else
- **Crossroads Ep 1** is the built-in project. Its stages open the original pipeline pages.
- **Project menu** at the top switches the active project. Each person's choice is saved to them only.
- **Storage:** projects live in the artifact database under `projects/*`. Queue items can carry a `project` field; items with no field belong to Crossroads.

## 2. Decide (swipe)

- One stack of cards for the active project: its pending Guild queue items, plus the pending PART 2 key frames for Crossroads.
- Swipe right to approve, left to send back (a frame goes to redo), up to skip. There are also buttons, arrow keys, and "Undo last".
- A publish-type card says it only records the OK. Gate 2 still needs `APPROVED` typed on the Publish page.

## 3. Onboarding

- **The welcome:** it opens by itself the first time each person visits and has five steps:
  1. Welcome and role (director, producer, editor, writer or viewer), plus what THELMA should call them.
  2. Where to start: a new project (created right in the welcome), Crossroads, or just look around.
  3. Meet THELMA, with her voice picker.
  4. The two gates, and swiping to decide.
  5. You're ready: the first three moves for the path they picked.
- **Tour:** a 30-second tour points at the project menu, This project, Decide, THELMA and the Conversation log.
- **Start here** page: explains the studio, replays the welcome and the tour, and lists how to bring someone in (claude.ai Share, then roles).
- **Login** today is each person's own claude.ai account. The standalone app, with Google, Apple and Microsoft sign-in, email link, phone code, and HIPAA-grade hosting, uses these same five steps. It waits for a go-ahead on hosting costs (see the HIPAA notes from 2026-09-30).

## 4. Execute: THELMA asks, you say yes, she does it

- **How it works:** THELMA's new tool `request_action` puts a **Yes / No card** in the chat. Nothing changes until someone taps **Yes, do it**.
- **After Yes:** the card turns to **Done** and shows **See it ↗** and **Undo**. Every run is written to the Activity log and the Conversation log.
- **The actions she can do:**
  - `frame_decision`
  - `queue_decision`
  - `mark_recorded`
  - `cast_review`
  - `create_project`
  - `add_task`
  - `set_stage` (never a gate stage)
  - `send_to_drive`
- **Never on the list:** publishing or anything at Gate 2, spending credits or generating, deleting, changing connections, sharing or settings. If she's asked, the card shows as blocked and says why.
- View-only people see the cards but get no Yes button.
- **Other THELMA changes:** her tools are ordered so the important ones survive a tool limit. She knows the active project, and she calls each person by the name they gave.

## Files

- New: `src/projects.js`, `src/execute.js`, `src/v8.css`.
- Changed: `src/thelma.js` (renders action cards and carries them into history and the logs), `build.py` (adds the new files).

## Tests (headless, stand-in services)

- 42 of 42 new checks passed, covering onboarding, projects and stages, both gates, Decide (mouse drag, thumb swipe, keys, undo), and execute (Yes, No, Undo, blocked actions, view-only).
- The earlier suites still pass: 36 of 36, 25 of 25, 14 of 14 and 18 of 18.
- At phone width (390 px): no sideways scroll on the welcome, Projects or Decide.
