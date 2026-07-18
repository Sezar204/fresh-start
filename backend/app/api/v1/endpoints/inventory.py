from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.inventory import InventoryRawMaterial, InventoryFinishedGoods, InventoryWIP, RawMaterial

router = APIRouter()

@router.get("/{factory_id}/raw-materials")
def get_inventory_raw_materials(factory_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(InventoryRawMaterial).where(InventoryRawMaterial.factory_id == factory_id)
    ).all()
    res = []
    for inv in items:
        rm = db.get(RawMaterial, inv.material_id)
        rm_dict = {
            "id": rm.id, "code": rm.code, "name": rm.name, "category": rm.category,
            "unit_of_measure": rm.unit_of_measure, "safety_stock_qty": rm.safety_stock_qty,
            "reorder_point_qty": rm.reorder_point_qty, "lead_time_days": rm.lead_time_days
        } if rm else {}
        cov = (inv.qty_on_hand / 100.0) if inv.qty_on_hand > 0 else 0
        cov_status = "critical" if inv.qty_on_hand == 0 else "warning" if inv.qty_on_hand < (rm.safety_stock_qty if rm else 100) else "ok"
        res.append({
            "id": inv.id, "factory_id": inv.factory_id, "material_id": inv.material_id,
            "qty_on_hand": inv.qty_on_hand, "qty_reserved": inv.qty_reserved, "qty_available": inv.qty_available,
            "batch_number": inv.batch_number, "last_updated": inv.last_updated.isoformat(),
            "days_coverage": round(cov, 1), "coverage_status": cov_status, "material": rm_dict
        })
    return {"success": True, "data": res, "total": len(res), "message": "Inventory raw materials fetched"}

@router.get("/{factory_id}/finished-goods")
def get_inventory_finished_goods(factory_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(InventoryFinishedGoods).where(InventoryFinishedGoods.factory_id == factory_id)
    ).all()
    return {"success": True, "data": items, "total": len(items), "message": "Finished goods inventory fetched"}

@router.get("/{factory_id}/wip")
def get_inventory_wip(factory_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(InventoryWIP).where(InventoryWIP.factory_id == factory_id)
    ).all()
    return {"success": True, "data": items, "total": len(items), "message": "WIP inventory fetched"}

@router.get("/{factory_id}/analysis/critical-items")
def get_critical_items(factory_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(InventoryRawMaterial).where(InventoryRawMaterial.factory_id == factory_id)
    ).all()
    criticals = []
    for inv in items:
        rm = db.get(RawMaterial, inv.material_id)
        if rm and inv.qty_on_hand < rm.safety_stock_qty:
            cov = round(inv.qty_on_hand / max(1, rm.safety_stock_qty / 10), 1)
            criticals.append({
                "material_name": rm.name, "material_code": rm.code,
                "on_hand": inv.qty_on_hand, "safety_stock": rm.safety_stock_qty,
                "coverage_days": cov, "status": "EMERGENCY" if inv.qty_on_hand == 0 else "WARNING"
            })
    return {"success": True, "data": criticals, "total": len(criticals), "message": "Critical inventory items fetched"}
