// VisionWeaver UI Board Registry — canonical Architect lock 2026-10-07
export type ViewId="V1"|"V2"|"V3";
export interface BoardView{id:ViewId;label:string;role:"primary"|"alternate";settingsSelectable:boolean}
export interface BoardDefinition{page:string;status:"locked"|"approved-no-primary"|"existing";primary?:ViewId;views:BoardView[];notes?:string[]}
const v=(id:ViewId,label:string,primary=false):BoardView=>({id,label,role:primary?"primary":"alternate",settingsSelectable:!primary});
const locked=(page:string,primary:ViewId,labels:[string,string,string],notes:string[]=[]):BoardDefinition=>({page,status:"locked",primary,views:[v("V1",labels[0],primary==="V1"),v("V2",labels[1],primary==="V2"),v("V3",labels[2],primary==="V3")],notes});
export const VISIONWEAVER_UI_BOARDS:BoardDefinition[]=[
 locked("Worlds & Locations","V2",["Cinematic Grid","Interactive Map","World Builder Studio"]),
 locked("Design Studio","V2",["Create Grid","Design Workspace","Catalogue Builder"]),
 locked("Design & Commercial","V1",["Campaign Command Grid","Interactive Commercial Studio","Placement & Performance"]),
 locked("Scene & Production","V1",["Production Workspace","Timeline & Continuity","Scene Operations"],["V2 may open contextually for timeline, stitching, sound-layer, continuity, long-form assembly and version/take work."]),
 locked("Post Production","V1",["Edit & Finish Desk","Color, Audio & VFX","AI Finishing & Delivery"]),
 locked("Distribution & Growth","V2",["Distribution Overview","Content Pipeline","Analytics & Growth"],["V2 supersedes the earlier V1 selection."]),
 locked("Quality & Audit","V1",["Quality Command Center","Evidence & Verification","Release Gate & Audit Trail"]),
 locked("Finance & Accounting","V1",["Financial Command Center","Project Budget & Cost Control","Accounting & Revenue Operations"]),
 locked("IT & Security","V2",["IT & Security Command","Infrastructure & Connections","Security, Reliability & Incidents"]),
 locked("Resources","V2",["Resource Library","Advanced Search & Filter","Collections & Collaboration"]),
 locked("Assets & Knowledge","V2",["Assets Overview","Advanced Search & Filter","Collections & Knowledge"]),
 locked("Reports & Insights","V2",["Executive Reporting","Interactive Intelligence","Insight Explorer"]),
 locked("Programs & Projects","V2",["Portfolio Command","Program & Project Workspace","Timeline & Dependencies"]),
 locked("Strategic Planner","V1",["Strategic Command Center","Scenario & Roadmap Studio","Goals, Risks & Outcomes"]),
 locked("Initiatives","V2",["Initiative Overview","Initiative Pipeline","Impact & Dependencies"]),
 locked("AI Co-Pilot","V2",["AI Command Center","Agent Workflow","Specialist Marketplace"]),
 locked("CMI","V1",["Creative & Market Intelligence","Signals & Trends","Opportunity Intelligence"]),
 locked("Directors Guild","V2",["Guild Overview","Review & Decision Queue","Department Workrooms"]),
 locked("Teams & C-Suite","V1",["Organization Command","Authority & Handoff Map","Workforce & Agent Capacity"]),
 locked("Settings","V2",["Quick Settings","Visual & System Control","Advanced Administration"]),
 locked("Vision Builder","V1",["Creative Command Canvas","Blueprint & Dependencies","Concept-to-Production Map"]),
 {page:"Avatar Engineering",status:"approved-no-primary",views:[v("V1","Approved Option 1"),v("V2","Approved Option 2"),v("V3","Approved Option 3")],notes:["Three approved versions retained; no primary invented without an explicit Architect selection."]},
 {page:"Book Creation",status:"existing",views:[]},
 {page:"VisionWeaver Home",status:"existing",views:[]}
];
export const NEXT_UI_REVIEW_PAGE=null;
export const UI_REVIEW_STATUS="NAVIGATION BUILDOUT COMPLETE" as const;
export const GLOBAL_UI_LOCKS={persistentSidebar:true,sidebarCollapseControl:true,topCommandBar:["Search","Create","Notifications"],topProfileAllowed:false,accountPlacement:"sidebar-above-THELMA",notebookThemeAllowed:false,settings:{visualViews:true,colorSchemes:true},prohibitedGenerationToolsForThisReview:["Canva"]} as const;
