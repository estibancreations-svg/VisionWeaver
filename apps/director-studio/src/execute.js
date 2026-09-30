/* ================= v8: EXECUTE — THELMA asks, Sire says yes, then she does it ================= */
/* THELMA can only DO things from this short list, and only after the viewer taps "Yes, do it" on a
   card. Every run is written to the Activity log and the Conversation log, and most can be undone.
   Hard limits (never on the list): Gate 2 / publishing, spending credits or generating, deleting,
   changing connections, sharing or settings. */
const qFind=a=>{const k=String(a.item||a.id||"").toLowerCase();if(!k)return null;return QUEUE.find(q=>q.id===a.item||q.id===a.id)||QUEUE.find(q=>q.status!=="done"&&String(q.title).toLowerCase().includes(k))||null};
const projFind=a=>{const k=String(a.project||"").toLowerCase();if(!k)return activeProject();return allProjects().find(p=>p.id===a.project)||allProjects().find(p=>p.name.toLowerCase().includes(k))||null};
const stageFind=(p,k)=>{k=String(k||"").toLowerCase();return stagesOf(p).find(s=>s[0]===k)||stagesOf(p).find(s=>s[1].toLowerCase().includes(k))||null};
const ACTIONS={
  frame_decision:{label:a=>`${a.decision==="approved"?"Approve":a.decision==="redo"?"Mark for redo":"Put back to waiting"}: PART 2 key frame ${a.frame}`,gate:"Gate 1 decision (yours)",
    check:a=>!(a.frame in ST.p2)?`There's no PART 2 key frame called "${a.frame}".`:!["approved","redo","pending"].includes(a.decision)?"The decision must be approved, redo or pending.":null,
    run:a=>{const before=ST.p2[a.frame];patch({p2:{[a.frame]:a.decision}},`PART 2 ${a.frame}: ${a.decision==="approved"?"approved":a.decision==="redo"?"marked for redo":"back to waiting"} (said yes to THELMA)`);return {text:`${a.frame} is now ${a.decision==="approved"?"approved":a.decision==="redo"?"marked for redo":"waiting"}.`,undo:{action:"frame_decision",args:{frame:a.frame,decision:before||"pending"}},go:{page:"pictures",detail:a.frame}}}},
  queue_decision:{label:a=>{const q=qFind(a);return `${a.decision==="approved"?"Approve":a.decision==="changes"?"Send back":"Reopen"}: "${q?q.title:a.item}"`},
    check:a=>!qFind(a)?"I can't find that Guild queue item.":!["approved","changes","pending"].includes(a.decision)?"The decision must be approved, changes or pending.":null,
    note:a=>{const q=qFind(a);return q&&/publish|packet|gate 2/i.test(q.title)&&a.decision==="approved"?"This records your OK only. Publishing still needs APPROVED typed on the Publish page.":""},
    run:a=>{const q=qFind(a),before=q.status;qDecide(q.id,a.decision,[a.note,"done by THELMA after a yes"].filter(Boolean).join(" · "));return {text:`"${q.title}" is now ${a.decision==="changes"?"sent back":a.decision}.`,undo:{action:"queue_decision",args:{item:q.id,decision:before}},go:{page:"guild",detail:q.title.split(" ").slice(0,4).join(" ")}}}},
  mark_recorded:{label:a=>`Mark narration ${a.cue} as recorded`,check:a=>!CUES.find(c=>c[0]===a.cue)?`There's no narration cue "${a.cue}".`:ST.recorded[a.cue]?`${a.cue} is already marked recorded.`:null,
    run:a=>{patch({recorded:{[a.cue]:{at:nowISO(),by:store.uid||null}}},`Recorded narration ${a.cue} (said yes to THELMA)`);return {text:`${a.cue} is marked recorded.`,undo:{action:"unmark_recorded",args:{cue:a.cue}},go:{page:"booth"}}}},
  unmark_recorded:{hidden:1,label:a=>`Unmark narration ${a.cue}`,check:()=>null,run:a=>{patch({recorded:{[a.cue]:null}},`Unmarked narration ${a.cue} (undo)`);delete ST.recorded[a.cue];return {text:`${a.cue} is back to not recorded.`}}},
  cast_review:{label:a=>`Mark ${a.code} as reviewed in Cast & avatars`,check:a=>!CAST.find(c=>c[0]===a.code)?`There's no cast code "${a.code}".`:null,
    run:a=>{const before=(ST.avatars[a.code]||{}).reviewed||null;patch({avatars:{[a.code]:{reviewed:{at:nowISO(),by:store.uid||null}}}},`Reviewed ${a.code} (said yes to THELMA)`);return {text:`${a.code} is marked reviewed.`,undo:{action:"cast_unreview",args:{code:a.code,before}},go:{page:"cast",detail:a.code}}}},
  cast_unreview:{hidden:1,label:a=>`Undo review of ${a.code}`,check:()=>null,run:a=>{patch({avatars:{[a.code]:{reviewed:a.before||null}}},`Reopened review of ${a.code} (undo)`);return {text:`${a.code} review undone.`}}},
  create_project:{label:a=>`Create a new project: "${a.name}" (${(PTYPES[a.type]||PTYPES.other).name})`,check:a=>!String(a.name||"").trim()?"A project needs a name.":store.readOnly?"This viewer can't add projects.":null,
    run:a=>{const id=createProject(a);return {text:`"${a.name}" is created and open.`,undo:{action:"archive_project",args:{id}},go:{page:"project"}}}},
  archive_project:{hidden:1,label:a=>`Archive project`,check:()=>null,run:a=>{const p=projById(a.id);if(p)projPatch(p.id,{status:"archived"},`${p.name}: archived (undo)`);setActive(XR_ID);return {text:"Project archived."}}},
  add_task:{label:a=>{const p=projFind(a),s=p&&stageFind(p,a.stage);return `Add task "${a.text}" to ${p?p.name:"the project"}${s?" · "+s[1]:""}`},
    check:a=>{const p=projFind(a);if(!p)return "I can't find that project.";if(p.builtin)return "Crossroads Ep 1 uses its own pages. Add a Guild queue item instead.";if(!stageFind(p,a.stage))return "I can't find that stage.";if(!String(a.text||"").trim())return "The task needs words.";return null},
    run:a=>{const p=projFind(a),s=stageFind(p,a.stage);const t=addTask(p,s[0],a.text);return {text:"Task added.",undo:{action:"remove_task",args:{project:p.id,task:t.id}},go:{page:"project"}}}},
  remove_task:{hidden:1,label:()=>"Remove task",check:()=>null,run:a=>{const p=projById(a.project);if(p)projPatch(p.id,{tasks:(p.tasks||[]).filter(t=>t.id!==a.task)},`${p.name}: task removed (undo)`);return {text:"Task removed."}}},
  set_stage:{label:a=>{const p=projFind(a),s=p&&stageFind(p,a.stage);return `${a.status==="done"?"Finish":a.status==="doing"?"Start":"Reset"} stage "${s?s[1]:a.stage}" in ${p?p.name:"the project"}`},
    check:a=>{const p=projFind(a);if(!p)return "I can't find that project.";if(p.builtin)return "Crossroads Ep 1 stages follow its pages.";const s=stageFind(p,a.stage);if(!s)return "I can't find that stage.";if(!["todo","doing","done"].includes(a.status))return "Status must be todo, doing or done.";if(a.status==="done"&&s[2]===2)return "Gate 2 can't be done by THELMA. You type APPROVED on the stage yourself.";if(a.status==="done"&&s[2]===1)return "Gate 1 is your approval. Use the \"I approve these visuals\" button on the stage.";return null},
    run:a=>{const p=projFind(a),s=stageFind(p,a.stage),before=stageStatus(p,s[0]);setStage(p,s[0],a.status,"THELMA after a yes");return {text:`"${s[1]}" is now ${a.status==="doing"?"in progress":a.status}.`,undo:{action:"set_stage",args:{project:p.id,stage:s[0],status:before}},go:{page:"project"}}}},
  send_to_drive:{label:a=>`Save the ${(OUT_DOCS.find(x=>x[0]===a.doc)||[0,a.doc])[1]} to Google Drive (new file)`,check:a=>!OUT_DOCS.find(x=>x[0]===a.doc)?`I don't know the document "${a.doc}".`:!CAP.mcp?"Drive isn't reachable from this view.":connOff("drive")?"Google Drive is turned off in Settings → Connections.":null,
    run:async a=>{await driveSend(a.doc);return {text:UI.driveMsg||"Sent to Drive.",link:UI.driveLink||""}}}
};
const NEVER_DO="publishing or anything at Gate 2, spending Runway credits or generating images/video, deleting anything, changing connections, sharing or settings";
function actLabel(m){const A=ACTIONS[m.act.action];try{return A?A.label(m.act.args||{}):m.act.action}catch(e){return m.act.action}}
function pushAction(action,args,why,before){const A=ACTIONS[action];const err=!A||A.hidden?`"${action}" isn't something I'm allowed to do.`:A.check(args||{});
  const msg={role:"action",at:nowISO(),done:true,content:A&&!A.hidden?A.label(args||{}):action,act:{action,args:args||{},gate:A&&A.gate||"",why:String(why||"").slice(0,300),state:err?"blocked":"pending",result:err||"",note:A&&A.note?A.note(args||{}):""}};
  curConv();const i=before?THELMA.chat.indexOf(before):-1;if(i>=0)THELMA.chat.splice(i,0,msg);else THELMA.chat.push(msg);renderChat();return msg}
async function runAction(m,{undo}={}){if(m.act.state!=="pending"&&!undo)return;if(store.readOnly){toast("This viewer can't make changes");return}
  const spec=undo?m.act.undo:{action:m.act.action,args:m.act.args};const A=ACTIONS[spec.action];
  const err=A?A.check(spec.args||{}):"Unknown action";if(err&&!undo){m.act.state="failed";m.act.result=err;renderChat();saveChat();return}
  try{const r=await A.run(spec.args||{});
    if(undo){m.act.state="undone";m.act.result="Undone. "+(r&&r.text||"");m.act.undo=null}else{m.act.state="done";m.act.result=r&&r.text||"Done.";m.act.undo=r&&r.undo||null;m.act.go=r&&r.go||null;m.act.link=r&&r.link||""}
    m.act.by=store.uid||null;m.act.doneAt=nowISO();addLog(`THELMA ${undo?"undid":"did"} (after a yes): ${m.content}`);
  }catch(e){m.act.state="failed";m.act.result="It didn't work: "+String(e&&e.message||e).slice(0,160)}
  renderChat();saveChat();logConv(curConv());}
function actionCardHTML(m,i){const a=m.act||{};const st=a.state||"pending";
  const head={pending:"THELMA wants to do this for you",done:"Done",blocked:"THELMA can't do this",failed:"Didn't work",declined:"You said no",undone:"Undone"}[st];
  const pendingN=THELMA.chat.filter(x=>x.role==="action"&&x.act&&x.act.state==="pending").length;
  return `<div class="actcard ${st}" data-msg="${i}"><div class="acthead"><span class="orb"></span><b>${esc(head)}</b>${a.gate?`<span class="note">${esc(a.gate)}</span>`:""}</div>
   <div class="actwhat">${esc(m.content)}</div>${a.why?`<div class="note">Why: ${esc(a.why)}</div>`:""}${a.note?`<div class="note warnnote">${esc(a.note)}</div>`:""}
   ${a.result?`<div class="actres">${esc(a.result)}${a.link?` <a href="${esc(a.link)}" target="_blank" rel="noopener">Open ↗</a>`:""}</div>`:""}
   <div class="row">${st==="pending"&&!store.readOnly?`<button type="button" class="btn primary small" data-act-yes="${i}">Yes, do it</button><button type="button" class="btn small" data-act-no="${i}">No</button>${pendingN>1?`<button type="button" class="btn small" data-act-all="1">Yes to all ${pendingN}</button>`:""}`:""}
    ${st==="done"&&a.go?`<button type="button" class="btn small" data-act-go="${i}">See it ↗</button>`:""}${st==="done"&&a.undo&&!store.readOnly?`<button type="button" class="btn small" data-act-undo="${i}">Undo</button>`:""}</div></div>`}
document.addEventListener("click",e=>{const t=e.target;let el;
  if((el=t.closest("[data-act-yes]"))){runAction(THELMA.chat[+el.dataset.actYes]);return}
  if((el=t.closest("[data-act-no]"))){const m=THELMA.chat[+el.dataset.actNo];m.act.state="declined";m.act.result="Nothing was changed.";addLog(`Said no to THELMA: ${m.content}`);renderChat();saveChat();logConv(curConv());return}
  if(t.closest("[data-act-all]")){(async()=>{for(const m of THELMA.chat.filter(x=>x.role==="action"&&x.act&&x.act.state==="pending"))await runAction(m)})();return}
  if((el=t.closest("[data-act-undo]"))){runAction(THELMA.chat[+el.dataset.actUndo],{undo:true});return}
  if((el=t.closest("[data-act-go]"))){const g=THELMA.chat[+el.dataset.actGo].act.go;if(g)transport(g);return}
});

/* ---------- give THELMA the new tools and rules ---------- */
Object.assign(TOOL_LBL,{request_action:"Asked for your yes",list_projects:"Read your projects"});
const TOOL_ORDER=["studio_status","open_page","request_action","list_projects","list_queue","get_shot","get_character","search_records","note_to_claude","propose_decision","read_uplink","read_database","check_connections","save_note","search_log"];
const _thelmaTools=thelmaTools;
thelmaTools=function(){const T=_thelmaTools();let ai=null;
  T.push({name:"request_action",description:`Offer to DO something for the viewer. It shows a Yes/No card; nothing happens until they tap Yes. Use it whenever they ask you to do, mark, approve (on their behalf), add, start or save something on this list: frame_decision {frame:"S05", decision:"approved|redo|pending"}; queue_decision {item:"title words or id", decision:"approved|changes|pending", note}; mark_recorded {cue:"N03"}; cast_review {code:"FL-MR32"}; create_project {name, type:"episode|social|kids|podcast|doc|other", due:"YYYY-MM-DD", desc}; add_task {project, stage, text}; set_stage {project, stage, status:"todo|doing|done"} (not for gate stages); send_to_drive {doc:"status|editlist|narration|shots|srt|backup"}. One card per action; several cards are fine. You can NEVER do: ${NEVER_DO}.`,
    inputSchema:{type:"object",properties:{action:{type:"string",enum:Object.keys(ACTIONS).filter(k=>!ACTIONS[k].hidden)},args:{type:"object"},why:{type:"string"}},required:["action","args"]},
    execute:i=>{const cur=THELMA.chat.filter(m=>m.role==="assistant"&&!m.done).pop();const m=pushAction(i.action,i.args,i.why,cur);return m.act.state==="blocked"?{status:"blocked",reason:m.act.result}:{status:"waiting_for_yes",note:"A Yes/No card is on screen. Say what it will do. Do not say it's done."}}});
  T.push({name:"list_projects",description:"List the studio's projects with type, stage progress, the current stage, next step and waiting decisions.",execute:()=>allProjects().map(p=>{const pr=progress(p),cs=currentStage(p);return {id:p.id,name:p.name,type:p.type,status:p.status||"active",due:p.due||"",stages_done:`${pr.done}/${pr.total}`,current_stage:cs?cs[1]:"finished",next:nextStep(p),waiting_decisions:projQueue(p).filter(q=>q.status==="pending").length,active:p.id===activeId()}})});
  return T.sort((a,b)=>{const x=TOOL_ORDER.indexOf(a.name),y=TOOL_ORDER.indexOf(b.name);return (x<0?99:x)-(y<0?99:y)})};
const _thelmaContext=thelmaContext;
thelmaContext=function(){const p=activeProject(),cs=currentStage(p),pr=progress(p);
  return _thelmaContext()+`

PROJECTS (${allProjects().length}): ${allProjects().map(x=>`${x.name} [${x.type}, ${progress(x).done}/${progress(x).total} stages${x.status==="archived"?", archived":""}]`).join(" | ")}.
ACTIVE PROJECT: ${p.name} (${(PTYPES[p.type]||PTYPES.other).name}). Now at: ${cs?cs[1]:"finished"}. Next step: ${nextStep(p)}. Pages: projects (all projects), project (this one), decide (swipe deck), welcome (start here).
ADDRESS THE VIEWER AS: ${MINE.callMe||"Sire"}${MINE.role?` (role: ${MINE.role})`:""}.

DOING THINGS (execute): When the viewer wants something done that is on your action list, don't just explain it. Offer it with request_action so a Yes/No card appears, then say in one line what the card will do. Only say it's done after they tap Yes (you'll see the card's state later in the conversation). Their Yes is the approval. You never approve on your own. Never offer: ${NEVER_DO}. For those, explain the steps and use a (go: page) option to take them there.`};
