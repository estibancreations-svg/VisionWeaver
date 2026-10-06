/* ================= VisionWeaver Operating System boards =================
   Adds truthful command surfaces around the existing studio without replacing
   production pages. Runtime labels distinguish live, recorded, available,
   degraded, planned and export-only states.
*/
const VW_OS_LINKS={
  ceo:"https://master-ceo-dashboard.vercel.app",
  github:"https://github.com/estibancreations-svg/VisionWeaver",
  supabase:"https://supabase.com/dashboard/project/yqealeekngxooyoemfba",
  chatgpt:"https://chatgpt.com/",
  claude:"https://claude.ai/",
  gemini:"https://gemini.google.com/"
};
const VW_SECRET_NAMES=[
  ["OpenAI","OPENAI_API_ACCESS","CEO/THELMA backend route"],
  ["Anthropic / Claude","ANTHROPIC_API_KEY","CEO/THELMA backend route"],
  ["Gemini","GEMINI_CONNECTION","CEO/THELMA backend route; provider validation required"],
  ["Runway","RUNWAY_API_ACCESS","VisionWeaver direct provider route"],
  ["OpenRouter","OPENROUTER_API_KEY","CEO/THELMA fallback route"]
];
const VW_OPERATING_CONTEXT=`
VISIONWEAVER OPERATING MAP:
Create & Produce -> Avatar Engineering -> Worlds & Locations -> Design & Commercial -> Post Production -> Distribution.
Support/control: Teams & C-Suite, Finance & Accounting, History & Memory, Data & Database, IT & Security, Quality & Audit, Rights & Provenance.
Design & Commercial contains Commercial Creativity, Product Design, Product Placement and Placement Mapping.
THELMA must treat Avatar State and World/Location State as upstream production locks; use evidence and existing approved state before proposing generation.
THELMA must not claim a provider or connector is live unless a runtime check or current system record proves it. Label other states available, degraded, planned, export-only or pending verification.
Actual secret values never belong in VisionWeaver pages, GitHub, screenshots or handoff text; show secret names and the approved Vault/secret-manager location only.
For ChatGPT, Claude and Gemini, distinguish interactive handoff from API/backend provider routing.
`;
function vwStatus(key,label){
  const r=ST.live&&ST.live[key];
  if(r)return pill(r.ok?"done":"block",r.ok?(label||"live check passed"):"problem");
  return pill("idle",label||"not checked");
}
function vwCard(title,body,actions,status){
  return `<section class="panel vw-os-card"><div class="vw-os-cardhead"><h2>${esc(title)}</h2>${status||""}</div><div class="vw-os-body">${body}</div>${actions?`<div class="row vw-os-actions">${actions}</div>`:""}</section>`;
}
function vwGo(label,page){return `<button type="button" class="btn small" data-view="${page}">${esc(label)}</button>`}
function vwExt(label,url){return `<a class="btn small" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`}
function vwContextPack(){
  const live=["runway","supabase","zapier","github"].map(k=>`${k}:${ST.live&&ST.live[k]?(ST.live[k].ok?"ok":"problem"):"not checked"}`).join(", ");
  return `VisionWeaver handoff
Current page: ${UI.view}
Parts finished: ${partsDone()} of 5
Waiting: ${waiting().map(x=>x.t).join(" | ")||"none"}
Live checks: ${live}
Operating map: ${VW_OPERATING_CONTEXT.trim()}`;
}
document.addEventListener("click",e=>{
  const b=e.target&&e.target.closest?e.target.closest("[data-vw-copy-context]"):null;
  if(b)copy(vwContextPack(),"VisionWeaver context copied");
});

if(typeof GUIDE!=="undefined")Object.assign(GUIDE,{
  command:["The operating map around the production studio.","Open the area that owns the next decision."],
  avatarops:["Identity, appearance, voice and reference coverage before generation.","Review the active Avatar State and unresolved coverage."],
  worldops:["Place, time, environment, physics and provenance before generation.","Review the Location Pack and World State evidence."],
  designops:["Commercial creativity, product design and placement live together here.","Open the Commercial Creativity Station or placement controls."],
  teamsops:["Human departments, C-Suite offices and agents share one authority map.","Check ownership and approval boundaries."],
  financeops:["Production resource use and business finance are visible but separate.","Review credits, ledger and CFO/Finance handoff."],
  memoryops:["History, canon, database state and backups must be traceable.","Check recent activity and backup state."],
  itops:["Infrastructure, providers, connectors, secrets and incidents.","Run live checks before calling anything live."],
  qualityops:["Independent evidence, rights and release acceptance.","Review the Quality Gate and unresolved runtime certifications."]
});

V.command=()=>`<div class="vhead"><span class="eyebrow">VisionWeaver operating system</span><h1>Command board</h1><p>The existing production studio stays intact. These boards expose the operating layers around it: identity, worlds, commercial work, teams, money, memory, infrastructure and independent quality.</p></div>
<div class="vw-os-grid">
 ${vwCard("Avatar Engineering","<p>Avatar State, character detail specifications, A Cast Board, 16/32/64 coverage planning, voices, appearance revisions and identity continuity.</p>",vwGo("Open Avatar Engineering","avatarops"),pill("wait","foundation"))}
 ${vwCard("Worlds & Locations","<p>Global Place + People references, Location Packs, World State, period/date evidence, ecology, sound, physics and persistent environment continuity.</p>",vwGo("Open Worlds & Locations","worldops"),pill("wait","foundation"))}
 ${vwCard("Create & Produce","<p>Books, locks, shots, pictures, motion, narration, sound, edit, delivery and publishing remain the production spine.</p>",vwGo("Open Run of show","overview"),pill("done","existing"))}
 ${vwCard("Design & Commercial","<p>Commercial Creativity, Product Design, Product Placement, Placement Mapping and approved product/object locks.</p>",vwGo("Open Design & Commercial","designops"),pill("done","commercial station"))}
 ${vwCard("Teams & C-Suite","<p>Directors Guild departments, executive offices, THELMA and specialist agents with clear authority and escalation.</p>",vwGo("Open Teams & C-Suite","teamsops"),pill("wait","mapped"))}
 ${vwCard("Finance & Accounting","<p>Production credits/costs, ledger, provider usage and the enterprise CFO/Finance handoff. Accounting integration is not overstated.</p>",vwGo("Open Finance","financeops"),pill("wait","partial"))}
 ${vwCard("History, Memory & Data","<p>Activity, canon/version history, Supabase, backups, files and durable handoff records.</p>",vwGo("Open Memory & Data","memoryops"),pill("done","existing sources"))}
 ${vwCard("IT, Security & Quality","<p>Infrastructure, provider health, secrets status, backups, rights, audits, Quality Gate and release evidence.</p>",vwGo("Open IT & Security","itops")+vwGo("Open Quality","qualityops"),pill("wait","mixed"))}
</div>`;

V.avatarops=()=>`<div class="vhead"><span class="eyebrow">Foundation · identity</span><h1>Avatar Engineering</h1><p>Character identity is a production lock, not an image prompt. Approved boards and versioned state must follow the character into every scene.</p></div>
<div class="vw-os-grid">
 ${vwCard("Avatar State","<p><b>Current contract:</b> three-board identity chain with Character Detail Specifications, 360 coverage and A Cast Board. Existing 32-view masters remain valid; 16-view is wardrobe/state; 64-slot expansion still requires exact calibration acceptance.</p>",vwGo("Cast & avatars","cast")+vwGo("Design Studio","design"),pill("wait","runtime certification pending"))}
 ${vwCard("Identity continuity","<p>Preserve body, face, skin tone, hair, wardrobe, injuries, age/body changes, voice/accent and scene-specific state. Do not silently replace an approved identity reference.</p>",vwGo("Locks & maps","locks"),pill("done","contracted"))}
 ${vwCard("Coverage & calibration","<p>Coverage must record indexed angle/height references and lineage. A board image being pretty is not proof of complete geometry or provider handoff.</p>",vwGo("Rights & provenance","rights"),pill("wait","calibration open"))}
 ${vwCard("Avatar Catalog","<p>Reusable identity, appearance, voice, scenes and product-linked wardrobe are defined in the catalog architecture. Runtime catalog publication is not certified.</p>",vwGo("Design Studio","design"),pill("idle","specification"))}
</div>`;

V.worldops=()=>`<div class="vhead"><span class="eyebrow">Foundation · place and causality</span><h1>Worlds & Locations</h1><p>VisionWeaver treats the environment as persistent state: geography, architecture, time, weather, sound, ecology, transport, people, off-camera events and causal consequences.</p></div>
<div class="vw-os-grid">
 ${vwCard("Global Place + People","<p>Worldwide, rights-aware reference architecture for believable places, populations, architecture, transport, lodging, events, licensed imagery and social discovery.</p>",vwGo("Design Studio","design"),pill("done","architecture approved"))}
 ${vwCard("Location Packs","<p>Each pack pins geography, architecture, transport, casting ranges, wardrobe, weather/season, lighting, ambience, animals/insects, signage/language, activity, camera references and provenance.</p>",vwGo("Locks & maps","locks"),pill("idle","generation pipeline pending"))}
 ${vwCard("World State & physics","<p>World State carries object/entity state, contacts, event timing, sound, camera consequences and continuity between shots. Existing balloon regression fixtures test part of this contract.</p>",vwGo("Shot bible","shots"),pill("wait","partial runtime"))}
 ${vwCard("Evidence boundary","<p>Public availability or attribution alone never grants training or redistribution rights. Location/date claims and reference permissions must retain provenance.</p>",vwGo("Rights & provenance","rights"),pill("done","required"))}
</div>`;

V.designops=()=>`<div class="vhead"><span class="eyebrow">Design & Commercial</span><h1>Commercial, product design & placement</h1><p>Products are locked assets. Creativity belongs in story, camera, environment, performance, sound and edit—not in accidental package drift.</p></div>
<div class="vw-os-grid">
 ${vwCard("Commercial Creativity","<p><b>2,000 base templates</b>: 40 structures × 25 verticals × 2 creative modes, with object locks, opening/closing frames, platform derivatives and low-AI rejection rules.</p>",vwGo("Commercial Creativity Station","commercial"),pill("done","implemented"))}
 ${vwCard("Product Design","<p>Concept, packaging, label geometry, colorways, approved hero reference, photography direction and versioned product master. The board is present; dedicated product-design runtime tools are the next implementation layer.</p>",vwGo("Design Studio","design"),pill("idle","board mapped"))}
 ${vwCard("Product Placement","<p>Track exact product/version, scene, avatar interaction, screen position, duration, prominence, orientation, label readability, lighting, rights, disclosure and continuity state.</p>",vwGo("Shot bible","shots")+vwGo("Rights","rights"),pill("idle","board mapped"))}
 ${vwCard("Placement Mapping","<p>Project-wide view of every branded item, which scene contains it, which avatar interacts with it and whether the placement is approved. No hidden substitution or competing-brand drift.</p>",vwGo("Projects / Run of show","overview"),pill("idle","workflow pending"))}
</div>`;

V.teamsops=()=>`<div class="vhead"><span class="eyebrow">People & authority</span><h1>Teams & C-Suite</h1><p>VisionWeaver uses the existing Directors Guild and enterprise authority model. This board does not create new powers; it makes ownership and escalation visible.</p></div>
<div class="vw-os-grid">
 ${vwCard("Directors Guild","<p><b>Design · Motion · Sound · Edit · Marketing · Automation.</b> Departments bring triple-checked work to the timestamped Guild queue; director approval gates remain unchanged.</p>",vwGo("Directors Guild queue","guild"),pill("done","existing"))}
 ${vwCard("Executive offices","<p>Architect / CEO authority, CFO Finance, combined CIO/CTO Technology & Information, Legal/Compliance, People & Capability, and CMGIO Growth. Chief Human Experience Officer remains a later concept until the enterprise System of Record is explicitly revised.</p>",vwExt("CEO Dashboard",VW_OS_LINKS.ceo),pill("wait","cross-system"))}
 ${vwCard("THELMA & specialists","<p>THELMA orchestrates. H.E.N.R.Y. handles architecture/root cause; P.E.R.C.Y. security; V.E.R.I.T.A.S. evidence; The Auditor quality/release; Canon Keeper memory; L.I.L.Y. guidance.</p>",vwGo("THELMA AI","thelma"),pill("done","studio assistant"))}
 ${vwCard("Access model","<p>Owner/editor/contributor/viewer access, approval boundaries, activity records and propose-only automation remain governed by existing studio and CEO-system rules.</p>",vwGo("Settings","settings")+vwGo("Activity log","activity"),pill("done","existing"))}
</div>`;

V.financeops=()=>{const cr=(ST.live&&ST.live.runway&&typeof ST.live.runway.credits==="number")?fmt(ST.live.runway.credits):fmt(BALANCE);return `<div class="vhead"><span class="eyebrow">Business & resource control</span><h1>Finance & Accounting</h1><p>Production-resource visibility lives here; enterprise accounting remains owned by the CEO/CFO finance layer until a certified accounting integration exists.</p></div>
<div class="vw-os-grid">
 ${vwCard("Production resources",`<p><b>${cr}</b> Runway credits shown from ${ST.live&&ST.live.runway&&ST.live.runway.ok?"the latest studio live check":"the recorded studio baseline"}. Provider usage should carry task/project attribution wherever receipts exist.</p>`,vwGo("Credit ledger","ledger")+vwGo("Live connections","setup"),ST.live&&ST.live.runway?vwStatus("runway"):pill("wait","recorded baseline"))}
 ${vwCard("Project cost control","<p>Track render/model use, storage, hosting, licensing, vendors, commercial production budget and cost per asset/minute. Missing accounting feeds must stay visibly missing rather than estimated as fact.</p>",vwGo("Credit ledger","ledger"),pill("wait","partial"))}
 ${vwCard("Enterprise finance","<p>The canonical CFO/Financial Command owns revenue, expense, forecasts, budget ceilings and accounting integrations. VisionWeaver links there instead of duplicating the ledger authority.</p>",vwExt("Open CEO Finance",VW_OS_LINKS.ceo),pill("wait","CEO system"))}
 ${vwCard("Commercial attribution","<p>CMGIO may carry campaign spend, leads, conversions and revenue attribution. Creative output alone does not prove business return.</p>",vwExt("Open CEO Dashboard",VW_OS_LINKS.ceo),pill("idle","cross-system"))}
</div>`};

V.memoryops=()=>`<div class="vhead"><span class="eyebrow">History · canon · data</span><h1>History, Memory & Database</h1><p>Every important change needs a durable footprint: current state in the studio/Supabase, version history in GitHub, operational deployments in Vercel and human-readable decisions in logs.</p></div>
<div class="vw-os-grid">
 ${vwCard("Activity & decision history",`<p><b>${LOG.length}</b> activity entries are currently loaded in this studio. Conversation/log search remains part of THELMA's trace path.</p>`,vwGo("Activity log","activity")+vwGo("Claude uplink","uplink"),pill("done","existing"))}
 ${vwCard("Database",`<p>Studio data inspector and read-only Supabase SELECT console are already present. Current mode: <b>${store.mode==="shared"?"shared studio data":"browser-local fallback"}</b>.</p>`,vwGo("Database","database")+vwExt("Supabase",VW_OS_LINKS.supabase),pill(store.mode==="shared"?"done":"wait",store.mode==="shared"?"shared":"local fallback"))}
 ${vwCard("Canon & provenance","<p>Approved avatar/world/shot versions, source lineage and superseded states should be discoverable without rewriting history. Canon Keeper and Rights/Provenance enforce the evidence boundary.</p>",vwGo("Rights & provenance","rights")+vwGo("Avatar Engineering","avatarops"),pill("wait","mixed runtime"))}
 ${vwCard("Backups & recovery",`<p>Studio backup/restore already exports decisions, settings, cast records, queue, activity and uplink threads. Stored files currently loaded: <b>${FILES.length}</b>.</p>`,`<button type="button" class="btn small" onclick="UI.setTab='data';go('settings')">Open backup & data</button>`,pill("done","existing"))}
</div>`;

function vwConnRow(name,state,detail,action){
  const cls=state==="LIVE"?"done":state==="PROBLEM"?"block":state==="RECORDED"||state==="AVAILABLE"?"wait":"idle";
  return `<tr><td><b>${esc(name)}</b></td><td>${pill(cls,state.toLowerCase())}</td><td class="note">${esc(detail)}</td><td>${action||"—"}</td></tr>`;
}
V.itops=()=>{
  const liveAction=vwGo("Live checks","setup");
  return `<div class="vhead"><span class="eyebrow">Technology & information</span><h1>IT, Security & Connections</h1><p>This is the wiring room. It shows verified runtime checks separately from recorded configuration, available integrations and export-only destinations. Secret values are never displayed.</p></div>
  <section class="panel"><h2>Connection truth</h2><div class="tablewrap"><table><tr><th>Service</th><th>State</th><th>Evidence / boundary</th><th>Open</th></tr>
   ${vwConnRow("Runway",ST.live&&ST.live.runway?(ST.live.runway.ok?"LIVE":"PROBLEM"):"RECORDED",ST.live&&ST.live.runway?"Studio live-check result":"Connector/API route recorded; run a live check before calling it current",liveAction)}
   ${vwConnRow("Supabase",ST.live&&ST.live.supabase?(ST.live.supabase.ok?"LIVE":"PROBLEM"):"RECORDED","Studio database + connector registry; page writes remain permission-controlled",vwGo("Database","database")+vwExt("Supabase",VW_OS_LINKS.supabase))}
   ${vwConnRow("GitHub",ST.live&&ST.live.github?(ST.live.github.ok?"LIVE":"PROBLEM"):"RECORDED","VisionWeaver source and Quality Gate repository",vwExt("Repository",VW_OS_LINKS.github))}
   ${vwConnRow("Vercel","RECORDED","Hosting/deployment system is documented; this board does not fabricate deployment health",SYSTEM&&SYSTEM.links?SYSTEM.links.filter(x=>/vercel/i.test(x[0])).map(x=>vwExt(x[0],x[1])).join(""):"")}
   ${vwConnRow("Claude / Anthropic",CAP.sample?"LIVE":"AVAILABLE",CAP.sample?"Studio THELMA sample capability is available in this runtime":"Anthropic backend route exists in CEO/THELMA; Studio capability not present here",vwGo("THELMA","thelma")+vwExt("Claude",VW_OS_LINKS.claude))}
   ${vwConnRow("OpenAI / ChatGPT","RECORDED","CEO/THELMA backend provider route exists. ChatGPT itself is an interactive handoff, not the same thing as an API call.",vwExt("ChatGPT",VW_OS_LINKS.chatgpt))}
   ${vwConnRow("Gemini","RECORDED","CEO/THELMA provider route exists; current provider documentation requires validation/billing before a green live label.",vwExt("Gemini",VW_OS_LINKS.gemini))}
   ${vwConnRow("YouTube","RECORDED","Authorized through Zapier in the 2026-09-29 wiring record; run current Zapier checks before publishing.",vwGo("Publish","publish"))}
   ${vwConnRow("Instagram for Business","RECORDED","Authorized through Zapier in the 2026-09-29 wiring record; account identity must still be checked.",vwGo("Publish","publish"))}
   ${vwConnRow("TikTok","NOT CONNECTED","Publisher packet/export exists; direct connection was not established in the current wiring record.",vwGo("Publish","publish"))}
   ${vwConnRow("Canva","AVAILABLE","Connector is available in the creative ecosystem but is not yet a certified VisionWeaver runtime connection.",vwGo("Design Studio","design"))}
   ${vwConnRow("CapCut","EXPORT ONLY","VisionWeaver prepares edit steps/assets; no direct certified CapCut integration is claimed.",vwGo("Edit","edit"))}
  </table></div><div class="row" style="margin-top:12px">${vwGo("Run live connection checks","setup")} ${vwExt("CEO Dashboard",VW_OS_LINKS.ceo)}</div></section>
  <div class="vw-os-grid">
   ${vwCard("Secrets & Vault",`<p>Only canonical secret names appear here. Values belong in Supabase Edge Function secrets/Vault or the approved runtime secret store.</p><div class="tablewrap"><table><tr><th>Provider</th><th>Secret name</th><th>Purpose</th></tr>${VW_SECRET_NAMES.map(x=>`<tr><td>${esc(x[0])}</td><td class="mono">${esc(x[1])}</td><td class="note">${esc(x[2])}</td></tr>`).join("")}</table></div>`,vwExt("Supabase secrets",VW_OS_LINKS.supabase),pill("done","values hidden"))}
   ${vwCard("Infrastructure & recovery","<p>Supabase, Vercel, GitHub, edge functions, storage, provider adapters, queue/retry paths, backups, deployment evidence and incident records belong here.</p>",vwGo("Settings","settings")+vwGo("Activity","activity"),pill("wait","mixed evidence"))}
   ${vwCard("ChatGPT handoff","<p>Use a context handoff instead of pretending a live ChatGPT conversation is embedded. Copy the current VisionWeaver context, open ChatGPT, and paste it. API routing remains separate.</p>",`<button type="button" class="btn small" data-vw-copy-context>Copy VisionWeaver context</button>`+vwExt("Open ChatGPT",VW_OS_LINKS.chatgpt),pill("done","honest handoff"))}
   ${vwCard("Architect command","<p>Enterprise command remains in the main CEO Dashboard. VisionWeaver stays the production OS and links upward rather than duplicating executive authority.</p>",vwExt("CEO Dashboard",VW_OS_LINKS.ceo),pill("done","direct link"))}
  </div>`;
};

V.qualityops=()=>`<div class="vhead"><span class="eyebrow">Independent verification</span><h1>Quality, Audit & Governance</h1><p>Production does not grade itself. The Quality Gate, The Auditor, V.E.R.I.T.A.S., Rights/Provenance and release approvals stay independent of generation.</p></div>
<div class="vw-os-grid">
 ${vwCard("GitHub Quality Gate","<p>Repository integrity, JSON, Python/JavaScript syntax, merge markers, selected secret patterns, six world-state regressions and Director Studio build are part of the current gate. A green offline gate is not live-production certification.</p>",vwExt("Quality Gate docs",VW_OS_LINKS.github+"/blob/main/docs/QUALITY_GATE.md"),pill("done","installed"))}
 ${vwCard("Runtime certification gaps","<p>Live avatar save/reload, provider execution, footage continuity, rights approval, deployment, branch-rule enforcement and autonomous publication require their own evidence.</p>",vwGo("Activity log","activity"),pill("wait","open"))}
 ${vwCard("Rights & provenance","<p>Source class, usage rights, commercial permissions, attribution, generated-asset lineage and final delivery evidence must remain attached to the work.</p>",vwGo("Rights & provenance","rights"),pill("done","existing page"))}
 ${vwCard("Audit roles","<p>The Auditor owns quality/release certification; V.E.R.I.T.A.S. owns evidence/truth; P.E.R.C.Y. owns security/permissions; Canon Keeper owns memory integrity.</p>",vwGo("THELMA AI","thelma"),pill("wait","distributed"))}
</div>`;
