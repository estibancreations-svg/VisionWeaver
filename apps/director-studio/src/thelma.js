/* ================= THELMA AI: assistant, tools, guide bar, voice, palette ================= */
const THELMA = {chat:[], busy:false, ops:null, opsBusy:false};
let askCtl=null;
function thelmaChrome(){
  const on=TH().enabled;
  $("#askOpen").hidden=!on;
  if(!on&&!$("#drawer").hidden)$("#drawer").hidden=true;
}
function guideBar(){
  if(!TH().enabled||!TH().guide)return "";
  const g=GUIDE[UI.view];if(!g)return "";
  let next=g[1];
  if(UI.view==="overview"){const w=waiting()[0];if(w)next=w.t}
  if(UI.view==="pictures"){const n=Object.values(ST.p2).filter(v=>v==="pending").length;next=n?`${n} PART 2 frames are waiting on your pick.`:"Every PART 2 frame has a decision."}
  if(UI.view==="booth"){const c=CUES.find(x=>!ST.recorded[x[0]]);next=c?`Record ${c[0]} (PART ${c[1]}).`:"All narration is recorded."}
  if(UI.view==="cast"){const c=CAST.find(x=>x[3]==="wait"&&!(ST.avatars[x[0]]&&ST.avatars[x[0]].reviewed));next=c?`Review ${c[1]}.`:"Every character is reviewed."}
  return `<div class="guide" role="note"><span class="orb"></span><b>THELMA guide</b><span>${esc(g[0])}</span><span class="next">Next: ${esc(next)}</span><span class="gx">${CAP.sample?`<button type="button" class="btn small" data-askpage="1">Ask about this page</button>`:""}<button type="button" class="btn small" id="guideOff" title="Turn the guide off (Settings → THELMA turns it back on)">Hide guide</button></span></div>`;
}

/* ---------- context + tools ---------- */
function thelmaContext(){
  const p2=Object.entries(ST.p2).map(([k,v])=>`${k}:${v}`).join(", ");
  const rec=CUES.filter(c=>ST.recorded[c[0]]).map(c=>c[0]).join(", ")||"none";
  const q=QUEUE.filter(x=>x.status==="pending").map(x=>`[${x.dept}] ${x.title}`).join("; ")||"none";
  const live=ST.live&&ST.live.at?`Live check ${ST.live.at}: `+["runway","supabase","zapier","github"].map(k=>`${k} ${ST.live[k]?(ST.live[k].ok?"ok · "+ST.live[k].text:"failed · "+ST.live[k].text):"not run"}`).join("; "):"Live check not run yet.";
  return `${THELMA_RULES}

STUDIO RECORDS (${new Date().toISOString().slice(0,10)}):
- Runway ${fmt((ST.live&&ST.live.runway&&ST.live.runway.credits)||BALANCE)} credits (Pro). Rates: key frame 20; Gen-4.5 video 12/sec; speech ~1 per 50 letters; effects 1/sec; music clip 4. PART 1 cost 1,208. Planned: P2 1,900–2,500, P3 4,000–5,000, P4 2,500–3,000, P5 2,000–2,700.
- PARTS: ${PARTS.map(p=>`${p.n} "${p.name}" (${DATA_SHOTS[p.n].length} shots; ${p.where})`).join(" | ")}
- PART 1 finished (13 clips, 11 sounds); Sire assembles in CapCut. PART 2 key frames: ${p2}.
- Narration: 25 cues, Sire's own voice, 981 words. Recorded: ${rec}.
- Guild queue pending: ${q}.
- Cast: ${CAST.map(c=>`${c[0]} ${c[1]} (${c[3]==="wait"?"needs check":"ok"})`).join("; ")}.
- ${live}
- Connections: Runway, Zapier (YouTube, Instagram, Drive), Supabase, GitHub, Google Drive. TikTok not connected.
- Current page: ${UI.view}${UI.view==="shots"&&UI.shotSel?` (shot E01-P${UI.shotPart}-${UI.shotSel})`:""}${UI.view==="cast"?` (character ${UI.castSel})`:""}.
Pages you can open: ${Object.keys(V).join(", ")}.`;
}
function thelmaTools(){
  const T=[
    {name:"studio_status",description:"Current state of the studio: what is waiting on Sire, PART status, queue, credits, connection check.",execute:()=>({waiting:waiting().map(w=>w.t),parts_finished:partsDone(),p2_pending:Object.entries(ST.p2).filter(([k,v])=>v==="pending").map(([k])=>k),narration_recorded:CUES.filter(c=>ST.recorded[c[0]]).length,queue_pending:QUEUE.filter(x=>x.status==="pending").length,live:ST.live||null,uplink_open:UPLINK.filter(u=>u.status==="open").length})},
    {name:"open_page",description:"Open a page of the studio for Sire. Use when he asks to go somewhere or when showing him is clearer.",inputSchema:{type:"object",properties:{page:{type:"string",enum:Object.keys(V)}},required:["page"]},execute:i=>{if(!V[i.page])throw new Error("No such page");go(i.page);return {opened:i.page}}},
    {name:"search_records",description:"Search shots, frames, stills, narration cues, sounds, faces, lights and plates.",inputSchema:{type:"object",properties:{query:{type:"string"}},required:["query"]},execute:i=>{const q=String(i.query||"").toLowerCase();return searchIndex().filter(x=>x.hay.toLowerCase().includes(q)).slice(0,10).map(x=>({key:x.k,title:x.t,detail:x.s}))}},
    {name:"get_shot",description:"Read one shot's full recipe, status and note.",inputSchema:{type:"object",properties:{part:{type:"integer",minimum:1,maximum:5},shot:{type:"string",description:"e.g. S07 or S13a"}},required:["part","shot"]},execute:i=>{const p=+i.part,s=(DATA_SHOTS[p]||[]).find(x=>x.id.toLowerCase()===String(i.shot).toLowerCase());if(!s)throw new Error("Shot not found");return Object.assign({},s,{status:STATUS_LBL[shotStatus(p,s.id)][1],note:ST.notes[`P${p}-${s.id}`]||""})}},
    {name:"get_character",description:"Read a character's lock record, checks and Localized Avatar profile by code (e.g. FL-MR32) or name.",inputSchema:{type:"object",properties:{who:{type:"string"}},required:["who"]},execute:i=>{const w=String(i.who).toLowerCase();const c=CAST.find(x=>x[0].toLowerCase()===w||x[1].toLowerCase().includes(w));if(!c)throw new Error("Character not found");return {code:c[0],name:c[1],board:c[2],status:c[3],note:c[4],record:ST.avatars[c[0]]||{}}}},
    {name:"list_queue",description:"List Guild queue items, optionally by status (pending, approved, changes).",inputSchema:{type:"object",properties:{status:{type:"string"}}},execute:i=>QUEUE.filter(x=>!i.status||x.status===i.status).slice(0,20).map(x=>({dept:x.dept,title:x.title,status:x.status,detail:x.detail}))},
    {name:"propose_decision",description:"Put a proposal in the Guild queue for Sire to approve or send back. Use for anything that needs his approval. You never approve it yourself.",inputSchema:{type:"object",properties:{department:{type:"string",enum:DEPTS},title:{type:"string"},detail:{type:"string"},part:{type:"string"},page:{type:"string"}},required:["department","title"]},execute:i=>{if(store.readOnly)throw new Error("This viewer can't add to the queue");qAdd({dept:DEPTS.includes(i.department)?i.department:"Automation",title:"THELMA proposes: "+String(i.title).slice(0,140),detail:String(i.detail||"").slice(0,600),part:String(i.part||""),go:V[i.page]?i.page:"guild"});return {queued:true,note:"Waiting for Sire in the Guild queue"}}}
  ];
  if(CAP.mcp){
    T.push({name:"check_connections",description:"Run the live connection check (Runway, Supabase, Zapier, GitHub). Read-only.",execute:async()=>{await liveCheck();return ST.live}});
    T.push({name:"read_database",description:"Run ONE read-only SELECT on the Supabase Master Dashboard (e.g. thelma_alerts, ec_connectors, vw_generations, production_log). Always add LIMIT 20 or less.",inputSchema:{type:"object",properties:{sql:{type:"string"}},required:["sql"]},execute:async(i,ctx)=>{const sql=safeSelect(i.sql,20);const r=await CAP.mcp.callTool("Supabase","execute_sql",{project_id:SYSTEM.supabase.ref,query:sql},{cache:false,signal:ctx&&ctx.signal});const rows=sqlRows(r.payload)||[];const out=JSON.stringify(rows);return out.length>12000?{rows:rows.slice(0,5),note:"trimmed"}:{rows}}});
  }
  T.push({name:"note_to_claude",description:"Leave a note or task for Claude in the Claude uplink (for work outside this page: building, pushing to GitHub, research).",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"]},execute:i=>{uplinkAdd({kind:"task",text:"(from THELMA) "+String(i.text).slice(0,1500)});return {sent:true}}});
  return T;
}
function safeSelect(sql,max){
  let s=String(sql||"").trim().replace(/;+\s*$/,"");
  if(!/^(select|with)\b/i.test(s)||/;/.test(s))throw new Error("Only one SELECT is allowed");
  if(/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|execute|pg_read|pg_ls|lo_import|set\s+role)\b/i.test(s))throw new Error("Read-only: that word isn't allowed here");
  if(!/\blimit\s+\d+\s*$/i.test(s))s+=" limit "+max;
  return s;
}

/* ---------- chat ---------- */
function speakable(t){return String(t||"").replace(/[#*_`>|]/g,"").replace(/\n{2,}/g,". ").slice(0,4000)}
function speak(t){try{const ss=window.speechSynthesis;if(!ss){toast("Read-aloud isn't available in this browser");return}ss.cancel();const u=new SpeechSynthesisUtterance(speakable(t));const v=ss.getVoices().find(v=>/en-US/i.test(v.lang)&&/female|samantha|aria|jenny|zira/i.test(v.name))||ss.getVoices().find(v=>/^en/i.test(v.lang));if(v)u.voice=v;u.rate=1;ss.speak(u)}catch(e){toast("Read-aloud isn't available here")}}
function chatHTML(){
  if(!THELMA.chat.length)return `<div class="note">${CAP.sample?"THELMA is ready. Ask what to do next, where something is, what a shot needs, or what something will cost. She can open pages, search the records and put proposals in your queue. She never approves anything.":"THELMA needs Claude to be available on this page. Open the studio inside claude.ai to talk with her. The guide bar still works everywhere."}</div>`;
  return THELMA.chat.map((m,i)=>m.role==="user"?`<div class="bubble me">${esc(m.content)}</div>`:m.role==="tool"?`<div class="bubble tool">⚙ ${esc(m.content)}</div>`:`<div class="bubble ai"><span class="who">THELMA${m.tier?` · ${esc(m.tier)}`:""}</span>${esc(m.content)}${m.done?`<div class="acts"><button type="button" class="btn small" data-speak="${i}">🔊 Read to me</button><button type="button" class="btn small" data-copymsg="${i}">Copy</button></div>`:""}</div>`).join("");
}
function renderChat(){const html=chatHTML();[$("#chat"),$("#thChat")].forEach(c=>{if(c){c.innerHTML=html;c.scrollTop=c.scrollHeight}});$("#askOpen").querySelector(".orb")&&$("#askOpen").querySelector(".orb").classList.toggle("busy",THELMA.busy)}
function saveChat(){if(!(CAP.db&&store.uid&&!store.readOnly))return;MINE.thelmaChat=THELMA.chat.filter(m=>m.role!=="tool").slice(-30).map(m=>({role:m.role,content:String(m.content).slice(0,4000),done:!!m.done}));write(()=>CAP.db.doc("data/users/"+store.uid+"/prefs").set(MINE))}
async function ask(text){
  text=String(text||"").trim();if(!text)return;
  if(!TH().enabled){toast("THELMA is off");return}
  if(!CAP.sample){THELMA.chat.push({role:"user",content:text},{role:"assistant",content:"I can't think on this page right now: Claude isn't available here. Open the studio inside claude.ai.",done:true});renderChat();return}
  if(THELMA.busy)return;
  const wantsVoice=/\b(tell me|read (it )?to me|explain (it )?out loud|say it|read it)\b/i.test(text)||TH().autoRead;
  THELMA.chat.push({role:"user",content:text});const ai={role:"assistant",content:"Thinking…",tier:TH().tier};THELMA.chat.push(ai);THELMA.busy=true;renderChat();
  const hist=THELMA.chat.filter(m=>m.role!=="tool"&&m!==ai).slice(-12).map(m=>({role:m.role,content:m.content}));
  const turns=[{role:"user",content:thelmaContext()},{role:"assistant",content:"Understood, Sire. I'll work from these records and propose, never approve."},...hist];
  askCtl=new AbortController();$("#askStop").hidden=false;$("#askSend").disabled=true;
  const tools=thelmaTools().map(t=>Object.assign({},t,{execute:async(inp,ctx)=>{THELMA.chat.splice(THELMA.chat.indexOf(ai),0,{role:"tool",content:`${t.name} ${JSON.stringify(inp||{}).slice(0,120)}`});renderChat();return await t.execute(inp||{},ctx)}}));
  let lim=null;try{lim=await CAP.sample.limits()}catch(e){}
  const useTools=lim&&lim.tools?tools.slice(0,lim.tools.maxCount):undefined;
  try{const r=await CAP.sample(turns,{signal:askCtl.signal,cache:false,modelTier:TH().tier,tools:useTools,onText:({text})=>{ai.content=text;renderChat()}});ai.content=r.text;ai.done=true;if(r.truncated)ai.content+="\n\n(Answer was cut short.)"}
  catch(e){ai.content=(e&&e.text)||(e&&e.code==="cancelled"?"Stopped.":e&&e.code==="rate_limited"?"Too many questions at once. Wait a minute and ask again.":e&&e.code==="not_granted"?"Asking Claude isn't allowed from this page for you.":e&&e.code==="tools_unavailable"?"My tools aren't available in this view. Ask again and I'll answer from the records only.":"That didn't go through. Try asking again.");ai.done=true}
  THELMA.busy=false;askCtl=null;$("#askStop").hidden=true;$("#askSend").disabled=false;renderChat();saveChat();
  if(wantsVoice&&ai.done)speak(ai.content);
}
function openAsk(prefill){
  if(!TH().enabled){go("settings");UI.setTab="thelma";render();return}
  $("#drawer").hidden=false;
  const chips=["What should I do next?","What will PART 2 cost to animate?","Which characters still need checks?","Check all connections","Explain the two gates simply"];
  $("#askChips").innerHTML=chips.map(c=>`<button type="button" class="chip" data-askchip="${esc(c)}">${esc(c)}</button>`).join("");
  renderChat();if(prefill)$("#askIn").value=prefill;$("#askIn").focus();
}
async function loadThelmaOps(){
  if(!CAP.mcp||THELMA.opsBusy)return;THELMA.opsBusy=true;render();
  const q="select (select count(*) from thelma_alerts) as alerts, (select count(*) from thelma_alerts where resolved_at is null) as open_alerts, (select count(*) from thelma_approval_requests) as approvals, (select count(*) from thelma_approval_requests where decided_at is null) as undecided, (select json_agg(a) from (select severity,title,state,system_key,created_at from thelma_alerts where resolved_at is null order by created_at desc limit 6) a) as latest";
  try{const r=await CAP.mcp.callTool("Supabase","execute_sql",{project_id:SYSTEM.supabase.ref,query:q},{cache:false});THELMA.ops=(sqlRows(r.payload)||[])[0]||{err:"Couldn't read the answer"}}
  catch(e){THELMA.ops={err:mcpErrText(e,"Supabase")}}
  THELMA.opsBusy=false;render();
}
V.thelma=()=>{
  const t=TH(),o=THELMA.ops;
  const lat=o&&o.latest?(typeof o.latest==="string"?JSON.parse(o.latest):o.latest):[];
  return `<div class="vhead"><span class="eyebrow">Intelligence</span><h1><span class="orb big"></span> THELMA AI</h1><p>Your studio assistant. She reads everything on this page, opens pages, searches the records, reads the database, and puts proposals in your Guild queue. Think of her as a first assistant director: she runs the floor, but the director calls "action."</p></div>
  <div class="th-layout">
   <section class="panel"><h2>Talk with THELMA <span class="sub">${CAP.sample?"answers use your Claude usage":"open in claude.ai to talk"}</span></h2>
    <div class="th-chat" id="thChat"></div>
    <form id="thForm" class="row" style="margin-top:10px"><input type="text" id="thIn" placeholder="Ask THELMA…  (say &quot;tell me&quot; to hear the answer)" style="flex:1" ${CAP.sample?"":"disabled"}><button type="submit" class="btn primary" ${CAP.sample?"":"disabled"}>Ask</button><button type="button" class="btn" id="thClear">New conversation</button></form>
    <div class="chips" style="margin-top:8px">${["Walk me through today's work","What's blocking PART 2?","Check all connections","Which characters need review?","Read the latest THELMA alerts","Leave Claude a note to add a feature"].map(c=>`<button type="button" class="chip" data-askchip="${esc(c)}">${esc(c)}</button>`).join("")}</div>
   </section>
   <div style="display:grid;gap:18px">
    <section class="panel"><h2>Controls</h2>
     <label class="switch"><input type="checkbox" data-thset="enabled" ${t.enabled?"checked":""}> THELMA on</label><br>
     <label class="switch" style="margin-top:8px"><input type="checkbox" data-thset="guide" ${t.guide?"checked":""}> Guide bar on every page</label><br>
     <label class="switch" style="margin-top:8px"><input type="checkbox" data-thset="autoRead" ${t.autoRead?"checked":""}> Read every answer out loud</label>
     <label class="f" style="margin-top:10px">Thinking depth<select data-thset="tier">${[["quick","Quick (fast, simple questions)"],["default","Standard"],["complex","Deep (planning, hard problems)"]].map(([v,l])=>`<option value="${v}" ${t.tier===v?"selected":""}>${l}</option>`).join("")}</select></label>
     <p class="note" style="margin:10px 0 0">Authority: <b>propose only</b>. Anything that spends credits, publishes, deletes or changes a connection goes to your Guild queue first.</p>
    </section>
    <section class="panel"><h2>Specialists</h2><table>${SPECIALISTS.map(s=>`<tr><td><b>${esc(s[0])}</b></td><td class="note">${esc(s[1])} · ${esc(s[2])}</td></tr>`).join("")}</table></section>
    <section class="panel"><h2>THELMA operations <span class="sub">Supabase · live</span></h2>
     ${CAP.mcp?`<button type="button" class="btn small" id="thOps" ${THELMA.opsBusy?"disabled":""}>${THELMA.opsBusy?"Reading…":o?"Refresh":"Load alerts and approvals"}</button>`:`<p class="note">Opens in claude.ai with Supabase connected.</p>`}
     ${o?(o.err?`<p class="note">${esc(o.err)}</p>`:`<dl class="kv" style="margin-top:10px"><dt>Open alerts</dt><dd><b>${esc(o.open_alerts)}</b> of ${esc(o.alerts)}</dd><dt>Undecided approvals</dt><dd><b>${esc(o.undecided)}</b> of ${esc(o.approvals)}</dd></dl>${(lat||[]).length?`<table style="margin-top:8px">${lat.map(a=>`<tr><td>${pill(/high|crit/i.test(a.severity)?"block":/med/i.test(a.severity)?"wait":"idle",a.severity||"—")}</td><td>${esc(a.title)}<div class="note">${esc(a.system_key||"")} · ${esc(a.state||"")}</div></td></tr>`).join("")}</table>`:""}`):""}
     <p class="note">THELMA's server brain (the <span class="mono">thelma-ai</span> function) only answers the CEO Dashboard's web address, so this page talks to her through Claude instead and reads her tables directly.</p>
    </section>
   </div>
  </div>`;
};

/* ---------- command palette ---------- */
let PAL={items:[],i:0};
function palItems(q){
  q=q.trim().toLowerCase();
  const views=NAV.flatMap(([h,items])=>items.map(([v,l])=>({k:"Go to",t:l,run:()=>go(v)})));
  const acts=[
    {k:"Action",t:TH().enabled?"Turn THELMA off":"Turn THELMA on",run:()=>patch({settings:{thelma:{enabled:!TH().enabled}}},`THELMA turned ${TH().enabled?"off":"on"}`)},
    {k:"Action",t:TH().guide?"Hide the guide bar":"Show the guide bar",run:()=>patch({settings:{thelma:{guide:!TH().guide}}})},
    {k:"Action",t:"Ask THELMA…",run:()=>openAsk()},
    {k:"Action",t:"Change the look (next theme)",run:()=>$("#themeBtn").click()},
    {k:"Action",t:"Check all connections now",run:()=>{go("setup");liveCheck()}},
    {k:"Action",t:"Print this page",run:()=>printPage()},
    {k:"Action",t:"Download a full studio backup",run:()=>saveFile(`VisionWeaver_backup_${new Date().toISOString().slice(0,10)}.json`,backupJSON())},
    {k:"Action",t:"Leave Claude a note (uplink)",run:()=>{go("uplink");setTimeout(()=>{const n=$("#upText");if(n)n.focus()},50)}},
    ...THEMES.map(([v,l])=>({k:"Look",t:l,run:()=>{setApp("theme",v);render()}}))
  ];
  let all=[...views,...acts];
  if(q){all=all.filter(x=>(x.k+" "+x.t).toLowerCase().includes(q));if(q.length>1){SIDX=SIDX||searchIndex();all=all.concat(SIDX.filter(x=>x.hay.toLowerCase().includes(q)).slice(0,8).map(h=>({k:h.k,t:h.t,run:h.go})))}}
  return all.slice(0,40);
}
function openPalette(){const p=$("#palette");p.hidden=false;const i=$("#pq");i.value="";PAL.i=0;drawPalette();i.focus()}
function closePalette(){const p=$("#palette");if(p)p.hidden=true}
function drawPalette(){PAL.items=palItems($("#pq").value);$("#plist").innerHTML=PAL.items.map((x,i)=>`<button type="button" data-pal="${i}" class="${i===PAL.i?"on":""}"><span class="k">${esc(x.k)}</span><span>${esc(x.t)}</span></button>`).join("")||`<div class="note" style="padding:12px">Nothing matches.</div>`}
function runPal(i){const x=PAL.items[i];closePalette();if(x)x.run()}

/* ---------- shared v7 events ---------- */
document.addEventListener("click",e=>{
  const t=e.target,c=s=>t.closest(s);let el;
  if(t.id==="paletteBtn"){openPalette();return}
  if(t.id==="palette"){closePalette();return}
  if((el=c("[data-pal]"))){runPal(+el.dataset.pal);return}
  if(t.id==="guideOff"){patch({settings:{thelma:{guide:false}}},"Guide bar hidden");toast("Guide hidden. Settings → THELMA brings it back.");return}
  if((el=c("[data-askpage]"))){openAsk(`I'm on the ${UI.view} page. What is it for, and what should I do here right now?`);return}
  if(t.id==="thFull"){$("#drawer").hidden=true;go("thelma");return}
  if(t.id==="thClear"){THELMA.chat=[];renderChat();saveChat();return}
  if(t.id==="thOps"){loadThelmaOps();return}
  if(t.id==="thSpeakLast"){const m=[...THELMA.chat].reverse().find(x=>x.role==="assistant"&&x.done);if(m)speak(m.content);else toast("Nothing to read yet");return}
  if((el=c("[data-speak]"))){speak(THELMA.chat[+el.dataset.speak].content);return}
  if((el=c("[data-copymsg]"))){copy(THELMA.chat[+el.dataset.copymsg].content,"Answer copied");return}
});
document.addEventListener("change",e=>{
  const t=e.target;
  if(t.dataset.thset){const k=t.dataset.thset;const v=t.type==="checkbox"?t.checked:t.value;patch({settings:{thelma:{[k]:v}}},k==="enabled"?`THELMA turned ${v?"on":"off"}`:null);thelmaChrome();return}
});
document.addEventListener("submit",e=>{const f=e.target;if(f.id==="thForm"){e.preventDefault();const i=$("#thIn");const v=i.value;i.value="";if(v.trim()==="")return;if(/check all connections/i.test(v)&&!CAP.sample){liveCheck();return}ask(v)}});
document.addEventListener("input",e=>{if(e.target.id==="pq"){PAL.i=0;drawPalette()}});
document.addEventListener("keydown",e=>{
  if($("#palette").hidden)return;
  if(e.key==="ArrowDown"){e.preventDefault();PAL.i=Math.min(PAL.items.length-1,PAL.i+1);drawPalette()}
  else if(e.key==="ArrowUp"){e.preventDefault();PAL.i=Math.max(0,PAL.i-1);drawPalette()}
  else if(e.key==="Enter"&&e.target.id==="pq"){e.preventDefault();runPal(PAL.i)}
});
