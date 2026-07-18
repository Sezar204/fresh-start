from typing import Optional, Dict, Any
from pydantic import BaseModel

class WhatIfScenarioSchema(BaseModel):
    scenario_type: str # DEMAND_CHANGE, SUPPLIER_FAILURE, LINE_DOWN, ADD_SHIFT, RUSH_ORDER, PRICE_CHANGE
    parameters: Dict[str, Any]
    horizon_days: int = 30
