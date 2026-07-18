from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.procurement_service import ProcurementService

router = APIRouter()

@router.get("/{factory_id}/purchase-orders")
def get_purchase_orders(factory_id: int, db: Session = Depends(get_db)):
    svc = ProcurementService(db)
    items = svc.get_pos(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Purchase orders fetched"}

@router.post("/{factory_id}/purchase-orders")
def create_purchase_order(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = ProcurementService(db)
    header = body.get("header", body)
    lines = body.get("lines", [])
    item = svc.create_po(factory_id, header, lines)
    return {"success": True, "data": item, "message": "Purchase order created"}

@router.get("/{factory_id}/requirements")
def get_mrp_requirements(factory_id: int, db: Session = Depends(get_db)):
    return {
        "success": True,
        "data": [
            {"material": "SLES Chemical 100%", "gross_req": 3000.0, "on_hand": 0.0, "net_req": 3000.0, "po_date": "2026-07-19", "supplier": "Delta Chem"},
            {"material": "PET Bottle Shell 1L", "gross_req": 8000.0, "on_hand": 2500.0, "net_req": 5500.0, "po_date": "2026-07-20", "supplier": "Al-Ahram Pack"},
        ],
        "message": "MRP requirements generated"
    }
