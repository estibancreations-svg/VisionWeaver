# Repair log: THELMA sent work to Claude and it was never answered (2026-09-30)

**Fixed in Studio v7.2.** Read this if work sent to Claude from the studio (by you or by THELMA) goes unanswered.

## What happened

- **20:38 UTC:** Sire asked THELMA to send Claude a task: find and fix why `production_log` stopped recording studio work.
- THELMA used her `note_to_claude` tool and told Sire it was sent.
- The task was saved in the uplink inbox as **open**, but Claude never saw it. The wake-up scheduled task (`trig_01EdZ47BV6RodPzYS9DV74b9`) last ran at 13:57 UTC, which was the morning test run. Nothing started it after that.

## Why it happened (root cause)

Sending work to Claude has **two steps**:

1. **Save** the message in the uplink inbox.
2. **Wake Claude**, which fires the wake-up scheduled task so a Claude session starts, reads the inbox and answers.

In v7.1, THELMA's `note_to_claude` and the uplink page's **Send to Claude** button did only step 1. Step 2 ran only when someone pressed **Wake Claude now**. THELMA also answered `{sent: true}`, which sounded finished when it wasn't.

It's like dropping a letter in the office mailbox and never raising the flag, so the mail carrier never stops.

A second gap: answers go to the uplink thread, not to the claude.ai chat. The page can't type into a claude.ai conversation. A claude.ai chat only sees the uplink when someone asks it to ("check the uplink").

## The repair (v7.2)

| Change | Where |
|---|---|
| New `sendToClaude()`: saves **and** wakes Claude, then returns an honest result (`saved`, `claude_woken`, `why`, `next`) | `apps/director-studio/src/views-system.js` |
| `wakeClaude()` returns a result instead of only showing a message. It records `settings.uplink.lastWake` and blocks double-fires within 15 seconds | same |
| THELMA's `note_to_claude` uses `sendToClaude()`. Her instructions say to report whether Claude was woken, and if not, why and what to press | `src/thelma.js` |
| The uplink page's **Send to Claude** form wakes Claude too | `src/views-system.js` |
| New setting **Wake Claude automatically**, on by default (Settings → Claude uplink) | same |
| Each open thread shows **"Claude was woken …"** or **"Not woken yet"**, with a Wake button next to it | same |
| When Claude answers, the page shows a message and puts the answer in THELMA's chat (**"Claude answered · via the uplink"**) | `src/core.js` (`uplinkNotify`), `src/thelma.js` (`thelmaRelay`) |
| New THELMA tool `read_uplink`, so she can say whether Claude answered | `src/thelma.js` |
| A troubleshooting checklist on the uplink page and in Settings → Claude uplink | `src/views-system.js` (`UPLINK_FIX`) |

Tested headless: 25 of 25 new checks passed, including THELMA's note both saving and waking Claude, the answer showing up in THELMA's chat, and the honest "not woken" message when the wake-up task is missing. The earlier 36-check workflow run still passes.

## If it happens again: check in this order

1. **Saved?** The message is listed under Threads as *open*. If not, send it again.
2. **Woken?** The thread says "Claude was woken" or "Not woken yet". If not woken, press **Wake Claude now**.
3. **Wake button missing?**
   - Settings → Claude uplink needs the wake-up task ID (`trig_…`).
   - Settings → Connections must have Claude Code Remote on.
   - The page must be open inside claude.ai.
4. **Woken but no answer after 10 minutes?** In a claude.ai chat, say "check the uplink". Claude reads the inbox with ArtifactData and checks the scheduled task's last run with `list_triggers`.
5. **Scheduled task broken?** `list_triggers` shows its `last_run`. If it says FAILED or never ran, fire it once by hand (`fire_trigger`) and read the run's session.

## Known limits (not bugs)

- The unattended wake-up run is read-and-answer only. It won't push to GitHub, republish, write to Supabase, spend credits or change decisions. It proposes those, and Sire approves them in a live chat.
- Studio answers never appear in a claude.ai chat by themselves. Getting an artifact comment to wake a chat needs a "watch". Registering one from this session failed on 2026-09-30 (`mint_failed`), so don't rely on it.
