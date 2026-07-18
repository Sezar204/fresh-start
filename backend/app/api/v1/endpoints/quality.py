from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.quality_service import QualityService

router = APIRouter()

@router.get("/{factory_id}/checks")
def get_checks(factory_id: int, db: Session = Depends(get_db)):
    svc = QualityService(db)
    items = svc.get_checks(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Quality checks fetched"}

@router.post("/{factory_id}/checks")
def create_check(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = QualityService(db)
    item = svc.create_check(factory_id, body)
    return {"success": True, "data": item, "message": "Quality check recorded"}

@router.get("/{factory_id}/ncr")
def get_ncrs(factory_id: int, db: Session = Depends(get_db)):
    svc = QualityService(db)
    items = svc.get_ncrs(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "NCRs fetched"}

@router.post("/{factory_id}/ncr")
def create_ncr(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = QualityService(db)
    item = svc.create_ncr(factory_id, body)
    return {"success": True, "data": item, "message": "NCR created"}

@router.get("/{factory_id}/capa")
def get_capas(factory_id: int, db: Session = Depends(get_db)):
    svc = QualityService(db)
    items = svc.get_capas(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "CAPAs fetched"}

@router.post("/{factory_id}/capa")
def create_capa(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = QualityService(db)
    item = svc.create_capa(factory_id, body)
    return {"success": True, "data": item, "message": "CAPA created"}
