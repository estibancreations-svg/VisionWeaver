#!/usr/bin/env python3
"""Build VisionWeaver Studio (apps/director-studio/index.html) from the production records.

Reads, for Crossroads of Identity Episode 1:
  - every PART's lock sheet (shot tables)      -> the Shot bible
  - narration/narration-cue-sheet-v1.md        -> the Narration booth (text + subtitle cards)
  - each PART's camera-maps.svg                -> Locks & maps (embedded as data URIs)
  - part-01-02/part1-captions.srt              -> Edit view + captions download
and stitches them into src/markup.html + src/*.js (records, core, views, THELMA, runtime) with src/*.css.

Run from anywhere:  python3 apps/director-studio/build.py
The output is one self-contained HTML file. Publish it as a Claude artifact with
capabilities {db, user(profile), sample, downloads, assets, mcp}; see README. Opened as a plain
file it still works and saves to the browser only.
"""
import base64, json, pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[1]
EP = REPO / "projects/creative-ip/crossroads-of-identity/production/book-01-convergence/episode-01-the-news"
JS_PARTS = ["records.js", "records-v7.js", "core.js", "views-pipeline.js", "views-production.js",
            "views-system.js", "commercial-station.js", "design-studio.js", "thelma.js", "projects.js", "execute.js", "frames.js", "runtime.js"]
KEYS = ["id", "plate", "pin", "lens", "move", "framing", "face", "light", "sound"]


def shot_tables(path):
    s = path.read_text(encoding="utf-8")
    i = s.find("Shot lock sheet") if "Shot lock sheet" in s else s.lower().find("shot lock")
    tables, cur = [], []
    for line in s[i:].splitlines():
        if line.startswith("| S") and not line.startswith("| Shot"):
            cur.append([c.strip() for c in line.strip().strip("|").split("|")])
        elif line.startswith("| Shot") and cur:
            tables.append(cur); cur = []
        elif line.startswith("## ") and cur and "hot" not in line:
            break
    if cur:
        tables.append(cur)
    return tables


def clean(x):
    return re.sub(r"\*\*|`", "", x)


def narration():
    s = (EP / "narration/narration-cue-sheet-v1.md").read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r"^### (N\d\d)[^\n]*\n(.*?)(?=^### |^## |\Z)", s, re.S | re.M):
        body = m.group(2)
        out[m.group(1)] = {
            "text": " ".join(l[2:].strip() for l in body.splitlines() if l.startswith("> ")),
            "cards": re.findall(r"^\d+\. \*(.*?)\*\s*$", body, re.M),
        }
    r = re.search(r"RADIO HOST.*?\n> (.*?)\n", s, re.S)
    out["RADIO"] = {"text": r.group(1).strip() if r else "", "cards": []}
    return out


def main():
    t12 = shot_tables(EP / "part-01-02/lock-sheet.md")
    parts = {1: t12[0], 2: t12[1]}
    for p, d in [(3, "part-03"), (4, "part-04"), (5, "part-05")]:
        parts[p] = shot_tables(EP / d / "lock-sheet.md")[0]
    shots = {p: [dict(zip(KEYS, [clean(c) for c in r])) for r in rows] for p, rows in parts.items()}
    maps = {k: "data:image/svg+xml;base64," + base64.b64encode((EP / d / "camera-maps.svg").read_bytes()).decode()
            for k, d in [("1-2", "part-01-02"), ("3", "part-03"), ("4", "part-04"), ("5", "part-05")]}
    data = {"shots": shots, "narr": narration(), "maps": maps,
            "srt": (EP / "part-01-02/part1-captions.srt").read_text(encoding="utf-8")}

    head = ('<title>VisionWeaver Studio</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800'
            '&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">\n')
    css = "".join((HERE / "src" / f).read_text(encoding="utf-8") for f in ["base.css", "extra.css", "v7.css", "v8.css"])
    css = css.replace("/* v5 additions", "[hidden]{display:none!important}\n/* v5 additions", 1)
    src = HERE / "src"
    js = "".join((src / f).read_text(encoding="utf-8") for f in JS_PARTS)
    dj = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    out = head + css + (src / "markup.html").read_text(encoding="utf-8") + "<script>\nconst DATA=" + dj + ";\n\n" + js + "</script>\n"
    (HERE / "index.html").write_text(out, encoding="utf-8")
    counts = {p: len(v) for p, v in shots.items()}
    print(f"index.html written: {len(out):,} bytes · shots per PART {counts} · {len(data['narr'])} narration cues")


if __name__ == "__main__":
    main()
