// EPMIC Phase 1 mock data. Replaced by Lovable Cloud in Phase 2.

export type FactoryStatus = "healthy" | "attention" | "critical";

export interface Factory {
  id: string;
  code: string;
  name: string;
  location: string;
  status: FactoryStatus;
  oee: number;         // 0-100
  onTime: number;      // 0-100
  scrap: number;       // %
  activeOrders: number;
  headcount: number;
}

export const factories: Factory[] = [
  {
    id: "atl-01",
    code: "ATL-01",
    name: "Atlanta Assembly",
    location: "Atlanta, GA",
    status: "healthy",
    oee: 87,
    onTime: 96,
    scrap: 1.4,
    activeOrders: 42,
    headcount: 218,
  },
  {
    id: "mty-02",
    code: "MTY-02",
    name: "Monterrey Components",
    location: "Monterrey, MX",
    status: "attention",
    oee: 74,
    onTime: 88,
    scrap: 3.1,
    activeOrders: 61,
    headcount: 340,
  },
  {
    id: "brn-03",
    code: "BRN-03",
    name: "Brno Precision",
    location: "Brno, CZ",
    status: "critical",
    oee: 58,
    onTime: 71,
    scrap: 5.8,
    activeOrders: 28,
    headcount: 154,
  },
  {
    id: "osk-04",
    code: "OSK-04",
    name: "Osaka Electronics",
    location: "Osaka, JP",
    status: "healthy",
    oee: 91,
    onTime: 98,
    scrap: 0.9,
    activeOrders: 55,
    headcount: 402,
  },
];

export function getFactory(id: string): Factory | undefined {
  return factories.find((f) => f.id === id);
}

export function statusLabel(s: FactoryStatus): string {
  return s === "healthy" ? "Healthy" : s === "attention" ? "Needs attention" : "Critical";
}

export interface DecisionAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  recommendation: string;
}

export function getDecisions(factoryId: string): DecisionAlert[] {
  const base: Record<string, DecisionAlert[]> = {
    "atl-01": [
      {
        id: "a1",
        severity: "info",
        title: "Line 3 running 4% above plan",
        detail: "Cycle time trending down over last 3 shifts.",
        recommendation: "Lock current setup as new standard; propagate to Line 4.",
      },
      {
        id: "a2",
        severity: "warning",
        title: "Raw MAT-118 below 5-day cover",
        detail: "Consumption up 12% w/w. Next delivery in 6 days.",
        recommendation: "Expedite PO-8842 with Acme Metals (+$1.2k freight).",
      },
    ],
    "mty-02": [
      {
        id: "a1",
        severity: "warning",
        title: "OEE dropped 6 pts on Line 2",
        detail: "Micro-stops up 22% since shift change 14:00.",
        recommendation: "Dispatch maintenance to check conveyor sensor CS-14.",
      },
    ],
    "brn-03": [
      {
        id: "a1",
        severity: "critical",
        title: "Scrap at 5.8% — SLA breach",
        detail: "Defect cluster on Product SKU-4491 during dayshift.",
        recommendation: "Stop Line 1, hold last 3 pallets, escalate to Quality lead.",
      },
      {
        id: "a2",
        severity: "warning",
        title: "3 orders at risk of missing ship date",
        detail: "PO-9012, PO-9014, PO-9021 trending 1-2 days late.",
        recommendation: "Rebalance capacity from Line 3 for next 2 shifts.",
      },
    ],
    "osk-04": [
      {
        id: "a1",
        severity: "info",
        title: "All lines within tolerance",
        detail: "No decisions require action right now.",
        recommendation: "Continue monitoring.",
      },
    ],
  };
  return base[factoryId] ?? [];
}
