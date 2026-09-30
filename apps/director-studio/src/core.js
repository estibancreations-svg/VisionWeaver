/* ================= STATE + STORE ================= */
const CAP = {db:null,user:null,sample:null,dl:null,mcp:null,assets:null,perms:null};
const store = {mode:"local",uid:null,exists:false,chain:Promise.resolve(),readOnly:false};
const NAMES = {};
function defaults(){
  const p2={};P2FRAMES.forEach(f=>p2[f[0]]=f[3]==="approved"?"approved":"pending");
  return {p2,recorded:{},deliver:{"1":[false,false,true,true,false]},setup:{"zapier-acct":{at:"2026-09-29T21:45:00-04:00",by:null}},shot:{},schedule:{},notes:{},live:{},
    settings:{thelma:{enabled:true,guide:true,tier:"default",voice:false,autoRead:false},output:{prefix:"E01",driveFolder:"",emailPrefix:"[VisionWeaver]",paper:"letter"},connections:{},uplink:{triggerId:""}},
    avatars:{},rights:{}};
}
let ST = defaults(), QUEUE = [], LOG = [], UPLINK = [], FILES = [], MINE = {};
const UI = {view:"overview",full:false,zoom:14,t:0,playing:false,sel:null,tlPart:1,shotPart:1,shotSel:null,shotQ:"",mapKey:"1-2",mapZoom:60,cue:"N01",wpm:150,prompting:false,promptT:0,
  uploads:[],pk:{part:"1",plat:"youtube_shorts",title:"He was closing the deal. | Crossroads of Identity Ep. 1 Pt. 1",desc:"He was in the middle of closing a deal when he found out the man who took him in at fifteen was gone. Nobody in the room noticed. Except the water.\n\nCrossroads of Identity · Episode 1 · Part 1: \"The Text\"\nMade with AI tools.",tags:"#CrossroadsOfIdentity #ShortFilm #BlackStories #LGBTQStories #AtlantaFilm #Drama #Storytelling",video:"",cover:"",when:"2026-10-01T18:00",vis:"private",ok:""},
  jc:{mode:"animate",budget:1600,notes:"Narrated shots at 10 s per the cue sheet.",off:{}},draftOut:"",draftBusy:false,qFilter:"all",setTab:"appearance",castSel:"FL-MR32",castQ:"",dbTab:"studio",dbTable:null,dbRows:null,dbBusy:false,dbTables:null,dbQ:"",logQ:"",rightsPart:"1"};
const APP_KEY="vw-studio-appearance";
const APP = Object.assign({theme:"auto",accent:"tungsten",scale:100,density:"comfortable",motion:"full",rail:"full"},(()=>{try{return JSON.parse(localStorage.getItem(APP_KEY)||"{}")}catch(e){return {}}})());
function applyAppearance(){const r=document.documentElement;if(APP.theme==="auto")delete r.dataset.theme;else r.dataset.theme=APP.theme;r.dataset.accent=APP.accent;r.dataset.density=APP.density;r.dataset.motion=APP.motion;r.dataset.rail=APP.rail;r.style.fontSize=(14*APP.scale/100)+"px"}
function setApp(k,v){APP[k]=v;try{localStorage.setItem(APP_KEY,JSON.stringify(APP))}catch(e){}applyAppearance()}
applyAppearance();
const TH=()=>ST.settings.thelma;
const LKEY="vw-studio-v5";
function loadLocal(){try{const s=JSON.parse(localStorage.getItem(LKEY)||"null");if(s){deepMerge(ST,s.st||{});LOG=s.log||[];QUEUE=s.queue||[]}}catch(e){}}
function saveLocal(){try{localStorage.setItem(LKEY,JSON.stringify({st:ST,log:LOG.slice(0,60),queue:QUEUE}))}catch(e){}}
function deepMerge(a,b){for(const k in b){const v=b[k];if(v&&typeof v==="object"&&!Array.isArray(v)){if(!a[k]||typeof a[k]!=="object"||Array.isArray(a[k]))a[k]={};deepMerge(a[k],v)}else a[k]=v}return a}
const clone=o=>JSON.parse(JSON.stringify(o));
const nowISO=()=>new Date().toISOString();

function write(fn){store.chain=store.chain.then(fn).catch(e=>{handleErr(e)});return store.chain}
function handleErr(e){const c=e&&e.code;if(c==="invalid_argument"&&store.mode==="shared"){store.readOnly=true;toast("You can view this studio but not change it")}else if(c==="quota_exceeded")toast("Saved data is full. Clear old queue items.");else if(c==="revoked")toast("Access to saved data ended");else toast("Couldn't save. Try again in a moment.")}
async function patch(obj,logText){
  deepMerge(ST,clone(obj));
  if(store.mode==="shared"&&!store.readOnly){
    write(async()=>{const ref=CAP.db.doc("studio/state");if(store.exists)await ref.update(obj);else{await ref.set(deepMerge(defaults(),ST));store.exists=true}});
  } else saveLocal();
  if(logText)addLog(logText);
  refresh();
}
function addLog(text){
  const e={at:nowISO(),by:store.uid||null,text};LOG=[e,...LOG].slice(0,120);
  if(store.mode==="shared"&&!store.readOnly)write(()=>CAP.db.doc("log/main").set({entries:LOG}));else saveLocal();
}
async function qAdd(item){
  const body={dept:item.dept,title:item.title,detail:item.detail||"",part:item.part||"",go:item.go||"",status:"pending",created:nowISO(),createdBy:store.uid||null,decided:null,decidedBy:null,note:""};
  if(store.mode==="shared"&&!store.readOnly){write(()=>CAP.db.collection("queue").add(body))}else{QUEUE.push({id:"l"+Date.now(),...body});saveLocal()}
  addLog(`Added to the ${item.dept} queue: ${item.title}`);refresh();
}
async function qDecide(id,status,note){
  const it=QUEUE.find(x=>x.id===id);if(!it)return;
  const up={status,note:note||"",decided:status==="pending"?null:nowISO(),decidedBy:status==="pending"?null:(store.uid||null)};
  Object.assign(it,up);
  if(store.mode==="shared"&&!store.readOnly)write(()=>CAP.db.doc("queue/"+id).update(up));else saveLocal();
  addLog(`${status==="approved"?"Approved":status==="changes"?"Sent back":"Reopened"}: ${it.title}${note?` — "${note}"`:""}`);refresh();
}
async function initCaps(){
  const c=window.claude;if(!c||typeof c.use!=="function")return;
  const get=n=>c.use(n).catch(()=>null);
  const [db,user,sample,dl,mcp]=await Promise.all([get("db"),get("user"),get("sample"),get("downloads"),get("mcp")]);
  CAP.user=user;CAP.sample=sample;CAP.dl=dl;CAP.mcp=mcp;
  if(user){try{store.uid=await user.id()}catch(e){}}
  if(db){
    CAP.db=db;store.mode="shared";
    if(user){try{const w=await user.can("data.write");if(w===false)store.readOnly=true}catch(e){}}
    db.doc("studio/state").onSnapshot(s=>{if(s.exists){store.exists=true;ST=deepMerge(defaults(),clone(s.data()))}else store.exists=false;refresh()},e=>handleErr(e));
    db.collection("queue").onSnapshot(s=>{QUEUE=s.docs.map(d=>Object.assign({id:d.id},d.data()));refresh()},e=>handleErr(e));
    db.doc("log/main").onSnapshot(s=>{LOG=s.exists?((s.data().entries)||[]):[];refresh()},e=>handleErr(e));
    db.collection("uplink").onSnapshot(s=>{UPLINK=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>String(b.created).localeCompare(String(a.created)));refresh()},e=>handleErr(e));
    db.collection("files").onSnapshot(s=>{FILES=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>String(b.at).localeCompare(String(a.at)));refresh()},e=>handleErr(e));
    if(store.uid){db.doc("data/users/"+store.uid+"/prefs").onSnapshot(s=>{MINE=s.exists?s.data():{};if(MINE.thelmaChat&&!THELMA.chat.length)THELMA.chat=MINE.thelmaChat.slice(-30);refresh()},()=>{})}
  }
  try{CAP.assets=await get("assets")}catch(e){}
  try{CAP.perms=await get("permissions")}catch(e){}
  thelmaChrome();
  refresh(true);
}
async function resolveNames(){
  if(!CAP.user)return;const ids=[...new Set([...document.querySelectorAll("[data-uid]")].map(e=>e.dataset.uid).filter(x=>x&&!(x in NAMES)))];
  if(ids.length){try{const ps=await CAP.user.profiles(ids);ids.forEach(i=>NAMES[i]=(ps[i]&&ps[i].name)||"")}catch(e){ids.forEach(i=>NAMES[i]="")}}
  document.querySelectorAll("[data-uid]").forEach(el=>{const n=NAMES[el.dataset.uid];el.textContent=el.dataset.uid===store.uid?(n?n+" (you)":"you"):(n||"Someone")});
}
const who=uid=>uid?`<span data-uid="${esc(uid)}">${uid===store.uid?"you":"…"}</span>`:(store.mode==="shared"?"Claude":"you");

/* ================= HELPERS ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>Number(n).toLocaleString("en-US");
const tc=t=>{const m=Math.floor(t/60),s=t-m*60;return m+":"+s.toFixed(1).padStart(4,"0")};
const when=iso=>{if(!iso)return"";const d=new Date(iso);return d.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})+" ET"};
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2600)}
function copy(text,msg){const ok=()=>toast(msg||"Copied");const fb=()=>{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok()}catch(e){toast("Select the text and copy it by hand")}ta.remove()};try{navigator.clipboard.writeText(text).then(ok,fb)}catch(e){fb()}}
async function saveFile(filename,data){
  if(!CAP.dl){copy(data,"Downloads aren't available here, so the contents were copied instead");return}
  try{await CAP.dl.save({filename,data});toast("Saved "+filename)}catch(e){if(e&&e.code==="declined")return;if(e&&e.code==="rate_limited"){toast("A save is already waiting for your answer");return}copy(data,"Couldn't save the file, so the contents were copied instead")}
}
const pill=(s,t)=>`<span class="pill ${s}">${esc(t)}</span>`;
const dlBtn=(id,label)=>`<button type="button" class="btn small" data-dl-file="${id}">${label||"Download"}</button>`;

/* ================= DERIVED ================= */
const DATA_SHOTS = (()=>{const o={};for(const p in DATA.shots)o[p]=DATA.shots[p].map(r=>Object.assign({},r));
  const i1=o[1].findIndex(r=>r.id==="S05");o[1].splice(i1+1,0,{id:"S05b",plate:"a60f82fb… conf room (AM)",pin:"C3",lens:"50mm · 4.5 ft · eye",move:"Locked",framing:"2-shot, Jayden reads, manager leans in",face:"FL-JK · FL-JM",light:"LK-ATL-AM",sound:"Narration N01 (full episode only)"});
  const i2=o[2].findIndex(r=>r.id==="S03");o[2].splice(i2+1,0,{id:"S03b",plate:"a60f82fb…",pin:"C4",lens:"50mm · low",move:"Locked",framing:"INSERT phone face-down on his thigh",face:"—",light:"LK-ATL-AM",sound:"Narration N03 continues; room talk muffled"});
  return o})();
function shotStatus(p,id){
  const k=`P${p}-${id}`;if(ST.shot[k])return ST.shot[k];
  if(p==1)return "animated";
  if(p==2){if(id==="S13a")id="S13";else if(/^S13[b-d]$/.test(id))return "approved";const s=ST.p2[id];return s==="approved"?"approved":s==="redo"?"redo":"kf"}
  return "planned";
}
const STATUS_LBL={planned:["idle","Planned"],kf:["you","Key frame · your pick"],redo:["block","Redo"],approved:["done","Approved"],animated:["done","Animated"]};
function waiting(){
  const list=[];
  const pend=QUEUE.filter(q=>q.status==="pending");
  pend.forEach(q=>list.push({t:q.title,d:q.detail,go:q.go||"guild",tag:q.dept,id:q.id,created:q.created}));
  const picks=Object.values(ST.p2).filter(v=>v==="pending").length;
  if(picks&&!pend.some(q=>/key frame/i.test(q.title)))list.unshift({t:"Pick PART 2 key frames",d:`${picks} frames made and waiting. Nothing gets animated until you approve it.`,go:"pictures",tag:"Design"});
  if(!ST.recorded.N01&&!pend.some(q=>/N01/.test(q.title)))list.push({t:"Record narration N01",d:"37 words, about 15 s. Full episode only.",go:"booth",tag:"Sound"});
  if(!ST.deliver["1"][0]&&!pend.some(q=>/CapCut|Assemble/i.test(q.title)))list.push({t:"Assemble PART 1 in CapCut",d:"13 clips and 11 sounds are ready. Download them first; Runway links expire.",go:"edit",tag:"Edit"});
  return list;
}
function partsDone(){return (ST.deliver["1"]&&ST.deliver["1"][0]?1:0)+[2,3,4,5].filter(p=>ST.deliver[p]&&ST.deliver[p][0]).length}
function matrix(p){
  const r=(s,t)=>[s,t];
  const recIn=CUES.filter(c=>c[1]==p);const recDone=recIn.filter(c=>ST.recorded[c[0]]).length;
  const shots=DATA_SHOTS[p];const st=shots.map(s=>shotStatus(p,s.id));
  const nAnim=st.filter(x=>x==="animated").length,nAppr=st.filter(x=>x==="approved"||x==="animated").length,nKf=st.filter(x=>x!=="planned").length;
  const dl=ST.deliver[p]||[];
  return [
    r("done",p<=2&&p==2?"Script v8 written":"Locked"),
    r("done","All locks set"),
    nAppr===shots.length?r("done",`${nAppr}/${shots.length} approved`):nKf?r("you",`${nAppr}/${shots.length} approved`):r("idle","Not made"),
    nAnim===shots.length?r("done",`${nAnim} clips made`):nAnim?r("wait",`${nAnim}/${shots.length} animated`):r("idle",nAppr?"After picks":"—"),
    recDone===recIn.length?r("done",p==1?"All sound in":"Narration in"):r(p<=2?"you":"idle",`${recDone}/${recIn.length} narration`),
    dl[0]?r("done","Short cut"):p==1?r("you","Assemble in CapCut"):r("idle","—"),
    dl.filter(Boolean).length===5?r("done","All files ready"):dl.some(Boolean)?r("wait",`${dl.filter(Boolean).length}/5 files`):r("idle","—"),
    (ST.schedule[p]&&Object.values(ST.schedule[p]).some(Boolean))?r("wait","Scheduled"):p==1?r("idle","Packet drafted"):r("idle","—")
  ];
}

/* ================= NAV ================= */
const NAV=[
 ["Home",[["overview","Run of show","◎"],["guild","Directors Guild queue","Q"]]],
 ["Pipeline",[["source","Books & script","1"],["locks","Locks & maps","2"],["cast","Cast & avatars","2"],["shots","Shot bible","2"],["pictures","Pictures","3"],["motion","Motion","4"],["booth","Narration booth","5"],["sound","Sound & music","5"],["edit","Edit","6"],["deliver","Deliver","7"],["publish","Publish & social","8"]]],
 ["Intelligence",[["thelma","THELMA AI","Th"],["uplink","Claude uplink","↯"]]],
 ["System",[["settings","Settings","⚙"],["setup","Live connections","Li"],["database","Database","DB"],["uploads","Uploads & files","⇪"],["rights","Rights & provenance","©"],["activity","Activity log","≡"],["ledger","Credit ledger","$"]]]
];
function railDot(v){
  if(v==="pictures")return Object.values(ST.p2).some(x=>x==="pending")?"wait":"done";
  if(v==="booth"||v==="sound")return CUES.some(c=>!ST.recorded[c[0]])?"wait":"done";
  if(v==="edit")return ST.deliver["1"][0]?"done":"wait";
  if(v==="guild")return QUEUE.some(q=>q.status==="pending")?"wait":"done";
  if(v==="setup")return SETUP_STEPS.every(s=>ST.setup[s[0]])?"done":"wait";
  if(v==="cast")return CAST.some(c=>c[3]==="wait"&&!(ST.avatars[c[0]]&&ST.avatars[c[0]].reviewed))?"wait":"done";
  if(v==="uplink")return UPLINK.some(u=>u.from==="claude"&&u.status==="answered"&&!u.read)?"you":UPLINK.some(u=>u.status==="open")?"wait":"";
  if(v==="rights"){const r=ST.rights[UI.rightsPart]||{};return RIGHTS.every(x=>r[x[0]])?"done":"wait"}
  if(v==="thelma")return TH().enabled?"done":"idle";
  if(["source","locks","shots","motion"].includes(v))return "done";
  return "";
}
function renderRail(){
  $("#rail").innerHTML=NAV.map(([h,items])=>`<h4>${h}</h4>`+items.map(([v,l,n])=>`<button type="button" data-view="${v}" aria-current="${UI.view===v}"><span class="n">${n?(/^\d+$/.test(n)?String(n).padStart(2,"0"):n):"·"}</span><span class="lbl">${l}</span><span class="dot ${railDot(v)}"></span></button>`).join("")).join("");
  $("#st-you").textContent=waiting().length;$("#st-parts").textContent=`${partsDone()} of 5`;
  const lr=ST.live&&ST.live.runway;const cb=$(".topstats .stat.credits b"),cs=$(".topstats .stat.credits span");
  if(lr&&lr.ok&&typeof lr.credits==="number"){cb.textContent=fmt(lr.credits);cs.textContent="Runway credits · live "+when(ST.live.at).replace(/, \d.*$/,"")}
  const m=$("#mode");m.className="mode"+(store.mode==="shared"?" shared":"");m.lastElementChild.textContent=store.mode==="shared"?(store.readOnly?"Shared · view only":"Shared · saved for the team"):"This browser only";
}
function go(v){if(v==="thelma"&&!TH().enabled){toast("THELMA is off. Turn her on in Settings → THELMA.");v="settings";UI.setTab="thelma"}UI.view=v;UI.playing=false;UI.prompting=false;renderRail();render();try{history.replaceState(null,"","#"+v)}catch(e){};$("#main").scrollTop=0}
