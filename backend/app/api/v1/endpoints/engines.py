from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.engines.alert_engine import AlertEngine
from app.engines.mrp_engine import MRPEngine
from app.engines.inventory_engine import InventoryEngine
from app.engines.demand_engine import DemandEngine
from app.engines.capacity_engine import CapacityEngine
from app.engines.what_if_engine import WhatIfEngine
from app.schemas.engine import WhatIfScenarioSchema

router = APIRouter()

@router.post("/run/all/{factory_id}")
def run_all_engines(factory_id: int, db: Session = Depends(get_db)):
    results = []
    r1 = AlertEngine(db, factory_id).execute()
    r2 = MRPEngine(db, factory_id).execute()
    r3 = InventoryEngine(db, factory_id).execute()
    r4 = CapacityEngine(db, factory_id).execute()
    results.extend([r1.__dict__, r2.__dict__, r3.__dict__, r4.__dict__])
    return {"success": True, "data": results, "message": "All decision engines executed"}

@router.post("/run/mrp/{factory_id}")
def run_mrp(factory_id: int, db: Session = Depends(get_db)):
    res = MRPEngine(db, factory_id).execute()
    return {"success": True, "data": res.__dict__, "message": "MRP engine executed"}

@router.post("/simulate/what-if/{factory_id}")
def run_what_if_simulation(factory_id: int, scenario: WhatIfScenarioSchema):
    engine = WhatIfEngine(factory_id)
    res = engine.simulate(
        scenario_type=scenario.scenario_type,
        parameters=scenario.parameters,
        horizon_days=scenario.horizon_days
    )
    return {"success": True, "data": res, "message": "What-if simulation computed"}
