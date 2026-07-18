from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.workforce_service import WorkforceService

router = APIRouter()

@router.get("/{factory_id}/workers")
def get_workers(factory_id: int, db: Session = Depends(get_db)):
    svc = WorkforceService(db)
    items = svc.get_workers(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Workers fetched"}

@router.post("/{factory_id}/workers")
def create_worker(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = WorkforceService(db)
    item = svc.create_worker(factory_id, body)
    return {"success": True, "data": item, "message": "Worker created"}

@router.get("/{factory_id}/attendance")
def get_attendance(factory_id: int, db: Session = Depends(get_db)):
    svc = WorkforceService(db)
    items = svc.get_attendance(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Attendance records fetched"}
