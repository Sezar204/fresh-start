from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.procurement import PurchaseOrder, PurchaseOrderLine, Supplier

class ProcurementRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_pos(self, factory_id: int) -> List[PurchaseOrder]:
        return list(self.db.scalars(select(PurchaseOrder).where(PurchaseOrder.factory_id == factory_id, PurchaseOrder.is_deleted == False)).all())

    def create_po(self, header_data: dict, lines_data: List[dict]) -> PurchaseOrder:
        po = PurchaseOrder(**header_data)
        self.db.add(po)
        self.db.flush()
        total = 0.0
        for ld in lines_data:
            line_val = ld.get("qty_ordered", 0) * ld.get("unit_price", 0)
            line = PurchaseOrderLine(po_id=po.id, **ld)
            self.db.add(line)
            total += line_val
        po.total_value = total
        self.db.commit()
        self.db.refresh(po)
        return po
