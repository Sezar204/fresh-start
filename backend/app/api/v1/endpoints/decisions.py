from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.alert_service import AlertService

router = APIRouter()

@router.get("/{factory_id}/pending")
def get_pending_decisions(factory_id: int, db: Session = Depends(get_db)):
    svc = AlertService(db)
    items = svc.get_pending_decisions(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Pending decisions fetched"}

@router.put("/{decision_id}/approve")
def approve_decision(decision_id: int, body: dict = {}, db: Session = Depends(get_db)):
    svc = AlertService(db)
    notes = body.get("notes")
    item = svc.approve_decision(decision_id, notes)
    return {"success": True, "data": item, "message": "Decision approved"}

@router.put("/{decision_id}/reject")
def reject_decision(decision_id: int, body: dict = {}, db: Session = Depends(get_db)):
    svc = AlertService(db)
    notes = body.get("notes")
    item = svc.reject_decision(decision_id, notes)
    return {"success": True, "data": item, "message": "Decision rejected"}
