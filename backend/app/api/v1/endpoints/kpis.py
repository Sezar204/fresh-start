from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.kpi_service import KPIService

router = APIRouter()

@router.get("/{factory_id}")
def get_factory_kpis(factory_id: int, period_type: str = "daily", db: Session = Depends(get_db)):
    svc = KPIService(db)
    vals = svc.get_values(factory_id, period_type)
    defs = {d.id: d for d in svc.get_definitions(factory_id)}

    res = []
    for v in vals:
        k_def = defs.get(v.kpi_id)
        res.append({
            "id": v.id,
            "kpi_id": v.kpi_id,
            "factory_id": v.factory_id,
            "period_type": v.period_type,
            "period_date": v.period_date,
            "value": v.value,
            "status": v.status,
            "calculated_at": v.calculated_at.isoformat() if v.calculated_at else "",
            "kpi": {
                "id": k_def.id, "code": k_def.code, "name": k_def.name,
                "category": k_def.category, "unit": k_def.unit,
                "target_value": k_def.target_value, "display_format": k_def.display_format
            } if k_def else None,
            "trend": v.trend_json or [80, 82, 85, 84, 88]
        })
    return {"success": True, "data": res, "total": len(res), "message": "KPIs fetched"}
