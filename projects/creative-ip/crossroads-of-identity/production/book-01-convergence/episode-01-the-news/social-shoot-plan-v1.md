# Episode 1: Social Shoot Plan and Budget (v1, DRAFT)

**Date:** 2026-09-25 · **Goal:** shoot the first Instagram/TikTok clips from the locked PARTS, spending as little new money as possible.

---

## 1. What's in the bank (checked today)

| Where | What you have | Does this work cost more? |
|---|---|---|
| **Runway** (Pro plan) | **39,005 credits**, all purchased credits (no monthly plan credits left this cycle). At Runway's own top-up price of $10 per 1,000 credits, that's about **$390 worth** already paid for. | **No new money needed.** Every clip below fits inside what you already have. |
| **Google Drive, GitHub** | Storage for the scripts and records | Free for this work |
| **Claude (this chat)** | Your plan's usage limit (I can't see your balance from here) | See the token estimates in Section 4 |
| **Editing app (CapCut or Canva)** | Free tiers work | Free |

**Think of it like a gift card:** the Runway credits are already on the card. The plan below spends about a third of the card on all five PARTS, and only a few percent on the first clip.

---

## 2. The one thing Runway can't do for us: the final edit

This sandbox can't download the finished video files (the same block that stops me from viewing the pictures). So **you do the last step on your phone** in a free editor (CapCut is the easiest). I'll hand you an **edit list** for each clip: which shot goes first, how many seconds each shot runs, the captions, and where each sound goes. It's like a paint-by-number kit: I draw the lines, you fill in the colors. It takes about 20–30 minutes per clip.

---

## 3. How one shot gets made (the recipe)

1. **Key frame (a still picture):** the locked face + the locked room + the exact camera spot, made **vertical (9:16)** for TikTok and Instagram. It costs about **20 credits** (measured on our last builds). Plan for 1 redo on every other shot, so about **30 credits per shot**.
2. **Animate it (5 seconds):** Runway's Gen-4.5 model costs **12 credits per second** on its price list, about 60 credits per 5-second shot. With one redo on every other shot, that's **about 90 credits**. For the few "hero" shots that must be perfect (faces up close), we use Seedance 2 at **36 credits per second**, about 180–270 credits (Runway, n.d.).
3. **Voices and sound:** Runway's voice tool costs **1 credit per 50 letters**, so every voice-over in a PART costs under 10 credits. Sound effects cost 1 credit per second, and a short music bed costs 4 credits.
4. **You check it, then I log it** in GitHub (task IDs and exact prompts), so any shot can be rebuilt later.

**Honest note on prices:** the video prices above come from Runway's published price list. The Runway app can charge a little differently, so **I'll measure the real cost on the very first shot** (checking the balance before and after) and correct this plan before spending more.

**Why vertical from the start:** our rooms were planned 16:9 with the action kept in the middle. But cutting a vertical slice out of a 1080p wide video leaves only a thin 608-pixel strip, which looks soft on a phone. Making the social clips vertical from the start keeps them sharp. The YouTube version gets its own wide renders later.

---

## 4. Cost for every PART

The "working tokens" column is my best estimate of the new Claude work (writing prompts, running tools, checking results, writing the edit list). A long chat also re-reads its own history on every step, which adds hidden cost, so **starting a fresh chat for each PART** (the records in GitHub carry everything over) is the single biggest token saver.

| PART | Shots | Short-form cut | Runway credits (estimate) | Working tokens (estimate) | Difficulty |
|---|---|---|---|---|---|
| **1 "The Text"** | 12 | 45–60 s, ends on the trembling water | **1,600–2,200** | ~100K | Medium: 3 lines on camera |
| **2 "The Performance"** | 14 | 50–60 s, ends on the smile dropping | 1,900–2,500 | ~110K | Medium: 5 lines on camera |
| **3 "The Bathroom"** | 29 | Two cuts of 60 s (present day / flashback) | 4,000–5,000 | ~220K | Hardest: two ages, a flashback, dialogue |
| **4 "The Box"** | 20 | 45–60 s, almost no dialogue | 2,500–3,000 | ~140K | **Easiest to do well:** objects and voice-over only |
| **5 "The Porch"** | 14 | 50–60 s, the episode's heart | 2,000–2,700 | ~110K | Medium: Elijah's speech on camera |
| **All five** | **89** | | **~12,000–15,400** (about a third of your credits) | ~680K | |

**Talking on camera** is the hardest thing for AI video to get right, because mouths have to match words. Three money-savers are built into the plan:
- Play most lines **off-screen**: over the other person's face, over hands, or from behind.
- Use **Runway's Lip Sync** (included in your Pro plan, inside the Runway app) only on the few close-ups that need it.
- The voice-over lines need no mouths at all.

---

## 5. Recommended order (the selection)

1. **First: PART 1 "The Text."** It's the hook for the whole series. A deal, three buzzes, a trembling glass. Most of its lines can play off-screen. **About 2,000 credits.**
2. **Second: PART 4 "The Box."** It's nearly silent, which makes it the cheapest to do *well*, and it's a strong mood clip.
3. Then PART 5, PART 2, and last PART 3 (the most complex).

**Before shooting PART 1,** you need to OK four pictures: the conference room in morning light (`a60f82fb`) and the boards for Jayden, his manager and Mr. Alvarez. Fresh viewing links come with the first batch.

---

## 6. The Dr. King moment

**The speech that fits:** Dr. King's address at **Holt Street Baptist Church, Montgomery, Alabama, on December 5, 1955**. It was the first night of the Montgomery bus boycott mass meetings. He was **26** and just stepping into leadership, before the country knew his name, and a recording of it exists (Martin Luther King, Jr. Research and Education Institute, n.d.-a).

**The catch:**
- **His words are protected.** Dr. King's speeches are still under copyright, and his estate enforces it, even for famous public speeches. A federal appeals court sided with the estate in 1999 (*Estate of Martin Luther King, Jr., Inc. v. CBS, Inc.*, 1999). The film *Selma* couldn't use his real words and had to paraphrase them (Moss, 2023).
- **The recording needs a license.** Stanford's King Institute says only the estate's licensing agent can give permission: Intellectual Properties Management, licensing@i-p-m.com, 404-526-8968 (Martin Luther King, Jr. Research and Education Institute, n.d.-a).
- **His voice can't be imitated with AI either.** Georgia's Supreme Court ruled that the right to control a person's likeness lives on after death, in a case brought by the King Center itself (*Martin Luther King, Jr., Center for Social Change, Inc. v. American Heritage Products, Inc.*, 1982). Instagram and TikTok also scan audio and can mute or pull clips with protected sound.

**The safe version (recommended for now):** at the end of PART 2, as Marcus's smile drops, a radio plays low from one of the glass offices. It's the day after MLK Day. A host we write ourselves says something like: *"…yesterday we closed with his very first address to the boycott, Holt Street Baptist Church, December 1955. He was twenty-six years old…"* The partner's door clicks. We never hear Dr. King's voice or words, only the host naming the night. That's legal, it costs about 10 credits, and it does exactly what you want: **people who hear it go look it up.** That starts the conversation.

**The full version (later):** ask Intellectual Properties Management for a license to use a few seconds of the real Holt Street recording in the full YouTube episode. The price is unknown and could be high, so it's a next-month decision, not this month.

---

## 7. Step by step, from here

| Step | What happens | Credits | Who |
|---|---|---|---|
| 1 | You pick the first clip and the Dr. King version (the questions below) | 0 | Sire |
| 2 | Fresh viewing links for that PART's pending pictures. You OK them | 0 | Claude → Sire |
| 3 | Vertical key frames for every shot, sent in one batch | ~360 (PART 1) | Claude |
| 4 | You pick or reject key frames. Only approved ones get animated | 0 | Sire |
| 5 | Animate the approved key frames. **Measure the real cost on shot 1 first** | ~1,100–1,600 | Claude |
| 6 | Voice-overs, sound effects, a music bed, the radio host line | ~30–50 | Claude |
| 7 | Edit list + captions + post text | 0 | Claude |
| 8 | You assemble in CapCut and post | 0 | Sire |
| 9 | Log everything in GitHub | 0 | Claude |

Step 4 is the money-saver: **we never pay to animate a picture you haven't approved.**

---

## References

*Estate of Martin Luther King, Jr., Inc. v. CBS, Inc.*, 194 F.3d 1211 (11th Cir. 1999).

*Martin Luther King, Jr., Center for Social Change, Inc. v. American Heritage Products, Inc.*, 250 Ga. 135, 296 S.E.2d 697 (1982).

Martin Luther King, Jr. Research and Education Institute. (n.d.-a). *MIA mass meeting at Holt Street Baptist Church*. Stanford University. https://kinginstitute.stanford.edu/king-papers/documents/mia-mass-meeting-holt-street-baptist-church

Martin Luther King, Jr. Research and Education Institute. (n.d.-b). *Holt Street Baptist Church (Montgomery, Alabama)*. Stanford University. https://kinginstitute.stanford.edu/holt-street-baptist-church-montgomery-alabama

Moss, A. (2023, January 13). *The copyright legacy of Martin Luther King*. Copyright Lately. https://copyrightlately.com/martin-luther-king-copyright/

Runway. (n.d.). *API pricing & costs*. Runway Developer Docs. https://docs.dev.runwayml.com/guides/pricing/

*No Wikipedia sources were used.*
