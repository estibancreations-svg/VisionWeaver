/* VisionWeaver UI completion layer — Architect lock 2026-10-07
   Adds remaining navigation buildouts plus Settings > Visual Views.
   View changes affect presentation only; authority/workflow gates are unchanged.
*/
const VW_BOARDS={
 worldops:{title:"Worlds & Locations",primary:"V2",views:{V1:"Cinematic Grid",V2:"Interactive Map",V3:"World Builder Studio"}},
 design:{title:"Design Studio",primary:"V2",views:{V1:"Create Grid",V2:"Design Workspace",V3:"Catalogue Builder"}},
 designops:{title:"Design & Commercial",primary:"V1",views:{V1:"Campaign Command Grid",V2:"Interactive Commercial Studio",V3:"Placement & Performance"}},
 sceneproduction:{title:"Scene & Production",primary:"V1",views:{V1:"Production Workspace",V2:"Timeline & Continuity",V3:"Scene Operations"}},
 postproduction:{title:"Post Production",primary:"V1",views:{V1:"Edit & Finish Desk",V2:"Color, Audio & VFX",V3:"AI Finishing & Delivery"}},
 distribution:{title:"Distribution & Growth",primary:"V2",views:{V1:"Distribution Overview",V2:"Content Pipeline",V3:"Analytics & Growth"}},
 qualityops:{title:"Quality & Audit",primary:"V1",views:{V1:"Quality Command Center",V2:"Evidence & Verification",V3:"Release Gate & Audit Trail"}},
 financeops:{title:"Finance & Accounting",primary:"V1",views:{V1:"Financial Command Center",V2:"Project Budget & Cost Control",V3:"Accounting & Revenue Operations"}},
 itops:{title:"IT & Security",primary:"V2",views:{V1:"IT & Security Command",V2:"Infrastructure & Connections",V3:"Security, Reliability & Incidents"}},
 resources:{title:"Resources",primary:"V2",views:{V1:"Resource Library",V2:"Advanced Search & Filter",V3:"Collections & Collaboration"}},
 assets:{title:"Assets & Knowledge",primary:"V2",views:{V1:"Assets Overview",V2:"Advanced Search & Filter",V3:"Collections & Knowledge"}},
 reports:{title:"Reports & Insights",primary:"V2",views:{V1:"Executive Reporting",V2:"Interactive Intelligence",V3:"Insight Explorer"}},
 portfolio:{title:"Programs & Projects",primary:"V2",views:{V1:"Portfolio Command",V2:"Program & Project Workspace",V3:"Timeline & Dependencies"}},
 strategy:{title:"Strategic Planner",primary:"V1",views:{V1:"Strategic Command Center",V2:"Scenario & Roadmap Studio",V3:"Goals, Risks & Outcomes"}},
 initiatives:{title:"Initiatives",primary:"V2",views:{V1:"Initiative Overview",V2:"Initiative Pipeline",V3:"Impact & Dependencies"}},
 copilot:{title:"AI Co-Pilot",primary:"V2",views:{V1:"AI Command Center",V2:"Agent Workflow",V3:"Specialist Marketplace"}},
 cmi:{title:"CMI",primary:"V1",views:{V1:"Creative & Market Intelligence",V2:"Signals & Trends",V3:"Opportunity Intelligence"}},
 guild:{title:"Directors Guild",primary:"V2",views:{V1:"Guild Overview",V2:"Review & Decision Queue",V3:"Department Workrooms"}},
 teamsops:{title:"Teams & C-Suite",primary:"V1",views:{V1:"Organization Command",V2:"Authority & Handoff Map",V3:"Workforce & Agent Capacity"}},
 settings:{title:"Settings",primary:"V2",views:{V1:"Quick Settings",V2:"Visual & System Control",V3:"Advanced Administration"}},
 visionbuilder:{title:"Vision Builder",primary:"V1",views:{V1:"Creative Command Canvas",V2:"Blueprint & Dependencies",V3:"Concept-to-Production Map"}}
};
const VW_VIEW_KEY="vw-ui-board-views-v2";
const VW_PREFS=(()=>{try{return JSON.parse(localStorage.getItem(VW_VIEW_KEY)||"{}")||{}}catch(e){return {}}})();
const vwView=k=>VW_PREFS[k]||VW_BOARDS[k].primary;
function vwSetView(k,v){if(!VW_BOARDS[k]||!VW_BOARDS[k].views[v])return;VW_PREFS[k]=v;try{localStorage.setItem(VW_VIEW_KEY,JSON.stringify(VW_PREFS))}catch(e){};toast(VW_BOARDS[k].title+": "+v+" selected");render()}
function vwSwitch(k){const d=VW_BOARDS[k],cur=vwView(k);return '<div class="vw-view-switch"><span>Page view</span>'+Object.entries(d.views).map(([v,l])=>'<button type="button" data-vw-key="'+k+'" data-vw-view="'+v+'" aria-pressed="'+(cur===v)+'"><b>'+v+'</b><small>'+esc(l)+'</small></button>').join("")+'</div>'}
const vwMetric=(a,b,c="")=>'<div class="vw-metric"><span>'+esc(a)+'</span><b>'+esc(b)+'</b><small>'+esc(c)+'</small></div>';
const vwCards=a=>'<div class="vw-mini-cards">'+a.map(x=>'<article><span>'+esc(x[2]||"WORK")+'</span><b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small></article>').join("")+'</div>';
const vwPanel=(t,b,w=false)=>'<section class="panel vw-build-panel'+(w?" wide":"")+'"><h2>'+esc(t)+'</h2>'+b+'</section>';
const vwGrid=a=>'<div class="vw-build-grid">'+a.join("")+'</div>';
const vwBars=a=>'<div class="vw-bars">'+a.map(x=>'<div><span>'+esc(x[0])+'</span><i><b style="width:'+x[2]+'%"></b></i><strong>'+esc(x[1])+'</strong></div>').join("")+'</div>';
const vwTime=a=>'<div class="vw-timeline">'+a.map(x=>'<div><span>'+esc(x[0])+'</span><i><b style="left:'+x[2]+'%;width:'+x[1]+'%"></b></i></div>').join("")+'</div>';
function vwHead(k,kicker,desc){const d=VW_BOARDS[k];return '<div class="vhead vw-build-head"><span class="eyebrow">'+esc(kicker)+'</span><h1>'+esc(d.title)+'</h1><p>'+esc(desc)+'</p>'+vwSwitch(k)+'</div>'}
function vwGeneric(k,content){return vwHead(k,content.kicker,content.desc)+content.views[vwView(k)]()}

V.reports=()=>vwGeneric("reports",{kicker:"Intelligence · evidence · reporting",desc:"One reporting layer across production, quality, finance, infrastructure and growth without inventing data.",views:{
 V1:()=>vwGrid([vwPanel("Executive report",'<div class="vw-metrics">'+vwMetric("Production","Record-backed","project scoped")+vwMetric("Quality","Gate-bound","exact version")+vwMetric("Finance","Verified only","no fabricated totals")+vwMetric("Growth","CMGIO","channel aware")+"</div>",true),vwPanel("Scheduled reports",vwCards([["Production status","Operational brief","DAILY"],["Quality & release","Evidence package","RELEASE"],["Finance & usage","Budget and providers","WEEKLY"]]))]),
 V2:()=>vwGrid([vwPanel("Interactive intelligence",vwBars([["Production readiness","record-backed",78],["Evidence completeness","gate-bound",66],["Rights readiness","project scoped",84],["Distribution verification","connection scoped",58]]),true),vwPanel("Cross-system filters",vwCards([["Project / Program","Scope metrics to owned work","FILTER"],["Date / Version","Approved vs superseded state","FILTER"],["Source truth","Live · Recorded · Pending verification","TRUTH"]])),vwPanel("Insight feed",vwCards([["Variance detected","Budget/schedule drift becomes an exception","ALERT"],["Continuity change","State change links to affected scenes","TRACE"],["Release blocker","Missing evidence stops certification","GATE"]]))]),
 V3:()=>vwGrid([vwPanel("Insight explorer",vwCards([["Why is release blocked?","Trace failing gates and missing evidence","QUESTION"],["What changed?","Compare decisions, versions and deployments","QUESTION"],["Where are costs rising?","Provider/project attribution only","QUESTION"]]),true)])
}});
V.portfolio=()=>vwGeneric("portfolio",{kicker:"Portfolio · programs · delivery",desc:"Programs and projects with ownership, stage, dependencies, evidence and next decision.",views:{
 V1:()=>vwGrid([vwPanel("Portfolio command",vwCards([["Crossroads of Identity","Book 1 / Episode 1 production","ACTIVE"],["Children's Series","Development and production system","PROGRAM"],["True Stories","Story/environment development","ACTIVE"],["Commercial Station","Commercial creative pipeline","SYSTEM"]]),true)]),
 V2:()=>vwGrid([vwPanel("Program & project workspace",vwCards([["Bullpen","Ideas and uncommitted work","STAGE"],["Staging","Ready for owned execution","STAGE"],["Active","Evidence-backed work in motion","STAGE"],["Graveyard","Stopped/superseded with reason","STAGE"]]),true),vwPanel("Ownership & gates",vwCards([["Owner","Accountable for next decision","OWNER"],["Dependencies","Upstream locks and external requirements","LINK"],["Acceptance","Exact evidence required to call done","GATE"]]))]),
 V3:()=>vwGrid([vwPanel("Timeline & dependencies",vwTime([["Crossroads",44,4],["Children's Series",52,20],["True Stories",30,10],["Commercial Station",64,5]]),true)])
}});
V.strategy=()=>vwGeneric("strategy",{kicker:"Strategy · scenarios · outcomes",desc:"The Architect's direction translated into outcomes, sequencing, constraints and measurable gates.",views:{
 V1:()=>vwGrid([vwPanel("Strategic command",'<div class="vw-metrics">'+vwMetric("North star","Autonomous creative OS")+vwMetric("Priority","Production reliability")+vwMetric("Constraint","Truthful integrations")+vwMetric("Gate","Architect approval")+"</div>",true),vwPanel("Strategic pillars",vwCards([["Create","Avatar → World → Story → Production","PILLAR"],["Govern","Evidence → Rights → Quality → Security","PILLAR"],["Grow","Distribution → CMGIO → Revenue intelligence","PILLAR"]]))]),
 V2:()=>vwGrid([vwPanel("Scenario & roadmap studio",vwTime([["MVP reliability",28,0],["Memory + agents",34,18],["Autonomous production",42,38],["Enterprise scale",30,70]]),true)]),
 V3:()=>vwGrid([vwPanel("Goals, risks & outcomes",vwCards([["Goal","Long-form believable production","OUTCOME"],["Risk","Provider limits / continuity drift","RISK"],["Control","State locks + evidence + fallback routing","CONTROL"],["Measure","Finished minutes, acceptance, cost, reuse","METRIC"]]),true)])
}});
V.initiatives=()=>vwGeneric("initiatives",{kicker:"Initiatives · ownership · outcomes",desc:"Move strategic work from idea to owned execution without losing dependencies, evidence or authority.",views:{
 V1:()=>vwGrid([vwPanel("Initiative overview",vwCards([["Avatar State","Stable reusable characters","FOUNDATION"],["World State","Persistent environments and causality","FOUNDATION"],["Long-form stitching","Clip continuation and transitions","PRODUCTION"],["Quality Gate","Evidence-bound release certification","GOVERNANCE"]]),true)]),
 V2:()=>vwGrid([vwPanel("Initiative pipeline",vwTime([["Intake",14,0],["Assign",16,14],["Execute",34,30],["Verify",20,64],["Finalize",16,84]]),true),vwPanel("Next decisions",vwCards([["Scope","What exact outcome changes?","INTAKE"],["Owner","Who approves and executes?","ASSIGN"],["Evidence","What proves completion?","VERIFY"]]))]),
 V3:()=>vwGrid([vwPanel("Impact & dependencies",vwBars([["VisionWeaver","high",90],["CEO Dashboard","medium",58],["THELMA","high",82],["CMGIO","medium",55]]),true)])
}});
V.copilot=()=>vwGeneric("copilot",{kicker:"AI orchestration · specialist agents",desc:"Delegate work while preserving authority, evidence, cost and safety boundaries.",views:{
 V1:()=>vwGrid([vwPanel("AI command center",'<div class="vw-metrics">'+vwMetric("Orchestrator","THELMA")+vwMetric("Specialists","7","role-bound")+vwMetric("Approval","Architect","where gated")+vwMetric("Memory","Evidence-linked")+"</div>",true)]),
 V2:()=>vwGrid([vwPanel("Agent workflow",vwCards([["THELMA","Orchestrate and route","ORCHESTRATOR"],["H.E.N.R.Y.","Architecture / root cause","SPECIALIST"],["P.E.R.C.Y.","Security review","SPECIALIST"],["V.E.R.I.T.A.S.","Evidence verification","SPECIALIST"],["The Auditor","Quality and release","SPECIALIST"],["Canon Keeper","Canon and continuity","SPECIALIST"]]),true),vwPanel("Handoff",vwTime([["Understand",18,0],["Route",16,18],["Execute",30,34],["Verify",20,64],["Return",16,84]]))]),
 V3:()=>vwGrid([vwPanel("Specialist marketplace",vwCards([["L.I.L.Y.","Training / explanation","GUIDE"],["H.E.N.R.Y.","Root cause","ARCH"],["P.E.R.C.Y.","Security","SEC"],["V.E.R.I.T.A.S.","Evidence","EVIDENCE"],["The Auditor","Quality","QC"],["Canon Keeper","Memory","CANON"]]),true)])
}});
V.cmi=()=>vwGeneric("cmi",{kicker:"CMI · research · market signals",desc:"Convert external signals into evidence-backed creative and business opportunities.",views:{
 V1:()=>vwGrid([vwPanel("Creative & market intelligence",'<div class="vw-metrics">'+vwMetric("Signals","Research feeds","source-linked")+vwMetric("Trends","Creative + audience","ranked")+vwMetric("Opportunities","Project-fit","scored")+vwMetric("Risks","Rights + saturation","flagged")+"</div>",true),vwPanel("Signal board",vwCards([["Creative formats","Changes in media creation","SIGNAL"],["Audience behavior","What people respond to and reuse","SIGNAL"],["Platform shifts","Distribution and monetization changes","SIGNAL"]]))]),
 V2:()=>vwGrid([vwPanel("Signals & trends",vwBars([["AI media creation","rising",84],["Short-to-long repurposing","rising",72],["Interactive story worlds","watch",63],["Synthetic sameness","risk",78]]),true)]),
 V3:()=>vwGrid([vwPanel("Opportunity intelligence",vwCards([["Catalog licensing","Reusable avatars/worlds/assets","OPPORTUNITY"],["Commercial templates","Verticalized creative systems","OPPORTUNITY"],["Education IP","Repeatable production + distribution","OPPORTUNITY"]]),true)])
}});
V.visionbuilder=()=>vwGeneric("visionbuilder",{kicker:"Vision Builder · concept to execution",desc:"Shape an idea into a production-ready blueprint with locks, dependencies and acceptance criteria.",views:{
 V1:()=>vwGrid([vwPanel("Creative command canvas",vwCards([["Intent","What are we creating and why?","START"],["Audience","Who should feel or do what?","LOCK"],["World","Where and when does it exist?","LOCK"],["Avatars","Who carries the story?","LOCK"],["Production","How is it made?","PLAN"],["Outcome","What counts as finished?","GATE"]]),true)]),
 V2:()=>vwGrid([vwPanel("Blueprint & dependencies",vwCards([["Avatar State","Identity / voice / wardrobe / state","UPSTREAM"],["World State","Place / physics / ambience / time","UPSTREAM"],["Story","Canon / beats / scene intent","CORE"],["Production","Shots / sound / edit / providers","EXECUTE"]]),true)]),
 V3:()=>vwGrid([vwPanel("Concept-to-production map",vwTime([["Concept",14,0],["Research",14,14],["Design",18,28],["Production",28,46],["QC",14,74],["Distribution",12,88]]),true)])
}});

const VW_GUILD_ORIGINAL=V.guild,VW_TEAMS_ORIGINAL=V.teamsops;
V.guild=()=>vwHead("guild","Directors Guild · review authority","Presentation may change; approval authority never does.")+(vwView("guild")==="V2"?VW_GUILD_ORIGINAL():vwGrid([vwPanel(vwView("guild")==="V1"?"Guild overview":"Department workrooms",vwCards([["Design","Visual systems and locks","DEPT"],["Motion","Animation and renders","DEPT"],["Sound","Voice, ambience, SFX, music","DEPT"],["Edit","Assembly and finishing","DEPT"],["Marketing","Distribution assets","DEPT"],["Automation","System and agent work","DEPT"]]),true)]));
V.teamsops=()=>vwHead("teamsops","Teams · C-Suite · agents","Human ownership, executive authority, specialist agents and handoff boundaries.")+(vwView("teamsops")==="V1"?VW_TEAMS_ORIGINAL():vwGrid([vwPanel(vwView("teamsops")==="V2"?"Authority & handoff map":"Workforce & agent capacity",vwCards([["Architect / CEO","Final enterprise authority","HUMAN"],["C-Suite","Domain ownership and escalation","EXEC"],["Directors Guild","Production review","TEAM"],["THELMA","Operations orchestration","AI"],["Specialists","Role-bound analysis","AI"]]),true)]));

if(typeof SET_TABS!=="undefined"&&!SET_TABS.some(x=>x[0]==="views"))SET_TABS.splice(1,0,["views","Visual views"]);
if(typeof SETV!=="undefined")SETV.views=()=>'<section class="panel"><h2>Visual views <span class="sub">locked defaults + approved choices</span></h2><p class="note">Changing a view changes presentation only. It does not change data, authority or workflow gates.</p><div class="vw-settings-views">'+Object.entries(VW_BOARDS).map(([k,d])=>'<article><div><b>'+esc(d.title)+'</b><small>Default '+d.primary+' · '+esc(d.views[d.primary])+'</small></div><div class="seg">'+Object.entries(d.views).map(([v,l])=>'<button type="button" data-vw-key="'+k+'" data-vw-view="'+v+'" aria-pressed="'+(vwView(k)===v)+'">'+v+'<span>'+esc(l)+'</span></button>').join("")+'</div></article>').join("")+'</div></section>';

function vwNav(section,item,before){const s=NAV.find(x=>x[0]===section);if(!s||s[1].some(x=>x[0]===item[0]))return;const i=before?s[1].findIndex(x=>x[0]===before):-1;i>=0?s[1].splice(i,0,item):s[1].push(item)}
vwNav("Home",["visionbuilder","Vision Builder","VB"],"overview");
vwNav("Home",["strategy","Strategic Planner","SP"],"overview");
vwNav("Home",["initiatives","Initiatives","IN"],"overview");
vwNav("Home",["portfolio","Programs & Projects","PP"],"overview");
vwNav("Intelligence",["copilot","AI Co-Pilot","AI"],"thelma");
vwNav("Intelligence",["cmi","CMI","CM"],"thelma");
vwNav("Intelligence",["reports","Reports & Insights","RI"]);

Object.assign(GUIDE,{
 visionbuilder:["Turn an idea into a production-ready blueprint.","Lock intent, audience, world and avatar dependencies."],
 strategy:["Translate direction into outcomes, sequencing and constraints.","Review the current priority and its acceptance measure."],
 initiatives:["Move strategic work from intake through verification.","Open the initiative with the next unresolved gate."],
 portfolio:["See programs/projects with owners and dependencies.","Open the active project with the next unresolved decision."],
 copilot:["Route work through THELMA and role-bound specialists.","Use the specialist that owns the problem, then verify."],
 cmi:["Turn external signals into evidence-backed opportunities.","Review the strongest source-linked signal."],
 reports:["Report across systems without inventing data.","Choose scope and trace the insight to evidence."]
});
document.addEventListener("click",e=>{const b=e.target&&e.target.closest?e.target.closest("[data-vw-key]"):null;if(b)vwSetView(b.dataset.vwKey,b.dataset.vwView)});
