/* ================= RECORDS (VisionWeaver repo, updated 2026-09-27; live checks 2026-09-29) ================= */
const BALANCE = 36738;
const PARTS = [
  {n:1,name:"The Text",shots:12,extra:"+ S05b",lock:"2026-09-25",light:"LK-ATL-AM",where:"Atlanta glass conference room, Tue Jan 17 2023, 10:00–11:15 AM",log:"He was in the middle of closing a deal when he found out the man who took him in at fifteen was gone. Nobody in the room noticed. Except the water."},
  {n:2,name:"The Performance",shots:14,extra:"+ S03b, memorial S13a–d",lock:"2026-09-25",light:"LK-ATL-AM · LK-YBOR-AM",where:"Conference room → elevator lobby → corridor; Tampa memorial cross-cut",log:"Marcus closes the deal with a perfect smile while grieving inside. A desk radio names Dr. King's first boycott night, Tampa lights a lantern for Elijah, and the smile drops only when the partner's door clicks shut."},
  {n:3,name:"The Bathroom",shots:28,extra:"+ S03a",lock:"2026-09-24",light:"LK-ATL-DAY · LK-2006-PM",where:"Executive bathroom; fall 2006 flashback in the Ybor City safe house",log:"Alone in the executive bathroom, the mask cracks. A memory of fall 2006: fifteen-year-old Marcus at the foot of Elijah's front walk in Ybor City, and the door that opened without a knock."},
  {n:4,name:"The Box",shots:20,extra:"",lock:"2026-09-25",light:"LK-ATL-NIGHT",where:"Marcus's condo, Tue Jan 17 2023, ~10:00–10:30 PM",log:"Home alone that night, twenty-three floors up, he opens the shoebox he has hidden for years, holds the carved figure Elijah gave him, ignores his mother's call, and burns the eggs."},
  {n:5,name:"The Porch",shots:14,extra:"",lock:"2026-09-24",light:"LK-2022-AM · LK-ATL-NIGHT",where:"Ybor porch, late March 2022, 9:30–10:00 AM → Atlanta kitchen at night",log:"A spring 2022 porch visit after Florida's bill passes: Elijah tells him courtrooms aren't enough. Back in the Atlanta kitchen at night, Marcus stands alone with what Elijah left him."}
];
const STAGES = ["Source","Locks","Pictures","Motion","Sound","Edit","Deliver","Publish"];
const BOOKS = [
 ["Convergence","https://drive.google.com/drive/folders/1gXoJmtwT6Qjb-Br4yiLDDgQ2kfiKe95o","In production · Episode 1"],
 ["Foundations","https://drive.google.com/drive/folders/1C8xy5yI_ngPmraDO26VGF10X5Z3lodME","Manuscript"],
 ["Revelations","https://drive.google.com/drive/folders/15U8ty_ZBfmiNmjGy4UvA3IoAI2d67Z1k","Manuscript"],
 ["Expansion","https://drive.google.com/drive/folders/1waasjHSYqsdhYM7swWkaaQs_c-FvhZ8p","Manuscript"],
 ["Legacy","https://drive.google.com/drive/folders/17UKUaCd27cMvV0T_JZRcPHvMtOqa4Psl","Manuscript"],
 ["Transformation","https://drive.google.com/drive/folders/1_9EhLBRHYFS-DwixViCCr9x5y0KiocXr","Recovery · not canon yet"],
 ["Evolution","https://drive.google.com/drive/folders/19gXx3WV8NYVDN0JOR2GQ1Hh-BdMwL3Dh","Manuscript"]
];
const FACES = [
 ["FL-MR32","Marcus Reynolds, 32","351c75c8-b576-485b-adcb-8c9b3cb21736","Locked. Board dropped off Runway's recent list; PART 2 used the approved S07 close-up f8762583… as the face reference.","wait"],
 ["FL-MR31","Marcus, 31 (porch 2022)","—","Locked in the PART 5 sheet","done"],
 ["FL-MR15","Marcus, 15 (2006 flashback)","—","Locked in the PART 3 sheet","done"],
 ["FL-MR10","Marcus, 10 (photo only)","—","New in PART 4; board not made yet","idle"],
 ["FL-JK","Jayden King","702a017c-087d-421d-96bf-d983a1bd4782","Approved. Bomber shown with no logo","done"],
 ["FL-JM","Jayden's manager","7d7fd9ee-2818-416f-a7fb-6976b9ffc73b","Approved","done"],
 ["FL-AL","Mr. Alvarez","6453033b-b665-4d6c-9472-82d73d9a529c","Approved","done"],
 ["FL-SP","Senior partner","280493a2-581d-4ea9-98ba-79ac95929d73","Approved","done"],
 ["FL-EJ77","Elijah Johnson, 77","02ba912e-2a28-4cd1-b470-f91213b44b61","Approved","done"],
 ["FL-EJ61","Elijah Johnson, 61","bfa76923-88c0-46e7-b049-da3a60602b6d","Approved","done"],
 ["FL-DW","Desiree Washington (360 v2)","3fd60372-1669-4395-b68c-b6249cae6825","Built from Sire's portrait","done"]
];
const PLATES = [
 ["Conference room, late morning","a60f82fb-c704-490e-9d14-bb2d95f69bed","P1, P2"],
 ["Elevator lobby and corridor","e7723b67-8821-445d-91fb-c7f915a08af6","P2"],
 ["Marcus's office","0166e281…","P3"],["Executive bathroom","aa5d7dae…","P3"],
 ["Safe house exterior (set house)","2aa055ef-f86c-4aa3-9fd3-c759d86e8956","P3, memorial"],
 ["Front yard, late afternoon","bc5ee687…","P3"],["Entrance hall, PM relight","de0ea4fa…","P3"],["Landing window","65584fba…","P3"],["Upstairs hall","d795f796…","P3"],["Third-floor room","66cbab09…","P3"],
 ["Condo living room, night","0af9b95d…","P4"],["Condo bedroom, night","0c1c4085…","P4"],["Condo kitchen, night","8735e56d…","P4, P5"],
 ["Heritage Pages parlor","893f4a11-d335-4eaa-91a1-e5638462b312","Memorial"],
 ["Porch (set house)","c58d9eab…","P5"],["Front yard, mid-morning","bc58559c…","P5"]
];
const PROPS = [["CITYGRAIN magazine","47ccde9b…","P4 S03"],["Father-son photograph","10523301…","P4 S08"],["Carved figure","6345f830…","P4 S10"]];
const LIGHTS = [
 ["LK-ATL-AM","P1–P2","Clear deep-blue sky, soft cool daylight 5600–6000K, no direct sun inside. Sun 138°/22° at 10:00 → 159°/32° at 11:30 (NOAA, Midtown Atlanta). Brass practicals low at 3000K."],
 ["LK-YBOR-AM","P2 memorial","Ybor City 11:10 AM, Jan 17 2023. Sun ~154° azimuth, ~37° high, straight through south windows. The lantern flame is the only warm point light."],
 ["LK-ATL-DAY","P3","Executive floor daylight, same morning; cool, soft; skyline glass behind."],
 ["LK-2006-PM","P3 flashback","Fall 2006 late afternoon. East front in shade, south porch and spire gold; landing window glows green and amber."],
 ["LK-ATL-NIGHT","P4, P5 kitchen","City glow, one warm practical. In P4 the only warm light is inside the closet with the box."],
 ["LK-2022-AM","P5 porch","Late March 2022, 9:30–10:00 AM. Sun 27° high at 9:30, 33° at 10:00 (NOAA, Ybor City). Backlit Marcus, frontal key on Elijah."]
];
const P1FRAMES = [
 ["S01","Wide: Marcus fixes his tie","f18bc87e-78c7-40f0-929d-ab5f8a4e8c8d","3cc26174-21d6-439e-8537-51f4b459ff29"],
 ["S02","Marcus line 1, skyline behind","74ba78b4-dbe7-4d80-9907-e5393696d6d8","cb156b76-39e1-48dc-82e0-6047e942a123"],
 ["S03","Contract slides (overhead)","3e665b6b-b7a3-4a3d-af2a-29070e81fdac","a1d5b30c-6d24-4a06-bc75-e42ceca78263"],
 ["S04","Skeptical Jayden","497b8ee1-e3ff-4ef6-82e0-ef53d3574e75","67f72c19-699c-420c-b873-2e1fc102900c"],
 ["S05","Jayden and manager trade a look","f75aa562-4337-4283-8a28-e0bbf6d7ce06","120adfd0-d6f8-4f92-81f1-e69632946955"],
 ["S05b","Jayden reads, manager leans in (full episode, 10 s)","f75aa562-4337-4283-8a28-e0bbf6d7ce06","b7e7dada-c342-482e-9899-c2dc6f0220b4"],
 ["S06","Phone buzzes in pocket","f5535e3e-5212-4790-81fa-6b4ad0cdf0ed","330e1590-697d-49b6-bd92-32192ea07bb4"],
 ["S07","Close-up: the flicker","f8762583-70a2-48dc-81b5-b159eee39ea4","2c31b066-4be0-4eb9-8c9b-4f1d9652b10b"],
 ["S08","Profile (v2, generic Atlanta skyline)","cbc94a0a-12c9-4884-8710-6ffd18a929be","55af0e03-520d-4e59-947b-d91b49fca708"],
 ["S09","Glass above, phone below","fd98aaf2-4bac-49bb-adbf-d4576fc0e0d1","6320825a-165a-4915-b79f-18937958a194"],
 ["S10","Phone screen, blank bubbles","308ad577-4214-4d20-b190-86484f20a198","aeccedd2-7dca-468c-b230-091c6b1edd35"],
 ["S11","His eyes","9e83a25c-880a-4ac4-a354-d9cf6e39b126","12db986b-55c6-43b1-9d8b-a30babb4f463"],
 ["S12","The trembling water","26cc9797-5118-4ac9-b6f4-3ab1403d755f","aa7ea013-1394-4287-b8b9-29cd60ad0b8e"]
];
const P2FRAMES = [
 ["S01","Jayden points at the contract","57213c9d-b7eb-428d-aeb9-eeefa4f5e69e","approved",10],
 ["S02","CU Marcus on autopilot","a54b6ec4-3195-475f-bc52-d4ec7bf45657","pending",5],
 ["S03","ECU eyes, grief held (N03)","6f49c3ab-b57f-4052-962d-590614af9d3f","pending",10],
 ["S03b","Phone face-down on his thigh (N03)","55e1e099-2053-41d4-8f3c-e522df3ce4ef","pending",10],
 ["S04","Manager: \"Mr. Reynolds?\"","ecfa8876-094e-4fa0-a653-57298b32316d","approved",5],
 ["S05","MCU Marcus: three-phase rollout","1968a2bc-602b-4cc3-885b-ebb398487f34","pending",5],
 ["S06","Wide down the table, all four (N04)","b5594b9f-e661-47f8-9078-6f732cbfbf66","pending",10],
 ["S07","Signatures, then the handshake","557e61f3-83aa-4c35-aa84-87aaa5b0e7ef","approved",10],
 ["S08","Partner's silhouette behind frosted glass","6cd3304b-b5a6-437e-b3ef-a607a74d1778","approved",5],
 ["S09","CU Marcus: the nod through the glass","a33ac338-0921-4fcf-a05d-a614c4c51fff","pending",5],
 ["S10","Lobby wide: walk to the elevators","f6cc109c-30da-4880-aad2-90acbb475a6d","pending",5],
 ["S11","Elevator doors close on his smile","bf070482-92f1-49e6-9dec-44150ac59bba","pending",5],
 ["S12","Corridor: partner claps his shoulder","553e59cf-4066-4c20-8475-f37a50990c83","pending",5],
 ["S13","OTS partner at his door, radio office behind","a27d9356-f413-4594-b3be-e21413489d81","pending",5],
 ["S14","CU Marcus: the smile drops","fb5032b3-f98b-42e1-982b-250b046f5e0d","pending",5]
];
const STILLS = [
 ["M01","1972","The Key","2e78d5d7-2457-4f28-a158-6c3d2abd4e16","approved",false],
 ["M02","c. 1977","After Hours at Heritage Pages","4c74bd71-6137-4160-a413-377f5c214b3a","approved",false],
 ["M03","1982","The First Picnic","21ee3141-3e63-458a-925b-9c5e6a0afd74","approved",true],
 ["M04 v2","c. 1987","The Care Room","1b0c9b6d-1747-413e-bf85-07d996c59b92","approved",true],
 ["M05","1988","Opening Day","b04492d0-240b-4d33-b561-dd5ee6936029","approved",false],
 ["M06","1998","Not for Sale","2d9b819d-7b0e-4822-9eba-8c8186558e5f","approved",false],
 ["M07","2015","Pride Comes Back","4b7629dd-70f1-437e-b629-d368078ecf0a","approved",true],
 ["M08","2020","The Scanning Summer","fc229cfe-57f0-4238-9251-cbeeaa6ac355","approved",true],
 ["M09","2006 page","The Porch Light Book","dde9e90f-4172-4191-a92d-c52d518e2f62","kept",false],
 ["M10","2023","The Bulb Jar","3b992b1f-b8e6-4ac6-bf04-0bde095f745f","kept",false],
 ["M11","2023","The Carvings","b5903bcd-99f9-4a90-9271-d8fe418b92a9","approved",true],
 ["M12","2023","The Pay-It-Forward Wall","13975eca-8777-460a-923f-816454dd9956","approved",true],
 ["M13","Jan 17 2023","Home Is Where You Make It","2a3bf94c-704a-40e9-9941-c53e0ffc3be1","approved",true]
];
const AUDIO = [
 ["Marcus line 1","Dialogue","10.72 s","cdb03009-33e8-4bad-ac22-a35246855ed6","VL-MR \"Frank\""],
 ["Marcus line 2","Dialogue","8.88 s","f3b6646e-3a84-4ddb-8a21-731b3e3b849e","VL-MR \"Frank\""],
 ["Marcus line 3","Dialogue","4.56 s","9844f162-5e92-4061-b841-b6587a996c96","VL-MR \"Frank\""],
 ["Room tone","Ambience","20 s loop","56bbfb7b-b122-46d5-a00a-89da063b5bc2","Loop 3×"],
 ["Music bed","Score","23.7 s","048ca860-51e7-488b-b9ae-e70dffd1f7e7","Low strings, heartbeat pulse, single piano note"],
 ["Buzz 1","Effect","1.5 s","9c47fa13-7c8b-4253-9712-0049ee30244a","S06"],
 ["Buzz 2 and 3","Effect","3 s","a7d63382-38f6-430c-858b-c0da60cf60c3","S07"],
 ["Three text chimes","Effect","3 s","cfdd2620-c613-4691-af3a-c4376288611b","S10"],
 ["Contract slide","Effect","2 s","8c26d89c-a4ac-4435-aba7-6396de535447","S03, S05"],
 ["Chair slide","Effect","1.5 s","e22d538e-6237-4fac-af5d-fbe52e5c2647","S08"],
 ["Glass set down","Effect","2 s","fb561c3e-63db-4956-9cec-0d1b457409b2","S12"]
];
const CUES = [
 ["N01",1,"Full episode only, after S05",37,15.3],["N02",2,"S01",22,9.3],["N03",2,"S03",58,23.7],["N04",2,"S06–S07",55,22.5],
 ["RADIO",2,"S13a, desk radio, low and thin",null,null],
 ["N05",3,"S07–S08",27,11.3],["N06",3,"S09–S10",34,14.1],["N07",3,"S11–S16",101,40.9],["N08",3,"S18–S19",43,17.7],["N09",3,"S25",59,24.1],["N10",3,"S26–S27",58,23.7],["N11",3,"S28",42,17.3],
 ["N12",4,"S01–S02",41,16.9],["N13",4,"S03",37,15.3],["N14",4,"S05–S06",28,11.7],["N15",4,"S11",59,24.1],["N16",4,"S13",34,14.1],["N17",4,"S14–S15",8,3.7],["N18",4,"S17–S18",40,16.5],["N19",4,"S20 → P5 S01",49,20.1],
 ["N20",5,"S04",17,7.3],["N21",5,"S11–S12",55,22.5],["N22",5,"S12",31,12.9],["N23",5,"S12",30,12.5],["N24",5,"S14",16,6.9]
];
const EST = {1:[1208,1208],2:[1900,2500],3:[4000,5000],4:[2500,3000],5:[2000,2700]};
const LEDGER = [
 ["2026-09-25","Balance checked before PART 1","","39,005"],
 ["2026-09-26","PART 2 key frames, batch 1 (4 × 20)","80","38,505"],
 ["2026-09-26","Memorial stills M01–M13 + M04 v2 edit (20 each)","≈ 280","—"],
 ["2026-09-26","PART 1: 12 key frames, 12 clips, S08 redo, 11 sounds","1,088","37,477"],
 ["2026-09-27","PART 2 key frames, batch 2 (11 × 20)","220","37,257"],
 ["2026-09-27","S05b, 10 s clip for N01","120","—"],
 ["2026-09-29","Live balance from Runway","519 since last record","36,738"]
];
const PLATFORMS = [
 ["YouTube (full episode)","16:9 or 9:16 master","Zapier → YouTube Studio","Upload private + scheduled. AI-use label on. Title ≤ 100 characters. 100 upload calls/day on the API; 5/day on Zapier free."],
 ["YouTube Shorts","9:16","Same Zap","Same AI label. Pick the cover frame from the video."],
 ["Instagram Reels","9:16","Zapier → Instagram professional account","Needs a public video link. 100 automatic posts per 24 hours. Turn on the AI label."],
 ["TikTok","9:16","Prepared for Sire to post","Posts from an unaudited app stay private, so Sire taps Post. Turn on TikTok's AI-generated label."]
];
const PLAT_KEYS = [["youtube_shorts","YouTube Shorts"],["instagram_reels","Instagram Reels"],["tiktok","TikTok"],["youtube","YouTube episode"]];
const CONNECTIONS = [
 ["Runway","done","Pro plan · 36,738 credits","Makes pictures, video, voices, effects and music."],
 ["Zapier → YouTube","done","Connected","Uploads private and scheduled."],
 ["Zapier → Instagram for Business","wait","Connected","Check it is the account that owns the show's Instagram."],
 ["Zapier → Google Drive","done","Connected","Holds final files at public links."],
 ["Zapier → TikTok","idle","Not connected","The Publisher prepares TikTok posts; you tap Post."],
 ["Supabase · Master Dashboard","done","production_log has 2 rows","Also has social_post_queue and vw_review_decisions, both empty."],
 ["GitHub · VisionWeaver repo","done","Production records","Public repo, so no manuscript text goes there."]
];
const SETUP_STEPS = [
 ["runway-gpt","Install Runway in ChatGPT","chatgpt.com/plugins → Runway → sign in. It spends your Runway credits."],
 ["zapier-acct","Zapier account with YouTube, Instagram, Sheets","YouTube, Instagram and Drive are already connected. Add Google Sheets for the publish log."],
 ["zap","Build the \"VisionWeaver Publisher\" Zap","Catch Hook → paths for YouTube (Upload Video, private), Instagram (Publish Reel), TikTok (email you the packet) → add a row to \"VisionWeaver Publish Log\"."],
 ["studio-gpt","Create the Studio bot","Paste Part C into Instructions, upload the Playbook (Part E) as Knowledge, turn on the Runway app."],
 ["publisher-gpt","Create the Publisher bot","Paste Part D, upload the Playbook, add the action schema with your hook URL. Keep the URL secret."],
 ["test","Test with PART 1, private","Send the PART 1 packet with visibility private. Check it lands in YouTube Studio, then flip it public yourself."]
];
const DEPTS = ["Design","Motion","Sound","Edit","Marketing","Automation","Source"];

