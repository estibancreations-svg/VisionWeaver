/* ================= v8.1: THE FRAMES AND THEIR BATCH CARD LINE UP =================
   The trap this fixes (found 2026-10-03): the Guild queue card "PART 2 key frames, batch 2" could be
   swiped or approved by itself. That approved the reminder only. Every frame stayed "waiting", but it
   looked like Gate 1 was done. Now:
   1. The batch card can't be approved or sent back while any frame is waiting. Trying opens Decide.
   2. In Decide the frames come first, one card each, under a progress line. The batch card isn't a card.
   3. The batch card follows the frames by itself: every frame picked -> approved (or "changes" when
      some are marked redo); a frame goes back to waiting -> the card reopens.
   4. On Pictures, tapping Approve on a frame that is already approved no longer un-approves it.
   Gate 1 still belongs to the owner: nothing here approves a frame without a tap or swipe on that frame. */
const FRAME_BATCH_RE=/part\s*2\b.*key\s*frames/i;
const FB_AUTO="Follows the frames";
function isFrameBatch(q){return !!q&&(q.project||XR_ID)===XR_ID&&(q.frames==="p2"||FRAME_BATCH_RE.test(String(q.title||"")))}
function p2Count(){const c={approved:0,pending:0,redo:0,total:P2FRAMES.length};P2FRAMES.forEach(f=>{const v=ST.p2[f[0]]||"pending";c[v]=(c[v]||0)+1});return c}
function p2Ids(k){return P2FRAMES.filter(f=>(ST.p2[f[0]]||"pending")===k).map(f=>f[0])}
const fbWait=n=>`That card is only the reminder. ${n} frame${n===1?"":"s"} still need${n===1?"s":""} your pick, one at a time.`;

/* 1. guard: the reminder can't be decided while frames are waiting */
const _qDecideFB=qDecide;
qDecide=async function(id,status,note){const q=QUEUE.find(x=>x.id===id);
  if(q&&isFrameBatch(q)&&status!=="pending"&&String(note||"").indexOf(FB_AUTO)!==0){const n=p2Count().pending;
    if(n>0){toast(fbWait(n));if(activeId()!==XR_ID)setActive(XR_ID);go("decide");return {blocked:true,pending:n}}}
  return _qDecideFB(id,status,note)};
const _qdCheckFB=ACTIONS.queue_decision.check;
ACTIONS.queue_decision.check=a=>{const r=_qdCheckFB(a);if(r)return r;const q=qFind(a),n=p2Count().pending;
  return q&&isFrameBatch(q)&&a.decision!=="pending"&&n>0?fbWait(n)+" Ask me to approve a frame by its number, or open Decide.":null};

/* 3. the batch card follows the frames */
function frameBatchSync(){
  if(store.readOnly||(store.mode==="shared"&&!store.exists))return;
  const c=p2Count(),want=c.pending>0?"pending":c.redo>0?"changes":"approved";
  QUEUE.filter(isFrameBatch).forEach(q=>{if(q.status===want||q.status==="done")return;
    _qDecideFB(q.id,want,want==="pending"?"":`${FB_AUTO}: ${c.approved} approved, ${c.redo} to redo${c.redo?` (${p2Ids("redo").join(", ")})`:""}`)})}
const _refreshFB=refresh;
refresh=function(force){try{frameBatchSync()}catch(e){}return _refreshFB(force)};

/* 2. Decide: frames first, no batch card, a progress line on top */
const _deckItemsFB=deckItems;
deckItems=function(){const items=_deckItemsFB();if(!activeProject().builtin)return items;
  const fr=[],rest=[];
  items.forEach(it=>{if(it.kind==="f"){const f=P2FRAMES.find(x=>x[0]===it.id);if(f)it.detail=`${f[1]}. Once approved it is animated at ${f[4]} s (${f[4]*12} credits).`;fr.push(it)}
    else if(!(it.kind==="q"&&isFrameBatch(QUEUE.find(q=>q.id===it.id))))rest.push(it)});
  const sk=UI.deckSkip||[];return fr.concat(rest).sort((a,b)=>sk.indexOf(a.kind+":"+a.id)-sk.indexOf(b.kind+":"+b.id))};
const _vDecideFB=V.decide;
V.decide=()=>{const h=_vDecideFB();if(!activeProject().builtin)return h;
  const c=p2Count(),picked=c.total-c.pending,top=deckItems()[0],f=top&&top.kind==="f"?P2FRAMES.find(x=>x[0]===top.id):null;
  const bar=`<section class="fbar" id="fbar" aria-label="PART 2 key frames progress"><div class="fbar-t"><b>PART 2 key frames</b><span>${picked} of ${c.total} picked · ${c.approved} approved · ${c.redo} to redo · ${c.pending} waiting</span></div>
   <div class="fbar-m" role="progressbar" aria-valuemin="0" aria-valuemax="${c.total}" aria-valuenow="${picked}"><i style="width:${Math.round(100*picked/c.total)}%"></i></div>
   ${f?`<p class="note">This page can't show Runway pictures. To look at ${esc(f[0])} first, open it in Runway by its task ID: <span class="mono">${esc(f[2].slice(0,8))}…</span> <button type="button" class="btn small" data-copy="${esc(f[2])}">Copy ID</button></p>`
     :c.pending===0?`<p class="note">Every frame has a pick. The "PART 2 key frames" card in the Guild queue closed by itself.</p>`:""}</section>`;
  return h.replace('<div class="deckwrap">',bar+'<div class="deckwrap">')};

/* 4. Pictures: Approve on an approved frame is not an un-approve */
document.addEventListener("click",e=>{const el=e.target.closest&&e.target.closest("[data-p2]");if(!el)return;
  if(el.dataset.v==="approved"&&ST.p2[el.dataset.p2]==="approved"){e.stopPropagation();e.preventDefault();toast(`${el.dataset.p2} is already approved. To change it, tap Redo.`)}},true);

/* THELMA knows the rule */
const _thelmaContextFB=thelmaContext;
thelmaContext=function(){const c=p2Count();
  return _thelmaContextFB()+`
PART 2 KEY FRAMES (Gate 1): ${c.approved} approved, ${c.redo} to redo, ${c.pending} waiting${c.pending?` (${p2Ids("pending").join(", ")})`:""}.
The Guild queue card "PART 2 key frames" is only a reminder. It closes by itself when every frame has a pick. Never offer queue_decision for it while frames are waiting; use frame_decision for one named frame at a time. Say plainly that this page can't show the frame pictures: they open in Runway by task ID, and Decide has a Copy ID button.`};
