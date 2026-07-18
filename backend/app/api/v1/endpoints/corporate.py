from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.factory import Factory
from app.models.alert import Alert, Decision

router = APIRouter()

@router.get("/overview")
def get_corporate_overview(db: Session = Depends(get_db)):
    factories = db.scalars(select(Factory).where(Factory.is_deleted == False)).all()
    critical_alerts = db.scalars(
        select(Alert).where(Alert.severity.in_(["critical", "emergency"]), Alert.is_resolved == False)
    ).all()
    pending_decisions = db.scalars(
        select(Decision).where(Decision.status == "pending")
    ).all()

    return {
        "success": True,
        "data": {
            "factories": factories,
            "total_factories": len(factories),
            "active_factories": len([f for f in factories if f.status == "active"]),
            "critical_alerts": critical_alerts,
            "pending_decisions": pending_decisions,
            "group_kpis": {
                "total_output": "18,450 units",
                "avg_oee_pct": 84.2,
                "avg_otif_pct": 94.8,
                "avg_quality_pct": 97.1
            }
        },
        "message": "Corporate overview fetched"
    }
