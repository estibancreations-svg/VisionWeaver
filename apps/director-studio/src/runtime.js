/* ================= FILES ================= */
function fileFor(id){
  if(id==="srt")return ["E01_PART1_captions.srt",DATA.srt];
  if(id==="jobcard")return ["E01_PART2_job_card.txt",UI.jcText||""];
  if(id==="packet")return [`E01_P${UI.pk.part}_${UI.pk.plat}_packet.json`,UI.pkJSON.replace(/^APPROVED, send\.\n\n/,"")];
  if(id==="narration"){let s="# Episode 1 · Narration reading script\n\nRead exactly as written. Save each recording as E01_<CUE>_Recorded_Script.\n";CUES.forEach(c=>{const n=DATA.narr[c[0]]||{};s+=`\n## E01_${c[0]}_Script\nPART ${c[1]} · ${c[2]}${c[3]?` · ${c[3]} words · about ${c[4]} s`:""}\n\n${n.text||""}\n`});return ["E01_Narration_Reading_Script.md",s]}
  if(id==="editlist"){const {items}=tlP1(UI.full);let s=`# PART 1 "The Text" · CapCut edit list (${UI.full?"full episode":"short, 57 s"})\n\n| Track | Item | Start | Length | What to do | File / task |\n|---|---|---|---|---|---|\n`;items.slice().sort((a,b)=>a.lane-b.lane||a.start-b.start).forEach(it=>s+=`| ${LANES[it.lane]} | ${it.label} | ${tc(it.start)} | ${it.dur.toFixed(1)} s | ${it.how.replace(/\|/g,"/")} | ${it.task||""} |\n`);return ["E01_PART1_CapCut_Edit_List.md",s]}
  if(id==="shots"){const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;let s="part,shot,status,plate,pin,lens,move,framing,face,light,sound,note\n";PARTS.forEach(p=>DATA_SHOTS[p.n].forEach(r=>s+=[p.n,r.id,STATUS_LBL[shotStatus(p.n,r.id)][1],r.plate,r.pin,r.lens,r.move,r.framing,r.face,r.light,r.sound,ST.notes[`P${p.n}-${r.id}`]||""].map(q).join(",")+"\n"));return ["E01_Shot_Bible.csv",s]}
  return null;
}

/* ================= SEARCH ================= */
function searchIndex(){
  const out=[];
  PARTS.forEach(p=>DATA_SHOTS[p.n].forEach(s=>out.push({k:`P${p.n} ${s.id}`,t:s.framing,s:`${s.pin} · ${s.lens} · ${s.face}`,hay:Object.values(s).join(" "),go:()=>{UI.shotPart=p.n;UI.shotSel=s.id;go("shots")}})));
  P1FRAMES.forEach(f=>out.push({k:`P1 ${f[0]}`,t:f[1],s:"key frame "+f[2]+" · video "+f[3],hay:f.join(" "),go:()=>{UI.shotPart=1;UI.shotSel=f[0];go("shots")}}));
  P2FRAMES.forEach(f=>out.push({k:`P2 ${f[0]}`,t:f[1],s:"key frame "+f[2],hay:f.join(" "),go:()=>go("pictures")}));
  STILLS.forEach(s=>out.push({k:s[0],t:s[2]+" · "+s[1],s:s[3],hay:s.join(" "),go:()=>go("pictures")}));
  CUES.forEach(c=>out.push({k:c[0],t:`Narration · PART ${c[1]} · ${c[2]}`,s:(DATA.narr[c[0]]||{}).text?.slice(0,90)+"…",hay:c.join(" ")+" "+((DATA.narr[c[0]]||{}).text||""),go:()=>{UI.cue=c[0];go("booth")}}));
  AUDIO.forEach(a=>out.push({k:"Sound",t:a[0],s:a[3],hay:a.join(" "),go:()=>go("sound")}));
  CAST.forEach(c=>out.push({k:c[0],t:c[1],s:"Cast · "+c[4].slice(0,80),hay:c.join(" ")+" "+JSON.stringify(ST.avatars[c[0]]||{}),go:()=>{UI.castSel=c[0];go("cast")}}));
  FACES.forEach(f=>out.push({k:f[0],t:f[1],s:f[2],hay:f.join(" "),go:()=>go("locks")}));
  LIGHTS.forEach(l=>out.push({k:l[0],t:l[1],s:l[2].slice(0,90),hay:l.join(" "),go:()=>go("locks")}));
  PLATES.forEach(p=>out.push({k:"Plate",t:p[0],s:p[1],hay:p.join(" "),go:()=>go("locks")}));
  return out;
}
let SIDX=null;
function doSearch(q){
  const box=$("#results");q=q.trim().toLowerCase();if(!q){box.hidden=true;return}
  SIDX=SIDX||searchIndex();const hits=SIDX.filter(x=>x.hay.toLowerCase().includes(q)).slice(0,14);
  box.innerHTML=hits.length?hits.map((h,i)=>`<button type="button" data-hit="${i}"><span class="k">${esc(h.k)}</span><span>${esc(h.t)}</span><span class="s">${esc(h.s)}</span></button>`).join(""):`<div class="note" style="padding:10px">Nothing matches "${esc(q)}".</div>`;
  box._hits=hits;box.hidden=false;
}

/* ================= CAPTION DRAFTS ================= */
async function draftCaptions(){
  if(!CAP.sample||UI.draftBusy)return;const p=PARTS[+UI.pk.part-1];UI.draftBusy=true;UI.draftOut="";render();
  try{
    const r=await CAP.sample.json(`Write social posts for a short film clip. Series: "Crossroads of Identity", Episode 1, Part ${p.n}: "${p.name}". Story of this part: ${p.log}
Rules: plain, gripping, no spoilers beyond this part, no invented quotes, no real brands. Each caption ends with the line "Made with AI tools." Hashtags must include #CrossroadsOfIdentity.
Reply with only JSON: {"youtube_title": string (under 100 characters, format "<hook> | Crossroads of Identity Ep. 1 Pt. ${p.n}"), "youtube_description": string, "instagram_caption": string, "tiktok_caption": string (short), "hashtags": array of 5 to 8 strings starting with #}`,{modelTier:"default"});
    UI.draft=r;UI.draftOut=esc(`YouTube title: ${r.youtube_title}\n\nYouTube description:\n${r.youtube_description}\n\nInstagram:\n${r.instagram_caption}\n\nTikTok:\n${r.tiktok_caption}\n\n${(r.hashtags||[]).join(" ")}`)+`<div class="row" style="margin-top:8px"><button type="button" class="btn small" id="useDraft">Use for this packet</button></div>`;
  }catch(e){UI.draftOut=esc(e&&e.code==="rate_limited"?"Too many requests. Wait a minute and try again.":e&&e.code==="cancelled"?"Stopped.":"Couldn't draft captions this time. Try again.")}
  UI.draftBusy=false;render();
}

/* ================= LIVE CONNECTION CHECK (mcp) ================= */
const LIVE_SQL="select (select count(*) from production_log) as production_log_rows, (select max(created_at) from production_log) as last_run, (select count(*) from ec_connectors) as connectors, (select count(*) from ec_connectors where connection_state='active') as active_connectors, (select count(*) from social_post_queue) as queued_posts";
function mcpErrText(e,server){const c=e&&e.code;
  if(c==="needs_reauth")return `Reconnect ${server} in claude.ai Settings → Connectors`;
  if(c==="server_not_connected")return `Add ${server} in claude.ai Settings → Connectors`;
  if(c==="selection_required")return `Choose which ${server} connector to use when claude.ai asks`;
  if(c==="not_in_manifest")return `Not allowed for this page. Turn ${server} on for this page to check it`;
  if(c==="blocked_by_policy"||c==="approval_required")return "Blocked by your organization's settings";
  if(c==="server_unavailable"||c==="upstream_error")return `${server} didn't answer. Try again in a minute`;
  if(c==="tool_error")return `${server} reported: ${String(e.message||"an error").slice(0,140)}`;
  if(c==="not_granted"||c==="capability_disabled"||c==="capability_removed")return "Live checks aren't available in this view";
  return `Couldn't check ${server}`;}
function sqlRows(payload){if(Array.isArray(payload))return payload;const t=typeof payload==="string"?payload:(payload&&typeof payload.result==="string")?payload.result:JSON.stringify(payload);const a=t.indexOf("[{"),b=t.lastIndexOf("}]");if(a<0||b<a)return null;try{return JSON.parse(t.slice(a,b+2))}catch(e){return null}}
async function liveCheck(){
  if(!CAP.mcp||UI.liveBusy)return;UI.liveBusy=true;render();
  const out={at:nowISO(),by:store.uid||null};
  const run=async(key,server,tool,input,read)=>{try{const r=await CAP.mcp.callTool(server,tool,input,{cache:false});out[key]=Object.assign({ok:true},read(r.payload))}catch(e){out[key]={ok:false,text:mcpErrText(e,server),code:(e&&e.code)||"error"}}};
  await Promise.all([
    run("runway","Runway","show_plans_and_credits",{rationale:"VisionWeaver Studio live connection check: read the current Runway credit balance for the Episode 1 budget."},p=>{const c=p&&p.credits;return {credits:c&&typeof c.total==="number"?c.total:null,plan:(p&&p.planName)||"",text:c?`${p.planName||""} plan · ${fmt(c.total)} credits`:"Connected"}}),
    run("supabase","Supabase","execute_sql",{project_id:"yqealeekngxooyoemfba",query:LIVE_SQL},p=>{const r=(sqlRows(p)||[])[0];if(!r)return {text:"Connected, but the answer couldn't be read"};return {rows:+r.production_log_rows,active:+r.active_connectors,connectors:+r.connectors,queued:+r.queued_posts,last:r.last_run,text:`production_log ${r.production_log_rows} rows · ${r.active_connectors} of ${r.connectors} connectors active · ${r.queued_posts} posts queued`}}),
    run("zapier","Zapier","inspect_zapier_actions",{},p=>{const apps=((p&&p.apps)||[]).map(a=>a.app);return {apps,text:apps.length?`${apps.join(", ")} connected`:"No apps enabled"}}),
    run("github","GitHub","get_file_contents",{owner:"estibancreations-svg",repo:"VisionWeaver",path:"apps/director-studio/src",fields:["name"]},p=>{const n=Array.isArray(p)?p.length:null;return {files:n,text:n!=null?`VisionWeaver repo reachable · ${n} studio source files`:"Repo reachable"}})
  ]);
  UI.liveBusy=false;
  const okN=["runway","supabase","zapier","github"].filter(k=>out[k]&&out[k].ok).length;
  patch({live:out},`Live connection check: ${okN} of 4 answered${out.runway&&out.runway.ok&&out.runway.credits!=null?` · Runway ${fmt(out.runway.credits)} credits`:""}`);
}

/* ================= RENDER + EVENTS ================= */
let pendingRender=false;
function refresh(force){renderRail();const a=document.activeElement;if(!force&&a&&$("#main").contains(a)&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.type!=="checkbox"&&a.type!=="range"){pendingRender=true;return}render()}
function render(){
  pendingRender=false;SIDX=null;
  $("#main").innerHTML=guideBar()+`<div class="view">${(V[UI.view]||V.overview)()}</div>`;
  if(UI.view==="edit"){$("#ruler").onclick=e=>{const r=e.currentTarget.getBoundingClientRect();UI.t=Math.max(0,(e.clientX-r.left)/UI.zoom);tick()};tick()}
  if(UI.view==="uploads"){const d=$("#drop");$("#fileIn").onchange=e=>takeFiles(e.target.files);d.addEventListener("dragover",e=>{e.preventDefault();d.classList.add("over")});d.addEventListener("dragleave",()=>d.classList.remove("over"));d.addEventListener("drop",e=>{e.preventDefault();d.classList.remove("over");takeFiles(e.dataTransfer.files)})}
  afterRender();
  resolveNames();
}
document.addEventListener("focusout",()=>{setTimeout(()=>{if(pendingRender){const a=document.activeElement;if(!(a&&$("#main").contains(a)&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)))render()}},0)});

document.addEventListener("input",e=>{
  const t=e.target,id=t.id;
  if(id==="q"){doSearch(t.value);return}
  if(id==="zoom"){UI.zoom=+t.value;render();return}
  if(id==="mapZoom"){UI.mapZoom=+t.value;const img=$(".mapbox img");if(img)img.style.width=UI.mapZoom*10+"px";return}
  if(id==="wpm"){UI.wpm=+t.value;$("#wpmV").textContent=UI.wpm;return}
  if(id==="shotQ"){UI.shotQ=t.value;const pos=t.selectionStart;render();const n=$("#shotQ");if(n){n.focus();n.setSelectionRange(pos,pos)}return}
  const pkMap={pkTitle:"title",pkDesc:"desc",pkTags:"tags",pkVideo:"video",pkCover:"cover",pkWhen:"when",pkApproved:"ok"};
  if(pkMap[id]){UI.pk[pkMap[id]]=t.value;updatePacket();return}
  if(id==="jcBudget"){UI.jc.budget=+t.value||0;softMotion();return}
  if(id==="jcNotes"){UI.jc.notes=t.value;softMotion();return}
});
function updatePacket(){const keep=document.activeElement&&document.activeElement.id;const pos=document.activeElement&&document.activeElement.selectionStart;render();if(keep){const n=document.getElementById(keep);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}}
function softMotion(){const keep=document.activeElement&&document.activeElement.id;render();if(keep){const n=document.getElementById(keep);if(n)n.focus()}}
document.addEventListener("change",e=>{
  const t=e.target,id=t.id;
  if(id==="pkPart"){UI.pk.part=t.value;const p=PARTS[+t.value-1];UI.pk.title=UI.pk.title.replace(/Pt\. \d/,"Pt. "+p.n);render();return}
  if(id==="pkPlat"){UI.pk.plat=t.value;render();return}
  if(id==="pkVis"){UI.pk.vis=t.value;render();return}
  if(id==="jcMode"){UI.jc.mode=t.value;render();return}
  if(t.dataset.jc){UI.jc.off[t.dataset.jc]=!t.checked;render();return}
  if(id==="shotSt"){const s=DATA_SHOTS[UI.shotPart].find(x=>x.id===UI.shotSel)||DATA_SHOTS[UI.shotPart][0];patch({shot:{[`P${UI.shotPart}-${s.id}`]:t.value}},`Set E01-P${UI.shotPart}-${s.id} to ${STATUS_LBL[t.value][1]}`);return}
  if(t.dataset.sched){const [p,k]=t.dataset.sched.split(":");patch({schedule:{[p]:{[k]:t.value||null}}},`Scheduled PART ${p} on ${PLAT_KEYS.find(x=>x[0]===k)[1]}: ${t.value?when(t.value+":00-04:00"):"cleared"}`);return}
});
document.addEventListener("submit",e=>{
  e.preventDefault();const f=e.target;
  if(f.id==="qForm"){const title=$("#qTitle").value.trim();if(!title){toast("Say what needs a decision");return}qAdd({dept:$("#qDept").value,part:$("#qPart").value,title,detail:$("#qDetail").value.trim()});return}
  if(f.id==="askForm"){const v=$("#askIn").value;$("#askIn").value="";ask(v);return}
});
document.addEventListener("keydown",e=>{
  if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"")){e.preventDefault();$("#q").focus()}
  if(e.key==="Escape"){$("#results").hidden=true;if(!$("#drawer").hidden)$("#drawer").hidden=true;closePalette()}
  if((e.metaKey||e.ctrlKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();openPalette()}
  if(e.key==="Enter"&&e.target.id==="askIn"&&!e.shiftKey){e.preventDefault();const v=e.target.value;e.target.value="";ask(v)}
});
document.addEventListener("click",e=>{
  const t=e.target;const c=s=>t.closest(s);
  if(!c("#searchWrap"))$("#results").hidden=true;
  let el;
  if((el=c("[data-hit]"))){const h=$("#results")._hits[+el.dataset.hit];$("#results").hidden=true;$("#q").value="";h.go();return}
  if((el=c("[data-view]"))){go(el.dataset.view);return}
  if((el=c("[data-p2]"))){const id=el.dataset.p2,v=el.dataset.v,nv=ST.p2[id]===v?"pending":v;patch({p2:{[id]:nv}},`PART 2 ${id}: ${nv==="approved"?"approved":nv==="redo"?"marked for redo":"back to waiting"}`);return}
  if(t.id==="approveRest"){const o={};P2FRAMES.forEach(f=>{if(ST.p2[f[0]]==="pending")o[f[0]]="approved"});if(!Object.keys(o).length){toast("Nothing is waiting");return}patch({p2:o},`Approved ${Object.keys(o).length} PART 2 key frames: ${Object.keys(o).join(", ")}`);return}
  if(t.id==="sendPicks"){const g=k=>P2FRAMES.filter(f=>ST.p2[f[0]]===k).map(f=>f[0]).join(", ")||"none";copy(`PART 2 key frame picks\nAPPROVED: ${g("approved")}\nREDO: ${g("redo")}\nSTILL DECIDING: ${g("pending")}`,"Picks copied");return}
  if((el=c("[data-rec]"))){const id=el.dataset.rec;patch({recorded:{[id]:ST.recorded[id]?null:{at:nowISO(),by:store.uid||null}}},ST.recorded[id]?`Unmarked narration ${id}`:`Recorded narration ${id}`);if(ST.recorded[id]===null)delete ST.recorded[id];return}
  if((el=c("[data-dlv]"))){const [p,i]=el.dataset.dlv.split(":");const row=(ST.deliver[p]||[false,false,false,false,false]).slice();row[+i]=!row[+i];const lbl=["short master","full-episode cut","cover","captions","public Drive links"][+i];patch({deliver:{[p]:row}},`PART ${p} ${lbl}: ${row[+i]?"ready":"not yet"}`);return}
  if((el=c("[data-setup]"))){const k=el.dataset.setup;patch({setup:{[k]:ST.setup[k]?null:{at:nowISO(),by:store.uid||null}}},ST.setup[k]?`Reopened setup step: ${k}`:`Setup step done: ${(SETUP_STEPS.find(s=>s[0]===k)||[k,k])[1]}`);if(ST.setup[k]===null)delete ST.setup[k];return}
  if((el=c("[data-qf]"))){UI.qFilter=el.dataset.qf;render();return}
  if((el=c("[data-qd]"))){const id=el.dataset.qd,n=$("#qn-"+id);qDecide(id,el.dataset.s,n?n.value.trim():"");return}
  if((el=c("[data-sp]"))){UI.shotPart=+el.dataset.sp;UI.shotSel=null;render();return}
  if((el=c("[data-shot]"))){UI.shotSel=el.dataset.shot;render();return}
  if((el=c("[data-map]"))){UI.mapKey=el.dataset.map;render();return}
  if((el=c("[data-mapgo]"))){UI.mapKey=el.dataset.mapgo;go("locks");return}
  if((el=c("[data-cue]"))){UI.cue=el.dataset.cue;UI.prompting=false;if(UI.view!=="booth")go("booth");else render();return}
  if((el=c("[data-tlp]"))){UI.tlPart=+el.dataset.tlp;UI.sel=null;UI.t=0;UI.playing=false;render();return}
  if((el=c("[data-cut]"))){UI.full=el.dataset.cut==="full";UI.sel=null;UI.t=0;UI.playing=false;render();return}
  if((el=c("[data-clip]"))){UI.sel=+el.dataset.clip;UI.t=curTL().items[UI.sel].start;render();return}
  if((el=c("[data-dl-file]"))){const f=fileFor(el.dataset.dlFile);if(f)saveFile(f[0],f[1]);return}
  if((el=c("[data-askchip]"))){ask(el.dataset.askchip);return}
  if((el=c("[data-ask-shot]"))){openAsk(`What does E01-P${UI.shotPart}-${el.dataset.askShot} need to get right, and what could go wrong when we make it?`);return}
  if(t.id==="saveNote"){const s=DATA_SHOTS[UI.shotPart].find(x=>x.id===UI.shotSel)||DATA_SHOTS[UI.shotPart][0];const v=$("#shotNote").value.trim();patch({notes:{[`P${UI.shotPart}-${s.id}`]:v}},`Note on E01-P${UI.shotPart}-${s.id}: ${v?`"${v.slice(0,80)}"`:"cleared"}`);toast("Note saved");return}
  if(t.id==="jcCopy"){copy(UI.jcText,"Job card copied");return}
  if(t.id==="jcQueue"){qAdd({dept:"Motion",part:"2",title:"PART 2 job card ready to run",detail:UI.jcText.split("\n").slice(2,5).join(" · "),go:"motion"});toast("Sent to the Motion queue");return}
  if(t.id==="pkCopy"){copy(UI.pkJSON,"Packet copied. Paste it to the Publisher.");return}
  if(t.id==="pkQueue"){qAdd({dept:"Marketing",part:UI.pk.part,title:`Packet approved: PART ${UI.pk.part} on ${UI.pk.plat}`,detail:`${UI.pk.title} · ${UI.pk.when} ET · ${UI.pk.vis}`,go:"publish"});return}
  if(t.id==="liveCheck"){liveCheck();return}
  if(t.id==="draftCaps"){draftCaptions();return}
  if(t.id==="useDraft"&&UI.draft){const d=UI.draft;const plat=UI.pk.plat;UI.pk.title=d.youtube_title||UI.pk.title;UI.pk.desc=(plat==="instagram_reels"?d.instagram_caption:plat==="tiktok"?d.tiktok_caption:d.youtube_description)||UI.pk.desc;if(Array.isArray(d.hashtags))UI.pk.tags=d.hashtags.join(" ");render();toast("Draft placed in the packet");return}
  if(t.id==="playBtn"){UI.playing=!UI.playing;t.textContent=UI.playing?"Pause":"Play";if(UI.playing){last=performance.now();requestAnimationFrame(loop)}return}
  if(t.id==="pStart"){UI.prompting=!UI.prompting;t.textContent=UI.prompting?"Stop":"Start prompter";if(UI.prompting){UI.promptT=0;plast=performance.now();requestAnimationFrame(ploop)}return}
  if(t.id==="askOpen"){openAsk();return}
  if(t.id==="askClose"){$("#drawer").hidden=true;return}
  if(t.id==="askStop"){askCtl&&askCtl.abort();return}
  if(t.id==="themeBtn"){const order=THEMES.map(x=>x[0]);setApp("theme",order[(order.indexOf(APP.theme)+1)%order.length]);toast("Look: "+THEMES.find(x=>x[0]===APP.theme)[1]);if(UI.view==="settings")render();return}
});
let last=0,plast=0;
function loop(now){if(!UI.playing||UI.view!=="edit")return;const {total}=curTL();UI.t+=(now-last)/1000;last=now;if(UI.t>=total){UI.t=total;UI.playing=false;const b=$("#playBtn");if(b)b.textContent="Play"}tick();if(UI.playing)requestAnimationFrame(loop)}
function tick(){
  const ph=$("#playhead");if(!ph)return;ph.style.left=UI.t*UI.zoom+"px";$("#tcNow").textContent=tc(UI.t);
  const {items}=curTL();const now=[];
  document.querySelectorAll(".clip").forEach(el=>{const it=items[+el.dataset.clip];const on=UI.t>=it.start&&UI.t<it.start+it.dur;el.classList.toggle("live",on);if(on&&it.lane<4)now.push(it.label)});
  $("#nowReadout").textContent=now.length?"Now: "+now.join(" · "):"";
  const w=$("#tlWrap");if(UI.playing&&w){const x=UI.t*UI.zoom+104;if(x>w.scrollLeft+w.clientWidth-60||x<w.scrollLeft)w.scrollLeft=x-120}
}
function ploop(now){
  if(!UI.prompting||UI.view!=="booth")return;UI.promptT+=(now-plast)/1000;plast=now;
  const idx=Math.floor(UI.promptT*UI.wpm/60);const spans=document.querySelectorAll("#prompter span");
  spans.forEach((s,i)=>{s.className=i<idx?"said":i===idx?"now":""});
  const cur=spans[idx];if(cur){const box=$("#prompter");const top=cur.offsetTop-box.offsetTop;if(top>box.scrollTop+box.clientHeight*0.6)box.scrollTop=top-box.clientHeight*0.3}
  const tt=$("#pTime");if(tt)tt.textContent=tc(UI.promptT);
  if(idx>=spans.length+2){UI.prompting=false;const b=$("#pStart");if(b)b.textContent="Start prompter";return}
  requestAnimationFrame(ploop);
}

loadLocal();
const h0=(location.hash||"").slice(1);if(V[h0])UI.view=h0;
renderRail();render();initCaps();
