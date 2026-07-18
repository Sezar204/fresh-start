from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.alert_service import AlertService

router = APIRouter()

@router.get("/{factory_id}")
def get_alerts(factory_id: int, db: Session = Depends(get_db)):
    svc = AlertService(db)
    items = svc.get_alerts(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Alerts fetched"}

@router.put("/{alert_id}/read")
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    svc = AlertService(db)
    a = svc.mark_read(alert_id)
    return {"success": True, "data": a, "message": "Alert marked read"}

@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    svc = AlertService(db)
    a = svc.resolve_alert(alert_id)
    return {"success": True, "data": a, "message": "Alert resolved"}
