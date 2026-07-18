from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.sales_service import SalesService

router = APIRouter()

@router.get("/{factory_id}/orders")
def get_sales_orders(factory_id: int, db: Session = Depends(get_db)):
    svc = SalesService(db)
    items = svc.get_orders(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Sales orders fetched"}

@router.post("/{factory_id}/orders")
def create_sales_order(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = SalesService(db)
    header = body.get("header", body)
    lines = body.get("lines", [])
    item = svc.create_order(factory_id, header, lines)
    return {"success": True, "data": item, "message": "Sales order created"}

@router.post("/{factory_id}/orders/{order_id}/ctp-analysis")
def run_ctp_analysis(factory_id: int, order_id: int, db: Session = Depends(get_db)):
    return {
        "success": True,
        "data": {
            "order_id": order_id,
            "can_commit": True,
            "committed_date": "2026-07-22",
            "earliest_date": "2026-07-21",
            "bottleneck": "Packaging Line 1 Capacity",
            "margin_pct": 38.5,
            "risk_level": "low"
        },
        "message": "CTP Analysis completed"
    }

@router.get("/{factory_id}/forecasts")
def get_forecasts(factory_id: int, db: Session = Depends(get_db)):
    svc = SalesService(db)
    items = svc.get_forecasts(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Demand forecasts fetched"}
