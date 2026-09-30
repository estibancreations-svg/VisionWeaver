V.booth=()=>{
  const c=CUES.find(x=>x[0]===UI.cue);const n=DATA.narr[UI.cue]||{text:"",cards:[]};
  const words=n.text.split(/\s+/).filter(w=>w&&w!=="…");const rec=ST.recorded[UI.cue];
  const target=c[4]||Math.round(words.length/150*60*10)/10;
  return `<div class="vhead"><span class="eyebrow">Stage 5 · your voice</span><h1>Narration booth</h1><p>Read each cue exactly as written; the words come straight from the locked chapter. The prompter paces you at the speed you set, and the timer shows how you compare with the planned length.</p></div>
  <section class="panel"><div class="row" style="gap:6px">${CUES.map(x=>`<button type="button" class="chip" data-cue="${x[0]}" aria-pressed="${x[0]===UI.cue}">${x[0]}${ST.recorded[x[0]]?" ✓":""}</button>`).join("")}</div></section>
  <div class="split">
   <section class="panel"><h2>${c[0]} <span class="sub">PART ${c[1]} · ${esc(c[2])}</span></h2>
    <div class="row" style="margin-bottom:10px"><span class="tc" id="pTime">0:00.0</span><span class="note">planned ≈ ${target} s · ${words.length} words</span>
     <button type="button" class="btn primary" id="pStart">${UI.prompting?"Stop":"Start prompter"}</button>
     <label class="f" for="wpm" style="min-width:170px">Pace <span id="wpmV">${UI.wpm}</span> words/min<input type="range" id="wpm" min="100" max="200" value="${UI.wpm}"></label></div>
    <div class="prompter" id="prompter">${words.map((w,i)=>`<span data-w="${i}">${esc(w)}</span>`).join(" ")}</div>
    <div class="row" style="margin-top:12px">
     ${store.readOnly?"":`<button type="button" class="btn ${rec?"":"primary"}" data-rec="${c[0]}" aria-pressed="${!!rec}">${rec?"Recorded":"Mark as recorded"}</button>`}
     <span class="note">Save the file as <span class="mono">E01_${c[0]}_Recorded_Script</span>${rec&&rec.at?` · marked ${when(rec.at)} by ${who(rec.by)}`:""}</span></div>
   </section>
   <section class="panel"><h2>Subtitle cards <span class="sub">italic, warm cream, 2 lines max</span></h2>
    <div class="cards">${(n.cards.length?n.cards:["(The radio host line plays under S13a–S13d. It uses the small-speaker radio sound, not subtitles.)"]).map(t=>`<div class="card">${esc(t).replace(" / ","<br>")}</div>`).join("")}</div>
    <h2 style="margin-top:14px">Recording tips</h2><ul class="checks"><li><span class="ok">•</span>Unhurried, about 150 words a minute. Your real pace sets the final times.</li><li><span class="ok">•</span>Quiet room, phone 6–8 inches away, record 3 seconds of silence first for clean-up.</li><li><span class="ok">•</span>Drop the finished file under Uploads and it checks off here.</li></ul>
    <div class="row" style="margin-top:10px">${dlBtn("narration","Download full reading script")}</div>
   </section>
  </div>
  <section class="panel"><h2>All cues <span class="sub">${CUES.filter(x=>ST.recorded[x[0]]).length} of ${CUES.length} recorded · 981 words · about 6.7 min</span></h2>
   <div class="bar2" style="margin-bottom:10px"><i style="width:${CUES.filter(x=>ST.recorded[x[0]]).length/CUES.length*100}%"></i></div>
   <div class="tablewrap"><table><tr><th>Cue</th><th>PART</th><th>Where</th><th>Words</th><th>≈ Sec</th><th>Status</th></tr>
   ${CUES.map(x=>{const r=ST.recorded[x[0]];return `<tr class="shotrow" data-cue="${x[0]}"><td class="mono"><b>${x[0]}</b></td><td class="num">${x[1]}</td><td>${esc(x[2])}</td><td class="num">${x[3]??"—"}</td><td class="num">${x[4]??"—"}</td><td>${r?pill("done","Recorded"):pill(x[1]<=2?"you":"idle","To record")}</td></tr>`}).join("")}</table></div>
  </section>`;
};

V.sound=()=>`<div class="vhead"><span class="eyebrow">Stage 5</span><h1>Sound & music</h1><p>Marcus's spoken lines use Runway speech. Every narration cue and the radio host line are your own recorded voice. Elijah keeps his two voice-over lines.</p></div>
  <div class="grid3">
   <section class="panel"><h2>Voice lock VL-MR</h2><p style="margin:0">Marcus Reynolds: Runway preset <b>"Frank"</b> (young, deep, American), eleven_v3, speed 0.95. Dialogue only.</p></section>
   <section class="panel"><h2>Subtitle styles</h2><p style="margin:0">Narrator: <i>italic, warm cream, soft shadow</i>. Dialogue: plain white. Up to 2 lines, about 32 letters a line.</p></section>
   <section class="panel"><h2>Sound rates</h2><p style="margin:0">Speech about 1 credit per 50 letters · effects 1 per second · music clip 4. PART 1's sound cost 48.</p></section>
  </div>
  <section class="panel"><h2>PART 1 sound kit <span class="sub">11 files, all made</span></h2><div class="tablewrap"><table><tr><th>Sound</th><th>Type</th><th>Length</th><th>Runway task</th><th>Use</th></tr>
   ${AUDIO.map(a=>`<tr><td><b>${esc(a[0])}</b></td><td>${a[1]}</td><td class="num">${a[2]}</td><td class="mono">${a[3]}</td><td class="note">${esc(a[4])}</td></tr>`).join("")}</table></div></section>
  <div class="grid2">
   <section class="panel"><h2>PART 2 sound still to make</h2><div class="tablewrap"><table>
    <tr><td>Marcus lines 4–7</td><td>Dialogue, VL-MR</td></tr><tr><td>Manager: "Mr. Reynolds?"</td><td>Dialogue</td></tr><tr><td>Partner lines 1–2</td><td>Dialogue</td></tr><tr><td>Radio host line</td><td>Your recording, small-speaker EQ</td></tr><tr><td>Walla, elevator chime, doors, pen scratch, door click</td><td>Effects</td></tr><tr><td>Match strike for the lantern</td><td>Effect</td></tr><tr><td>Music bed for the performance</td><td>Score</td></tr>
   </table></div></section>
   <section class="panel"><h2>Music direction</h2><p style="margin:0 0 8px">PART 1 bed: minimal, tense underscore. Low sustained strings, a slow heartbeat pulse, one high piano note now and then, thinning to silence. No vocals, no drums.</p><p class="note" style="margin:0">Never use real songs or protected recordings; Instagram and TikTok scan audio and can mute or pull clips. A licensed Holt Street recording is a later decision (Intellectual Properties Management, licensing@i-p-m.com).</p></section>
  </div>`;

/* ---------- timelines ---------- */
const LANES=["Picture","Dialogue","Narration","Effects","Music","Room tone","Text"];
function tlP1(full){
  const ins=full?15.8:0,sh=t=>t>=23.5?t+ins:t,items=[];
  [["S01",0,3.5,"Trim to the best 3.5 s of the push-in."],["S02",3.5,5,"Use the whole clip. Line 1 starts here."],["S03",8.5,5,"Line 1 keeps playing. Add contract slide."],["S04",13.5,5,"Line 2 starts at 0:14.5, Marcus off screen."],["S05",18.5,5,"Line 2 ends ~0:23.4. Contract slide again."],["S06",23.5,2.5,"Buzz 1."],["S07",26,4,"Buzz 2 and 3."],["S08",30,5,"Line 3 at 0:30.2. Chair slide ~0:34."],["S09",35,3,"Quiet."],["S10",38,8,"Slow to 0.6× so it lasts 8 s. Add the three texts, one at a time."],["S11",46,4,"Fade music out to nothing. Room tone only."],["S12",50,5,"Glass set-down clink at the start. Let the ripples play."],["Black",55,2,"Fade to black. Near silence. End of clip."]].forEach(([id,s,d,how])=>{const f=P1FRAMES.find(x=>x[0]===id);items.push({lane:0,cls:id==="Black"?"blk":"pic",label:id,start:sh(s),dur:d,how,task:f?f[3]:"",kf:f?f[2]:"",desc:f?f[1]:"Black"})});
  if(full){const f=P1FRAMES.find(x=>x[0]==="S05b");items.push({lane:0,cls:"pic",label:"S05b",start:23.5,dur:ins,how:"Full episode only. Slow to about 0.63× so it covers your N01 reading plus half a second.",task:f[3],kf:f[2],desc:f[1]});items.push({lane:2,cls:"nar",label:"N01 · your voice",start:23.5,dur:15.3,how:"Lay E01_N01_Recorded_Script here. Narrator subtitles: italic, warm cream.",task:"E01_N01_Recorded_Script",desc:"37 words"})}
  [["Line 1",3.5,10.72,0],["Line 2",14.5,8.88,1],["Line 3",30.2,4.56,2]].forEach(([l,s,d,i])=>items.push({lane:1,cls:"dia",label:"Marcus "+l,start:sh(s),dur:d,how:"Full voice. VL-MR \"Frank\", eleven_v3, speed 0.95.",task:AUDIO[i][3],desc:"Dialogue"}));
  [["Contract slide",9.5,2,8],["Contract slide",20.5,2,8],["Buzz 1",23.8,1.5,5],["Buzz 2 + 3",26.4,3,6],["Chair slide",34,1.5,9],["Chime",38.6,1,7],["Chime",41.1,1,7],["Chime",43.6,1,7],["Glass set down",50,2,10]].forEach(([l,s,d,i])=>items.push({lane:3,cls:"sfx",label:l,start:sh(s),dur:d,how:"Soft. Felt more than heard.",task:AUDIO[i][3],desc:"Sound effect"}));
  items.push({lane:4,cls:"mus",label:"Music bed · copy 1",start:0,dur:23.7,how:"Low, under the voices.",task:AUDIO[4][3],desc:"Score"});
  items.push({lane:4,cls:"mus",label:"Music bed · copy 2",start:22,dur:23.7+ins,how:"Cross-fade the overlap with copy 1. Fade to nothing across S11.",task:AUDIO[4][3],desc:"Score"});
  const total=57+ins;for(let t=0;t<total;t+=20)items.push({lane:5,cls:"room",label:"Room tone",start:t,dur:Math.min(20,total-t),how:"Low, steady.",task:AUDIO[3][3],desc:"Ambience"});
  [["L1 caption",3.5,10.72],["L2 caption",14.5,8.88],["L3 caption",30.2,4.56]].forEach(([l,s,d])=>items.push({lane:6,cls:"txt",label:l,start:sh(s),dur:d,how:"From E01_PART1_captions.srt. Plain white.",task:"part1-captions.srt",desc:"Dialogue caption"}));
  ["Marcus, it's Victor Mendoza. Elijah Johnson passed last night. Peacefully, in his sleep. Thought you should know.","Will reading scheduled for Friday at Brennan & Associates. Elijah left specific instructions for you to attend.","I'm sorry to deliver this news. He spoke of you often."].forEach((tx,i)=>items.push({lane:6,cls:"txt",label:"Text "+(i+1),start:sh(38.6+i*2.5),dur:46-(38.6+i*2.5),how:"Text box inside the blank bubble. Plain font, dark grey. Exact words: \""+tx+"\"",task:"",desc:"Phone text"}));
  return {items,total,draft:false};
}
function tlP2(){
  const seq=[["S01",10],["S02",5],["S03",10],["S03b",10],["S04",5],["S05",5],["S06",10],["S07",10],["S08",5],["S09",5],["S10",5],["S11",5],["S12",5],["S13",5],["S13a",4],["S13b",3],["S13c",4.8],["S13d",2.4],["S14",5]];
  const items=[],at={};let t=0;
  seq.forEach(([id,d])=>{const s=DATA_SHOTS[2].find(x=>x.id===id)||{};const f=P2FRAMES.find(x=>x[0]===id);at[id]=t;items.push({lane:0,cls:"pic",label:id,start:t,dur:d,how:`${s.move||""}. ${s.framing||""}`,task:f?f[2]:(s.plate||""),desc:s.framing||"",kf:f?f[2]:""});t+=d});
  const nar=[["N02","S01",9.3],["N03","S03",23.7],["N04","S06",22.5]];
  nar.forEach(([c,sid,d])=>items.push({lane:2,cls:"nar",label:c+" · your voice",start:at[sid],dur:d,how:`Lay E01_${c}_Recorded_Script here.`,task:`E01_${c}_Recorded_Script`,desc:"Narration"}));
  items.push({lane:2,cls:"nar",label:"RADIO · your voice",start:at.S13a,dur:at.S14-at.S13a+1.5,how:"Small-speaker EQ, faint room echo, low. Carries across the memorial cross-cut as a sound bridge.",task:"E01_RADIO_Recorded_Script",desc:"Radio host line"});
  [["Marcus line 4","S02"],["Manager line","S04"],["Marcus line 5","S05"],["Partner 1 · Marcus 6","S12"],["Partner 2 · Marcus 7","S13"]].forEach(([l,sid])=>items.push({lane:1,cls:"dia",label:l,start:at[sid]+.3,dur:4,how:"Line to be made. Length is a placeholder.",task:"",desc:"Dialogue (not made yet)"}));
  [["Pen scratch","S07",2],["Door opening","S09",1.5],["Elevator chime","S10",1],["Doors closing","S11",2],["Match strike","S13b",1.5],["Door click","S14",1]].forEach(([l,sid,d])=>items.push({lane:3,cls:"sfx",label:l,start:at[sid]+(l==="Door click"?3.8:.4),dur:d,how:"Effect to be made.",task:"",desc:"Sound effect"}));
  for(let x=0;x<t;x+=20)items.push({lane:5,cls:"room",label:"Room tone",start:x,dur:Math.min(20,t-x),how:"Low, steady.",task:"",desc:"Ambience"});
  return {items,total:t,draft:true};
}
function curTL(){return UI.tlPart===1?tlP1(UI.full):tlP2()}
V.edit=()=>{
  const {items,total,draft}=curTL();const px=UI.zoom,W=Math.ceil(total*px)+20;
  let ruler="";for(let s=0;s<=Math.ceil(total);s++){ruler+=`<i class="${s%5===0?"major":""}" style="left:${s*px}px"></i>`+(s%5===0?`<em style="left:${s*px}px">${tc(s).replace(".0","")}</em>`:"")}
  const lanes=LANES.map((l,i)=>`<div class="lane">${items.map((it,k)=>it.lane===i?`<div class="clip ${it.cls}${UI.sel===k?" sel":""}" data-clip="${k}" style="left:${it.start*px}px;width:${Math.max(it.dur*px-2,6)}px" title="${esc(it.label)}">${esc(it.label)}<small>${tc(it.start)}</small></div>`:"").join("")}</div>`).join("");
  const sel=UI.sel!=null?items[UI.sel]:null;
  return `<div class="vhead"><span class="eyebrow">Stage 6</span><h1>Edit</h1><p>${draft?"PART 2 draft assembly, built from the planned shot lengths and narration cues. It is a planning view, not an approved edit list.":"PART 1 \"The Text\" from edit list v1.1. Build it in CapCut at 9:16. Click any block for exactly what to do."}</p></div>
  <section class="panel"><div class="tl-controls">
    <div class="seg"><button type="button" data-tlp="1" aria-pressed="${UI.tlPart===1}">PART 1 · edit list</button><button type="button" data-tlp="2" aria-pressed="${UI.tlPart===2}">PART 2 · draft</button></div>
    <button type="button" class="btn primary" id="playBtn">${UI.playing?"Pause":"Play"}</button>
    <span class="tc" id="tcNow">${tc(UI.t)}</span><span class="note">of ${tc(total)}</span>
    ${UI.tlPart===1?`<div class="seg"><button type="button" data-cut="short" aria-pressed="${!UI.full}">Short · 57 s</button><button type="button" data-cut="full" aria-pressed="${UI.full}">Full episode · ${tc(72.8)}</button></div>`:""}
    <label class="f" for="zoom" style="min-width:140px">Zoom<input type="range" id="zoom" min="6" max="30" value="${UI.zoom}"></label>
    <span class="note" id="nowReadout"></span>
  </div></section>
  <div class="tl-wrap" id="tlWrap"><div class="tl" style="width:${W+104}px"><div class="lanes-l"><div></div>${LANES.map(l=>`<div>${l}</div>`).join("")}</div>
   <div class="lanes" style="width:${W}px"><div class="ruler" id="ruler">${ruler}</div>${lanes}<div class="playhead" id="playhead" style="left:${UI.t*px}px"></div></div></div></div>
  <div class="grid2">
   <section class="panel inspector"><h2>Selected</h2>${sel?`<dl><dt>Item</dt><dd><b>${esc(sel.label)}</b></dd><dt>Starts</dt><dd class="mono">${tc(sel.start)}</dd><dt>Length</dt><dd class="mono">${sel.dur.toFixed(2)} s</dd><dt>What it is</dt><dd>${esc(sel.desc)}</dd><dt>In CapCut</dt><dd>${esc(sel.how)}</dd>${sel.task?`<dt>File / task</dt><dd class="mono">${esc(sel.task)}</dd>`:""}</dl>`:`<p class="note" style="margin:0">Click a block on the timeline.</p>`}</section>
   ${UI.tlPart===1?`<section class="panel"><h2>Finish the cut</h2><ul class="checks">
    <li><span class="no">○</span>Download every clip and sound first (Runway links expire)</li><li><span class="ok">✓</span>Captions: Text → Import captions → E01_PART1_captions.srt</li><li><span class="ok">✓</span>Cover: S12 water, title "He was closing the deal." added in CapCut</li><li><span class="${ST.recorded.N01?"ok":"no"}">${ST.recorded.N01?"✓":"○"}</span>Full episode: record N01, lay it on S05b</li></ul>
    <div class="row" style="margin-top:10px">${store.readOnly?"":`<button type="button" class="btn primary" data-dlv="1:0">${ST.deliver["1"][0]?"Short marked as cut":"Mark short as cut"}</button>`}${dlBtn("editlist","Edit list (.md)")}${dlBtn("srt","Captions (.srt)")}</div>
    <h2 style="margin-top:14px">Captions file</h2><pre class="out">${esc(DATA.srt)}</pre></section>`:`<section class="panel"><h2>Before PART 2 can be cut</h2><ul class="checks"><li><span class="${Object.values(ST.p2).every(v=>v==="approved")?"ok":"no"}">${Object.values(ST.p2).every(v=>v==="approved")?"✓":"○"}</span>All 15 key frames approved</li><li><span class="no">○</span>Animate: 5 shots at 10 s, the rest at 5 s</li><li><span class="${["N02","N03","N04","RADIO"].every(c=>ST.recorded[c])?"ok":"no"}">${["N02","N03","N04","RADIO"].every(c=>ST.recorded[c])?"✓":"○"}</span>Record N02, N03, N04 and the radio line</li><li><span class="no">○</span>Make dialogue lines 4–7, manager and partner lines</li><li><span class="ok">✓</span>Memorial stills approved (M13, M03, M04 v2, M07, M08, M11, M12)</li></ul></section>`}
  </div>`;
};

V.deliver=()=>{
  const cols=["Short master (9:16)","Full-episode cut","Cover","Captions .srt","Public Drive links"];
  return `<div class="vhead"><span class="eyebrow">Stage 7</span><h1>Deliver</h1><p>Finished files go in a Drive folder, each shared as "Anyone with the link," so YouTube and Instagram can fetch them. Name them so the Publisher and Uploads can match them.</p></div>
  <section class="panel"><h2>Deliverables by PART</h2><div class="tablewrap"><table><tr><th>PART</th>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>
   ${PARTS.map(p=>{const row=ST.deliver[p.n]||[false,false,false,false,false];return `<tr><td><b>${p.n} · ${esc(p.name)}</b></td>${row.map((v,i)=>`<td><button type="button" class="btn small" data-dlv="${p.n}:${i}" aria-pressed="${!!v}" ${store.readOnly?"disabled":""}>${v?"Ready":"Not yet"}</button></td>`).join("")}</tr>`}).join("")}
  </table></div></section>
  <div class="grid2">
   <section class="panel"><h2>File names</h2><div class="tablewrap"><table><tr><td class="mono">E01_PART1_final.mp4</td><td>Finished short, 9:16</td></tr><tr><td class="mono">E01_PART1_cover.jpg</td><td>Cover with the title added in the editor</td></tr><tr><td class="mono">E01_PART1_captions.srt</td><td>Timed dialogue captions</td></tr><tr><td class="mono">E01_N01_Recorded_Script</td><td>Your narration recording</td></tr><tr><td class="mono">E01_RADIO_Recorded_Script</td><td>The radio host line</td></tr></table></div></section>
   <section class="panel"><h2>Formats</h2><div class="tablewrap"><table><tr><td>Shorts, Reels, TikTok</td><td>9:16 vertical, 720 × 1280 clips</td></tr><tr><td>YouTube episode</td><td>All five PARTS together, about 13–15 min with narration</td></tr><tr><td>Thumbnails</td><td>One 16:9 for YouTube, one 9:16 cover per PART. No text in the AI picture.</td></tr><tr><td>Captions</td><td>On for every short and the full episode</td></tr></table></div></section>
  </div>`;
};

V.publish=()=>{
  const k=UI.pk;const tags=k.tags.split(/\s+/).filter(x=>x.startsWith("#"));
  const checks=[[k.title.length>0&&k.title.length<=100,"Title is 1–100 characters"],[k.desc.length>0&&k.desc.length<=5000,"Description is under 5,000 characters"],[/made with ai/i.test(k.desc),"Description carries the AI note"],[/^https:\/\//.test(k.video.trim()),"Video link is a public https link"],[!k.cover.trim()||/^https:\/\//.test(k.cover.trim()),"Cover link is https (or left for later)"],[!!k.when,"Publish time is set"],[tags.length>0,`${tags.length} hashtags`],[true,"AI disclosure is on"]];
  const allOk=checks.every(x=>x[0]),appr=k.ok.trim()==="APPROVED";
  const packet={packet_id:`E01-P${k.part}-${k.when?k.when.slice(0,10):"TBD"}`,platform:k.plat,video_url:k.video.trim(),cover_url:k.cover.trim()||undefined,title:k.title,description:k.desc,hashtags:tags,captions_srt_url:"",visibility:k.vis,publish_at:k.when?k.when+":00-04:00":"",ai_disclosure:true,made_for_kids:false};
  UI.pkJSON=(appr?"APPROVED, send.\n\n":"")+JSON.stringify(packet,null,2);UI.pkReady=allOk&&appr;
  const sched=ST.schedule;
  return `<div class="vhead"><span class="eyebrow">Stage 8 · Gate 2</span><h1>Publish & social</h1><p>Build one packet per platform. The Publisher bot only sends a packet when your message contains the word APPROVED. Uploads land private and scheduled; you flip YouTube public the first time.</p></div>
  <section class="panel"><h2>Release calendar <span class="sub">Eastern time · ${store.mode==="shared"?"saved for the team":"saved in this browser"}</span></h2><div class="tablewrap"><table>
   <tr><th>PART</th>${PLAT_KEYS.map(p=>`<th>${p[1]}</th>`).join("")}</tr>
   ${PARTS.map(p=>`<tr><td><b>${p.n} · ${esc(p.name)}</b></td>${PLAT_KEYS.map(([pk])=>`<td><input type="datetime-local" data-sched="${p.n}:${pk}" value="${esc((sched[p.n]||{})[pk]||"")}" ${store.readOnly?"disabled":""} style="min-width:180px"></td>`).join("")}</tr>`).join("")}
  </table></div><p class="note">Suggested order: PART 1 first (the hook), then PART 4 (nearly silent, strong mood), then 5, 2 and 3. Post one PART on all three short platforms within an hour, and point every caption to the full YouTube episode.</p></section>
  <div class="grid2">
   <section class="panel"><h2>Publish packet</h2>
    <form id="pk" style="display:grid;gap:10px" autocomplete="off">
     <div class="grid2" style="gap:10px">
      <label class="f" for="pkPart">PART<select id="pkPart">${PARTS.map(p=>`<option value="${p.n}" ${k.part==p.n?"selected":""}>${p.n} · ${esc(p.name)}</option>`).join("")}</select></label>
      <label class="f" for="pkPlat">Platform<select id="pkPlat">${[["youtube_shorts","YouTube Shorts"],["youtube","YouTube (full episode)"],["instagram_reels","Instagram Reels"],["tiktok","TikTok (prepared for you)"]].map(([v,l])=>`<option value="${v}" ${k.plat===v?"selected":""}>${l}</option>`).join("")}</select></label></div>
     <label class="f" for="pkTitle">Title<input id="pkTitle" type="text" value="${esc(k.title)}"><span class="counter ${k.title.length>100?"bad":""}">${k.title.length} / 100</span></label>
     <label class="f" for="pkDesc">Description<textarea id="pkDesc">${esc(k.desc)}</textarea><span class="counter ${k.desc.length>5000?"bad":""}">${k.desc.length} / 5000</span></label>
     <label class="f" for="pkTags">Hashtags<input id="pkTags" type="text" value="${esc(k.tags)}"></label>
     <label class="f" for="pkVideo">Video link (public Drive link to the MP4)<input id="pkVideo" type="url" value="${esc(k.video)}" placeholder="https://drive.google.com/…/E01_PART1_final.mp4"></label>
     <label class="f" for="pkCover">Cover link<input id="pkCover" type="url" value="${esc(k.cover)}" placeholder="https://drive.google.com/…/E01_PART1_cover.jpg"></label>
     <div class="grid2" style="gap:10px"><label class="f" for="pkWhen">Publish at (Eastern)<input id="pkWhen" type="datetime-local" value="${esc(k.when)}"></label><label class="f" for="pkVis">Visibility<select id="pkVis">${["private","unlisted","public"].map(v=>`<option ${k.vis===v?"selected":""}>${v}</option>`).join("")}</select></label></div>
     <div class="note">AI disclosure: <b>on</b> (always). Made for kids: <b>no</b>.</div>
    </form>
    ${CAP.sample?`<div class="row" style="margin-top:12px"><button type="button" class="btn" id="draftCaps" ${UI.draftBusy?"disabled":""}>${UI.draftBusy?"Drafting…":"Draft captions for every platform"}</button><span class="note">Claude writes from this PART's story. Review before using.</span></div>${UI.draftOut?`<div class="answer" style="margin-top:8px">${UI.draftOut}</div>`:""}`:""}
   </section>
   <section class="panel"><h2>Checks</h2><ul class="checks">${checks.map(([ok,l])=>`<li><span class="${ok?"ok":"no"}">${ok?"✓":"✗"}</span>${esc(l)}</li>`).join("")}</ul>
    <label class="f" for="pkApproved" style="margin-top:12px">Type APPROVED to release the packet<input id="pkApproved" type="text" placeholder="APPROVED" value="${esc(k.ok)}"></label>
    <div class="row" style="margin:10px 0"><button type="button" class="btn primary" id="pkCopy" ${UI.pkReady?"":"disabled"}>${!allOk?"Fix the checks first":!appr?"Type APPROVED to release":"Copy packet for the Publisher"}</button>${UI.pkReady?dlBtn("packet","Download .json"):""}${UI.pkReady&&!store.readOnly?`<button type="button" class="btn" id="pkQueue">Log to Marketing queue</button>`:""}</div>
    <pre class="out" id="pkOut">${esc(UI.pkJSON)}</pre>
    <p class="note">This page doesn't hold the Zapier hook, so nothing is sent from here. Paste the packet to the Publisher bot, which sends it once.</p>
   </section>
  </div>
  <section class="panel"><h2>Platform rules</h2><div class="tablewrap"><table><tr><th>Platform</th><th>Frame</th><th>Route</th><th>Rules</th></tr>${PLATFORMS.map(p=>`<tr><td><b>${p[0]}</b></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td></tr>`).join("")}</table></div></section>
  <section class="panel"><h2>Community and networking</h2><ul class="checks">
   <li><span class="ok">•</span>The radio host names Dr. King's Holt Street address (Dec 5, 1955, age 26) so viewers go look it up. Pin a comment with the Stanford King Institute page to start that conversation.</li>
   <li><span class="ok">•</span>Most people scroll with sound off, so captions are always on.</li>
   <li><span class="ok">•</span>Every post is logged in the "VisionWeaver Publish Log" sheet (last Zap step) so replies and reach can be reviewed.</li>
   <li><span class="ok">•</span>Supabase already has an empty social_post_queue table in the Master Dashboard, ready to track posts once the Zap is live.</li></ul></section>`;
};

V.setup=()=>{
  const done=SETUP_STEPS.filter(s=>ST.setup[s[0]]).length;
  return `<div class="vhead"><span class="eyebrow">System</span><h1>Setup & connections</h1><p>What's connected today, and the one-time steps that let the Studio and Publisher bots run on their own between your two gates.</p></div>
  <section class="panel"><h2>Live check <span class="sub">${ST.live&&ST.live.at?`last run ${when(ST.live.at)} by ${who(ST.live.by)}`:"not run yet"}</span></h2>
   ${CAP.mcp?`<div class="row" style="margin-bottom:10px"><button type="button" class="btn primary" id="liveCheck" ${UI.liveBusy?"disabled":""}>${UI.liveBusy?"Checking…":"Check all connections now"}</button><span class="note">Reads only. Uses your own connector logins; claude.ai may ask you to allow each one the first time.</span></div>`:`<p class="note" style="margin:0 0 10px">Live checks run when this page is opened in Claude with your connectors available.</p>`}
   ${[["runway","Runway","Credits and plan"],["supabase","Supabase · Master Dashboard","Production log and connector registry"],["zapier","Zapier","Apps the Publisher can use"],["github","GitHub · VisionWeaver","Studio source in the repo"]].map(([k,l,d])=>{const r=ST.live&&ST.live[k];return `<div class="conn"><span class="ic" style="background:var(--${!r?"idle":r.ok?"done":"block"})"></span><div><b>${esc(l)}</b><div class="note">${esc(d)}</div></div><span class="note" style="text-align:right;max-width:52ch">${r?esc(r.text||""):"—"}</span></div>`}).join("")}
  </section>
  <div class="grid2">
   <section class="panel"><h2>Connections <span class="sub">recorded 2026-09-29</span></h2>
    ${CONNECTIONS.map(c=>`<div class="conn"><span class="ic" style="background:var(--${c[1]==="done"?"done":c[1]==="wait"?"wait":"idle"})"></span><div><b>${esc(c[0])}</b><div class="note">${esc(c[3])}</div></div><span class="note" style="text-align:right">${esc(c[2])}</span></div>`).join("")}
   </section>
   <section class="panel"><h2>One-time setup <span class="sub">${done} of ${SETUP_STEPS.length} done · about 30–45 min</span></h2>
    <div class="bar2" style="margin-bottom:10px"><i style="width:${done/SETUP_STEPS.length*100}%"></i></div>
    <ul class="todo" style="margin:0;padding:0">${SETUP_STEPS.map((s,i)=>{const d=ST.setup[s[0]];return `<li><span class="mono" style="padding-top:2px">${i+1}</span><div><b>${esc(s[1])}</b><div class="note">${esc(s[2])}</div>${d&&d.at?`<div class="note">Done ${when(d.at)} · ${who(d.by)}</div>`:""}</div>${store.readOnly?"":`<button type="button" class="btn small" data-setup="${s[0]}" aria-pressed="${!!d}">${d?"Done":"Mark done"}</button>`}</li>`}).join("")}</ul>
   </section>
  </div>
  <section class="panel"><h2>How the bots split the work</h2><div class="grid3">
   <div><b>Studio bot</b><div class="note">Holds the Runway app. Takes a job card, makes key frames, waits for your picks, animates only approved frames, writes the edit list and captions, and hands you a publish packet. Never publishes.</div></div>
   <div><b>Publisher bot</b><div class="note">Holds the Zapier action. Only acts on a packet with the word APPROVED. Uploads private and scheduled, logs every post, and never sends the same packet twice.</div></div>
   <div><b>This studio</b><div class="note">Where you decide. Picks, recordings, queue decisions and the release calendar are ${store.mode==="shared"?"saved for the team, and Claude can read them directly":"saved in this browser"}.</div></div>
  </div></section>`;
};

V.uploads=()=>`<div class="vhead"><span class="eyebrow">System</span><h1>Uploads</h1><p>Drop recordings, finished cuts, covers and caption files. Names are checked against the house naming rules and matched to the cue or deliverable they fill.</p></div>
 <label class="drop" id="drop" for="fileIn"><b>Drop files here</b><div class="note">or click to choose · audio, video, images, .srt</div><input id="fileIn" type="file" multiple hidden></label>
 <section class="panel"><h2>This visit <span class="sub">${UI.uploads.length} files</span></h2>
  ${UI.uploads.length?`<div class="tablewrap"><table><tr><th>File</th><th>Size</th><th>Matched to</th><th></th></tr>${UI.uploads.map(u=>`<tr><td class="mono">${esc(u.name)}</td><td class="num">${u.size}</td><td>${esc(u.match)}${u.extra?`<div class="note">${esc(u.extra)}</div>`:""}</td><td>${pill(u.ok?"done":"block",u.ok?"Matched":"Rename")}</td></tr>`).join("")}</table></div>`:`<div class="empty">Nothing dropped yet. Try a narration file named <span class="mono">E01_N01_Recorded_Script.m4a</span>.</div>`}
  <p class="note">The files themselves stay on your device. Matching marks the cue or deliverable as done${store.mode==="shared"?" for the team":""}; put final files in the Drive delivery folder.</p>
 </section>
 <section class="panel"><h2>Naming rules</h2><div class="tablewrap"><table><tr><td class="mono">E01_N01_Recorded_Script … E01_N24_Recorded_Script</td><td>Narration cues</td></tr><tr><td class="mono">E01_RADIO_Recorded_Script</td><td>Radio host line</td></tr><tr><td class="mono">E01_PART1_final.mp4</td><td>Finished short for a PART</td></tr><tr><td class="mono">E01_PART1_cover.jpg</td><td>Cover image</td></tr><tr><td class="mono">E01_PART1_captions.srt</td><td>Captions</td></tr><tr><td class="mono">S01.mp4 … S12.mp4</td><td>Downloaded Runway clips for the edit</td></tr></table></div></section>`;
function takeFiles(files){
  const recPatch={},dlv={};
  [...files].forEach(f=>{
    const n=f.name,size=f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.max(1,Math.round(f.size/1024))+" KB";let m,u={name:n,size,ok:false,match:"No rule matches this name"};
    if((m=n.match(/^E01_(N\d{2}|RADIO)_Recorded_Script(\.\w+)?$/i))){const id=m[1].toUpperCase();const cue=CUES.find(c=>c[0]===id);if(cue){u.ok=true;u.match=`Narration ${id} · PART ${cue[1]} · ${cue[2]}`;recPatch[id]={at:nowISO(),by:store.uid||null,file:n}}}
    else if((m=n.match(/^E01_PART([1-5])_(final\.mp4|cover\.(jpe?g|png)|captions\.srt)$/i))){const p=m[1],kind=m[2].toLowerCase();const i=kind.startsWith("final")?0:kind.startsWith("cover")?2:3;u.ok=true;u.match=`PART ${p} ${["short master","","cover","captions"][i]}`;dlv[p]=dlv[p]||(ST.deliver[p]||[false,false,false,false,false]).slice();dlv[p][i]=true;
      if(i===3){const r=new FileReader();r.onload=()=>{u.extra=`${String(r.result).trim().split(/\r?\n\r?\n/).filter(b=>/-->/.test(b)).length} caption cards found`;render()};r.readAsText(f)}}
    else if((m=n.match(/^(S\d{2})(b?)\.(mp4|mov)$/i))){const id=m[1].toUpperCase()+m[2].toLowerCase();const fr=P1FRAMES.find(x=>x[0]===id);if(fr){u.ok=true;u.match=`PART 1 clip ${id} · ${fr[1]}`}}
    else if(/narrat|^n\d{1,2}/i.test(n))u.match="Looks like narration. Rename to E01_N##_Recorded_Script";
    UI.uploads.push(u);
  });
  const obj={};if(Object.keys(recPatch).length)obj.recorded=recPatch;if(Object.keys(dlv).length)obj.deliver=dlv;
  if(Object.keys(obj).length&&!store.readOnly)patch(obj,`Uploaded and matched: ${[...Object.keys(recPatch),...Object.keys(dlv).map(p=>"PART "+p+" files")].join(", ")}`);else refresh();
  toast(`${files.length} file${files.length>1?"s":""} checked`);
}

V.ledger=()=>`<div class="vhead"><span class="eyebrow">System</span><h1>Credit ledger</h1><p>Every spend written in the production records, plus today's live balance. Runway credits are purchased credits on the Pro plan.</p></div>
 <section class="panel"><div class="tablewrap"><table><tr><th>Date</th><th>What</th><th>Credits</th><th>Balance</th></tr>${LEDGER.map(r=>`<tr><td class="mono">${r[0]}</td><td>${esc(r[1])}</td><td class="num">${r[2]}</td><td class="num"><b>${r[3]}</b></td></tr>`).join("")}</table></div>
 <p class="note">The records stop at 37,257. Runway now shows 36,738, so 519 credits were used after that. S05b (120) accounts for part of it; the records don't say what the rest was for.</p></section>
 <section class="panel"><h2>Price list</h2><div class="tablewrap"><table><tr><td>Key frame picture, 2K</td><td class="num">20</td></tr><tr><td>Video, Gen-4.5</td><td class="num">12 per second (60 per 5 s, 120 per 10 s)</td></tr><tr><td>Hero close-ups, Seedance 2</td><td class="num">36 per second</td></tr><tr><td>Speech</td><td class="num">about 1 per 50 letters</td></tr><tr><td>Sound effect</td><td class="num">1 per second</td></tr><tr><td>Music clip</td><td class="num">4</td></tr></table></div></section>`;
