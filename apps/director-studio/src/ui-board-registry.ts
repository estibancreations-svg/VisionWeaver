// VisionWeaver UI Board Registry
// Canonical review state locked by The Architect on 2026-10-07.
// Consult before generating or implementing another board.

export type ViewId = "V1" | "V2" | "V3";

export interface BoardView {
  id: ViewId;
  label: string;
  role: "primary" | "alternate";
  settingsSelectable: boolean;
}

export interface BoardDefinition {
  page: string;
  status: "locked" | "approved-no-primary" | "existing";
  primary?: ViewId;
  views: BoardView[];
  notes?: string[];
}

const view = (
  id: ViewId,
  label: string,
  primary = false
): BoardView => ({
  id,
  label,
  role: primary ? "primary" : "alternate",
  settingsSelectable: !primary,
});

export const VISIONWEAVER_UI_BOARDS: BoardDefinition[] = [
  {
    page: "Worlds & Locations",
    status: "locked",
    primary: "V2",
    views: [
      view("V1", "Cinematic Grid View"),
      view("V2", "Interactive Map View", true),
      view("V3", "World Builder Studio"),
    ],
  },
  {
    page: "Design Studio",
    status: "locked",
    primary: "V2",
    views: [view("V1", "Option 1"), view("V2", "Option 2", true), view("V3", "Option 3")],
  },
  {
    page: "Design & Commercial",
    status: "locked",
    primary: "V1",
    views: [
      view("V1", "Campaign Command Grid", true),
      view("V2", "Interactive Commercial Studio"),
      view("V3", "Placement & Performance Workspace"),
    ],
  },
  {
    page: "Scene & Production",
    status: "locked",
    primary: "V1",
    views: [
      view("V1", "Primary Production Workspace", true),
      view("V2", "Timeline & Continuity"),
      view("V3", "Alternate Production View"),
    ],
    notes: ["V2 may open contextually for timeline, stitching, sound-layer, continuity, long-form assembly, and version/take work."],
  },
  {
    page: "Post Production",
    status: "locked",
    primary: "V1",
    views: [
      view("V1", "Edit & Finish Desk", true),
      view("V2", "Color, Audio & VFX Suite"),
      view("V3", "AI Finishing & Delivery"),
    ],
  },
  {
    page: "Distribution & Growth",
    status: "locked",
    primary: "V2",
    views: [
      view("V1", "Distribution Overview"),
      view("V2", "Content Pipeline View", true),
      view("V3", "Analytics & Growth View"),
    ],
    notes: ["V2 supersedes the earlier V1 selection."],
  },
  {
    page: "Quality & Audit",
    status: "locked",
    primary: "V1",
    views: [
      view("V1", "Quality Command Center", true),
      view("V2", "Evidence & Verification"),
      view("V3", "Release Gate & Audit Trail"),
    ],
  },
  {
    page: "Finance & Accounting",
    status: "locked",
    primary: "V1",
    views: [
      view("V1", "Financial Command Center", true),
      view("V2", "Project Budget & Cost Control"),
      view("V3", "Accounting & Revenue Operations"),
    ],
  },
  {
    page: "IT & Security",
    status: "locked",
    primary: "V2",
    views: [
      view("V1", "IT & Security Command Center"),
      view("V2", "Infrastructure & Connections", true),
      view("V3", "Security, Reliability & Incidents"),
    ],
  },
  {
    page: "Resources",
    status: "locked",
    primary: "V2",
    views: [
      view("V1", "Resource Library Grid"),
      view("V2", "Advanced Search & Filter", true),
      view("V3", "Collections & Collaboration"),
    ],
  },
  {
    page: "Assets & Knowledge",
    status: "locked",
    primary: "V2",
    views: [
      view("V1", "Assets Overview Grid"),
      view("V2", "Advanced Search & Filter", true),
      view("V3", "Collections & Knowledge"),
    ],
  },
  {
    page: "Avatar Engineering",
    status: "approved-no-primary",
    views: [view("V1", "Approved Option 1"), view("V2", "Approved Option 2"), view("V3", "Approved Option 3")],
    notes: ["Do not invent a primary without explicit Architect selection."],
  },
];

export const NEXT_UI_REVIEW_PAGE = "Reports & Insights";

export const GLOBAL_UI_LOCKS = {
  persistentSidebar: true,
  sidebarCollapseControl: true,
  topCommandBar: ["Search", "Create", "Notifications"],
  topProfileAllowed: false,
  accountPlacement: "sidebar-above-THELMA",
  notebookThemeAllowed: false,
  settings: {
    visualViews: true,
    colorSchemes: true,
  },
  prohibitedGenerationToolsForThisReview: ["Canva"],
} as const;
