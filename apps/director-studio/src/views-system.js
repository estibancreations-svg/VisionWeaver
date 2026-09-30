/* ================= v7 SYSTEM VIEWS: settings, cast & avatars, database, uplink, activity, rights ================= */
const SET_TABS=[["appearance","Appearance"],["system","System & access"],["connections","Connections"],["output","Output & transfer"],["thelma","THELMA AI"],["uplink","Claude uplink"],["data","Data & backup"]];
const connOff=k=>!!(ST.settings.connections[k]&&ST.settings.connections[k].off);
const opt=(label,desc,control)=>`<div class="opt"><b>${label}</b><span class="d">${desc}</span><div>${control}</div></div>`;
const segCtl=(key,opts,cur,attr="data-app")=>`<div class="seg">${opts.map(([v,l])=>`<button type="button" ${attr}="${key}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join("")}</div>`;

/* ---------- reports + output helpers ---------- */
function statusReport(){
  const w=waiting();const d=new Date();
  let s=`VisionWeaver Studio · status report · ${d.toLocaleString("en-US",{timeZone:"America/New_York"})} ET\nCrossroads of Identity · Episode 1 "The News"\n\n`;
  s+=`Runway credits: ${fmt((ST.live&&ST.live.runway&&ST.live.runway.credits)||BALANCE)}\nParts finished: ${partsDone()} of 5\n\nWAITING ON SIRE (${w.length})\n`+w.map((x,i)=>`${i+1}. ${x.t} — ${x.d||""}`).join("\n");
  s+=`\n\nPART 2 key frames: ${Object.values(ST.p2).filter(v=>v==="approved").length} approved, ${Object.values(ST.p2).filter(v=>v==="pending").length} waiting, ${Object.values(ST.p2).filter(v=>v==="redo").length} redo`;
  s+=`\nNarration recorded: ${CUES.filter(c=>ST.recorded[c[0]]).length} of ${CUES.length}`;
  s+=`\nCast needing review: ${CAST.filter(c=>c[3]==="wait"&&!(ST.avatars[c[0]]&&ST.avatars[c[0]].reviewed)).map(c=>c[1]).join(", ")||"none"}`;
  s+=`\nGuild queue pending: ${QUEUE.filter(q=>q.status==="pending").length}\nUplink open: ${UPLINK.filter(u=>u.status==="open").length}\n\nRECENT ACTIVITY\n`+LOG.slice(0,10).map(l=>`- ${when(l.at)}: ${l.text}`).join("\n");
  return s;
}
function backupJSON(){return JSON.stringify({system:SYSTEM.id,version:VERSION,exported:nowISO(),state:ST,queue:QUEUE,log:LOG,uplink:UPLINK,files:FILES},null,2)}
function docFor(kind){
  const pre=ST.settings.output.prefix||"E01";
  if(kind==="status")return [`${pre}_Status_${new Date().toISOString().slice(0,10)}.md`,statusReport(),"text/markdown"];
  if(kind==="backup")return [`VisionWeaver_backup_${new Date().toISOString().slice(0,10)}.json`,backupJSON(),"application/json"];
  const f=fileFor(kind);if(!f)return null;
  return [f[0].replace(/^E01/,pre),f[1],/\.csv$/.test(f[0])?"text/csv":/\.json$/.test(f[0])?"application/json":/\.srt$/.test(f[0])?"text/plain":"text/markdown"];
}
const OUT_DOCS=[["status","Status report"],["editlist","PART 1 edit list"],["narration","Narration reading script"],["shots","Shot bible (CSV)"],["srt","PART 1 captions (.srt)"],["backup","Full studio backup (JSON)"]];
function printableHTML(){
  const css=[...document.querySelectorAll("style")].map(s=>s.textContent).join("\n");
  return `<!doctype html><html data-theme="light"><head><meta charset="utf-8"><title>VisionWeaver · ${esc(UI.view)}</title><style>${css}</style><style>body{background:#fff}main{padding:24px}.guide,.btn,.seg{display:none!important}</style></head><body><main>${$("#main").innerHTML}</main></body></html>`;
}
function printPage(){try{window.print()}catch(e){}setTimeout(()=>toast("If no print dialog opened, use Output → Download printable page"),800)}
async function driveSend(kind){
  const d=docFor(kind);if(!d)return;
  if(!CAP.mcp){toast("Open the studio in claude.ai to send to Drive");return}
  if(connOff("drive")){toast("Google Drive is turned off in Settings → Connections");return}
  UI.driveMsg="Sending "+d[0]+"…";render();
  const input={title:d[0],textContent:d[1],contentMimeType:d[2],disableConversionToGoogleType:true};
  const folder=(ST.settings.output.driveFolder||"").trim();if(folder)input.parentId=folder;
  try{const r=await CAP.mcp.callTool("Google Drive","create_file",input,{cache:false});const p=r.payload||{};const link=p.viewUrl||p.alternateLink||p.webViewLink||p.url||(p.id?`https://drive.google.com/file/d/${p.id}/view`:"");UI.driveMsg=`Saved to Drive: ${d[0]}`;UI.driveLink=link;addLog(`Sent ${d[0]} to Google Drive`)}
  catch(e){UI.driveMsg=mcpErrText(e,"Google Drive");UI.driveLink=""}
  render();
}
function emailOut(kind){
  const d=docFor(kind)||docFor("status");const to=(MINE.recipients||"").trim();
  const subj=`${ST.settings.output.emailPrefix||""} ${d[0]}`.trim();let body=d[1];
  if(body.length>1800)body=body.slice(0,1800)+"\n\n… (trimmed; the full file is attached separately or in Drive)";
  const href=`mailto:${encodeURIComponent(to).replace(/%2C/g,",").replace(/%40/g,"@")}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  const a=document.createElement("a");a.href=href;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>toast("If your mail app didn't open, use Copy email instead"),700);
}
function savePrivate(patchObj){Object.assign(MINE,patchObj);if(CAP.db&&store.uid){write(()=>CAP.db.doc("data/users/"+store.uid+"/prefs").set(MINE))}else{try{localStorage.setItem(LKEY+"-mine",JSON.stringify(MINE))}catch(e){}}}
try{if(!Object.keys(MINE).length)MINE=JSON.parse(localStorage.getItem(LKEY+"-mine")||"{}")}catch(e){}

/* ---------- SETTINGS ---------- */
V.settings=()=>`<div class="vhead"><span class="eyebrow">System</span><h1>Settings</h1><p>How the studio looks, where it lives, what it connects to, how it prints and sends files, and how THELMA behaves. Look settings belong to you on this device; everything else is saved for the team.</p></div>
 <div class="set-layout"><nav class="set-tabs">${SET_TABS.map(([k,l])=>`<button type="button" data-settab="${k}" aria-current="${UI.setTab===k}">${l}</button>`).join("")}</nav><div style="display:grid;gap:18px;min-width:0">${(SETV[UI.setTab]||SETV.appearance)()}</div></div>`;
const SETV={};
SETV.appearance=()=>{
  const prev={auto:["#101217","#171A21","#E89F52"],dark:["#101217","#171A21","#E89F52"],light:["#F1F2F5","#FFFFFF","#B5631B"],think:["#FDF1AA","#FFF8CF","#B8412F"],contrast:["#000","#0A0A0A","#FFD400"]};
  const acc={tungsten:"#D0802F",daylight:"#2E68A6",emerald:"#1E8A5A",violet:"#6D4BC4",rose:"#C0386B"};
  return `<section class="panel"><h2>Look <span class="sub">yours only, this device</span></h2>
   ${opt("Theme","Tungsten is the screening-room look. Think turns the studio into a legal pad, like your Systems Desktop.",`<div class="swatches">${THEMES.map(([v,l])=>`<button type="button" class="sw" data-app="theme" data-v="${v}" aria-pressed="${APP.theme===v}"><span class="prev">${prev[v].map(c=>`<i style="background:${c}"></i>`).join("")}</span>${l}</button>`).join("")}</div>`)}
   ${opt("Accent color","Buttons, highlights and the live playhead.",`<div class="swatches">${ACCENTS.map(([v,l])=>`<button type="button" class="sw" data-app="accent" data-v="${v}" aria-pressed="${APP.accent===v}"><span class="prev"><i style="background:${acc[v]}"></i></span>${l}</button>`).join("")}</div>`)}
   ${opt("Text size",`${APP.scale}% · bigger text for reading scripts across the room.`,`<input type="range" min="85" max="135" step="5" value="${APP.scale}" data-apprange="scale" style="width:100%">`)}
   ${opt("Spacing","Compact fits more on screen; Roomy is easier on a tablet.",segCtl("density",[["compact","Compact"],["comfortable","Standard"],["roomy","Roomy"]],APP.density))}
   ${opt("Menu","Icons-only gives the work area more room.",segCtl("rail",[["full","Full menu"],["icons","Numbers only"]],APP.rail))}
   ${opt("Motion","Turn off animations.",segCtl("motion",[["full","On"],["reduced","Off"]],APP.motion))}
  </section>
  <section class="panel"><h2>Preview</h2><div class="row">${pill("done","Approved")} ${pill("you","Your pick")} ${pill("wait","Waiting")} ${pill("block","Redo")} <button type="button" class="btn primary">Primary</button> <button type="button" class="btn">Button</button></div><div class="bar2" style="margin-top:10px"><i style="width:62%;background:var(--tungsten)"></i></div></section>`;
};
SETV.system=()=>{
  const ps=UI.perms;const s=SYSTEM;
  return `<section class="panel"><h2>Where the studio lives</h2><dl class="kv">
    <dt>System</dt><dd><b>${esc(s.name)}</b> · ${esc(s.id)} · ${VERSION}</dd>
    <dt>Hosted as</dt><dd>${esc(s.runtime)} · runtime ${esc(s.contract)}. Only you and people you share it with can open it.</dd>
    <dt>Saved data</dt><dd>${store.mode==="shared"?"Shared studio database (Claude artifact storage), live for everyone with access":"This browser only (open in claude.ai to share)"}</dd>
    <dt>Source code</dt><dd class="mono">${esc(s.repo)} → ${esc(s.src)} · build: ${esc(s.build)}</dd>
    <dt>Back end</dt><dd>Supabase “${esc(s.supabase.name)}” <span class="mono">${esc(s.supabase.ref)}</span> · mode ${esc(s.supabase.mode)}</dd>
    <dt>Web host</dt><dd>Vercel team ${esc(s.vercel.team)} · <span class="mono">${esc(s.vercel.site)}</span></dd>
    <dt>Edge functions</dt><dd class="mono">${s.functions.map(esc).join(", ")}</dd>
    <dt>Secret names</dt><dd class="mono">Browser: ${s.envNames.browser.join(", ")}<br>Server: ${s.envNames.server.join(", ")}</dd></dl>
   <p class="note">Values never live in this page or the repo. Keys stay in Supabase secrets / Vault.</p>
   <div class="row">${s.links.map(([l,u])=>`<a class="btn small" href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</div></section>
  <section class="panel"><h2>Access <span class="sub">who can do what</span></h2><dl class="kv">
    <dt>You</dt><dd>${store.uid?`<span data-uid="${esc(store.uid)}">you</span>`:"Not signed in to shared data"} · ${store.readOnly?"view only":"can make decisions"}</dd>
    <dt>Roles</dt><dd>Owner and editors decide and change settings · contributors can use the page · viewers read only. Change who has access with the page's Share button in claude.ai.</dd>
    <dt>Private to you</dt><dd>Your THELMA conversation and email recipients (nobody else can read them, not even the owner).</dd></dl></section>
  <section class="panel"><h2>Page permissions <span class="sub">what this page may use in your view</span></h2>
   ${ps?`<table><tr><th>Capability</th><th>State</th><th>Used for</th></tr>${Object.entries(ps).map(([k,v])=>`<tr><td class="mono">${esc(k)}</td><td>${pill(v==="granted"?"done":v==="prompt"?"wait":v==="denied"?"block":"idle",v)}</td><td class="note">${esc(({db:"Shared decisions and data",user:"Who approved what",sample:"THELMA and caption drafts",downloads:"Saving files",mcp:"Live checks, database, Drive, uplink",assets:"Storing uploaded files and photos",permissions:"This table"})[k]||"")}</td></tr>`).join("")}</table>`:`<p class="note">Loading…</p>`}
   <div class="row" style="margin-top:10px"><button type="button" class="btn small" id="permAsk">Allow everything now</button><span class="note">One dialog. You can say no to any part.</span></div></section>`;
};
SETV.connections=()=>{
  const live=k=>{const r=ST.live&&ST.live[k];return r?pill(r.ok?"done":"block",r.ok?"answering":"problem"):pill("idle","not checked")};
  return `<section class="panel"><h2>Connections <span class="sub">${CONNECTORS.length} services</span></h2><div class="tablewrap"><table><tr><th>Service</th><th>How it plugs in</th><th>Status</th><th>What this page may call</th><th>Page may use</th></tr>
   ${CONNECTORS.map(([k,n,route,tools,purpose,notes])=>`<tr><td><b>${esc(n)}</b><div class="note">${esc(purpose)}</div><div class="note">${esc(notes)}</div></td><td>${esc(route)}</td><td>${["runway","supabase","zapier","github"].includes(k)?live(k):route.startsWith("Not")?pill("idle","not connected"):route.includes("available")?pill("idle","available"):pill("wait","not checked")}</td><td class="mono">${tools.length?tools.join(", "):"—"}</td><td>${tools.length?`<label class="switch"><input type="checkbox" data-connoff="${k}" ${connOff(k)?"":"checked"} ${store.readOnly?"disabled":""}></label>`:"—"}</td></tr>`).join("")}
  </table></div>
  <div class="row" style="margin-top:10px">${CAP.mcp?`<button type="button" class="btn primary" id="liveCheck">Check all connections now</button>`:""}<span class="note">Each connector asks your permission the first time. Turning one off here stops this page from calling it.</span></div></section>
  <section class="panel"><h2>OAuth for direct connections <span class="sub">server side, later</span></h2><dl class="kv"><dt>Redirect URL</dt><dd class="mono">${esc(OAUTH.redirect)}</dd><dt>Right now</dt><dd>${esc(OAUTH.current)}</dd>${OAUTH.scopes.map(([p,s])=>`<dt>${esc(p)}</dt><dd class="mono">${esc(s)}</dd>`).join("")}</dl><p class="note">Full wiring notes: connections/README.md in the repo.</p></section>`;
};
SETV.output=()=>{
  const o=ST.settings.output;
  return `<section class="panel"><h2>Defaults</h2>
   ${opt("File name start","Put in front of every exported file.",`<input type="text" data-outset="prefix" value="${esc(o.prefix)}" ${store.readOnly?"disabled":""}>`)}
   ${opt("Email subject start","Added to every email subject.",`<input type="text" data-outset="emailPrefix" value="${esc(o.emailPrefix)}" ${store.readOnly?"disabled":""}>`)}
   ${opt("Email recipients","Private to you. Comma-separated.",`<input type="text" id="recips" value="${esc(MINE.recipients||"")}" placeholder="name@example.com, …">`)}
   ${opt("Google Drive folder ID","Optional. The long code in a folder's web address. Blank = your Drive's top level.",`<input type="text" data-outset="driveFolder" value="${esc(o.driveFolder)}" placeholder="1AbC…" ${store.readOnly?"disabled":""}>`)}
   ${opt("Paper","For printing.",segCtl("paper",[["letter","Letter"],["a4","A4"]],o.paper,"data-outseg"))}
  </section>
  <section class="panel"><h2>Send something</h2>
   <label class="f" style="max-width:360px">Document<select id="outDoc">${OUT_DOCS.map(([k,l])=>`<option value="${k}" ${UI.outDoc===k?"selected":""}>${l}</option>`).join("")}</select></label>
   <div class="row" style="margin-top:12px">
    <button type="button" class="btn primary" data-out="download">Download</button>
    ${CAP.mcp&&!connOff("drive")?`<button type="button" class="btn" data-out="drive">Send to Google Drive</button>`:""}
    <button type="button" class="btn" data-out="email">Email</button>
    <button type="button" class="btn" data-out="copyemail">Copy email text</button>
    <button type="button" class="btn" data-out="print">Print this page</button>
    <button type="button" class="btn" data-out="printable">Download printable page</button>
   </div>
   ${UI.driveMsg?`<p class="hint" style="margin-top:10px">${esc(UI.driveMsg)} ${UI.driveLink?`<a href="${esc(UI.driveLink)}" target="_blank" rel="noopener">Open ↗</a>`:""}</p>`:""}
   <p class="note">Transfers: Download saves to this device · Drive creates a new file (never overwrites) · Email opens your mail app with the text filled in · GitHub pushes go through Claude (Uplink) after review, because the repo is public.</p></section>
  <section class="panel"><h2>Status report preview</h2><pre class="out">${esc(statusReport())}</pre></section>`;
};
SETV.thelma=()=>{const t=TH();return `<section class="panel"><h2>THELMA AI</h2>
  ${opt("THELMA","Turns the assistant, her button and her guide on or off for everyone.",`<label class="switch"><input type="checkbox" data-thset="enabled" ${t.enabled?"checked":""}> ${t.enabled?"On":"Off"}</label>`)}
  ${opt("Guide bar","A short 'what this page is for / what's next' strip on every page. Free: it doesn't use Claude.",`<label class="switch"><input type="checkbox" data-thset="guide" ${t.guide?"checked":""}> ${t.guide?"On":"Off"}</label>`)}
  ${opt("Read answers aloud","Say 'tell me' or 'read to me' in a question to hear one answer anytime.",`<label class="switch"><input type="checkbox" data-thset="autoRead" ${t.autoRead?"checked":""}> ${t.autoRead?"Always":"Only when asked"}</label>`)}
  ${opt("Thinking depth","Deep is slower and uses more of your Claude usage.",`<select data-thset="tier">${[["quick","Quick"],["default","Standard"],["complex","Deep"]].map(([v,l])=>`<option value="${v}" ${t.tier===v?"selected":""}>${l}</option>`).join("")}</select>`)}
  ${opt("Authority","Fixed by the Architect's rules.",`<b>Propose only.</b> <span class="note">She can open pages, search, read data, run checks and queue proposals. She can't approve, spend, publish or delete.</span>`)}
 </section><section class="panel"><h2>Her rules <span class="sub">from the THELMA canon in MASTER_CEO_DASHBOARD</span></h2><pre class="out">${esc(THELMA_RULES)}</pre></section>`};
SETV.uplink=()=>`<section class="panel"><h2>Claude uplink</h2><p style="margin-top:0">The uplink is a shared inbox between you and Claude. You (or THELMA) leave tasks; Claude reads them from its side, answers in the thread, and can build, push to GitHub and republish the studio.</p>
  ${opt("Wake-up task ID","A scheduled task that starts a Claude session to work the inbox. Set by Claude.",`<input type="text" data-upset="triggerId" value="${esc(ST.settings.uplink.triggerId||"")}" placeholder="trig_…" ${store.readOnly?"disabled":""}>`)}
  <p class="note">Without a wake-up task, just tell Claude in chat: "check the uplink."</p><button type="button" class="btn small" data-view="uplink">Open the uplink</button></section>`;
SETV.data=()=>`<section class="panel"><h2>Backup and restore</h2>
  <div class="row"><button type="button" class="btn primary" data-out="backupdl">Download full backup (JSON)</button>${CAP.mcp&&!connOff("drive")?`<button type="button" class="btn" data-out="backupdrive">Back up to Google Drive</button>`:""}</div>
  <p class="note">A backup holds decisions, settings, cast records, queue, activity and uplink threads. It does not hold your private THELMA chat.</p>
  ${store.readOnly?"":`<label class="f" style="margin-top:12px;max-width:420px">Restore settings and records from a backup<input type="file" id="restoreIn" accept="application/json,.json"></label><p class="note">Restoring merges the backup's decisions and settings into the studio for everyone. You'll be asked to confirm.</p>`}</section>
 <section class="panel"><h2>Stored files</h2>${CAP.assets?`<button type="button" class="btn small" id="assetUsage">Check storage</button> <span class="note">${UI.usage?`${UI.usage.files} files · ${(UI.usage.bytes/1048576).toFixed(1)} MB of ${(UI.usage.maxBytes/1048576).toFixed(0)} MB`:""}</span>`:`<p class="note">File storage turns on for editors when opened in claude.ai.</p>`}</section>
 <section class="panel"><h2>This device</h2><button type="button" class="btn small" id="resetLook">Reset my look settings</button></section>`;

/* ---------- CAST & AVATARS ---------- */
function avRec(code){return ST.avatars[code]||{}}
V.cast=()=>{
  const q=UI.castQ.toLowerCase();const list=CAST.filter(c=>!q||(c[0]+" "+c[1]).toLowerCase().includes(q));
  const c=CAST.find(x=>x[0]===UI.castSel)||CAST[0];const r=avRec(c[0]);const refs=r.refs||[];
  const reviewed=r.reviewed;const needs=c[3]==="wait"&&!reviewed;
  return `<div class="vhead"><span class="eyebrow">Stage 2 · locks</span><h1>Cast & avatars</h1><p>Every character's locked look, voice, history and checks. The board is the master: if words and picture disagree, the picture wins and the words get fixed. Think of each record as a passport the character carries into every shot.</p></div>
  <div class="castgrid">
   <section class="panel"><h2>Cast <span class="sub">${CAST.length} records · ${CAST.filter(x=>x[3]==="wait"&&!avRec(x[0]).reviewed).length} need review</span></h2>
    <input type="text" id="castQ" placeholder="Filter by name or code" value="${esc(UI.castQ)}" style="margin-bottom:8px">
    <div class="castlist">${list.map(x=>{const rv=avRec(x[0]).reviewed;return `<button type="button" data-cast="${x[0]}" aria-current="${x[0]===c[0]}"><span class="code">${esc(x[0])}</span><span>${esc(x[1])}</span>${rv?pill("done","Reviewed"):x[3]==="wait"?pill("you","Check"):x[3]==="idle"?pill("idle","Not made"):pill("done","Locked")}</button>`}).join("")}</div>
   </section>
   <div style="display:grid;gap:18px;min-width:0">
    <section class="panel"><h2>${esc(c[1])} <span class="sub mono">${esc(c[0])}</span></h2>
     <dl class="kv"><dt>Board / task</dt><dd class="mono">${esc(c[2])} ${c[2]!=="—"?`<button type="button" class="btn small" data-copy="${esc(c[2])}">Copy</button>`:""}</dd><dt>Record</dt><dd>${esc(c[4])}</dd>
      <dt>Review</dt><dd>${reviewed?`${pill("done","Reviewed")} ${when(reviewed.at)} · ${who(reviewed.by)}`:needs?pill("you","Needs your look"):pill("done","Locked")} ${store.readOnly?"":`<button type="button" class="btn small" data-avreview="${c[0]}">${reviewed?"Undo review":"Mark reviewed"}</button>`}</dd></dl>
     <div class="row" style="margin-top:10px">${CAP.sample&&TH().enabled?`<button type="button" class="btn small" data-askcast="${c[0]}">Ask THELMA to check ${esc(c[1].split(",")[0])}</button>`:""}<button type="button" class="btn small" data-avexport="${c[0]}">Download character card</button></div></section>
    <section class="panel"><h2>Reference photos <span class="sub">${refs.length} stored</span></h2>
     ${refs.length?`<div class="refs">${refs.map(f=>`<figure><img src="/_blob/${esc(f.id)}" alt="${esc(f.name)}" loading="lazy"><figcaption>${esc(f.name)}</figcaption></figure>`).join("")}</div>`:`<div class="empty">No photos stored yet. Runway boards live in Runway by task ID; add stills or phone photos here to keep them with the record.</div>`}
     ${CAP.assets&&!store.readOnly?`<label class="btn small" style="margin-top:8px">Add photos<input type="file" id="avRefIn" accept="image/*" multiple hidden></label>`:""}</section>
    <form class="panel" id="avForm"><h2>Lock record</h2><div class="fgrid">${LOCK_FIELDS.map(([k,l,ph])=>`<label class="f">${esc(l)}<textarea data-av="${k}" rows="2" placeholder="${esc(ph)}" ${store.readOnly?"disabled":""}>${esc((r.lock||{})[k]||"")}</textarea></label>`).join("")}</div>
     <h2 style="margin-top:14px">Localized Avatar + Historical Space profile</h2><p class="note" style="margin-top:0">Time, place and people, so the look, clothes, speech and light match the real moment. Built from your framework description; it wasn't in GitHub yet.</p>
     ${LAHS.map(([g,fs])=>`<h3 style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin:12px 0 6px">${g}</h3><div class="fgrid">${fs.map(([k,l,ph])=>`<label class="f">${esc(l)}<textarea data-lahs="${k}" rows="2" placeholder="${esc(ph)}" ${store.readOnly?"disabled":""}>${esc((r.lahs||{})[k]||"")}</textarea></label>`).join("")}</div>`).join("")}
     ${store.readOnly?"":`<div class="row" style="margin-top:12px"><button type="submit" class="btn primary">Save ${esc(c[0])}</button><span class="note">${r.savedAt?`Saved ${when(r.savedAt)} · ${who(r.savedBy)}`:"Not saved yet"}</span></div>`}</form>
    <div class="grid2">
     <section class="panel"><h2>360 board check</h2><ul class="checks">${BOARD_CHECKS.map((b,i)=>`<li><label class="switch"><input type="checkbox" data-avboard="${i}" ${(r.board||{})[i]?"checked":""} ${store.readOnly?"disabled":""}> ${esc(b)}</label></li>`).join("")}</ul></section>
     <section class="panel"><h2>Calibration ladder</h2><table>${LADDER.map(([k,l])=>`<tr><td>${esc(l)}</td><td><select data-avladder="${k}" class="stat-sel" ${store.readOnly?"disabled":""}>${LADDER_STATES.map(([v,t])=>`<option value="${v}" ${((r.ladder||{})[k]||"")===v?"selected":""}>${t}</option>`).join("")}</select></td></tr>`).join("")}</table></section>
    </div>
   </div>
  </div>
  <div class="grid2">
   <section class="panel"><h2>Voice locks</h2><div class="tablewrap"><table><tr><th>Lock</th><th>Who</th><th>Source</th><th>Rule</th></tr>${VOICES.map(v=>`<tr><td class="mono">${esc(v[0])}</td><td>${esc(v[1])}</td><td>${esc(v[2])}</td><td class="note">${esc(v[3])}</td></tr>`).join("")}</table></div></section>
   <section class="panel"><h2>Pause and ask Sire when…</h2><ul class="checks">${PAUSE_GATES.map(g=>`<li><span class="no">■</span>${esc(g)}</li>`).join("")}</ul><p class="note">From the Five Stations pilot-mode rules. Automation stops at each of these.</p></section>
  </div>`;
};
function characterCard(code){const c=CAST.find(x=>x[0]===code);const r=avRec(code);let s=`# ${c[1]} (${c[0]})\n\nBoard / task: ${c[2]}\nRecord: ${c[4]}\nReviewed: ${r.reviewed?r.reviewed.at:"no"}\n\n## Lock record\n`;LOCK_FIELDS.forEach(([k,l])=>s+=`- **${l}:** ${(r.lock||{})[k]||"—"}\n`);s+=`\n## Localized Avatar + Historical Space\n`;LAHS.forEach(([g,fs])=>fs.forEach(([k,l])=>s+=`- **${l}:** ${(r.lahs||{})[k]||"—"}\n`));s+=`\n## 360 board check\n`;BOARD_CHECKS.forEach((b,i)=>s+=`- [${(r.board||{})[i]?"x":" "}] ${b}\n`);s+=`\n## Calibration ladder\n`;LADDER.forEach(([k,l])=>s+=`- ${l}: ${(LADDER_STATES.find(x=>x[0]===((r.ladder||{})[k]||""))||["","Not started"])[1]}\n`);return s}

/* ---------- DATABASE ---------- */
V.database=()=>`<div class="vhead"><span class="eyebrow">System</span><h1>Database</h1><p>Look inside the studio's own saved data and the Supabase Master Dashboard. Read-only here, like looking through a store window: you can see everything, and changes go through the pages that own them.</p></div>
 <div class="seg"><button type="button" data-dbtab="studio" aria-pressed="${UI.dbTab==="studio"}">Studio data</button><button type="button" data-dbtab="supabase" aria-pressed="${UI.dbTab==="supabase"}">Supabase · Master Dashboard</button></div>
 ${UI.dbTab==="studio"?dbStudio():dbSupa()}`;
function dbStudio(){
  const sizes=Object.entries(ST).map(([k,v])=>[k,JSON.stringify(v).length]);
  return `<div class="grid3">${[["studio/state","Decisions and settings",sizes.reduce((a,b)=>a+b[1],0).toLocaleString()+" bytes"],["queue/*","Guild queue items",QUEUE.length],["log/main","Activity entries",LOG.length],["uplink/*","Uplink threads",UPLINK.length],["files/*","Stored files",FILES.length],["data/users/you","Your private prefs",Object.keys(MINE).length+" fields"]].map(([k,l,n])=>`<section class="panel"><div class="mono note">${k}</div><b style="font-size:22px;font-family:var(--f-display)">${n}</b><div class="note">${l}</div></section>`).join("")}</div>
  <section class="panel"><h2>studio/state <span class="sub">${store.mode==="shared"?"shared":"this browser"}</span></h2>${sizes.map(([k,n])=>`<details><summary><b class="mono">${esc(k)}</b> <span class="note">${n.toLocaleString()} bytes</span></summary><pre class="out">${esc(JSON.stringify(ST[k],null,2))}</pre></details>`).join("")}
   <div class="row" style="margin-top:10px">${dlBtn("dbjson","Download as JSON")}</div></section>`;
}
function dbSupa(){
  if(!CAP.mcp)return `<section class="panel"><p class="note">Open the studio in claude.ai with the Supabase connector to browse the database.</p></section>`;
  if(connOff("supabase"))return `<section class="panel"><p class="note">Supabase is turned off in Settings → Connections.</p></section>`;
  const ts=(UI.dbTables||[]).filter(t=>!UI.dbQ||t.name.includes(UI.dbQ.toLowerCase()));
  const rows=UI.dbRows;
  return `<div class="dbgrid"><section class="panel"><h2>Tables ${UI.dbTables?`<span class="sub">${UI.dbTables.length}</span>`:""}</h2>
    ${UI.dbTables?`<input type="text" id="dbFilter" placeholder="Filter (vw_, thelma_, ec_…)" value="${esc(UI.dbQ)}" style="margin-bottom:8px"><div class="tlist">${ts.map(t=>`<button type="button" data-dbt="${esc(t.name)}" aria-current="${UI.dbTable===t.name}"><span>${esc(t.name.replace(/^public\./,""))}</span><span class="note">${t.rows??""}</span></button>`).join("")}</div>`:`<button type="button" class="btn primary" id="dbLoad" ${UI.dbBusy?"disabled":""}>${UI.dbBusy?"Loading…":"Load tables"}</button>`}</section>
   <section class="panel" style="min-width:0"><h2>${UI.dbTable?esc(UI.dbTable):"Query"} ${rows&&rows.length!=null?`<span class="sub">${rows.length} rows shown</span>`:""}</h2>
    <form id="dbForm" class="row"><input type="text" id="dbSql" value="${esc(UI.dbSql||"")}" placeholder="select * from public.vw_generations order by created_at desc limit 10" style="flex:1;font-family:var(--f-mono)"><button type="submit" class="btn" ${UI.dbBusy?"disabled":""}>Run (read-only)</button></form>
    <div style="margin-top:10px">${UI.dbErr?`<p class="hint">${esc(UI.dbErr)}</p>`:rows?(rows.length?`<div class="tablewrap"><table><tr>${Object.keys(rows[0]).map(k=>`<th>${esc(k)}</th>`).join("")}</tr>${rows.map(r=>`<tr>${Object.values(r).map(v=>`<td><div class="cellv" title="${esc(typeof v==="object"?JSON.stringify(v):v)}">${esc(typeof v==="object"&&v!==null?JSON.stringify(v):v)}</div></td>`).join("")}</tr>`).join("")}</table></div>`:`<div class="empty">No rows.</div>`):`<div class="empty">Pick a table or run a SELECT.</div>`}</div>
    <p class="note">Only one SELECT runs at a time, 50 rows max. Writing to the database happens through the pages and functions that own each table.</p></section></div>`;
}
async function dbRun(sql){
  let s;try{s=safeSelect(sql,50)}catch(e){UI.dbErr=e.message;render();return}
  UI.dbBusy=true;UI.dbErr="";UI.dbSql=s;render();
  try{const r=await CAP.mcp.callTool("Supabase","execute_sql",{project_id:SYSTEM.supabase.ref,query:s},{cache:false});UI.dbRows=sqlRows(r.payload)||[]}
  catch(e){UI.dbErr=mcpErrText(e,"Supabase");UI.dbRows=null}
  UI.dbBusy=false;render();
}
async function dbLoadTables(){
  UI.dbBusy=true;render();
  try{const r=await CAP.mcp.callTool("Supabase","list_tables",{project_id:SYSTEM.supabase.ref,schemas:["public"],verbose:false},{cache:false});const p=r.payload||{};UI.dbTables=(p.tables||[]).map(t=>({name:t.name,rows:t.rows}))}
  catch(e){UI.dbErr=mcpErrText(e,"Supabase")}
  UI.dbBusy=false;render();
}

/* ---------- UPLINK ---------- */
function uplinkAdd(item){
  const body={from:"sire",kind:item.kind||"task",text:String(item.text||"").slice(0,4000),page:UI.view,status:"open",created:nowISO(),by:store.uid||null,reply:"",repliedAt:null};
  if(CAP.db&&!store.readOnly)write(()=>CAP.db.collection("uplink").add(body));else{UPLINK.unshift(Object.assign({id:"l"+Date.now()},body));saveLocal()}
  addLog(`Uplink ${body.kind} for Claude: ${body.text.slice(0,80)}`);refresh();
}
function uplinkSet(id,up){const u=UPLINK.find(x=>x.id===id);if(!u)return;Object.assign(u,up);if(CAP.db&&!store.readOnly)write(()=>CAP.db.doc("uplink/"+id).update(up));refresh()}
async function wakeClaude(){
  const id=(ST.settings.uplink.triggerId||"").trim();
  if(!id||!CAP.mcp){toast("No wake-up task is set yet");return}
  if(connOff("uplink")){toast("The uplink connector is off in Settings → Connections");return}
  const open=UPLINK.filter(u=>u.status==="open");
  try{await CAP.mcp.callTool("Claude Code Remote","fire_trigger",{trigger_id:id,text:`Sire pressed "Wake Claude" in VisionWeaver Studio. ${open.length} open uplink item(s): `+open.slice(0,8).map(u=>`[${u.kind}] ${u.text.slice(0,160)}`).join(" | ")},{cache:false});toast("Claude is waking up to work the uplink");addLog("Woke Claude to work the uplink")}
  catch(e){toast(mcpErrText(e,"Claude Code Remote"))}
}
V.uplink=()=>{
  const desk=ST.claudeDesk;const open=UPLINK.filter(u=>u.status!=="done");const done=UPLINK.filter(u=>u.status==="done");
  const th=u=>`<div class="thread ${u.status==="open"?"open":""}"><div class="row"><span class="from">${u.from==="claude"?"Claude":"Sire"} · ${esc(u.kind)} · ${when(u.created)} · from ${esc(u.page||"")}</span><span style="margin-left:auto">${pill(u.status==="open"?"you":u.status==="working"?"wait":u.status==="answered"?"done":"idle",u.status)}</span></div><div style="white-space:pre-wrap">${esc(u.text)}</div>${u.reply?`<div class="reply"><b>Claude:</b> ${esc(u.reply)}${u.repliedAt?`<div class="note">${when(u.repliedAt)}</div>`:""}</div>`:""}${store.readOnly?"":`<div class="row">${u.status!=="done"?`<button type="button" class="btn small" data-upst="${u.id}" data-s="done">Mark done</button>`:`<button type="button" class="btn small" data-upst="${u.id}" data-s="open">Reopen</button>`}</div>`}</div>`;
  return `<div class="vhead"><span class="eyebrow">Intelligence</span><h1>Claude uplink</h1><p>Your direct line to Claude inside the studio. Leave a task, question, idea or bug report. Claude reads this inbox from its side, answers here, and does the outside work: building features, pushing to GitHub, research, and republishing this studio. Like a walkie-talkie to the editing bay.</p></div>
  <div class="grid2">
   <form class="panel" id="upForm"><h2>New message to Claude</h2>
    <div class="seg" style="margin-bottom:8px">${[["task","Task"],["question","Question"],["idea","Idea"],["bug","Something's broken"]].map(([v,l])=>`<button type="button" data-upkind="${v}" aria-pressed="${(UI.upKind||"task")===v}">${l}</button>`).join("")}</div>
    <textarea id="upText" rows="5" placeholder="e.g. Add a page for PART 3 location scouting…" ${store.readOnly?"disabled":""}></textarea>
    <div class="row" style="margin-top:8px"><button type="submit" class="btn primary" ${store.readOnly?"disabled":""}>Send to Claude</button>${ST.settings.uplink.triggerId&&CAP.mcp?`<button type="button" class="btn" id="wakeClaude">Wake Claude now</button>`:""}<span class="note">${ST.settings.uplink.triggerId?"":"Tip: tell Claude in chat \"check the uplink\"."}</span></div></form>
   <section class="panel"><h2>Claude's desk</h2>${desk&&desk.text?`<div style="white-space:pre-wrap">${esc(desk.text)}</div><p class="note">Updated ${when(desk.at)}</p>`:`<div class="empty">Claude posts what it's working on here.</div>`}
    <dl class="kv" style="margin-top:10px"><dt>Open</dt><dd>${UPLINK.filter(u=>u.status==="open").length}</dd><dt>Working</dt><dd>${UPLINK.filter(u=>u.status==="working").length}</dd><dt>Answered</dt><dd>${UPLINK.filter(u=>u.status==="answered").length}</dd><dt>Done</dt><dd>${done.length}</dd></dl></section>
  </div>
  <section class="panel"><h2>Threads</h2><div style="display:grid;gap:10px">${open.length?open.map(th).join(""):`<div class="empty">No open messages.</div>`}</div>
   ${done.length?`<details style="margin-top:12px"><summary>${done.length} done</summary><div style="display:grid;gap:10px;margin-top:10px">${done.map(th).join("")}</div></details>`:""}</section>`;
};

/* ---------- ACTIVITY ---------- */
V.activity=()=>{const q=UI.logQ.toLowerCase();const rows=LOG.filter(l=>!q||l.text.toLowerCase().includes(q));
  return `<div class="vhead"><span class="eyebrow">System</span><h1>Activity log</h1><p>Every decision and change, newest first, with who and when. The studio's flight recorder.</p></div>
  <section class="panel"><div class="row" style="margin-bottom:10px"><input type="text" id="logQ" placeholder="Filter: approved, PART 2, THELMA, uplink…" value="${esc(UI.logQ)}" style="flex:1"> ${dlBtn("logcsv","Download CSV")}</div>
  ${rows.length?`<ul class="feed">${rows.map(l=>`<li><time>${when(l.at)}</time><span>${esc(l.text)} · ${who(l.by)}</span></li>`).join("")}</ul>`:`<div class="empty">Nothing yet.</div>`}</section>`};

/* ---------- RIGHTS & PROVENANCE ---------- */
V.rights=()=>{const p=UI.rightsPart;const r=ST.rights[p]||{};const n=RIGHTS.filter(x=>r[x[0]]).length;
  return `<div class="vhead"><span class="eyebrow">System</span><h1>Rights & provenance</h1><p>The safety checks every PART passes before Gate 2. Platforms scan audio, faces and logos; this list keeps a PART from being muted, pulled or disputed.</p></div>
  <section class="panel"><div class="row"><div class="seg">${PARTS.map(x=>`<button type="button" data-rpart="${x.n}" aria-pressed="${p==x.n}">PART ${x.n}</button>`).join("")}</div><span class="note">${n} of ${RIGHTS.length} checked for PART ${p}</span></div>
   <div class="bar2" style="margin:10px 0"><i style="width:${n/RIGHTS.length*100}%"></i></div>
   <ul class="checks">${RIGHTS.map(([k,l])=>`<li><label class="switch"><input type="checkbox" data-right="${k}" ${r[k]?"checked":""} ${store.readOnly?"disabled":""}> ${esc(l)}</label>${r[k]&&r[k].at?`<span class="note">· ${when(r[k].at)} ${who(r[k].by)}</span>`:""}</li>`).join("")}</ul></section>`};

/* ---------- after render + events ---------- */
function afterRender(){
  if(UI.view==="thelma"||!$("#drawer").hidden)renderChat();
  if(UI.view==="settings"&&UI.setTab==="system"&&!UI.perms&&!UI.permsLoading){UI.permsLoading=true;(async()=>{try{const p=CAP.perms||(window.claude&&await window.claude.use("permissions"));UI.perms=p?await p.state():{"(not in claude.ai)":"unavailable"}}catch(e){UI.perms={"(unavailable)":"unavailable"}}UI.permsLoading=false;if(UI.view==="settings")render()})()}
  const ri=$("#restoreIn");if(ri)ri.onchange=e=>restoreFrom(e.target.files[0]);
  const ai=$("#avRefIn");if(ai)ai.onchange=e=>uploadRefs(e.target.files);
}
async function uploadRefs(files){
  if(!CAP.assets)return;const code=UI.castSel;const refs=(avRec(code).refs||[]).slice();
  for(const f of files){try{const r=await CAP.assets.upload(f);refs.push({id:r.id,name:f.name,at:nowISO()})}catch(e){toast(e&&e.code==="too_large"?`${f.name} is over 20 MB`:e&&e.code==="unsupported_type"?`${f.name}: that file type can't be stored`:`Couldn't store ${f.name}`)}}
  patch({avatars:{[code]:{refs}}},`Added ${files.length} reference photo(s) to ${code}`);
}
async function restoreFrom(file){
  if(!file)return;let data;try{data=JSON.parse(await file.text())}catch(e){toast("That isn't a studio backup file");return}
  if(!data||data.system!==SYSTEM.id||!data.state){toast("That file isn't a VisionWeaver backup");return}
  if(!confirm(`Restore decisions and settings from the backup made ${data.exported}? This changes the studio for everyone.`))return;
  const s=data.state;patch({p2:s.p2||{},recorded:s.recorded||{},deliver:s.deliver||{},setup:s.setup||{},shot:s.shot||{},schedule:s.schedule||{},notes:s.notes||{},settings:s.settings||{},avatars:s.avatars||{},rights:s.rights||{}},`Restored from backup (${String(data.exported).slice(0,10)})`);
}
const _fileFor=fileFor;
fileFor=function(id){
  if(id==="dbjson")return ["VisionWeaver_studio_state.json",JSON.stringify(ST,null,2)];
  if(id==="logcsv"){const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;return ["VisionWeaver_activity.csv","when,who,what\n"+LOG.map(l=>[l.at,l.by||"",l.text].map(q).join(",")).join("\n")]}
  return _fileFor(id);
};
document.addEventListener("click",e=>{
  const t=e.target,c=s=>t.closest(s);let el;
  if((el=c("[data-settab]"))){UI.setTab=el.dataset.settab;render();return}
  if((el=c("[data-app]"))){setApp(el.dataset.app,el.dataset.v);render();return}
  if((el=c("[data-outseg]"))){patch({settings:{output:{[el.dataset.outseg]:el.dataset.v}}});return}
  if((el=c("[data-out]"))){const k=el.dataset.out,doc=($("#outDoc")||{}).value||"status";UI.outDoc=doc;
    if(k==="download"){const d=docFor(doc);saveFile(d[0],d[1])}else if(k==="drive")driveSend(doc);else if(k==="email")emailOut(doc);else if(k==="copyemail"){const d=docFor(doc);copy(`To: ${MINE.recipients||""}\nSubject: ${(ST.settings.output.emailPrefix||"")} ${d[0]}\n\n${d[1]}`,"Email text copied")}
    else if(k==="print")printPage();else if(k==="printable")saveFile(`VisionWeaver_${UI.view}_print.html`,printableHTML());else if(k==="backupdl"){const d=docFor("backup");saveFile(d[0],d[1])}else if(k==="backupdrive")driveSend("backup");return}
  if(t.id==="permAsk"){(async()=>{try{const p=CAP.perms||await window.claude.use("permissions");UI.perms=await p.request()}catch(e){}render()})();return}
  if(t.id==="resetLook"){Object.assign(APP,{theme:"auto",accent:"tungsten",scale:100,density:"comfortable",motion:"full",rail:"full"});setApp("theme","auto");render();return}
  if(t.id==="assetUsage"){(async()=>{try{UI.usage=(await CAP.assets.list()).usage}catch(e){toast("Couldn't read storage")}render()})();return}
  if((el=c("[data-cast]"))){UI.castSel=el.dataset.cast;render();return}
  if((el=c("[data-copy]"))){copy(el.dataset.copy,"Copied");return}
  if((el=c("[data-avreview]"))){const k=el.dataset.avreview;const r=avRec(k);patch({avatars:{[k]:{reviewed:r.reviewed?null:{at:nowISO(),by:store.uid||null}}}},r.reviewed?`Reopened review of ${k}`:`Reviewed ${k}`);return}
  if((el=c("[data-askcast]"))){openAsk(`Check ${el.dataset.askcast}: use get_character, then tell me what's missing from the lock record, the 360 board check and the Localized Avatar + Historical Space profile, and what could break continuity.`);return}
  if((el=c("[data-avexport]"))){const k=el.dataset.avexport;saveFile(`${k}_character_card.md`,characterCard(k));return}
  if((el=c("[data-dbtab]"))){UI.dbTab=el.dataset.dbtab;render();return}
  if(t.id==="dbLoad"){dbLoadTables();return}
  if((el=c("[data-dbt]"))){UI.dbTable=el.dataset.dbt;dbRun(`select * from ${UI.dbTable} limit 25`);return}
  if((el=c("[data-upkind]"))){UI.upKind=el.dataset.upkind;render();return}
  if((el=c("[data-upst]"))){uplinkSet(el.dataset.upst,{status:el.dataset.s});return}
  if(t.id==="wakeClaude"){wakeClaude();return}
  if((el=c("[data-rpart]"))){UI.rightsPart=el.dataset.rpart;render();return}
});
document.addEventListener("change",e=>{
  const t=e.target;
  if(t.dataset.apprange){setApp(t.dataset.apprange,+t.value);render();return}
  if(t.dataset.outset){patch({settings:{output:{[t.dataset.outset]:t.value.trim()}}},"Output setting changed");return}
  if(t.id==="recips"){savePrivate({recipients:t.value.trim()});toast("Recipients saved (private to you)");return}
  if(t.dataset.upset){patch({settings:{uplink:{[t.dataset.upset]:t.value.trim()}}},"Uplink wake-up task set");return}
  if(t.dataset.connoff){const k=t.dataset.connoff;patch({settings:{connections:{[k]:{off:!t.checked}}}},`${(CONNECTORS.find(x=>x[0]===k)||[k,k])[1]} ${t.checked?"allowed":"turned off"} for this page`);return}
  if(t.dataset.avboard!=null&&t.dataset.avboard!==undefined&&t.hasAttribute("data-avboard")){const code=UI.castSel;patch({avatars:{[code]:{board:{[t.dataset.avboard]:t.checked}}}});return}
  if(t.dataset.avladder){const code=UI.castSel;patch({avatars:{[code]:{ladder:{[t.dataset.avladder]:t.value}}}},`${code}: ${LADDER.find(x=>x[0]===t.dataset.avladder)[1]} → ${(LADDER_STATES.find(x=>x[0]===t.value)||["","Not started"])[1]}`);return}
  if(t.dataset.right){const p=UI.rightsPart,k=t.dataset.right;patch({rights:{[p]:{[k]:t.checked?{at:nowISO(),by:store.uid||null}:null}}},`PART ${p} rights: ${RIGHTS.find(x=>x[0]===k)[1]} ${t.checked?"checked":"unchecked"}`);return}
  if(t.id==="outDoc"){UI.outDoc=t.value;return}
});
document.addEventListener("input",e=>{
  const t=e.target;
  if(t.id==="castQ"){UI.castQ=t.value;const pos=t.selectionStart;render();const n=$("#castQ");if(n){n.focus();n.setSelectionRange(pos,pos)}return}
  if(t.id==="dbFilter"){UI.dbQ=t.value;const pos=t.selectionStart;render();const n=$("#dbFilter");if(n){n.focus();n.setSelectionRange(pos,pos)}return}
  if(t.id==="logQ"){UI.logQ=t.value;const pos=t.selectionStart;render();const n=$("#logQ");if(n){n.focus();n.setSelectionRange(pos,pos)}return}
});
document.addEventListener("submit",e=>{
  const f=e.target;
  if(f.id==="avForm"){e.preventDefault();const code=UI.castSel;const lock={},lahs={};f.querySelectorAll("[data-av]").forEach(x=>lock[x.dataset.av]=x.value.trim());f.querySelectorAll("[data-lahs]").forEach(x=>lahs[x.dataset.lahs]=x.value.trim());patch({avatars:{[code]:{lock,lahs,savedAt:nowISO(),savedBy:store.uid||null}}},`Saved the lock record for ${code}`);toast("Saved");return}
  if(f.id==="dbForm"){e.preventDefault();UI.dbTable=null;dbRun($("#dbSql").value);return}
  if(f.id==="upForm"){e.preventDefault();const v=$("#upText").value.trim();if(!v){toast("Write the message first");return}uplinkAdd({kind:UI.upKind||"task",text:v});toast("Sent to Claude");return}
});
