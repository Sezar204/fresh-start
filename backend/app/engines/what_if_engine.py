from typing import Dict, Any

class WhatIfEngine:
    def __init__(self, factory_id: int):
        self.factory_id = factory_id

    def simulate(self, scenario_type: str, parameters: Dict[str, Any], horizon_days: int = 30) -> Dict[str, Any]:
        # Pure in-memory simulation — NEVER mutates database
        if scenario_type == "DEMAND_CHANGE":
            pct_change = parameters.get("pct_change", 20.0)
            return {
                "scenario": scenario_type,
                "parameters": parameters,
                "baseline": {"capacity_utilization": "82%", "otd_rate": "95%", "bottleneck": "Labeler L1"},
                "simulated": {
                    "capacity_utilization": f"{min(100, 82 + pct_change * 0.7):.1f}%",
                    "otd_rate": f"{max(60, 95 - pct_change * 0.5):.1f}%",
                    "bottleneck": "Packaging Line 1 & Assembly Line 2",
                    "raw_material_shortages": ["RM-001 (PET Bottle)", "RM-003 (SLES Chemical)"]
                },
                "financial_impact": {"revenue_delta": f"+${pct_change * 1250:.2f}", "overtime_cost": "+$450.00"}
            }
        elif scenario_type == "LINE_DOWN":
            return {
                "scenario": scenario_type,
                "parameters": parameters,
                "baseline": {"daily_output": 5000, "oee": "85%"},
                "simulated": {
                    "daily_output": 3200,
                    "oee": "62%",
                    "orders_at_risk": ["ORD-20260718-001", "ORD-20260718-004"]
                },
                "financial_impact": {"revenue_at_risk": "$18,500.00", "penalty_clause": "$1,200.00"}
            }
        else:
            return {
                "scenario": scenario_type,
                "parameters": parameters,
                "baseline": {"status": "Normal"},
                "simulated": {"status": "Simulated Normal with +12% throughput"},
                "financial_impact": {"gross_margin": "+2.4%"}
            }
