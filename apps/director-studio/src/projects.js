/* ================= v8: PROJECTS (multi-project), DECIDE deck (swipe), ONBOARDING + tour ================= */
/* A studio holds many projects. Crossroads Episode 1 is the built-in project whose stages are the
   original pipeline pages. New projects get a stage board (tasks, gates, files) that works for any
   kind of work: an episode, a social piece, a kids video, a podcast, a document. */
const PTYPES={
  episode:{name:"Film or series episode",icon:"🎬",stages:[["script","Script & story"],["cast","Cast & looks"],["frames","Key frames · Gate 1",1],["motion","Video clips (motion)"],["sound","Voice & sound"],["edit","Edit"],["deliver","Deliver files"],["publish","Publish · Gate 2",2]]},
  social:{name:"Social media piece",icon:"📱",stages:[["brief","Brief & hook"],["assets","Pick clips & images"],["frames","New visuals · Gate 1",1],["edit","Cut (9:16 · 1:1 · 16:9)"],["captions","Captions & on-screen text"],["schedule","Schedule"],["publish","Publish · Gate 2",2]]},
  kids:{name:"Kids video or book",icon:"🧸",stages:[["story","Story"],["art","Characters & art · Gate 1",1],["scenes","Pages / scenes"],["voice","Voice & music"],["edit","Edit & layout"],["review","Review"],["publish","Publish · Gate 2",2]]},
  podcast:{name:"Podcast episode",icon:"🎙",stages:[["plan","Plan"],["record","Record"],["edit","Edit"],["art","Cover art · Gate 1",1],["notes","Show notes"],["publish","Publish · Gate 2",2]]},
  doc:{name:"Document or book",icon:"📄",stages:[["outline","Outline"],["draft","Draft"],["review","Review"],["final","Final · Gate 2",2]]},
  other:{name:"Something else",icon:"◆",stages:[["plan","Plan"],["make","Make"],["review","Review · Gate 1",1],["deliver","Deliver · Gate 2",2]]}
};
const XR_ID="crossroads-e01";
const XR_MAP={script:"source",cast:"cast",frames:"pictures",motion:"motion",sound:"booth",edit:"edit",deliver:"deliver",publish:"publish"};
let PROJECTS=[],PROJ_SUB=false;
const PKEY="vw-studio-projects";
function ensureProjects(){
  if(PROJ_SUB)return;
  if(CAP.db){PROJ_SUB=true;CAP.db.collection("projects").onSnapshot(s=>{PROJECTS=s.docs.map(d=>Object.assign({id:d.id},d.data()));refresh()},()=>{});return}
  if(!PROJECTS.length){try{PROJECTS=JSON.parse(localStorage.getItem(PKEY)||"[]")}catch(e){PROJECTS=[]}}
}
function saveProjectsLocal(){try{localStorage.setItem(PKEY,JSON.stringify(PROJECTS))}catch(e){}}
function xrProject(){
  const st=k=>{const v=XR_MAP[k];if(k==="script")return "done";if(k==="frames")return Object.values(ST.p2).some(x=>x==="pending")?"doing":"done";
    if(k==="motion")return "doing";if(k==="publish")return (ST.schedule&&Object.keys(ST.schedule).length)?"doing":"todo";
    if(k==="deliver")return (ST.deliver["1"]||[]).some(Boolean)?"doing":"todo";const d=railDot(v);return d==="done"?"done":d==="wait"||d==="you"?"doing":"todo"};
  const stages={};PTYPES.episode.stages.forEach(([k])=>stages[k]={status:st(k)});
  return {id:XR_ID,name:"Crossroads of Identity · Episode 1",type:"episode",builtin:true,status:(ST.xrArchived?"archived":"active"),due:"2026-10-01",desc:"\"The News\" · 5 PARTS · PART 1 finished, PART 2 at Gate 1.",stages,tasks:[]};
}
function allProjects(){return [xrProject(),...PROJECTS.filter(p=>p.id!==XR_ID)]}
function projById(id){return allProjects().find(p=>p.id===id)}
function activeId(){const id=(store.mode==="shared"?MINE.project:(()=>{try{return localStorage.getItem(PKEY+"-active")}catch(e){return null}})())||XR_ID;return projById(id)?id:XR_ID}
function activeProject(){return projById(activeId())}
function setActive(id){if(store.mode==="shared"&&store.uid){MINE.project=id;const clean=JSON.parse(JSON.stringify(MINE));write(()=>CAP.db.doc("data/users/"+store.uid+"/prefs").set(clean))}else{try{localStorage.setItem(PKEY+"-active",id)}catch(e){}}refresh()}
function stagesOf(p){return (PTYPES[p.type]||PTYPES.other).stages}
function stageStatus(p,k){return ((p.stages||{})[k]||{}).status||"todo"}
function progress(p){const s=stagesOf(p);const done=s.filter(([k])=>stageStatus(p,k)==="done").length;return {done,total:s.length,pct:Math.round(done/s.length*100)}}
function currentStage(p){return stagesOf(p).find(([k])=>stageStatus(p,k)!=="done")||null}
function projQueue(p){return QUEUE.filter(q=>(q.project||XR_ID)===p.id)}
function nextStep(p){
  if(p.builtin){const w=waiting()[0];return w?w.t:"Everything is decided for now."}
  const cs=currentStage(p);if(!cs)return "All stages are done. Archive it or start the next project.";
  const open=(p.tasks||[]).filter(t=>t.stage===cs[0]&&!t.done);
  if(open.length)return open[0].text;
  if(cs[2]===2)return `Gate 2: type APPROVED on the ${cs[1].split(" ·")[0]} stage when it's ready to go out.`;
  if(cs[2]===1)return `Gate 1: look at the visuals and approve them before anything is animated.`;
  return stageStatus(p,cs[0])==="todo"?`Start "${cs[1]}".`:`Add the tasks for "${cs[1]}" or mark it done.`;
}
function pid(){return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function createProject(a){
  const p={name:String(a.name||"New project").slice(0,80),type:PTYPES[a.type]?a.type:"other",status:"active",due:a.due||"",desc:String(a.desc||a.description||"").slice(0,400),created:nowISO(),by:store.uid||null,stages:{},tasks:[]};
  const id=pid();
  if(CAP.db&&!store.readOnly){write(()=>CAP.db.doc("projects/"+id).set(p))}
  PROJECTS=[...PROJECTS.filter(x=>x.id!==id),Object.assign({id},p)];if(!CAP.db)saveProjectsLocal();
  addLog(`New project: ${p.name} (${PTYPES[p.type].name})`);setActive(id);return id;
}
function projPatch(id,up,logText){
  if(id===XR_ID){if(up.status)patch({xrArchived:up.status==="archived"},logText);return}
  const p=PROJECTS.find(x=>x.id===id);if(!p)return;deepMerge(p,clone(up));if(up.tasks)p.tasks=clone(up.tasks);
  if(CAP.db&&!store.readOnly)write(()=>CAP.db.doc("projects/"+id).update(up));else saveProjectsLocal();
  if(logText)addLog(logText);refresh();
}
function setStage(p,k,status,how){const st=stagesOf(p).find(x=>x[0]===k);projPatch(p.id,{stages:{[k]:{status,at:nowISO(),by:store.uid||null,how:how||""}}},`${p.name} · ${st?st[1]:k}: ${status==="done"?"done":status==="doing"?"started":"back to not started"}${how?" ("+how+")":""}`)}
function addTask(p,stage,text){const t={id:"t"+Date.now().toString(36),stage,text:String(text).slice(0,200),done:false,at:nowISO(),by:store.uid||null};projPatch(p.id,{tasks:[...(p.tasks||[]),t]},`${p.name}: task added — ${t.text}`);return t}
function toggleTask(p,tid){const tasks=(p.tasks||[]).map(t=>t.id===tid?Object.assign({},t,{done:!t.done,doneAt:t.done?null:nowISO(),doneBy:t.done?null:(store.uid||null)}):t);const t=tasks.find(x=>x.id===tid);projPatch(p.id,{tasks},`${p.name}: ${t.done?"done":"reopened"} — ${t.text}`)}
const STAT_PILL={done:["done","Done"],doing:["wait","In progress"],todo:["idle","Not started"]};

/* ---------- topbar switcher + nav ---------- */
function projSwitcher(){
  const tools=document.querySelector(".topbar .tools");if(!tools)return;
  let sel=document.getElementById("projSel");
  if(!sel){sel=document.createElement("select");sel.id="projSel";sel.setAttribute("aria-label","Switch project");sel.className="projsel";tools.insertBefore(sel,tools.firstChild)}
  const a=activeId();const list=allProjects().filter(p=>p.status!=="archived"||p.id===a);
  const html=list.map(p=>`<option value="${esc(p.id)}" ${p.id===a?"selected":""}>${(PTYPES[p.type]||PTYPES.other).icon} ${esc(p.name.slice(0,34))}</option>`).join("")+`<option value="__all">▦ All projects…</option>${store.readOnly?"":`<option value="__new">＋ New project…</option>`}`;
  if(sel.dataset.h!==html){sel.innerHTML=html;sel.dataset.h=html}
  const b=document.querySelector(".brand small");const p=activeProject();if(b&&p)b.textContent=p.builtin?"Crossroads of Identity · Book 1 Convergence · Episode 1 \"The News\"":`${(PTYPES[p.type]||PTYPES.other).name} · ${p.name}`;
}
try{
  const home=NAV.find(g=>g[0]==="Home");if(home&&!home[1].some(x=>x[0]==="projects")){home[1].unshift(["welcome","Start here","★"],["projects","Projects","▦"],["project","This project","◧"]);home[1].push(["decide","Decide (swipe)","⇆"])}
  const pipe=NAV.find(g=>g[0]==="Pipeline");if(pipe)pipe[0]="Crossroads Ep 1 pipeline";
  Object.assign(GUIDE,{welcome:["How the studio works, how to start, and how to bring someone in.","Take the tour, or start a project."],projects:["Every project in the studio: where each one is, what's done and what's next.","Open a project, or start a new one."],project:["One project's stages: where you are, what's done, what's next.","Work the current stage."],decide:["Your decisions as cards. Swipe right to approve, left to send back, up to skip.","Clear the stack."]});
  Object.assign(START_CHIPS,{projects:["Which project needs me most?","Start a new social media piece","Compare where my projects are"],project:["Where is this project right now?","What should I do next here?","Add the tasks for this stage"],decide:["What's in my decision stack?","Explain Gate 1 and Gate 2"],welcome:["Walk me through the studio","How do I invite someone?"]});
}catch(e){}
const _renderRail=renderRail;
renderRail=function(){_renderRail();try{ensureProjects();projSwitcher();maybeOnboard()}catch(e){}};

/* ---------- Projects hub ---------- */
V.projects=()=>{ensureProjects();const a=activeId();const f=UI.projFilter||"active";const list=allProjects().filter(p=>f==="all"||(p.status||"active")===f);
  const card=p=>{const pr=progress(p),cs=currentStage(p),t=PTYPES[p.type]||PTYPES.other;const pend=projQueue(p).filter(q=>q.status==="pending").length+(p.builtin?Object.values(ST.p2).filter(v=>v==="pending").length:0);
    return `<article class="pcard${p.id===a?" on":""}"><div class="pc-top"><span class="pc-ic">${t.icon}</span><div><b>${esc(p.name)}</b><div class="note">${esc(t.name)}${p.due?` · due ${esc(p.due)}`:""}</div></div></div>
     <div class="bar2"><i style="width:${pr.pct}%"></i></div><div class="note">${pr.done} of ${pr.total} stages done${cs?` · now: <b>${esc(cs[1])}</b>`:""}</div>
     <p class="pc-next"><span class="note">Next:</span> ${esc(nextStep(p))}</p>
     <div class="row">${pend?pill("you",`${pend} to decide`):pill("done","Nothing to decide")}<span style="margin-left:auto"></span><button type="button" class="btn small primary" data-popen="${esc(p.id)}">Open</button>${pend?`<button type="button" class="btn small" data-pdeck="${esc(p.id)}">Decide ⇆</button>`:""}</div></article>`};
  return `<div class="vhead"><span class="eyebrow">Home</span><h1>Projects</h1><p>Every project in your studio, side by side. Each card shows where it is, what's done, and the very next step. Think of it as the call sheet for the whole studio.</p></div>
  <div class="row" style="margin-bottom:12px"><div class="seg">${[["active","Active"],["archived","Archived"],["all","All"]].map(([v,l])=>`<button type="button" data-pfilter="${v}" aria-pressed="${f===v}">${l}</button>`).join("")}</div></div>
  <div class="pgrid">${store.readOnly?"":`<article class="pcard new"><b>＋ Start a new project</b><p class="note">A film episode, a social media piece, a kids video, a podcast, a document or anything else.</p>${newProjForm("pnew")}</article>`}${list.map(card).join("")}</div>`};
function newProjForm(id){return `<form class="npf" id="${id}"><input type="text" name="name" placeholder="Project name (e.g. Crossroads trailer · 30 s)" required>
  <select name="type">${Object.entries(PTYPES).map(([k,t])=>`<option value="${k}">${t.icon} ${esc(t.name)}</option>`).join("")}</select>
  <input type="date" name="due" aria-label="Due date"><textarea name="desc" rows="2" placeholder="One line: what is it and who is it for?"></textarea>
  <button type="submit" class="btn primary">Create project</button></form>`}

/* ---------- One project ---------- */
V.project=()=>{ensureProjects();const p=activeProject();const t=PTYPES[p.type]||PTYPES.other;const pr=progress(p);const cs=currentStage(p);
  const done=stagesOf(p).filter(([k])=>stageStatus(p,k)==="done");
  const stageCard=([k,label,gate])=>{const s=stageStatus(p,k);const tasks=(p.tasks||[]).filter(x=>x.stage===k);const isNow=cs&&cs[0]===k;
    const body=p.builtin?`<p class="note">${esc({script:"Script v8 is written and locked.",cast:"Lock records, looks and voices for every character.",frames:"PART 2 key frames wait on your pick. Nothing is animated until you approve.",motion:"PART 1 clips are made. PART 2 animates after Gate 1.",sound:"Narration in your voice plus sound and music.",edit:"Assemble in CapCut from the edit list.",deliver:"Masters, captions and cut-downs.",publish:"Packet, then Gate 2: you type APPROVED."}[k]||"")}</p><button type="button" class="btn small" data-view="${XR_MAP[k]}">Open ${esc(label.split(" ·")[0])} ↗</button>`
      :`<ul class="tasks">${tasks.map(x=>`<li><label class="switch"><input type="checkbox" data-ptask="${esc(x.id)}" ${x.done?"checked":""} ${store.readOnly?"disabled":""}> <span class="${x.done?"struck":""}">${esc(x.text)}</span></label></li>`).join("")||`<li class="note">No tasks yet.</li>`}</ul>
       ${store.readOnly?"":`<form class="askrow ptaskf" data-pstage="${k}"><input type="text" placeholder="Add a task…" aria-label="Add a task to ${esc(label)}"><button type="submit" class="btn small">Add</button></form>
       <div class="row" style="margin-top:8px">${s!=="doing"&&s!=="done"?`<button type="button" class="btn small" data-pst="${k}" data-s="doing">Start</button>`:""}${s!=="done"?(gate===2?`<input type="text" class="gate2" data-g2="${k}" placeholder="Type APPROVED" aria-label="Gate 2: type APPROVED to finish"><button type="button" class="btn small primary" data-pst="${k}" data-s="done" data-gate="2">Finish · Gate 2</button>`:gate===1?`<button type="button" class="btn small primary" data-pst="${k}" data-s="done" data-gate="1">I approve these visuals · Gate 1</button>`:`<button type="button" class="btn small primary" data-pst="${k}" data-s="done">Mark done</button>`):`<button type="button" class="btn small" data-pst="${k}" data-s="doing">Reopen</button>`}</div>`}`;
    return `<article class="stage ${s}${isNow?" now":""}" data-stage="${k}"><div class="row"><b>${esc(label)}</b><span style="margin-left:auto">${pill(STAT_PILL[s][0],isNow&&s!=="done"?"You are here":STAT_PILL[s][1])}</span></div>${gate?`<div class="note gatenote">${gate===1?"Gate 1: approve the look before anything is animated or built on.":"Gate 2: nothing goes public until you type APPROVED."}</div>`:""}${body}</article>`};
  const dec=projQueue(p).filter(q=>q.status==="pending");
  return `<div class="vhead"><span class="eyebrow">${t.icon} ${esc(t.name)}</span><h1>${esc(p.name)}</h1><p>${esc(p.desc||"")}${p.due?` Due ${esc(p.due)}.`:""}</p></div>
  <div class="grid3 pstat"><section class="panel"><div class="note">Where you are</div><b class="big">${cs?esc(cs[1]):"Finished"}</b><div class="bar2" style="margin-top:8px"><i style="width:${pr.pct}%"></i></div><div class="note">${pr.done} of ${pr.total} stages done</div></section>
   <section class="panel"><div class="note">What's done</div><div>${done.length?done.map(([,l])=>pill("done",l.split(" ·")[0])).join(" "):`<span class="note">Nothing yet. Every project starts here.</span>`}</div></section>
   <section class="panel"><div class="note">What's next</div><b>${esc(nextStep(p))}</b><div class="row" style="margin-top:8px">${CAP.sample&&TH().enabled?`<button type="button" class="btn small" data-askproj="1">Ask THELMA about this project</button>`:""}${dec.length||p.builtin?`<button type="button" class="btn small" data-view="decide">Decide ⇆</button>`:""}</div></section></div>
  <section class="panel"><h2>Stages <span class="sub">${p.builtin?"each stage opens its page":"add tasks, start, finish; gates need your approval"}</span></h2><div class="stages">${stagesOf(p).map(stageCard).join("")}</div></section>
  <div class="grid2"><section class="panel"><h2>Decisions for this project <span class="sub">${dec.length} waiting</span></h2>${dec.length?`<ul class="feed">${dec.map(q=>`<li><span>${esc(q.title)}</span><span class="note">${esc(q.dept)}</span></li>`).join("")}</ul>`:`<div class="empty">No decisions waiting.</div>`}
   ${store.readOnly||p.builtin?"":`<form class="askrow" id="pqForm" style="margin-top:8px"><input type="text" placeholder="Something that needs a yes or no…"><button type="submit" class="btn small">Add to queue</button></form>`}</section>
   <section class="panel"><h2>Project settings</h2><dl class="kv"><dt>Type</dt><dd>${esc(t.name)}</dd><dt>Status</dt><dd>${esc(p.status||"active")}</dd><dt>Started</dt><dd>${p.created?when(p.created):"Sep 2026"}</dd></dl>${store.readOnly?"":`<div class="row" style="margin-top:8px"><button type="button" class="btn small" data-parch="${esc(p.id)}">${p.status==="archived"?"Bring back":"Archive"}</button><button type="button" class="btn small" data-view="projects">All projects</button></div>`}</section></div>`};

/* ---------- Decide deck (swipe) ---------- */
function deckItems(){const p=activeProject();const items=[];
  projQueue(p).filter(q=>q.status==="pending").sort((a,b)=>String(a.created).localeCompare(String(b.created))).forEach(q=>items.push({kind:"q",id:q.id,title:q.title,detail:q.detail||"",tag:q.dept,gate2:/publish|packet|post|gate 2/i.test(q.title)}));
  if(p.builtin)P2FRAMES.filter(f=>ST.p2[f[0]]==="pending").forEach(f=>items.push({kind:"f",id:f[0],title:`PART 2 key frame ${f[0]}`,detail:f[1]||"",tag:"Gate 1 · Design"}));
  const sk=UI.deckSkip||[];return items.sort((a,b)=>sk.indexOf(a.kind+":"+a.id)-sk.indexOf(b.kind+":"+b.id))}
V.decide=()=>{const items=deckItems();const p=activeProject();const top=items[0];const u=UI.deckUndo||[];
  return `<div class="vhead"><span class="eyebrow">Home · ${esc(p.name)}</span><h1>Decide</h1><p>Your decisions as a stack of cards. <b>Swipe right</b> to approve, <b>left</b> to send back (or redo a frame), <b>up</b> to skip for now. Buttons work too. Like sorting mail: yes pile, no pile, later pile.</p></div>
  <div class="deckwrap">${top?`<div class="deck" id="deck">${items.slice(0,3).reverse().map((it,i,arr)=>`<article class="dcard${i===arr.length-1?" top":""}" ${i===arr.length-1?`id="deckTop" data-dk="${it.kind}:${esc(it.id)}"`:""} style="--n:${arr.length-1-i}"><div class="note">${esc(it.tag)}</div><h3>${esc(it.title)}</h3><p>${esc(it.detail.slice(0,260))}</p>${it.gate2?`<p class="note warnnote">Approving here records your OK. Publishing still needs APPROVED typed on the Publish page (Gate 2).</p>`:it.kind==="f"?`<p class="note">Gate 1: approving lets this frame be animated.</p>`:""}<div class="swipehint"><span>← ${it.kind==="f"?"Redo":"Send back"}</span><span>↑ Skip</span><span>Approve →</span></div></article>`).join("")}</div>
   <div class="deckbtns"><button type="button" class="btn big" data-deck="left" aria-label="Send back">✕</button><button type="button" class="btn big" data-deck="up" aria-label="Skip">↷</button><button type="button" class="btn big primary" data-deck="right" aria-label="Approve">✓</button></div>
   <p class="note" style="text-align:center">${items.length} in the stack${u.length?` · <button type="button" class="btn small" id="deckUndo">Undo last</button>`:""}</p>`
   :`<div class="empty">Nothing to decide in ${esc(p.name)}. ${u.length?`<button type="button" class="btn small" id="deckUndo">Undo last</button>`:""}</div>`}</div>`};
function deckAct(dir){const el=$("#deckTop");if(!el)return;const [kind,id]=el.dataset.dk.split(/:(.*)/s);
  if(dir==="up"){UI.deckSkip=(UI.deckSkip||[]).filter(x=>x!==kind+":"+id).concat([kind+":"+id]);flyOut(el,"up",()=>render());return}
  const v=kind==="f"?(dir==="right"?"approved":"redo"):(dir==="right"?"approved":"changes");
  UI.deckUndo=(UI.deckUndo||[]).concat([{kind,id,before:kind==="f"?ST.p2[id]:(QUEUE.find(x=>x.id===id)||{}).status}]).slice(-20);
  flyOut(el,dir,()=>{if(kind==="f")patch({p2:{[id]:v}},`PART 2 ${id}: ${v==="approved"?"approved":"marked for redo"} (swiped)`);else qDecide(id,v,"swiped in Decide");});
}
function deckUndo(){const u=(UI.deckUndo||[]).pop();if(!u)return;if(u.kind==="f")patch({p2:{[u.id]:u.before||"pending"}},`PART 2 ${u.id}: undo swipe`);else qDecide(u.id,u.before||"pending","undo swipe");}
function flyOut(el,dir,done){const dx=dir==="right"?700:dir==="left"?-700:0,dy=dir==="up"?-700:0;el.style.transition=APP.motion==="reduced"?"none":"transform .28s ease-in,opacity .28s";el.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/40}deg)`;el.style.opacity="0";setTimeout(done,APP.motion==="reduced"?0:260)}
(function(){let sx=0,sy=0,drag=null;
  document.addEventListener("pointerdown",e=>{const el=e.target.closest&&e.target.closest("#deckTop");if(!el||e.target.closest("button"))return;drag=el;sx=e.clientX;sy=e.clientY;el.setPointerCapture&&el.setPointerCapture(e.pointerId);el.style.transition="none"});
  document.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;drag.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/20}deg)`;drag.classList.toggle("yes",dx>60);drag.classList.toggle("no",dx<-60);drag.classList.toggle("skip",dy<-60&&Math.abs(dx)<60)});
  document.addEventListener("pointerup",e=>{if(!drag)return;const el=drag;drag=null;const dx=e.clientX-sx,dy=e.clientY-sy;
    if(dx>90)deckAct("right");else if(dx<-90)deckAct("left");else if(dy<-90&&Math.abs(dx)<90)deckAct("up");else{el.style.transition="transform .2s";el.style.transform="";el.classList.remove("yes","no","skip")}});
  document.addEventListener("keydown",e=>{if(UI.view!=="decide"||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||""))return;if(e.key==="ArrowRight")deckAct("right");else if(e.key==="ArrowLeft")deckAct("left");else if(e.key==="ArrowUp"){e.preventDefault();deckAct("up")}});
})();

/* ---------- Start here + onboarding wizard + tour ---------- */
V.welcome=()=>{const p=activeProject();
  return `<div class="vhead"><span class="eyebrow">Home</span><h1>Start here</h1><p>VisionWeaver Studio is a film studio on one screen. <b>Projects</b> are the movies and posts you're making. <b>Stages</b> are the steps each one goes through. <b>THELMA</b> is your assistant director: she finds things, explains, and offers to do the busywork, but only after you say yes. <b>Gates</b> are the two big yeses only you can give.</p></div>
  <div class="grid3"><section class="panel"><h2>1 · Pick a project</h2><p class="note">Use the project menu at the top, or open <b>Projects</b> to start a new one. Right now you're in <b>${esc(p.name)}</b>.</p><button type="button" class="btn small" data-view="projects">Projects ▦</button></section>
   <section class="panel"><h2>2 · Work the current stage</h2><p class="note"><b>This project</b> shows where you are, what's done and what's next. Decisions pile up in <b>Decide</b>, where you swipe them.</p><button type="button" class="btn small" data-view="project">This project ◧</button> <button type="button" class="btn small" data-view="decide">Decide ⇆</button></section>
   <section class="panel"><h2>3 · Ask THELMA</h2><p class="note">She's on every page. Tap a blue ↗ button in her answer to jump there. When she offers to do something, you get a Yes/No card first.</p>${TH().enabled?`<button type="button" class="btn small" id="askOpen2">Ask THELMA</button>`:""}</section></div>
  <section class="panel"><h2>Onboarding</h2><p style="margin-top:0">New people see a 5-step welcome the first time they open the studio. You can replay it any time to show someone how it works.</p><div class="row"><button type="button" class="btn primary" id="onbReplay">Replay the welcome</button><button type="button" class="btn" id="tourGo">Take the 30-second tour</button></div></section>
  <div class="grid2"><section class="panel"><h2>Bring someone in</h2><ol class="fixlist"><li>Open this studio in claude.ai and press <b>Share</b> (top right).</li><li>Add their email. Pick <b>can edit</b> for people who decide, <b>can view</b> for people who only watch.</li><li>They sign in with their own claude.ai account. That's the login, so nobody shares a password.</li><li>The first time they open the studio, the welcome walks them through their role, a first project, THELMA and the two gates.</li><li>Their THELMA chats are private to them. Decisions, projects and the conversation log are shared.</li></ol></section>
   <section class="panel"><h2>The standalone app (next)</h2><p class="note" style="margin-top:0">For people outside claude.ai, the same studio runs as its own web app with Google, Apple and Microsoft sign-in, a sign-in link by email, and a code by text. THELMA gets attached to <i>their</i> system only. The onboarding is these same 5 steps. HIPAA-grade hosting is possible but needs paid plans and signed agreements with each provider (Supabase, Vercel, Twilio, Anthropic), so it waits for your go-ahead on cost.</p></section></div>`};
const ONB_STEPS=5;
function maybeOnboard(){if(UI.onbChecked)return;const inClaude=!!(window.claude&&typeof window.claude.use==="function");const ready=inClaude?(store.mode==="shared"&&(!store.uid||THELMA.loaded)):true;if(!ready)return;UI.onbChecked=true;
  const done=store.mode==="shared"?MINE.onboarded:(()=>{try{return localStorage.getItem(PKEY+"-onb")}catch(e){return null}})();if(!done)setTimeout(()=>openOnboarding(),300)}
function markOnboarded(){if(store.mode==="shared"&&store.uid){MINE.onboarded=nowISO();const clean=JSON.parse(JSON.stringify(MINE));write(()=>CAP.db.doc("data/users/"+store.uid+"/prefs").set(clean))}else{try{localStorage.setItem(PKEY+"-onb",nowISO())}catch(e){}}}
function openOnboarding(){UI.onb=1;UI.onbPath=UI.onbPath||"";drawOnb()}
function closeOnb(){const o=$("#onb");if(o)o.remove();UI.onb=0}
function drawOnb(){let o=$("#onb");if(!o){o=document.createElement("div");o.id="onb";o.className="onb";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Welcome to VisionWeaver Studio");document.body.appendChild(o)}
  const s=UI.onb,name=(NAMES[store.uid]||"").split(" ")[0];
  const roles=[["director","Director / owner","You make the final calls."],["producer","Producer","You keep projects moving."],["editor","Editor","You cut clips into movies and posts."],["writer","Writer","You shape scripts and captions."],["viewer","Viewer","You watch and comment."]];
  const body={
   1:`<h2>Welcome${name?`, ${esc(name)}`:""} 👋</h2><p>This is a film studio on one screen. <b>Projects</b> are the movies and posts. <b>THELMA</b> is your assistant director. <b>Nothing big happens without your yes.</b></p><p class="note">${store.mode==="shared"?`You're connected through your artifact workspace${name?` as ${esc(name)}`:""}.`:"This hosted workspace saves on this browser. Cloud sign-in is not active here."}</p>
      <h3>What's your role?</h3><div class="onbroles">${roles.map(([k,l,d])=>`<button type="button" class="onbrole" data-role="${k}" aria-pressed="${MINE.role===k}"><b>${l}</b><span class="note">${d}</span></button>`).join("")}</div>
      <label class="f" style="margin-top:10px">What should THELMA call you?<input type="text" id="onbCall" value="${esc(MINE.callMe||(MINE.role==="director"||!name?"Sire":name))}"></label>`,
   2:`<h2>Where do you want to start?</h2><div class="onbpaths">
      <button type="button" class="onbpath" data-path="new" aria-pressed="${UI.onbPath==="new"}"><b>＋ Start a new project</b><span class="note">A film, a social piece, a kids video, a podcast, a document.</span></button>
      <button type="button" class="onbpath" data-path="xr" aria-pressed="${UI.onbPath==="xr"}"><b>🎬 Continue Crossroads Ep 1</b><span class="note">PART 1 is finished; PART 2 is waiting at Gate 1.</span></button>
      <button type="button" class="onbpath" data-path="look" aria-pressed="${UI.onbPath==="look"}"><b>👀 Just look around</b><span class="note">Nothing changes until you decide something.</span></button></div>
      ${UI.onbPath==="new"&&!store.readOnly?newProjForm("onbNew"):""}${UI.onbPath==="new"&&store.readOnly?`<p class="note">You can view this studio but not add projects. Ask the owner for edit access.</p>`:""}`,
   3:`<h2>Meet THELMA</h2><p>She's on every page (the round orange button). Ask her anything about your work. She answers in plain words and gives you buttons: <b>→</b> asks her the next question, <b>↗</b> takes you straight to the spot.</p><p>When she can do something for you, like approving a frame you picked or adding a task, she shows a <b>Yes / No card</b> first. She never publishes, spends credits or deletes.</p>
      <div class="panel" style="margin-top:8px">${voicePicker()}</div>`,
   4:`<h2>The two gates</h2><div class="gates"><div><b>Gate 1</b><p class="note">Look before it's made. Key frames and visuals are approved before any video is made from them, because video costs the most.</p></div><div><b>Gate 2</b><p class="note">Nothing goes public until <i>you</i> type the word APPROVED. No button can skip it.</p></div></div>
      <h3>Deciding is a swipe</h3><div class="swipedemo"><span>← send back</span><span>↑ later</span><span>approve →</span></div><p class="note">Open <b>Decide</b> any time. It works with a thumb on a phone and with arrow keys on a computer.</p>`,
   5:`<h2>You're ready</h2><p>Your first three moves:</p><ol class="fixlist">${UI.onbPath==="new"?`<li>Open <b>This project</b> and add tasks to the first stage.</li><li>Ask THELMA: "What should I do first on this project?"</li><li>When visuals are ready, approve them at Gate 1.</li>`:UI.onbPath==="xr"?`<li>Open <b>Decide</b> and swipe through the PART 2 key frames.</li><li>Check the PART 1 publish packet on <b>Publish</b>.</li><li>Ask THELMA: "What's closest to its deadline?"</li>`:`<li>Open <b>Projects</b> to see everything in the studio.</li><li>Ask THELMA: "Walk me through the studio."</li><li>Replay this welcome from <b>Start here</b> any time.</li>`}</ol>`
  }[s];
  o.innerHTML=`<div class="onbbox"><div class="onbdots">${Array.from({length:ONB_STEPS},(_,i)=>`<i class="${i+1===s?"on":i+1<s?"done":""}"></i>`).join("")}</div>${body}
   <div class="onbnav"><button type="button" class="btn" id="onbSkip">Skip</button><span style="flex:1"></span>${s>1?`<button type="button" class="btn" id="onbBack">Back</button>`:""}${s<ONB_STEPS?`<button type="button" class="btn primary" id="onbNext">Next</button>`:`<button type="button" class="btn" id="onbTour">Take the tour</button><button type="button" class="btn primary" id="onbFinish">Let's go</button>`}</div></div>`;
  const f=o.querySelector("#onbNext,#onbFinish");if(f)f.focus();
}
function onbSaveStep1(){const c=$("#onbCall");if(c){MINE.callMe=c.value.trim()||"Sire"}}
function finishOnb(tour){onbSaveStep1();markOnboarded();closeOnb();addLog(`Welcome finished${MINE.role?" · role: "+MINE.role:""}`);
  if(UI.onbPath==="xr"){setActive(XR_ID);go("decide")}else if(UI.onbPath==="new"&&activeId()!==XR_ID)go("project");else go("projects");
  if(tour)setTimeout(startTour,250)}
const TOUR=[["#projSel","Switch projects here. Each project keeps its own stages and decisions."],['#rail [data-view="project"]',"This project: where you are, what's done, and what's next."],['#rail [data-view="decide"]',"Decide: swipe right to approve, left to send back."],["#askOpen","THELMA is always here. Tap her to ask, or to have her take you somewhere."],['#rail [data-view="convlog"]',"Every conversation is logged, so any change can be traced back."]];
function startTour(){UI.tour=0;drawTour()}
function drawTour(){let t=$("#tour");const step=TOUR[UI.tour];if(!step){if(t)t.remove();const h=document.querySelector(".tourhi");if(h)h.classList.remove("tourhi");return}
  if(!t){t=document.createElement("div");t.id="tour";t.className="tourtip";t.setAttribute("role","dialog");document.body.appendChild(t)}
  document.querySelectorAll(".tourhi").forEach(x=>x.classList.remove("tourhi"));const el=$(step[0]);
  if(el){if(el.hidden&&el.id==="askOpen")el.hidden=false;el.scrollIntoView({block:"nearest",inline:"center"});el.classList.add("tourhi")}
  const r=el?el.getBoundingClientRect():{left:innerWidth/2-150,bottom:innerHeight/2,top:innerHeight/2};
  t.innerHTML=`<p>${esc(step[1])}</p><div class="row"><span class="note">${UI.tour+1} of ${TOUR.length}</span><span style="flex:1"></span><button type="button" class="btn small" id="tourEnd">Close</button><button type="button" class="btn small primary" id="tourNext">${UI.tour<TOUR.length-1?"Next":"Done"}</button></div>`;
  const w=Math.min(300,innerWidth-24);t.style.width=w+"px";t.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+"px";
  const below=r.bottom+10+140<innerHeight;t.style.top=(below?r.bottom+10:Math.max(12,r.top-150))+"px";}

/* ---------- events ---------- */
document.addEventListener("change",e=>{const t=e.target;
  if(t.id==="projSel"){const v=t.value;if(v==="__all"){go("projects");projSwitcher();return}if(v==="__new"){go("projects");projSwitcher();setTimeout(()=>{const n=document.querySelector("#pnew input[name=name]");if(n)n.focus()},80);return}setActive(v);addLog(`Switched to project: ${(projById(v)||{}).name}`);if(["projects","project","decide"].includes(UI.view))render();else go("project");return}
  if(t.dataset.ptask){const p=activeProject();toggleTask(p,t.dataset.ptask);return}
});
document.addEventListener("submit",e=>{const f=e.target;
  if(f.classList&&f.classList.contains("npf")){e.preventDefault();const d=Object.fromEntries(new FormData(f).entries());if(!String(d.name||"").trim()){toast("Give the project a name");return}const id=createProject(d);toast(`Project created: ${d.name}`);if(f.id==="onbNew"){UI.onbPath="new";UI.onb=3;drawOnb();return}go("project");return}
  if(f.classList&&f.classList.contains("ptaskf")){e.preventDefault();const i=f.querySelector("input");const v=i.value.trim();if(!v)return;i.value="";i.blur();addTask(activeProject(),f.dataset.pstage,v);return}
  if(f.id==="pqForm"){e.preventDefault();const i=f.querySelector("input");const v=i.value.trim();if(!v)return;const p=activeProject();const body={dept:"Design",title:v,detail:"",part:"",go:"project",status:"pending",created:nowISO(),createdBy:store.uid||null,decided:null,decidedBy:null,note:"",project:p.id};
    if(store.mode==="shared"&&!store.readOnly)write(()=>CAP.db.collection("queue").add(body));else{QUEUE.push(Object.assign({id:"l"+Date.now()},body));saveLocal()}addLog(`${p.name}: added to the queue — ${v}`);i.value="";refresh();return}
});
document.addEventListener("click",e=>{const t=e.target,c=s=>t.closest(s);let el;
  if((el=c("[data-popen]"))){setActive(el.dataset.popen);go("project");return}
  if((el=c("[data-pdeck]"))){setActive(el.dataset.pdeck);go("decide");return}
  if((el=c("[data-pfilter]"))){UI.projFilter=el.dataset.pfilter;render();return}
  if((el=c("[data-parch]"))){const p=projById(el.dataset.parch);projPatch(p.id,{status:p.status==="archived"?"active":"archived"},`${p.name}: ${p.status==="archived"?"brought back":"archived"}`);return}
  if((el=c("[data-pst]"))){const p=activeProject(),k=el.dataset.pst,s=el.dataset.s,g=el.dataset.gate;
    if(g==="2"){const inp=document.querySelector(`[data-g2="${k}"]`);if(!inp||inp.value.trim()!=="APPROVED"){toast("Gate 2: type APPROVED (capital letters) to finish this stage");if(inp)inp.focus();return}setStage(p,k,"done","Gate 2 · APPROVED typed");return}
    setStage(p,k,s,g==="1"?"Gate 1 · approved by "+(MINE.callMe||"Sire"):"");return}
  if(t.dataset&&t.dataset.askproj){const p=activeProject();openAsk();ask(`Tell me where "${p.name}" is right now, what's done, and what I should do next.`);return}
  if((el=c("[data-deck]"))){deckAct(el.dataset.deck);return}
  if(t.id==="deckUndo"){deckUndo();return}
  if(t.id==="askOpen2"){openAsk();return}
  if(t.id==="onbReplay"){UI.onbPath="";openOnboarding();return}
  if(t.id==="tourGo"){startTour();return}
  if((el=c("[data-role]"))){MINE.role=el.dataset.role;onbSaveStep1();drawOnb();return}
  if((el=c("[data-path]"))){UI.onbPath=el.dataset.path;drawOnb();return}
  if(t.id==="onbNext"){if(UI.onb===1)onbSaveStep1();if(UI.onb===2&&!UI.onbPath){toast("Pick where to start");return}UI.onb++;drawOnb();return}
  if(t.id==="onbBack"){UI.onb--;drawOnb();return}
  if(t.id==="onbSkip"){finishOnb(false);return}
  if(t.id==="onbFinish"){finishOnb(false);return}
  if(t.id==="onbTour"){finishOnb(true);return}
  if(t.id==="tourNext"){UI.tour++;drawTour();return}
  if(t.id==="tourEnd"){UI.tour=99;drawTour();return}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#tour")){UI.tour=99;drawTour()}}});
