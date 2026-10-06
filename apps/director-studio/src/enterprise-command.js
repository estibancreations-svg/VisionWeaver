/* ================= CEO SOVEREIGN ENTERPRISE ================= */
UI.enterprise = UI.enterprise || {tab:"portfolio"};

const ENT_METRICS = [
  ["Active campaigns","12","Across 4 business units","done"],
  ["Awaiting approval","3","Executive or legal decision","you"],
  ["Blocked","2","Claims / rights exceptions","block"],
  ["Approved digital twins","27","Product + property masters","done"],
  ["Markets live","8","Campaign descendants active","wait"],
  ["Risk exceptions","4","Needs owner + deadline","you"]
];

const ENT_DECISIONS = [
  {level:"High",unit:"Luxury Marine",title:"82 ft flagship launch — claim review",why:"Performance copy references a range figure that is not tied to an approved evidence record.",rec:"Hold claim; approve visual campaign while Legal Claims Auditor resolves evidence.",go:"commercial"},
  {level:"Medium",unit:"Senior Living",title:"Sunrise campus — market variant approval",why:"Three regional variants are production-ready; one accessibility statement needs confirmation.",rec:"Approve three cleared markets; keep one variant blocked.",go:"commercial"},
  {level:"Low",unit:"Commercial Real Estate",title:"Tower North — digital twin refresh",why:"New lobby finish schedule supersedes the current visualization package.",rec:"Invalidate lobby descendants only; preserve all unaffected floor and exterior assets.",go:"design"}
];

const ENT_UNITS = [
  ["Enterprise Technology","6 campaigns","4 markets","Brand constitution locked"],
  ["Residential + Commercial Real Estate","4 campaigns","3 properties","2 twin updates pending"],
  ["Luxury Marine + RV","3 campaigns","5 models","1 claims hold"],
  ["Senior Living","5 campaigns","7 communities","Regional rollout staged"]
];

V.enterprise=()=>{
 return `<div class="vhead"><span class="eyebrow">Part 3 · CEO Sovereign Enterprise · v0.1</span><h1>Enterprise command</h1><p>Boardroom control for enterprise truth, digital twins, brand law, global campaigns, approvals, risk and CMGIO performance. This surface shows decisions first; production detail is one drill-down away.</p></div>
 <section class="panel"><div class="grid3">${ENT_METRICS.map(m=>`<div class="stat"><b class="num">${m[1]}</b><span>${esc(m[0])}</span><div style="margin-top:7px">${pill(m[3],m[2])}</div></div>`).join("")}</div></section>
 <div class="grid2">
  <section class="panel"><h2>Executive decision queue <span class="sub">3 need action</span></h2>
   <ul class="todo" style="margin:0;padding:0">${ENT_DECISIONS.map(d=>`<li>${pill(d.level==="High"?"block":d.level==="Medium"?"you":"wait",d.level)}<div><b>${esc(d.title)}</b><div class="note">${esc(d.unit)} · ${esc(d.why)}</div><div style="margin-top:5px"><b>Recommendation:</b> ${esc(d.rec)}</div></div><button type="button" class="btn small" data-view="${d.go}">Open</button></li>`).join("")}</ul>
  </section>
  <section class="panel"><h2>Portfolio intelligence</h2>
   <div class="tablewrap"><table><tr><th>Business unit</th><th>Campaigns</th><th>Footprint</th><th>Current state</th></tr>${ENT_UNITS.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</table></div>
  </section>
 </div>
 <section class="panel"><h2>Enterprise control chain</h2>
  <div class="flow">
   <div class="st"><b>1 · Objective</b>CEO / CMO business goal</div>
   <div class="st"><b>2 · Truth</b>Products, properties, claims, rights</div>
   <div class="st"><b>3 · Strategy</b>Market, audience, investment thesis</div>
   <div class="st"><b>4 · Campaign graph</b>Master → regions → channels → variants</div>
   <div class="gate">EXEC<br>GATE</div>
   <div class="st"><b>5 · VisionWeaver</b>Creative + digital twin production</div>
   <div class="st"><b>6 · Audit</b>Brand, legal, rights, continuity, security</div>
   <div class="gate">APPROVED</div>
   <div class="st"><b>7 · CMGIO</b>Publish, monitor, scale, pause</div>
   <div class="st"><b>8 · Boardroom</b>Performance, cost, risk, next decision</div>
  </div>
 </section>
 <div class="grid2">
  <section class="panel"><h2>Enterprise truth + digital twins</h2>
   <ul class="checks">${[
    "Products / SKUs / models / options resolve to locked enterprise records",
    "Properties / floorplans / rooms / amenities retain approved twin versions",
    "Brand Constitution governs copy, product presentation, camera, light and audio",
    "Claims require evidence before release",
    "Contract / talent / rights expirations can invalidate dependent assets",
    "Market and localization branches cannot overwrite master truth"
   ].map(x=>`<li><span class="ok">✓</span>${x}</li>`).join("")}</ul>
  </section>
  <section class="panel"><h2>Independent executive agents</h2>
   <div class="grid3">${["Campaign Architect","Brand Director","Commercial Producer","Digital Twin Director","Research Director","Rights Director","Legal Claims Auditor","Localization Director","Media Director","Growth Scientist","Casting Director","The Auditor"].map(a=>`<div><b>${a}</b><div class="note">${a==="The Auditor"?"Independent verification; never self-approves.":"Specialist recommendation; approval stays with authorized humans."}</div></div>`).join("")}</div>
  </section>
 </div>
 <section class="panel"><h2>Security + governance boundary</h2>
  <p><b>Enterprise target:</b> SSO/SAML, SCIM, MFA, RBAC/ABAC, business-unit compartments, zero-trust/JIT access, encrypted storage, immutable audit history, legal holds, DLP, regional controls and scoped agency workspaces.</p>
  <p class="note">These controls are the Part 3 contract. They are not represented as deployed until the corresponding integrations and release evidence exist.</p>
 </section>
 <section class="panel"><h2>Deferred — Part 2 Studio Intelligence</h2><p>The governed creative-intelligence layer remains intentionally deferred: evidence router, constraint compiler, isolated generation contexts, specialized QC, corrective regeneration, variant graph mechanics, performance-learning and dependency invalidation. It is preserved as future work; Part 3 does not falsely claim it is already built.</p></section>`;
};
