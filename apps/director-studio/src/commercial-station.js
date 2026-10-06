/* ================= COMMERCIAL CREATIVITY STATION ================= */
UI.commercial = UI.commercial || {vertical:"All",structure:"All",mode:"All",q:"",selected:"CCS-0001"};

const CCS_VERTICALS = [
"Family dining","Steakhouse","Seafood","Barbecue","Fast casual","Quick service","Grocery","Beverage","Snacks / packaged food","Automotive","Real estate","Hospitality / hotels","Travel / tourism","Retail","Apparel","Beauty / skincare","Home / furniture","Consumer electronics","Fitness","Financial services","Professional services","Healthcare services","Education","Entertainment / events","Nonprofit / community"
];

const CCS_STRUCTURES = [
"Hero Product Reveal","Craving → Product","Problem → Solution","Before → After","Family Table","Occasion / Celebration","Product Ritual","Macro Sensory","Ingredient / Craft","Demonstration","Testimonial","Social Proof","Three Reasons","Comparison","Transformation","Day in the Life","Point of View","UGC-Style","Founder / Maker","Staff / Service","Environment / Atmosphere","Destination","Limited Offer","New Launch","Seasonal","Countdown","Story Mini-Arc","Humor Setup / Payoff","Emotional Memory","Generational / Family Legacy","Behind the Scenes","Process / How It’s Made","Feature Stack","Benefit Stack","Objection / Rebuttal","FAQ","Product Lineup","Choose Your Favorite","Sound-First / ASMR","Cinematic Brand Film"
];

const CCS_MODES = ["Cinematic","Direct Response"];
const CCS_COUNT = CCS_VERTICALS.length * CCS_STRUCTURES.length * CCS_MODES.length;

function ccsId(v,s,m){
  const n=((CCS_VERTICALS.indexOf(v)*CCS_STRUCTURES.length+CCS_STRUCTURES.indexOf(s))*CCS_MODES.length+CCS_MODES.indexOf(m))+1;
  return "CCS-"+String(n).padStart(4,"0");
}
function ccsObjective(v,s,m){
  if(v==="Family dining") return m==="Cinematic"?"Sell food, hospitality, environment and family ritual as one experience.":"Create an immediate reason for a family to choose this dining occasion now.";
  if(v==="Beverage"&&s==="Craving → Product") return "Turn sensory craving into product desire, then close on an exact hero packshot.";
  if(/Testimonial|Social Proof/.test(s)) return "Build trust through specific, supportable evidence without invented claims.";
  if(/Limited Offer|Countdown/.test(s)) return "Create clear urgency around a real, verified offer and one CTA.";
  if(/Environment|Destination|Cinematic/.test(s)) return "Make the setting increase perceived value while keeping the commercial objective legible.";
  return m==="Cinematic"?"Create desire through controlled story, atmosphere and a memorable payoff.":"Move the viewer from a clear problem or desire to one concrete action.";
}
function ccsProof(v,s){
  if(v==="Family dining") return "Food-detail payoff + natural table reaction + room/service atmosphere.";
  if(v==="Beverage") return "Condensation, opening ritual, pour/carbonation and exact final packshot.";
  if(/Demonstration|Before → After|Transformation/.test(s)) return "Visible, supportable change shown on camera.";
  if(/Ingredient|Craft|Process/.test(s)) return "Specific material, ingredient or making step that can be shown.";
  if(/Testimonial|Social Proof/.test(s)) return "Verifiable customer statement or sourced evidence.";
  return "A visible product/service result, reaction or experience that supports the promise.";
}
function ccsCTA(s,m){
  if(/Limited Offer|Countdown|New Launch/.test(s)) return "Shop / Book / Order now — only if the offer is verified.";
  if(/Destination|Environment|Cinematic Brand Film|Emotional Memory/.test(s)) return "Visit / Discover / Learn more.";
  if(/Testimonial|FAQ|Objection/.test(s)) return "Learn more / See details / Start a conversation.";
  return m==="Direct Response"?"One measurable action: Order, Book, Shop, Call, Visit or Learn more.":"One restrained brand action matched to the story.";
}
function ccsSlots(v,s,m){
  if(v==="Family dining"){
    return [
      ["0:00–0:05","Arrival or immediate food hook","Exterior/warm room context + one irresistible food detail"],
      ["0:05–0:10","Hospitality","Seating, service, table setup; environment must increase food value"],
      ["0:10–0:15","Hero entrée reveal","Steam, crust, butter, sauce, grill marks or fresh plating"],
      ["0:15–0:20","Sensory proof","Knife cut, bread tear, fork lift, beverage pour, sizzle or first bite"],
      ["0:20–0:25","Family payoff","Natural reaction and conversation; no posed stock-photo behavior"],
      ["0:25–0:30","Memory frame","Hero spread + restaurant identity + one CTA"]
    ];
  }
  if(v==="Beverage"&&s==="Craving → Product"){
    return [
      ["0:00–0:05","Craving trigger","Food/action first; product not yet fully revealed"],
      ["0:05–0:10","Product interruption","Exact package enters frame and becomes the hero"],
      ["0:10–0:15","Anticipation","Reach, label glide, condensation, hand-object contact"],
      ["0:15–0:20","Release","Pull-tab/open/pour/carbonation sound-led macro"],
      ["0:20–0:25","Experience","Consumption + natural social reaction"],
      ["0:25–0:30","Memory frame","Exact hero packshot + tagline + one CTA"]
    ];
  }
  const names = [
    ["0:00–0:05","Hook","Pattern interruption tied directly to the offer or desire"],
    ["0:05–0:10","Context","Establish who, where and why it matters"],
    ["0:10–0:15","Tension","Show the problem, craving, obstacle or unanswered question"],
    ["0:15–0:20","Turn","Product/service enters as the credible change"],
    ["0:20–0:25","Proof","Visible demonstration, reaction, evidence or benefit"],
    ["0:25–0:30","Memory frame","Hero object / result + one CTA"]
  ];
  if(m==="Direct Response") names[5][2]="Offer/result + one measurable CTA; no competing asks";
  return names;
}
function ccsTemplate(v,s,m){
  return {
    id:ccsId(v,s,m),vertical:v,structure:s,mode:m,
    objective:ccsObjective(v,s,m),proof:ccsProof(v,s),cta:ccsCTA(s,m),
    locks:["Hero object / service truth","Approved opening frame","Approved closing frame","Environment","Cast state when present","Rights/claims"],
    slots:ccsSlots(v,s,m)
  };
}
function ccsAll(){
  const a=[];CCS_VERTICALS.forEach(v=>CCS_STRUCTURES.forEach(s=>CCS_MODES.forEach(m=>a.push(ccsTemplate(v,s,m)))));
  return a;
}
const CCS_TEMPLATES = ccsAll();
function ccsFiltered(){
  const f=UI.commercial,q=(f.q||"").toLowerCase();
  return CCS_TEMPLATES.filter(t=>(f.vertical==="All"||t.vertical===f.vertical)&&(f.structure==="All"||t.structure===f.structure)&&(f.mode==="All"||t.mode===f.mode)&&(!q||[t.id,t.vertical,t.structure,t.mode,t.objective].join(" ").toLowerCase().includes(q)));
}
function ccsSelected(){
  const hits=ccsFiltered();return CCS_TEMPLATES.find(t=>t.id===UI.commercial.selected)||hits[0]||CCS_TEMPLATES[0];
}
function ccsSelect(id){UI.commercial.selected=id;render();}
function ccsOpt(all,cur){return '<option>All</option>'+all.map(x=>`<option ${x===cur?"selected":""}>${esc(x)}</option>`).join("");}

V.commercial=()=>{
  const hits=ccsFiltered(), t=ccsSelected();
  return `<div class="vhead"><span class="eyebrow">Commercial Creativity Station · v0.1</span><h1>Commercials & ads</h1><p>Concrete commercial structures with continuity locks, shot logic and platform-ready derivatives. <b>${fmt(CCS_COUNT)} base templates</b>: 40 structures × 25 verticals × 2 creative modes.</p></div>
  <section class="panel"><div class="grid3">
    <label class="f">Vertical<select id="ccsVertical">${ccsOpt(CCS_VERTICALS,UI.commercial.vertical)}</select></label>
    <label class="f">Structure<select id="ccsStructure">${ccsOpt(CCS_STRUCTURES,UI.commercial.structure)}</select></label>
    <label class="f">Mode<select id="ccsMode">${ccsOpt(CCS_MODES,UI.commercial.mode)}</select></label>
  </div><div class="row" style="margin-top:10px"><input id="ccsQ" value="${esc(UI.commercial.q)}" placeholder="Search: family, sensory, testimonial, launch…" style="max-width:420px"><span class="note">${fmt(hits.length)} matching templates · durations and aspect ratios are variants, not fake extra counts.</span></div></section>
  <div class="split">
   <section class="panel" style="padding:0"><div class="tablewrap"><table><tr><th>ID</th><th>Vertical</th><th>Structure</th><th>Mode</th></tr>
   ${hits.slice(0,120).map(x=>`<tr data-ccs="${x.id}" class="shotrow${x.id===t.id?" sel":""}"><td class="mono"><b>${x.id}</b></td><td>${esc(x.vertical)}</td><td>${esc(x.structure)}</td><td>${esc(x.mode)}</td></tr>`).join("")||'<tr><td colspan="4" class="note">No matching templates.</td></tr>'}
   </table></div>${hits.length>120?'<div class="note" style="padding:10px">Showing the first 120 matches. Narrow the filters to browse the rest.</div>':""}</section>
   <section class="panel" style="position:sticky;top:0">
    <h2>${t.id} <span class="sub">${esc(t.vertical)} · ${esc(t.mode)}</span></h2>
    <h3>${esc(t.structure)}</h3>
    <dl class="kv"><dt>Objective</dt><dd>${esc(t.objective)}</dd><dt>Proof moment</dt><dd>${esc(t.proof)}</dd><dt>CTA</dt><dd>${esc(t.cta)}</dd></dl>
    <h3>30-second starter board</h3><div class="tablewrap"><table><tr><th>Time</th><th>Beat</th><th>Direction</th></tr>${t.slots.map(s=>`<tr><td class="mono">${s[0]}</td><td><b>${esc(s[1])}</b></td><td>${esc(s[2])}</td></tr>`).join("")}</table></div>
    <h3 style="margin-top:14px">Hard continuity gate</h3>
    <ul class="checks">${["Exact hero object/package/label reference","Opening AND closing frame approved for every shot block","No silent lookalike substitution","Food/prop/cast/environment state remains coherent","Reject warped text, geometry, reflections, hands or repeated AI-looking faces","Claims, price, availability and affiliation must be sourced"].map(x=>`<li><span class="ok">✓</span>${x}</li>`).join("")}</ul>
    <div class="row"><button type="button" class="btn" id="ccsPepsi">Open Pepsi anchor</button><button type="button" class="btn" id="ccsFamily">Open Family Dining anchor</button></div>
   </section>
  </div>
  <section class="panel"><h2>Production standard</h2><p><b>Object lock → opening frame → closing frame → motion → continuity comparison → edit → derivative sizes.</b> A visually attractive render still fails if the hero product, food, label, environment or cast drifts.</p><p class="note">This station currently authors plans and QC requirements. It does not claim generation or publishing until those runtime actions are connected and verified.</p></section>`;
};

document.addEventListener("change",e=>{
  if(e.target.id==="ccsVertical"){UI.commercial.vertical=e.target.value;UI.commercial.selected="";render()}
  if(e.target.id==="ccsStructure"){UI.commercial.structure=e.target.value;UI.commercial.selected="";render()}
  if(e.target.id==="ccsMode"){UI.commercial.mode=e.target.value;UI.commercial.selected="";render()}
});
document.addEventListener("input",e=>{
  if(e.target.id==="ccsQ"){UI.commercial.q=e.target.value;UI.commercial.selected="";const pos=e.target.selectionStart;render();const n=document.getElementById("ccsQ");if(n){n.focus();n.setSelectionRange(pos,pos)}}
});
document.addEventListener("click",e=>{
  const row=e.target.closest&&e.target.closest("[data-ccs]");if(row){ccsSelect(row.dataset.ccs);return}
  if(e.target.id==="ccsPepsi"){UI.commercial.vertical="Beverage";UI.commercial.structure="Craving → Product";UI.commercial.mode="Cinematic";UI.commercial.q="";UI.commercial.selected=ccsId("Beverage","Craving → Product","Cinematic");render();return}
  if(e.target.id==="ccsFamily"){UI.commercial.vertical="Family dining";UI.commercial.structure="Family Table";UI.commercial.mode="Cinematic";UI.commercial.q="";UI.commercial.selected=ccsId("Family dining","Family Table","Cinematic");render();return}
});
