/* ================= VIEWS ================= */
const V={};
V.overview=()=>{
  const w=waiting();const remLo=[2,3,4,5].reduce((a,p)=>a+EST[p][0],0),remHi=[2,3,4,5].reduce((a,p)=>a+EST[p][1],0);
  return `<div class="vhead"><span class="eyebrow">Episode 1 · "The News"</span><h1>Run of show</h1><p>Every PART moves left to right through eight stages. Two gates stay with you: key frames before any video is made, and the word APPROVED before anything goes public.</p></div>
  <section class="panel"><h2>How the system works</h2>
   <div class="flow">
    <div class="st"><b>1 · Books</b>Manuscript and script in Drive</div><div class="st"><b>2 · Locks</b>Faces, light, camera pins</div><div class="st"><b>3 · Pictures</b>Key frames, 20 cr each</div>
    <div class="gate">GATE 1<br>Sire picks</div>
    <div class="st"><b>4 · Motion</b>Gen-4.5, 12 cr/sec</div><div class="st"><b>5 · Sound</b>Voices, effects, score, your narration</div><div class="st"><b>6 · Edit</b>CapCut from the edit list</div><div class="st"><b>7 · Deliver</b>Masters, covers, captions</div>
    <div class="gate">GATE 2<br>APPROVED</div>
    <div class="st"><b>8 · Publish</b>Publisher bot → Zapier → platforms</div>
   </div>
   <p class="note" style="margin:10px 0 0">The Studio bot makes pictures, video and the edit list with Runway. The Publisher bot only sends approved packets to Zapier. Each department brings finished work to the Directors Guild queue with a timestamp, and nothing moves until you decide.</p>
  </section>
  <section class="panel"><h2>Where each PART stands</h2>
   <div class="tablewrap"><div class="matrix"><div class="h"></div>${STAGES.map((s,i)=>`<div class="h">${i+1} · ${s}</div>`).join("")}
    ${PARTS.map(p=>`<div class="p">PART ${p.n}<small>${esc(p.name)} · ${DATA_SHOTS[p.n].length} shots</small></div>`+matrix(p.n).map(([s,t],i)=>`<button type="button" class="cell ${s}" data-view="${["source","locks","pictures","motion","booth","edit","deliver","publish"][i]}" style="text-align:left;cursor:pointer">${esc(t)}</button>`).join("")).join("")}
   </div></div>
   <div class="row" style="margin-top:10px;gap:14px">${pill("done","Done")}${pill("you","Waiting on you")}${pill("wait","In progress")}${pill("idle","Not started")}<span class="note">Click any cell to open that stage.</span></div>
  </section>
  <div class="grid2">
   <section class="panel"><h2>Waiting on you <span class="sub">${w.length}</span></h2>
    ${w.length?`<ul class="todo" style="margin:0;padding:0">${w.slice(0,8).map(x=>`<li>${pill("you",x.tag)}<div><b>${esc(x.t)}</b><div class="note">${esc(x.d)}</div></div><button class="btn small" data-view="${x.go}" type="button">Open</button></li>`).join("")}</ul>`:`<div class="empty">Nothing is waiting on you.</div>`}
    <div class="row" style="margin-top:10px"><button type="button" class="btn" data-view="guild">Open the Guild queue</button></div>
   </section>
   <section class="panel"><h2>Credits</h2>
    <div class="stat credits"><b class="num" style="font-size:34px">${fmt(BALANCE)}</b><span>Runway balance, checked live 2026-09-29 · Pro plan</span></div>
    <div class="meter" style="margin:14px 0 6px" aria-hidden="true"><i style="width:${1208/BALANCE*100}%;background:var(--done)"></i><i style="width:${remLo/BALANCE*100}%;background:var(--tungsten)"></i><i style="width:${(remHi-remLo)/BALANCE*100}%;background:var(--tungsten-soft)"></i></div>
    <div class="tablewrap"><table><tr><td>PART 1, measured</td><td class="num">1,208</td></tr><tr><td>PARTS 2–5, planned</td><td class="num">${fmt(remLo)}–${fmt(remHi)}</td></tr><tr><td>Narration cover shots (if every second is new video)</td><td class="num">up to 2,676</td></tr><tr><td><b>Left after the whole episode</b></td><td class="num"><b>${fmt(BALANCE-remHi-2676)} or more</b></td></tr></table></div>
   </section>
  </div>
  <section class="panel"><h2>Activity <span class="sub">${store.mode==="shared"?"shared with everyone on this studio":"this browser"}</span></h2>
   ${LOG.length?`<ul class="feed">${LOG.slice(0,14).map(e=>`<li><time>${when(e.at)}</time><div>${esc(e.text)} <span class="note">· ${who(e.by)}</span></div></li>`).join("")}</ul>`:`<div class="empty">Approvals, recordings and decisions will show here with the time and who made them.</div>`}
  </section>`;
};

V.guild=()=>{
  const cols=[["pending","Waiting on Sire"],["changes","Sent back"],["approved","Approved"]];
  const f=UI.qFilter;const items=QUEUE.filter(q=>f==="all"||q.dept===f).sort((a,b)=>(b.created||"").localeCompare(a.created||""));
  return `<div class="vhead"><span class="eyebrow">Directors Guild</span><h1>Guild queue</h1><p>Departments bring triple-checked work here with a timestamp. Approve it, or send it back with a note. Every decision is logged with the time and who made it.</p></div>
  <div class="row"><div class="seg" role="group" aria-label="Department">${["all",...DEPTS].map(d=>`<button type="button" data-qf="${d}" aria-pressed="${f===d}">${d==="all"?"All":d}</button>`).join("")}</div></div>
  ${QUEUE.length?"":`<div class="empty">The queue is empty. ${store.mode==="shared"?"Departments add work here as it's ready.":"Saved data isn't available in this view, so the queue only lives in this browser."}</div>`}
  <div class="kanban">${cols.map(([st,label])=>{const list=items.filter(q=>q.status===st);return `<div class="col"><h3><span>${label}</span><span>${list.length}</span></h3>${list.map(q=>`<article class="qitem ${st}">
     <div class="row" style="justify-content:space-between">${pill(st==="approved"?"done":st==="changes"?"block":"you",q.dept)}<span class="when">${when(q.created)}</span></div>
     <div class="t">${esc(q.title)}</div>${q.detail?`<div class="note">${esc(q.detail)}</div>`:""}
     ${q.part?`<div class="note">PART ${esc(q.part)}</div>`:""}
     ${q.decided?`<div class="note">${st==="approved"?"Approved":"Sent back"} ${when(q.decided)} by ${who(q.decidedBy)}${q.note?` — “${esc(q.note)}”`:""}</div>`:""}
     ${store.readOnly?"":st==="pending"?`<input type="text" id="qn-${q.id}" placeholder="Note (optional)"><div class="row"><button type="button" class="btn small primary" data-qd="${q.id}" data-s="approved">Approve</button><button type="button" class="btn small" data-qd="${q.id}" data-s="changes">Send back</button>${q.go?`<button type="button" class="btn small" data-view="${q.go}">Open</button>`:""}</div>`:`<div class="row"><button type="button" class="btn small" data-qd="${q.id}" data-s="pending">Reopen</button></div>`}
    </article>`).join("")||`<div class="empty">None</div>`}</div>`}).join("")}</div>
  ${store.readOnly?"":`<section class="panel"><h2>Bring work to the queue</h2>
   <form id="qForm" class="grid3" style="align-items:end">
    <label class="f" for="qDept">Department<select id="qDept">${DEPTS.map(d=>`<option>${d}</option>`).join("")}</select></label>
    <label class="f" for="qPart">PART<select id="qPart"><option value="">Whole episode</option>${PARTS.map(p=>`<option value="${p.n}">${p.n} · ${esc(p.name)}</option>`).join("")}</select></label>
    <label class="f" for="qTitle">What needs a decision<input id="qTitle" type="text" placeholder="e.g. PART 2 animated clips ready"></label>
    <label class="f" for="qDetail" style="grid-column:1/-1">Details<input id="qDetail" type="text" placeholder="Links, task IDs, cost"></label>
    <div><button type="submit" class="btn primary">Add to queue</button></div>
   </form></section>`}`;
};

V.source=()=>`<div class="vhead"><span class="eyebrow">Stage 1</span><h1>Books & script</h1><p>Drive holds the manuscripts and scripts. GitHub holds production records only, because the repo is public. Canon order: original manuscript, then outline, then character histories, then adaptation documents.</p></div>
 <section class="panel"><h2>Crossroads of Identity <span class="sub">seven books</span></h2><div class="tablewrap"><table><tr><th>#</th><th>Book</th><th>Status</th><th>Folder</th></tr>
  ${BOOKS.map((b,i)=>`<tr><td class="mono">${i+1}</td><td><b>${b[0]}</b>${i===0?`<div class="note">Chapter 1 → Episode 1 "The News" (5 PARTS)</div>`:""}</td><td>${pill(i===0?"you":b[2].startsWith("Recovery")?"wait":"idle",b[2])}</td><td><a href="${b[1]}" target="_blank" rel="noopener">Open in Drive</a></td></tr>`).join("")}
 </table></div></section>
 <div class="grid2">
 <section class="panel"><h2>Episode 1 script</h2><div class="tablewrap"><table>
  <tr><td>Chapter 1, Expanded v5</td><td>${pill("done","Locked")}</td><td><a href="https://drive.google.com/file/d/1_QBqlneanWdPoUWButq81Sp3RghNiAPw/view" target="_blank" rel="noopener">Drive</a></td></tr>
  <tr><td>Shooting Script v7</td><td>${pill("done","Current in Drive")}</td><td><a href="https://drive.google.com/file/d/1mYPabzUXz7YJMuGboMzv4toU0gVQUDTH/view" target="_blank" rel="noopener">Drive</a></td></tr>
  <tr><td>Shooting Script v8 (narration placed)</td><td>${ST.setup["script-v8"]?pill("done","In Drive"):pill("you","Needs adding to Drive")}</td><td>${store.readOnly?"":`<button type="button" class="btn small" data-setup="script-v8" aria-pressed="${!!ST.setup["script-v8"]}">${ST.setup["script-v8"]?"Added":"Mark added"}</button>`}</td></tr>
  <tr><td>Narration reading script v1.1</td><td>${pill("done","Approved 9/27")}</td><td>${dlBtn("narration","Download")}</td></tr>
  <tr><td>Location Bible, Ybor safe house v5</td><td>${pill("done","Locked")}</td><td><a href="https://drive.google.com/file/d/1K4k1kJt5GrgLUhatqw9AwggXk7o-eOJs/view" target="_blank" rel="noopener">Drive</a></td></tr>
  <tr><td>Character Histories v2</td><td>${pill("done","Current")}</td><td><a href="https://drive.google.com/file/d/1vBfydgcK74GMkfEsI5ToEfq5v-zs_aMN/view" target="_blank" rel="noopener">Drive</a></td></tr>
 </table></div></section>
 <section class="panel"><h2>The five PARTS</h2><div class="tablewrap"><table><tr><th>PART</th><th>Shots</th><th>Story</th></tr>
  ${PARTS.map(p=>`<tr><td><b>${p.n} · ${esc(p.name)}</b><div class="note">Locked ${p.lock}</div></td><td class="num">${p.shots}${p.extra?`<div class="note">${esc(p.extra)}</div>`:""}</td><td>${esc(p.log)}<div class="note">${esc(p.where)}</div></td></tr>`).join("")}
 </table></div></section></div>
 <section class="panel"><h2>Other properties <span class="sub">separate canon, separate repos</span></h2><div class="grid3">
  <div><b>This Is Your Life</b><div class="note">S01E01 The Foundation of Lies · S01E02 Living Gallery · S01E03 See and Feel (recovery) · S02E01 The Matriarch's Debt</div><a href="https://drive.google.com/drive/folders/1Xi9kQwU39hz38rDeCVhhWheOwzGQeLi9" target="_blank" rel="noopener">Drive root</a></div>
  <div><b>The Arc</b><div class="note">ARC-01 Passover-Class is the screen authority. 134 mapped zones and 491 seeded entities in the Digital Twin.</div></div>
  <div><b>Crossroads series bible</b><div class="note">Characters, world, adaptation and storyboard folders.</div><a href="https://drive.google.com/drive/folders/1gpOgjrdmMGTQqgOcQ8qJbvyNRTbrHnEi" target="_blank" rel="noopener">Series Bible</a></div>
 </div></section>`;

V.locks=()=>{
  const keys=[["1-2","PARTS 1–2 · conference room, lobby"],["3","PART 3 · bathroom, safe house"],["4","PART 4 · condo at night"],["5","PART 5 · porch, kitchen"]];
  return `<div class="vhead"><span class="eyebrow">Stage 2</span><h1>Locks & maps</h1><p>Like tape marks on a stage: every face, light and camera goes back to the same spot every time, so the look holds from shot to shot and episode to episode.</p></div>
 <section class="panel"><h2>Camera maps <span class="sub">top-down, north up · blue = camera pin and view cone</span></h2>
  <div class="row" style="margin-bottom:10px"><div class="seg">${keys.map(([k,l])=>`<button type="button" data-map="${k}" aria-pressed="${UI.mapKey===k}">${l}</button>`).join("")}</div>
  <label class="f" for="mapZoom" style="min-width:160px">Size<input type="range" id="mapZoom" min="40" max="160" value="${UI.mapZoom}"></label></div>
  <div class="mapbox"><img src="${DATA.maps[UI.mapKey]}" alt="Camera map ${esc(UI.mapKey)}" style="width:${UI.mapZoom*10}px"></div>
 </section>
 <section class="panel"><h2>Face locks <span class="sub">pass these to Runway by ID</span></h2><div class="tablewrap"><table><tr><th>Lock</th><th>Who</th><th>Runway reference</th><th>Status</th></tr>
  ${FACES.map(f=>`<tr><td class="mono"><b>${f[0]}</b></td><td>${esc(f[1])}</td><td class="mono">${esc(f[2])}<div class="note" style="font-family:var(--f-body)">${esc(f[3])}</div></td><td>${pill(f[4],f[4]==="done"?"Locked":f[4]==="wait"?"Check":"Not made")}</td></tr>`).join("")}
 </table></div><p class="note">Board standard: 360 View Storyboard, head to toe from 8 sides. Don't recreate existing boards unless you ask.</p></section>
 <div class="grid2">
  <section class="panel"><h2>Light locks</h2><div class="tablewrap"><table>${LIGHTS.map(l=>`<tr><td class="mono"><b>${l[0]}</b><div class="note" style="font-family:var(--f-body)">${l[1]}</div></td><td>${esc(l[2])}</td></tr>`).join("")}</table></div></section>
  <section class="panel"><h2>Plates & props</h2><div class="tablewrap"><table>${PLATES.map(p=>`<tr><td>${esc(p[0])}</td><td class="mono">${p[1]}</td><td class="note">${p[2]}</td></tr>`).join("")}${PROPS.map(p=>`<tr><td>${esc(p[0])} <span class="note">(prop)</span></td><td class="mono">${p[1]}</td><td class="note">${p[2]}</td></tr>`).join("")}</table></div>
  <h2 style="margin-top:14px">House rules for every picture</h2>
  <ul class="checks">${["No readable text, logos, watermarks or real landmarks","Never Dr. King's voice or words; the radio host line is our own","Dialogue and texts word for word from the locked script","AI disclosure on every platform"].map(x=>`<li><span class="ok">✓</span>${x}</li>`).join("")}</ul></section>
 </div>`;
};

V.shots=()=>{
  const p=UI.shotPart;const q=UI.shotQ.toLowerCase();
  const rows=DATA_SHOTS[p].filter(s=>!q||Object.values(s).join(" ").toLowerCase().includes(q));
  const counts={};DATA_SHOTS[p].forEach(s=>{const k=shotStatus(p,s.id);counts[k]=(counts[k]||0)+1});
  const sel=DATA_SHOTS[p].find(s=>s.id===UI.shotSel)||rows[0];
  const k=sel?`P${p}-${sel.id}`:"";const frame=sel&&(p==1?P1FRAMES.find(f=>f[0]===sel.id):p==2?P2FRAMES.find(f=>f[0]===sel.id):null);
  const cue=sel&&CUES.find(c=>c[1]==p&&c[2].split(/[–→ ,]+/).includes(sel.id));
  return `<div class="vhead"><span class="eyebrow">Stage 2 · every shot, all five PARTS</span><h1>Shot bible</h1><p>Every locked shot in the house format: plate, camera pin, lens, move, framing, face, light and sound. Click a shot for its full card and the camera map it lives on.</p></div>
  <div class="row"><div class="seg">${PARTS.map(x=>`<button type="button" data-sp="${x.n}" aria-pressed="${p===x.n}">PART ${x.n} · ${DATA_SHOTS[x.n].length}</button>`).join("")}</div>
   <input type="text" id="shotQ" value="${esc(UI.shotQ)}" placeholder="Filter: FL-EJ61, 85mm, K1, radio…" style="max-width:280px">
   <span class="note">${Object.entries(counts).map(([k,v])=>`${v} ${STATUS_LBL[k][1].toLowerCase()}`).join(" · ")}</span>
   ${dlBtn("shots","Download all shots (.csv)")}</div>
  <div class="split">
   <section class="panel" style="padding:0"><div class="tablewrap"><table>
    <tr><th>Shot</th><th>Framing</th><th>Pin · Lens</th><th>Face</th><th>Status</th></tr>
    ${rows.map(s=>{const st=shotStatus(p,s.id);return `<tr class="shotrow${sel&&sel.id===s.id?" sel":""}" data-shot="${s.id}"><td class="mono"><b>${s.id}</b></td><td>${esc(s.framing)}<div class="note">${esc(s.move)}</div></td><td class="mono">${esc(s.pin)}<div class="note">${esc(s.lens)}</div></td><td class="note">${esc(s.face)}</td><td>${pill(STATUS_LBL[st][0],STATUS_LBL[st][1])}</td></tr>`}).join("")||`<tr><td colspan="5" class="note">No shots match.</td></tr>`}
   </table></div></section>
   ${sel?`<section class="panel" style="position:sticky;top:0"><h2>E01-P${p}-${sel.id} <span class="sub">PART ${p} · ${esc(PARTS[p-1].name)}</span></h2>
    <dl class="kv"><dt>Plate</dt><dd class="mono">${esc(sel.plate)}</dd><dt>Camera pin</dt><dd class="mono">${esc(sel.pin)}</dd><dt>Lens · height</dt><dd>${esc(sel.lens)}</dd><dt>Move</dt><dd>${esc(sel.move)}</dd><dt>Framing</dt><dd>${esc(sel.framing)}</dd><dt>Face lock</dt><dd>${esc(sel.face)}</dd><dt>Light</dt><dd>${esc(sel.light)}</dd><dt>Sound</dt><dd>${esc(sel.sound)}</dd>
    ${frame?`<dt>Key frame</dt><dd class="mono">${frame[2]}</dd>`:""}${p==1&&frame?`<dt>Video</dt><dd class="mono">${frame[3]}</dd>`:""}${cue?`<dt>Narration</dt><dd><button type="button" class="btn small" data-cue="${cue[0]}">${cue[0]} · ${cue[3]} words</button></dd>`:""}</dl>
    <div class="row" style="margin-top:12px"><label class="f" for="shotSt">Status<select id="shotSt" class="stat-sel" ${store.readOnly?"disabled":""}>${Object.entries(STATUS_LBL).map(([v,l])=>`<option value="${v}" ${shotStatus(p,sel.id)===v?"selected":""}>${l[1]}</option>`).join("")}</select></label>
    <button type="button" class="btn small" data-mapgo="${p<=2?"1-2":p}">Open camera map</button><button type="button" class="btn small" data-ask-shot="${sel.id}" ${CAP.sample?"":"hidden"}>Ask about this shot</button></div>
    <label class="f" for="shotNote" style="margin-top:10px">Director's note<textarea id="shotNote" rows="3" placeholder="What to change or watch for" ${store.readOnly?"disabled":""}>${esc(ST.notes[k]||"")}</textarea></label>
    <div class="row" style="margin-top:6px"><button type="button" class="btn small" id="saveNote" ${store.readOnly?"disabled":""}>Save note</button></div>
   </section>`:""}
  </div>`;
};

V.pictures=()=>{
  const c={approved:0,pending:0,redo:0};Object.values(ST.p2).forEach(v=>c[v]=(c[v]||0)+1);
  return `<div class="vhead"><span class="eyebrow">Stage 3 · Gate 1</span><h1>Pictures</h1><p>Key frames are cheap (20 credits). Video is the expensive step. Only frames you approve here get animated.</p></div>
  <section class="panel"><h2>PART 2 key frames <span class="sub">${c.approved} approved · ${c.pending} waiting · ${c.redo} to redo</span></h2>
   <div class="frames">${P2FRAMES.map(f=>{const st=ST.p2[f[0]];return `<div class="frame ${st}"><div class="ph"><span class="sid">${f[0]}</span>${st==="approved"?pill("done","Approved"):st==="redo"?pill("block","Redo"):pill("you","Your pick")}</div>
    <div class="meta"><div>${esc(f[1])}</div><div class="mono">${f[2]}</div><div class="note">Animate at ${f[4]} s · ${f[4]*12} credits</div>
    ${store.readOnly?"":`<div class="acts"><button type="button" class="btn small" data-p2="${f[0]}" data-v="approved" aria-pressed="${st==="approved"}">Approve</button><button type="button" class="btn small" data-p2="${f[0]}" data-v="redo" aria-pressed="${st==="redo"}">Redo</button></div>`}</div></div>`}).join("")}</div>
   <div class="row" style="margin-top:14px">${store.readOnly?"":`<button type="button" class="btn" id="approveRest">Approve all still waiting</button>`}<button type="button" class="btn primary" id="sendPicks">Copy picks for the Studio</button><span class="note">${store.mode==="shared"?"Picks are saved for the team, and Claude can read them directly.":"Picks are saved in this browser."}</span></div>
   <p class="note">Runway output links expire and this page can't load Runway images, so frames show their shot number. Open a frame by its task ID in Runway to view it.</p>
  </section>
  <section class="panel"><h2>Memorial stills <span class="sub">13 made · 11 approved · 2 kept in the library</span></h2>
   <div class="frames">${STILLS.map(s=>`<div class="frame ${s[4]==="approved"?"approved":""}"><div class="ph"><span class="sid" style="font-size:24px">${s[0]}</span>${s[5]?pill("you","PART 2 cross-cut"):s[4]==="kept"?pill("idle","Library"):pill("done","Reel")}</div><div class="meta"><div><b>${esc(s[2])}</b> · ${s[1]}</div><div class="mono">${s[3]}</div></div></div>`).join("")}</div>
   <p class="note">Cross-cut order in PART 2: M13 lantern (S13b), then M03, M04 v2, M07, M08 (S13c), then M11 and M12 (S13d). Slow push-ins happen in CapCut at 0 credits.</p>
  </section>
  <section class="panel"><h2>PART 1 key frames <span class="sub">12 of 12 approved 2026-09-26</span></h2>
   <div class="frames">${P1FRAMES.filter(f=>f[0]!=="S05b").map(f=>`<div class="frame approved"><div class="ph"><span class="sid">${f[0]}</span>${pill("done","Approved")}</div><div class="meta"><div>${esc(f[1])}</div><div class="mono">${f[2]}</div></div></div>`).join("")}</div>
  </section>`;
};

V.motion=()=>{
  const j=UI.jc;const pool=P2FRAMES.filter(f=>ST.p2[f[0]]===(j.mode==="animate"?"approved":"redo"));
  const picked=pool.filter(f=>!j.off[f[0]]);const cost=j.mode==="animate"?picked.reduce((a,f)=>a+f[4]*12,0):picked.length*20;
  const card=`JOB CARD\nEpisode: 1  PART: 2\nMake: ${j.mode==="animate"?"animate approved":"key frames"}: ${picked.map(f=>f[0]+(j.mode==="animate"?` (${f[4]} s)`:"")).join(", ")||"(none selected)"}\nBudget: ${fmt(j.budget)} credits\nEstimate: ${fmt(cost)} credits\nNotes: ${j.notes}`;
  UI.jcText=card;
  return `<div class="vhead"><span class="eyebrow">Stage 4</span><h1>Motion</h1><p>Gen-4.5 at 720 × 1280, 12 credits a second (measured on S12: 38,325 → 38,265 for 5 s). Motion prompts describe only small, natural movement. No new people, text or brands.</p></div>
  <section class="panel"><h2>Job card for the Studio bot</h2>
   <div class="grid2"><div style="display:grid;gap:10px">
     <label class="f" for="jcMode">What to make<select id="jcMode"><option value="animate" ${j.mode==="animate"?"selected":""}>Animate approved PART 2 frames</option><option value="redo" ${j.mode==="redo"?"selected":""}>Remake key frames marked Redo</option></select></label>
     <div style="display:grid;gap:4px">${pool.length?pool.map(f=>`<label class="row" style="gap:8px"><input type="checkbox" data-jc="${f[0]}" ${j.off[f[0]]?"":"checked"}> <span class="mono">${f[0]}</span> <span class="note">${esc(f[1])}${j.mode==="animate"?` · ${f[4]} s · ${f[4]*12} cr`:" · 20 cr"}</span></label>`).join(""):`<div class="note">Nothing ${j.mode==="animate"?"approved":"marked Redo"} yet in PART 2. Pick frames under Pictures.</div>`}</div>
     <label class="f" for="jcBudget">Budget (credits)<input id="jcBudget" type="number" value="${j.budget}" min="0" step="100"></label>
     <label class="f" for="jcNotes">Notes<input id="jcNotes" type="text" value="${esc(j.notes)}"></label>
    </div>
    <div style="display:grid;gap:10px;align-content:start">
     <div class="stat credits"><b class="num">${fmt(cost)}</b><span>Estimated credits</span></div>
     <div class="note">${cost>j.budget?`<span style="color:var(--block)">Over budget by ${fmt(cost-j.budget)}. The Studio will stop and ask.</span>`:`Within budget. Balance after: about ${fmt(((ST.live&&ST.live.runway&&ST.live.runway.credits)||BALANCE)-cost)}.`}</div>
     <pre class="out">${esc(card)}</pre>
     <div class="row"><button type="button" class="btn primary" id="jcCopy">Copy job card</button>${dlBtn("jobcard","Download .txt")}${store.readOnly?"":`<button type="button" class="btn" id="jcQueue">Send to Motion queue</button>`}</div>
    </div></div>
  </section>
  <section class="panel"><h2>PART 1 clips <span class="sub">13 made</span></h2><div class="tablewrap"><table><tr><th>Shot</th><th>What</th><th>Video task</th><th>From key frame</th></tr>
   ${P1FRAMES.map(f=>`<tr><td class="mono"><b>${f[0]}</b></td><td>${esc(f[1])}</td><td class="mono">${f[3]}</td><td class="mono">${f[2]}</td></tr>`).join("")}
  </table></div><p class="note">Superseded: S08 v1 (Chicago-style tower in the window). Lip sync on S02 and S08 is loose; Runway Lip Sync on the Pro plan can match lines 1 and 3.</p></section>
  <section class="panel"><h2>Credits for the rest of the episode</h2><div class="tablewrap"><table><tr><th>PART</th><th>Shots</th><th>Planned credits</th><th>Hard parts</th></tr>
   <tr><td>2 · The Performance</td><td class="num">18</td><td class="num">1,900–2,500</td><td>5 on-camera lines</td></tr><tr><td>3 · The Bathroom</td><td class="num">29</td><td class="num">4,000–5,000</td><td>Two ages, a flashback, dialogue</td></tr><tr><td>4 · The Box</td><td class="num">20</td><td class="num">2,500–3,000</td><td>Easiest to do well: objects and voice-over</td></tr><tr><td>5 · The Porch</td><td class="num">14</td><td class="num">2,000–2,700</td><td>Elijah's speech on camera</td></tr>
  </table></div></section>
  <section class="panel"><h2>Quality check before anything reaches you</h2><ul class="checks">${["Faces match the boards","No text except what the script calls for","No logos, brands or real landmarks","Hands and fingers look normal","Time of day matches the light lock","Shot matches its lock-sheet framing","Motion small and natural, no new people"].map(x=>`<li><span class="ok">✓</span>${x}</li>`).join("")}</ul></section>`;
};

