from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.maintenance_service import MaintenanceService

router = APIRouter()

@router.get("/{factory_id}/schedules")
def get_schedules(factory_id: int, db: Session = Depends(get_db)):
    svc = MaintenanceService(db)
    items = svc.get_schedules(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Schedules fetched"}

@router.get("/{factory_id}/work-orders")
def get_work_orders(factory_id: int, db: Session = Depends(get_db)):
    svc = MaintenanceService(db)
    items = svc.get_work_orders(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Work orders fetched"}

@router.post("/{factory_id}/work-orders")
def create_work_order(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MaintenanceService(db)
    item = svc.create_work_order(factory_id, body)
    return {"success": True, "data": item, "message": "Work order created"}

@router.get("/{factory_id}/breakdowns")
def get_breakdowns(factory_id: int, db: Session = Depends(get_db)):
    svc = MaintenanceService(db)
    items = svc.get_breakdowns(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Breakdowns fetched"}
