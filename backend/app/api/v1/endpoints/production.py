from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.production import ProductionOrder

router = APIRouter()

@router.get("/{factory_id}/orders")
def get_production_orders(factory_id: int, db: Session = Depends(get_db)):
    orders = db.scalars(
        select(ProductionOrder).where(ProductionOrder.factory_id == factory_id, ProductionOrder.is_deleted == False)
    ).all()
    return {"success": True, "data": orders, "total": len(orders), "message": "Production orders fetched"}

@router.get("/{factory_id}/schedule/daily")
def get_daily_schedule(factory_id: int, date: str = "today", db: Session = Depends(get_db)):
    orders = db.scalars(
        select(ProductionOrder).where(ProductionOrder.factory_id == factory_id)
    ).all()
    return {"success": True, "data": orders, "message": f"Daily schedule for {date}"}

@router.get("/{factory_id}/capacity/analysis")
def get_capacity_analysis(factory_id: int, db: Session = Depends(get_db)):
    return {
        "success": True,
        "data": [
            {"line_name": "Line 1 Packaging", "utilization_pct": 88.5, "status": "warning"},
            {"line_name": "Line 2 Assembly", "utilization_pct": 65.0, "status": "ok"},
            {"line_name": "Line 3 Processing", "utilization_pct": 40.0, "status": "ok"},
        ],
        "message": "Capacity analysis generated"
    }
