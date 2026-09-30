/* ================= THELMA AI: assistant, tools, guide bar, voice, palette ================= */
const THELMA = {chat:[], convs:[], cur:0, loaded:false, busy:false, ops:null, opsBusy:false};
/* v7.3: each conversation has a topic so THELMA stays on task; a new launch starts fresh */
const THELMA_EPOCH="2026-09-30b";
const TOPICS=[["general","General · what's next"],["frames","PART 2 frames · Gate 1"],["publish","Publish & deliver · Gate 2"],["cast","Cast & avatars"],["sound","Narration & sound"],["claude","Tasks for Claude · uplink"],["system","Settings & system"],["ideas","Ideas & notes"]];
const TOPIC_CHIPS={general:["What should I do next?","Where are we in the process?","What's the closest deadline?"],frames:["Which frames still need my pick?","What makes a frame pass Gate 1?","Show me the redo list"],publish:["What does Gate 2 need?","Is the PART 1 packet ready?","What's left before publishing?"],cast:["Who still needs a review?","Explain the three boards simply","What does a lock record hold?"],sound:["Which narration cues are left?","What sounds does PART 2 need?"],claude:["Did Claude answer me?","Send Claude a task for me","What's open in the uplink?"],system:["Check all connections","What should I set up first?","Explain the uplink settings"],ideas:["Read my notes back to me","Turn my notes into a plan"]};
const topicName=k=>(TOPICS.find(t=>t[0]===k)||TOPICS[0])[1];
function newConv(title,chat,topic){const c={id:"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),title:title||"New conversation",topic:topic||"general",chat:chat||[],at:nowISO()};THELMA.convs.push(c);THELMA.cur=THELMA.convs.length-1;THELMA.chat=c.chat;return c}
function clearConv(){if(THELMA.busy){toast("Wait for THELMA to finish");return}const c=curConv();THELMA.convs.splice(THELMA.cur,1);newConv("New conversation",[],c.topic);THELMA.clearArm=false;renderChat();saveChat();toast("Conversation cleared")}
function curConv(){if(!THELMA.convs.length)newConv("New conversation",THELMA.chat);return THELMA.convs[THELMA.cur]||THELMA.convs[0]}
function switchConv(i){if(THELMA.busy){toast("Wait for THELMA to finish");return}if(!THELMA.convs[i])return;THELMA.cur=i;THELMA.chat=THELMA.convs[i].chat;renderChat();saveChat()}
function thelmaLoad(m){if(THELMA.loaded||THELMA.chat.length)return;THELMA.loaded=true;
  if(m&&Array.isArray(m.thelmaConvs)&&m.thelmaConvs.length){THELMA.convs=m.thelmaConvs.filter(c=>c.chat&&c.chat.length).map(c=>({id:c.id,title:c.title,topic:c.topic||"general",at:c.at,earlier:c.earlier||m.thelmaEpoch!==THELMA_EPOCH,chat:(c.chat||[]).map(x=>Object.assign({},x))}));THELMA.cur=Math.min(+m.thelmaCur||0,Math.max(0,THELMA.convs.length-1));if(THELMA.convs.length)THELMA.chat=THELMA.convs[THELMA.cur].chat}
  else if(m&&m.thelmaChat&&m.thelmaChat.length){newConv("Earlier conversation",m.thelmaChat.slice(-30).map(x=>Object.assign({},x,parseOpts(x.content))));curConv().earlier=true}
  if(!m||m.thelmaEpoch!==THELMA_EPOCH){newConv("New conversation",[],"general");THELMA.fresh=true;saveChat()}
  if(typeof renderChat==="function")renderChat()}
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
Pages you can open: ${Object.keys(V).join(", ")}.
- Claude uplink: wake-up ${ST.settings.uplink.triggerId?"set":"NOT set"}; automatic wake ${(ST.settings.uplink||{}).autoWake!==false?"on":"off"}; last wake ${(ST.settings.uplink||{}).lastWake||"never"}; open items ${UPLINK.filter(u=>u.status==="open").length}.

THIS CONVERSATION'S TOPIC: ${topicName(curConv().topic)}. Stay on this topic so nothing gets missed. If Sire asks about something clearly outside it, answer in one or two lines and offer an option like "» Start a new conversation about <that>".

HOW TO ANSWER (important):
- Talk like a warm, calm first assistant director. Plain sentences at a 6th-grade reading level. Use a short analogy when it helps.
- Short paragraphs. Bullets or numbered steps are fine. Bold only a few key words. No tables, no code, no JSON, no SQL, and never say tool names or field names unless Sire asks for them.
- End EVERY answer with 2 to 4 next-step options that fit THIS answer, each on its own line starting with "» " (under 60 letters, worded the way Sire would say it, e.g. "» Show me the pending frames"). New question, new options: never reuse options from earlier answers unless they are still the best next step.
- When you send work to Claude, read the result and say plainly whether Claude was woken. If it wasn't, say why and exactly what to press.`;
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
  T.push({name:"note_to_claude",description:"Send work to Claude through the Claude uplink (building, fixing, pushing to GitHub, research, anything outside this page). It saves the task AND wakes Claude when it can. Read the result: tell Sire plainly whether Claude was woken, and if not, why and what to press.",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"]},execute:async i=>await sendToClaude({kind:"task",from:"thelma",text:"(from THELMA) "+String(i.text).slice(0,1500)},{quiet:true})});
  T.push({name:"read_uplink",description:"Read the Claude uplink: recent tasks sent to Claude, their status, and Claude's replies. Use when Sire asks if Claude answered.",execute:()=>({last_wake:(ST.settings.uplink||{}).lastWake||null,items:UPLINK.slice(0,8).map(u=>({from:u.from,kind:u.kind,status:u.status,created:u.created,text:String(u.text).slice(0,200),reply:String(u.reply||"").slice(0,800),replied:u.repliedAt||null}))})});
  T.push({name:"save_note",description:"Save a short note to the shared Notes board (ideas, reminders, things to come back to). Use when Sire says note this, jot this, or remember this for later.",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"]},execute:i=>{if(store.readOnly)throw new Error("This viewer can't add notes");addJot(String(i.text).slice(0,1200),"THELMA");return {saved:true}}});
  return T;
}
function safeSelect(sql,max){
  let s=String(sql||"").trim().replace(/;+\s*$/,"");
  if(!/^(select|with)\b/i.test(s)||/;/.test(s))throw new Error("Only one SELECT is allowed");
  if(/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|execute|pg_read|pg_ls|lo_import|set\s+role)\b/i.test(s))throw new Error("Read-only: that word isn't allowed here");
  if(!/\blimit\s+\d+\s*$/i.test(s))s+=" limit "+max;
  return s;
}

/* ---------- chat (v7.2: readable answers, live options, branching, notes, better voice) ---------- */
const TOOL_LBL={studio_status:"Checked the studio",open_page:"Opened a page",search_records:"Searched the records",get_shot:"Read a shot",get_character:"Read a cast record",list_queue:"Read the Guild queue",propose_decision:"Put a proposal in your queue",check_connections:"Checked the connections",read_database:"Read the database",note_to_claude:"Sent work to Claude",read_uplink:"Read the Claude uplink",save_note:"Saved a note"};
function parseOpts(t){const lines=String(t||"").split("\n"),options=[],body=[];lines.forEach(l=>{const m=l.match(/^\s*(?:»|>>|&raquo;)\s*(.+?)\s*$/);if(m&&options.length<5)options.push(m[1].replace(/^\*\*|\*\*$/g,"").slice(0,90));else body.push(l)});return {body:body.join("\n").replace(/\s*(Options|Next steps|What next)\s*:?\s*$/i,"").trimEnd(),options}}
function mdInline(s){return s.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/(^|[\s(])\*(?!\s)([^*]+?)\*(?=[\s).,!?:;]|$)/g,"$1<i>$2</i>").replace(/`([^`]+)`/g,'<span class="kbd">$1</span>')}
function md(src){const L=esc(src).split("\n");let out="",list=null,code=false;const close=()=>{if(list){out+=`</${list}>`;list=null}};
  for(const raw of L){const l=raw.trimEnd();let m;
    if(/^```/.test(l.trim())){code=!code;close();continue}
    if(!l.trim()){close();continue}
    if(code){out+=`<p class="plain">${l}</p>`;continue}
    if((m=l.match(/^#{1,5}\s+(.*)/))){close();out+=`<h4>${mdInline(m[1])}</h4>`;continue}
    if((m=l.match(/^\s*[-•*]\s+(.*)/))){if(list!=="ul"){close();out+="<ul>";list="ul"}out+=`<li>${mdInline(m[1])}</li>`;continue}
    if((m=l.match(/^\s*(\d+)[.)]\s+(.*)/))){if(list!=="ol"){close();out+="<ol>";list="ol"}out+=`<li>${mdInline(m[2])}</li>`;continue}
    if(/^\s*\|?\s*:?-{3,}/.test(l))continue;
    if(/^\s*\|/.test(l)){close();out+=`<p>${mdInline(l.split("|").map(x=>x.trim()).filter(Boolean).join(" · "))}</p>`;continue}
    if((m=l.match(/^&gt;\s?(.*)/))){close();out+=`<p class="quote">${mdInline(m[1])}</p>`;continue}
    close();out+=`<p>${mdInline(l)}</p>`}
  close();return out}
function speakable(t){return parseOpts(t).body.replace(/[#*_`>|]/g,"").replace(/\n{2,}/g,". ").replace(/\n/g,". ").slice(0,6000)}
/* voice: THELMA's voice is warm, calm and unhurried. Best natural voice on this device unless Sire picks one. */
const VOICE_PREF=[/Ava.*(Natural|Online|Premium|Enhanced)/i,/Jenny.*(Natural|Online)/i,/Aria.*(Natural|Online)/i,/Emma.*(Natural|Online)/i,/Michelle.*(Natural|Online)/i,/Samantha.*(Premium|Enhanced)/i,/Google US English/i,/^Ava\b/i,/Samantha/i,/Allison/i,/Susan/i,/Zira/i];
function voices(){try{return (window.speechSynthesis&&speechSynthesis.getVoices())||[]}catch(e){return []}}
function pickVoice(){const vs=voices().filter(v=>/^en/i.test(v.lang));if(APP.voice){const v=vs.find(x=>x.name===APP.voice);if(v)return v}for(const r of VOICE_PREF){const v=vs.find(x=>r.test(x.name));if(v)return v}return vs.find(v=>/en-US/i.test(v.lang))||vs[0]||null}
let SPEAKING=false;
function speak(t){try{const ss=window.speechSynthesis;if(!ss){toast("Read-aloud isn't available in this browser");return}
  if(SPEAKING||ss.speaking){ss.cancel();SPEAKING=false;renderChat();return}
  const text=speakable(t);const parts=text.match(/[^.!?]+[.!?]*\s*/g)||[text];const chunks=[];let cur="";parts.forEach(p=>{if((cur+p).length>220){if(cur)chunks.push(cur);cur=p}else cur+=p});if(cur)chunks.push(cur);
  const v=pickVoice();SPEAKING=true;renderChat();
  chunks.forEach((c,i)=>{const u=new SpeechSynthesisUtterance(c);if(v){u.voice=v;u.lang=v.lang}u.rate=(APP.vrate||96)/100;u.pitch=(APP.vpitch||100)/100;if(i===chunks.length-1){u.onend=u.onerror=()=>{SPEAKING=false;renderChat()}}ss.speak(u)})
}catch(e){SPEAKING=false;toast("Read-aloud isn't available here")}}
try{window.speechSynthesis&&speechSynthesis.addEventListener&&speechSynthesis.addEventListener("voiceschanged",()=>{if(UI.view==="thelma"||(UI.view==="settings"&&UI.setTab==="thelma"))render()})}catch(e){}
function voicePicker(){const vs=voices().filter(v=>/^en/i.test(v.lang));const cur=pickVoice();
  return `<label class="f">Her voice (this device)<select id="thVoice"><option value="">Best natural voice${cur&&!APP.voice?` (${esc(cur.name)})`:""}</option>${vs.map(v=>`<option value="${esc(v.name)}" ${APP.voice===v.name?"selected":""}>${esc(v.name)} · ${esc(v.lang)}</option>`).join("")}</select></label>
  <label class="f">Speed <input type="range" id="thRate" min="80" max="120" value="${APP.vrate||96}"></label>
  <div class="row"><button type="button" class="btn small" id="thVoiceTry">▶ Hear her</button><span class="note">${vs.length?`${vs.length} English voices on this device. Voices marked Natural or Premium sound most human.`:"This browser hasn't listed its voices yet."}</span></div>`}
/* chat rendering */
const START_CHIPS={overview:["What should I do first today?","What's the closest deadline?","Walk me through where we are"],pictures:["Which frames still need my pick?","What makes a frame pass Gate 1?","Show me the redo list"],cast:["Who still needs a review?","Explain the three boards simply","What does a lock record hold?"],uplink:["Did Claude answer me?","Send Claude a task for me","Why wasn't my last request answered?"],guild:["What's oldest in my queue?","Which decisions are quick wins?"],publish:["What does Gate 2 need?","Is the PART 1 packet ready?"],settings:["What should I set up first?","Explain the uplink settings"]};
const DEFAULT_CHIPS=["What should I do next?","Where are we in the process?","Check all connections","Which characters need review?","Explain the two gates simply"];
function lastAiIdx(){for(let i=THELMA.chat.length-1;i>=0;i--)if(THELMA.chat[i].role==="assistant")return i;return -1}
function chipsNow(){if(THELMA.busy)return [];const i=lastAiIdx();const m=THELMA.chat[i];if(m&&m.done&&m.options&&m.options.length&&i===THELMA.chat.length-1)return m.options;const tp=curConv().topic;if(tp&&tp!=="general"&&TOPIC_CHIPS[tp])return TOPIC_CHIPS[tp];return START_CHIPS[UI.view]||DEFAULT_CHIPS}
function chipsHTML(){const c=chipsNow();return c.length?c.map(x=>`<button type="button" class="chip" data-askchip="${esc(x)}" title="Click to ask · right-click or hold for more">${esc(x)}</button>`).join(""):`<span class="note">THELMA is thinking…</span>`}
function convBarHTML(){const cur=curConv();const now=THELMA.convs.map((c,i)=>[c,i]).filter(([c])=>!c.earlier),old=THELMA.convs.map((c,i)=>[c,i]).filter(([c])=>c.earlier);
  const o=([c,i])=>`<option value="${i}" ${i===THELMA.cur?"selected":""}>${esc(topicName(c.topic).split(" · ")[0])} · ${esc(c.title.slice(0,40))}</option>`;
  return `<div class="convbar"><label class="convlbl">Topic<select id="convTopic" aria-label="What this conversation is about">${TOPICS.map(([k,l])=>`<option value="${k}" ${cur.topic===k?"selected":""}>${esc(l)}</option>`).join("")}</select></label>
   <label class="convlbl">Conversation<select id="convSel" aria-label="Conversation"><optgroup label="Now">${now.map(o).join("")}</optgroup>${old.length?`<optgroup label="Earlier (before the fresh start)">${old.map(o).join("")}</optgroup>`:""}</select></label>
   <div class="convbtns"><button type="button" class="btn small" id="convNew">+ New</button><button type="button" class="btn small${THELMA.clearArm?" danger":""}" id="convClear">${THELMA.clearArm?"Tap again to clear":"Clear"}</button><button type="button" class="btn small" data-view="thelma" id="notesGo">Notes${(ST.jots||[]).length?` (${ST.jots.length})`:""}</button></div></div>`}
function chatHTML(){
  if(!THELMA.chat.length)return `<div class="thintro"><span class="orb big"></span><div><b>Hi Sire, I'm THELMA.</b>${THELMA.fresh?`<p class="note">Fresh start. Earlier conversations are saved under "Earlier" in the Conversation list.</p>`:""}<p><b>Topic: ${esc(topicName(curConv().topic))}.</b> Change it above so I stay on task.</p><p>${CAP.sample?"Ask me what to do next, where something is, what a shot needs, or what it will cost. I'll answer in plain words and give you options to tap. Right-click (or press and hold) any option to branch it into its own conversation or save it to Notes. I propose; you decide.":"I need Claude to think. Open the studio inside claude.ai to talk with me. The guide bar still works everywhere."}</p></div></div>`;
  const last=lastAiIdx();
  return THELMA.chat.map((m,i)=>{
    if(m.role==="tool")return "";
    if(m.role==="user")return `<div class="bubble me">${m.branchOf?`<div class="branchnote">↳ Branched from: “${esc(m.branchOf.slice(0,120))}…”</div>`:""}${esc(m.show||m.content)}</div>`;
    const po=parseOpts(m.content);const opts=m.done?(m.options||po.options):[];
    const steps=(m.steps||[]).length?`<div class="steps">${[...new Set(m.steps)].map(x=>`<span>✓ ${esc(x)}</span>`).join("")}</div>`:"";
    return `<div class="bubble ai${m.relay?" relay":""}" data-msg="${i}"><div class="who"><span class="orb"></span>${m.relay?"Claude answered · via the uplink":"THELMA"}${!m.done?` <span class="typing"><i></i><i></i><i></i></span>`:""}</div>${steps}<div class="mdx">${po.body?md(po.body):(m.done?"":`<p class="note">Thinking…</p>`)}</div>
    ${opts.length?`<div class="opts${i===last?"":" old"}">${i===last?"":`<span class="note">Earlier options</span>`}${opts.map((o,j)=>`<button type="button" class="optbtn" data-opt="${i}:${j}" title="Click to ask · right-click or hold to branch or save">${esc(o)}<span aria-hidden="true">→</span></button>`).join("")}</div>`:""}
    ${m.done?`<div class="acts"><button type="button" class="btn small" data-speak="${i}">${SPEAKING?"■ Stop":"🔊 Read to me"}</button><button type="button" class="btn small" data-jot="${i}">📝 Save to notes</button><button type="button" class="btn small" data-more="${i}" aria-label="More">⋯</button></div>`:""}</div>`}).join("");
}
function branchBanner(){return THELMA.pendingBranch!=null?`<div class="branchbar">↳ Your next question starts a <b>new branch</b> from that answer. <button type="button" class="btn small" id="branchCancel">Cancel</button></div>`:""}
function submitAsk(v){return ask(v)}
function renderChat(){const html=chatHTML()+branchBanner();[$("#chat"),$("#thChat")].forEach(c=>{if(c){const near=c.scrollHeight-c.scrollTop-c.clientHeight<120;c.innerHTML=html;if(near||THELMA.busy)c.scrollTop=c.scrollHeight}});
  const ch=chipsHTML();[$("#askChips"),$("#thChips")].forEach(c=>{if(c)c.innerHTML=ch});
  const cb=convBarHTML();[$("#convBarD"),$("#convBarP")].forEach(c=>{if(c)c.innerHTML=cb});
  const o=$("#askOpen")&&$("#askOpen").querySelector(".orb");if(o)o.classList.toggle("busy",THELMA.busy)}
function saveChat(){curConv();if(!(CAP.db&&store.uid&&!store.readOnly))return;
  MINE.thelmaEpoch=THELMA_EPOCH;MINE.thelmaConvs=THELMA.convs.filter(c=>c.chat.length||THELMA.convs[THELMA.cur]===c).slice(-12).map(c=>({id:c.id,title:c.title,topic:c.topic||"general",earlier:!!c.earlier,at:c.at,chat:c.chat.filter(m=>m.role!=="tool"&&m.done!==false).slice(-30).map(m=>({role:m.role,content:String(m.content).slice(0,4000),show:m.show?String(m.show).slice(0,500):undefined,branchOf:m.branchOf?String(m.branchOf).slice(0,300):undefined,options:m.options||[],relay:!!m.relay,done:!!m.done}))}));
  MINE.thelmaCur=Math.max(0,MINE.thelmaConvs.findIndex(x=>x.id===curConv().id));delete MINE.thelmaChat;
  const clean=JSON.parse(JSON.stringify(MINE));write(()=>CAP.db.doc("data/users/"+store.uid+"/prefs").set(clean))}
function thelmaRelay(u){curConv();THELMA.chat.push({role:"assistant",relay:true,done:true,content:`**Claude answered** your request: “${String(u.text).replace(/^\(from THELMA\)\s*/,"").slice(0,140)}…”\n\n${u.reply}\n\n» Open the Claude uplink\n» What should I do with this answer?`,options:["Open the Claude uplink","What should I do with this answer?"]});renderChat();saveChat()}
async function ask(text,o={}){
  text=String(text||"").trim();if(!text)return;
  if(THELMA.pendingBranch!=null&&!o.prefix&&!o.plain){const i=THELMA.pendingBranch;THELMA.pendingBranch=null;return branch(text,i)}
  if(!TH().enabled){toast("THELMA is off");return}
  if(/^open the claude uplink$/i.test(text)){go("uplink");return}
  {const mm=text.match(/^start a new conversation about (.+)$/i);if(mm&&!o.prefix){const t=mm[1].toLowerCase();const hit=TOPICS.find(([k,l])=>t.includes(k)||l.toLowerCase().split(/[ ·&]+/).some(w=>w.length>3&&t.includes(w)));newConv(mm[1].slice(0,48),[],hit?hit[0]:"general");renderChat();saveChat();return ask(`Let's talk about ${mm[1]}.`,{plain:true})}}
  curConv();
  if(!CAP.sample){THELMA.chat.push({role:"user",content:text},{role:"assistant",content:"I can't think on this page right now: Claude isn't available here. Open the studio inside claude.ai.",done:true});renderChat();return}
  if(THELMA.busy)return;
  const wantsVoice=/\b(tell me|read (it |this )?to me|explain (it |this )?out loud|say it|read it)\b/i.test(text)||TH().autoRead;
  const conv=curConv();if(conv.chat.length===0||/^(New conversation|Conversation \d+)$/.test(conv.title))conv.title=(o.show||text).slice(0,48);
  const um={role:"user",content:o.prefix?o.prefix+text:text};if(o.prefix){um.show=text;um.branchOf=o.branchOf||""}
  THELMA.chat.push(um);const ai={role:"assistant",content:"",tier:TH().tier,steps:[]};THELMA.chat.push(ai);THELMA.busy=true;renderChat();
  const hist=THELMA.chat.filter(m=>m.role!=="tool"&&m!==ai).slice(-12).map(m=>({role:m.role,content:m.relay?"(Claude's answer from the uplink) "+m.content:m.content}));
  const fixed=[];hist.forEach(m=>{if(fixed.length&&fixed[fixed.length-1].role===m.role)fixed[fixed.length-1].content+="\n\n"+m.content;else fixed.push(m)});
  if(fixed.length&&fixed[0].role==="assistant")fixed.unshift({role:"user",content:"(earlier in this conversation)"});
  const turns=[{role:"user",content:thelmaContext()},{role:"assistant",content:"Understood, Sire. I'll work from these records and propose, never approve."},...fixed];
  askCtl=new AbortController();const st=$("#askStop"),sd=$("#askSend");if(st)st.hidden=false;if(sd)sd.disabled=true;
  const tools=thelmaTools().map(t=>Object.assign({},t,{execute:async(inp,ctx)=>{ai.steps.push(TOOL_LBL[t.name]||"Worked");renderChat();return await t.execute(inp||{},ctx)}}));
  let lim=null;try{lim=await CAP.sample.limits()}catch(e){}
  const useTools=lim&&lim.tools?tools.slice(0,lim.tools.maxCount):undefined;
  try{const r=await CAP.sample(turns,{signal:askCtl.signal,cache:false,modelTier:TH().tier,tools:useTools,onText:({text})=>{ai.content=text;renderChat()}});ai.content=r.text;if(r.truncated)ai.content+="\n\n(Answer was cut short.)"}
  catch(e){ai.content=(e&&e.text)||(e&&e.code==="cancelled"?"Stopped.":e&&e.code==="rate_limited"?"Too many questions at once. Wait a minute and ask again.":e&&e.code==="not_granted"?"Asking Claude isn't allowed from this page for you.":e&&e.code==="tools_unavailable"?"My tools aren't available in this view. Ask again and I'll answer from the records only.":"That didn't go through. Try asking again.")}
  const po=parseOpts(ai.content);ai.options=po.options;ai.done=true;
  THELMA.busy=false;askCtl=null;if(st)st.hidden=true;if(sd)sd.disabled=false;renderChat();saveChat();
  if(wantsVoice)speak(ai.content);
}
function branch(text,fromIdx){if(THELMA.busy){toast("Wait for THELMA to finish");return}
  const src=fromIdx!=null&&THELMA.chat[fromIdx]?parseOpts(THELMA.chat[fromIdx].content).body:"";
  newConv(("↳ "+text).slice(0,48),[],curConv().topic);saveChat();renderChat();
  if(!$("#drawer").hidden||UI.view==="thelma"){}else openAsk();
  ask(text,src?{prefix:`(New branch. Context from your earlier answer: "${src.slice(0,1200)}")\n\n`,branchOf:src}:{plain:true});toast("Branched into a new conversation")}
function addJot(text,src){const j={id:"j"+Date.now().toString(36),text:String(text).slice(0,1200),at:nowISO(),by:store.uid||null,src:src||"Sire"};patch({jots:[j,...(ST.jots||[])].slice(0,200)},`Note saved: ${j.text.slice(0,60)}`);toast("Saved to Notes")}
/* right-click / press-and-hold menu */
function menuFor(kind,payload,x,y){closeMenu();const m=document.createElement("div");m.id="ctxMenu";m.className="ctxmenu";m.setAttribute("role","menu");
  const items=kind==="text"?[["ask","Ask this now"],["branch","Branch into a new conversation"],["jot","Save to Notes"],["copy","Copy"]]:[["branchmsg","Branch from this answer…"],["jotmsg","Save answer to Notes"],["speak","Read to me"],["copymsg","Copy answer"]];
  m.innerHTML=items.map(([k,l])=>`<button type="button" role="menuitem" data-ctx="${k}">${l}</button>`).join("");
  m._p=payload;document.body.appendChild(m);const w=m.offsetWidth,h=m.offsetHeight;m.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+"px";m.style.top=Math.max(8,Math.min(y,innerHeight-h-8))+"px";m.querySelector("button").focus()}
function closeMenu(){const m=$("#ctxMenu");if(m)m.remove()}
function ctxRun(k,p){closeMenu();
  if(k==="ask")ask(p.text);else if(k==="branch")branch(p.text,p.idx);else if(k==="jot")addJot(p.text,"Option");else if(k==="copy")copy(p.text,"Copied");
  else if(k==="branchmsg"){THELMA.pendingBranch=p.idx;if($("#drawer").hidden&&UI.view!=="thelma")openAsk();renderChat();const i=UI.view==="thelma"?$("#thIn"):$("#askIn");if(i){i.placeholder="Type what you want to explore from that answer…";i.focus()}}
  else if(k==="jotmsg")addJot(parseOpts(THELMA.chat[p.idx].content).body,"THELMA answer");else if(k==="speak")speak(THELMA.chat[p.idx].content);else if(k==="copymsg")copy(parseOpts(THELMA.chat[p.idx].content).body,"Answer copied")}
function ctxTarget(t){let el;if((el=t.closest("[data-opt]"))){const [i,j]=el.dataset.opt.split(":").map(Number);const m=THELMA.chat[i];return ["text",{text:(m.options||[])[j]||el.textContent,idx:i}]}
  if((el=t.closest("[data-askchip]")))return ["text",{text:el.dataset.askchip,idx:lastAiIdx()}];
  if((el=t.closest(".bubble.ai[data-msg]")))return ["msg",{idx:+el.dataset.msg}];return null}
document.addEventListener("contextmenu",e=>{const r=ctxTarget(e.target);if(!r)return;e.preventDefault();menuFor(r[0],r[1],e.clientX,e.clientY)});
let HOLD=null;
document.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")return;const r=ctxTarget(e.target);if(!r)return;const x=e.clientX,y=e.clientY;clearTimeout(HOLD);HOLD=setTimeout(()=>{HOLD="fired";menuFor(r[0],r[1],x,y);try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}} ,520)});
["pointerup","pointercancel","pointermove"].forEach(ev=>document.addEventListener(ev,e=>{if(ev==="pointermove"&&HOLD&&HOLD!=="fired"&&Math.abs(e.movementX)+Math.abs(e.movementY)<4)return;if(HOLD!=="fired")clearTimeout(HOLD);if(ev!=="pointermove")setTimeout(()=>{if(HOLD==="fired")HOLD=null},0)}));
document.addEventListener("click",e=>{if(HOLD==="fired"&&e.target.closest("[data-opt],[data-askchip]")){e.preventDefault();e.stopImmediatePropagation();HOLD=null;return}
  const c=e.target.closest("[data-ctx]");if(c){const m=$("#ctxMenu");ctxRun(c.dataset.ctx,m&&m._p);e.stopImmediatePropagation();return}if($("#ctxMenu")&&!e.target.closest("#ctxMenu"))closeMenu()},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
function openAsk(prefill){
  if(!TH().enabled){go("settings");UI.setTab="thelma";render();return}
  $("#drawer").hidden=false;
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
    <div id="convBarP">${convBarHTML()}</div>
    <div class="th-chat" id="thChat"></div>
    <div class="chips" id="thChips" style="margin-top:10px">${chipsHTML()}</div>
    <form id="thForm" class="askrow" style="margin-top:10px"><input type="text" id="thIn" placeholder="Ask THELMA…  (say &quot;tell me&quot; to hear the answer)" ${CAP.sample?"":"disabled"}><button type="submit" class="btn primary" ${CAP.sample?"":"disabled"}>Ask</button></form>
    <p class="note" style="margin:6px 0 0">Tap an option to ask it. Right-click it (or press and hold on a phone) to branch it into its own conversation or save it to Notes.</p>
   </section>
   <div style="display:grid;gap:18px">
    <section class="panel"><h2>Controls</h2>
     <label class="switch"><input type="checkbox" data-thset="enabled" ${t.enabled?"checked":""}> THELMA on</label><br>
     <label class="switch" style="margin-top:8px"><input type="checkbox" data-thset="guide" ${t.guide?"checked":""}> Guide bar on every page</label><br>
     <label class="switch" style="margin-top:8px"><input type="checkbox" data-thset="autoRead" ${t.autoRead?"checked":""}> Read every answer out loud</label>
     <label class="f" style="margin-top:10px">Thinking depth<select data-thset="tier">${[["quick","Quick (fast, simple questions)"],["default","Standard"],["complex","Deep (planning, hard problems)"]].map(([v,l])=>`<option value="${v}" ${t.tier===v?"selected":""}>${l}</option>`).join("")}</select></label>
     <p class="note" style="margin:10px 0 0">Authority: <b>propose only</b>. Anything that spends credits, publishes, deletes or changes a connection goes to your Guild queue first.</p>
    </section>
    <section class="panel" id="notesPanel"><h2>Notes <span class="sub">shared · jot it now, act on it later</span></h2>
     ${store.readOnly?"":`<form id="jotForm" class="askrow"><input type="text" id="jotIn" placeholder="Jot an idea, a reminder, a what-if…"><button type="submit" class="btn">Add</button></form>`}
     ${(ST.jots||[]).length?`<ul class="jots">${ST.jots.map(j=>`<li><div class="mdx">${md(j.text)}</div><div class="note">${esc(j.src||"")} · ${when(j.at)}</div><div class="row"><button type="button" class="btn small" data-jotask="${esc(j.id)}">Ask THELMA</button><button type="button" class="btn small" data-jotbranch="${esc(j.id)}">New conversation</button>${store.readOnly?"":`<button type="button" class="btn small" data-jotdel="${esc(j.id)}">Remove</button>`}</div></li>`).join("")}</ul>`:`<div class="empty">No notes yet. Save any answer or option here with 📝, or type one above.</div>`}
    </section>
    <section class="panel"><h2>Her voice</h2>${voicePicker()}</section>
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
  if(t.id==="thClear"||t.id==="convNew"){if(THELMA.busy){toast("Wait for THELMA to finish");return}newConv("New conversation",[],curConv().topic);THELMA.fresh=false;renderChat();saveChat();return}
  if(t.id==="convClear"){if(!THELMA.clearArm){THELMA.clearArm=true;renderChat();setTimeout(()=>{if(THELMA.clearArm){THELMA.clearArm=false;renderChat()}},4000);return}clearConv();return}
  if(t.id==="branchCancel"){THELMA.pendingBranch=null;renderChat();return}
  if((el=c("[data-opt]"))){const [i,j]=el.dataset.opt.split(":").map(Number);const o=(THELMA.chat[i]&&THELMA.chat[i].options||[])[j];if(o)submitAsk(o);return}
  if((el=c("[data-jot]"))){addJot(parseOpts(THELMA.chat[+el.dataset.jot].content).body,"THELMA answer");return}
  if((el=c("[data-more]"))){const r=el.getBoundingClientRect();menuFor("msg",{idx:+el.dataset.more},r.left,r.bottom+4);return}
  if((el=c("[data-jotask]"))){const j=(ST.jots||[]).find(x=>x.id===el.dataset.jotask);if(j)ask(`About this note: "${j.text}". What should we do with it?`);return}
  if((el=c("[data-jotbranch]"))){const j=(ST.jots||[]).find(x=>x.id===el.dataset.jotbranch);if(j){newConv(("📝 "+j.text).slice(0,48));ask(`Let's work on this note: "${j.text}"`)}return}
  if((el=c("[data-jotdel]"))){patch({jots:(ST.jots||[]).filter(x=>x.id!==el.dataset.jotdel)},"Note removed");return}
  if(t.id==="thVoiceTry"){speak("Hi Sire, I'm THELMA. This is how I'll sound when I read your answers to you.");return}
  if(t.id==="thOps"){loadThelmaOps();return}
  if(t.id==="thSpeakLast"){const m=[...THELMA.chat].reverse().find(x=>x.role==="assistant"&&x.done);if(m)speak(m.content);else toast("Nothing to read yet");return}
  if((el=c("[data-speak]"))){speak(THELMA.chat[+el.dataset.speak].content);return}
  if((el=c("[data-copymsg]"))){copy(THELMA.chat[+el.dataset.copymsg].content,"Answer copied");return}
});
document.addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="convSel"){switchConv(+t.value);return}
  if(t.id==="convTopic"){const c=curConv();if(c.chat.length&&c.topic!==t.value){newConv("New conversation",[],t.value);toast("New conversation: "+topicName(t.value))}else{c.topic=t.value}THELMA.fresh=false;renderChat();saveChat();return}
  if(t.id==="thVoice"){setApp("voice",t.value);toast(t.value?"Voice set on this device":"Using the best natural voice");return}
  if(t.id==="thRate"){setApp("vrate",+t.value);return}
  if(t.dataset.thset){const k=t.dataset.thset;const v=t.type==="checkbox"?t.checked:t.value;patch({settings:{thelma:{[k]:v}}},k==="enabled"?`THELMA turned ${v?"on":"off"}`:null);thelmaChrome();return}
});
document.addEventListener("submit",e=>{const f=e.target;if(f.id==="thForm"){e.preventDefault();const i=$("#thIn");const v=i.value;i.value="";if(v.trim()==="")return;if(/check all connections/i.test(v)&&!CAP.sample){liveCheck();return}submitAsk(v)}
  if(f.id==="jotForm"){e.preventDefault();const i=$("#jotIn");const v=i.value.trim();if(!v)return;i.value="";i.blur();addJot(v,"Sire");render()}});
document.addEventListener("input",e=>{if(e.target.id==="pq"){PAL.i=0;drawPalette()}});
document.addEventListener("keydown",e=>{
  if($("#palette").hidden)return;
  if(e.key==="ArrowDown"){e.preventDefault();PAL.i=Math.min(PAL.items.length-1,PAL.i+1);drawPalette()}
  else if(e.key==="ArrowUp"){e.preventDefault();PAL.i=Math.max(0,PAL.i-1);drawPalette()}
  else if(e.key==="Enter"&&e.target.id==="pq"){e.preventDefault();runPal(PAL.i)}
});
