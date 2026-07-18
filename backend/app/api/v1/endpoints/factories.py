from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.factory_service import FactoryService
from app.schemas.factory import FactoryCreateSchema, FactoryUpdateSchema

router = APIRouter()

@router.get("/")
def get_factories(db: Session = Depends(get_db)):
    svc = FactoryService(db)
    factories = svc.get_all_factories()
    return {"success": True, "data": factories, "message": "Factories fetched", "total": len(factories)}

@router.post("/")
def create_factory(payload: FactoryCreateSchema, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    factory = svc.create_factory(payload.model_dump())
    return {"success": True, "data": factory, "message": "Factory created successfully"}

@router.get("/{factory_id}")
def get_factory(factory_id: int, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    f = svc.get_factory(factory_id)
    if not f:
        raise HTTPException(status_code=404, detail="Factory not found")
    return {"success": True, "data": f, "message": "Factory details"}

@router.put("/{factory_id}")
def update_factory(factory_id: int, payload: FactoryUpdateSchema, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    updated = svc.update_factory(factory_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Factory not found")
    return {"success": True, "data": updated, "message": "Factory updated successfully"}

@router.delete("/{factory_id}")
def delete_factory(factory_id: int, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    ok = svc.delete_factory(factory_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Factory not found")
    return {"success": True, "data": None, "message": "Factory deleted"}

@router.get("/{factory_id}/health-score")
def get_health_score(factory_id: int, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    score = svc.calculate_health_score(factory_id)
    return {"success": True, "data": score, "message": "Health score calculated"}

@router.get("/{factory_id}/dashboard-summary")
def get_dashboard_summary(factory_id: int, db: Session = Depends(get_db)):
    svc = FactoryService(db)
    f = svc.get_factory(factory_id)
    score = svc.calculate_health_score(factory_id)
    return {
        "success": True,
        "data": {
            "factory": f,
            "health_score": score,
            "critical_alerts_count": 2,
            "pending_decisions_count": 2,
            "plan_adherence": 92.5
        },
        "message": "Dashboard summary fetched"
    }
