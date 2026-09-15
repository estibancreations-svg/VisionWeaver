# Creative IP Repository Split Plan

## Target dedicated private repositories

### 1. `estibancreations-svg/This-Is-Your-Life`
Purpose: versioned series bible, episode manifests, continuity ledgers, prompt/production specs, source indexes, adaptation records.

Recommended root:
```text
00-series-bible/
01-season-1/
02-season-2/
03-characters/
04-locations/
05-artwork-manifests/
06-scripts-outlines/
07-production/
08-audio/
09-source-indexes/
99-archive/
README.md
CANON.md
CONTINUITY.md
MANIFEST.md
```

### 2. `estibancreations-svg/Crossroads-of-Identity`
Purpose: versioned literary-series indexes and screen-adaptation work. Original manuscript/binary masters remain in Drive unless intentionally mirrored.

Recommended root:
```text
00-series-bible/
01-book-1-convergence/
02-book-2-foundations/
03-book-3-revelations/
04-book-4-expansion/
05-book-5-legacy/
06-book-6-transformation-recovery/
07-book-7-evolution/
08-characters/
09-world-locations/
10-film-series-adaptation/
11-artwork-storyboards/
12-source-research/
99-archive/
README.md
CANON.md
CONTINUITY.md
MANIFEST.md
```

## Current staging
Until those repository shells exist, the indexes live under this private `VisionWeaver/projects/creative-ip/` path. Do not place unpublished manuscripts into public repositories.

## Tool limitation recorded
The currently connected GitHub integration can create/update files, branches, commits, PRs and issues inside existing repositories, but it does not expose an action to create a new repository. The two private repository shells therefore require one manual GitHub creation action; migration can then be completed through the connected GitHub tools.