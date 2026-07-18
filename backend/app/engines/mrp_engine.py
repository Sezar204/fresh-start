from sqlalchemy import select
from app.engines.base import BaseEngine, EngineResult
from app.models.production import ProductionOrder
from app.models.product import BOMHeader
from app.models.procurement import PurchaseOrder, PurchaseOrderLine
from datetime import datetime, timedelta

class MRPEngine(BaseEngine):
    def execute(self) -> EngineResult:
        orders = self.db.scalars(
            select(ProductionOrder).where(
                ProductionOrder.factory_id == self.factory_id,
                ProductionOrder.status == "planned"
            )
        ).all()

        pos_created = 0
        today_str = datetime.utcnow().strftime("%Y-%m-%d")

        for ord_item in orders:
            bom = self.db.scalar(
                select(BOMHeader).where(
                    BOMHeader.product_id == ord_item.product_id,
                    BOMHeader.status == "active"
                )
            )
            if not bom or not bom.lines:
                continue

            for line in bom.lines:
                gross_req = ord_item.planned_qty * line.quantity_required * (1 + line.loss_factor_pct / 100.0)
                po_num = f"PO-AUTO-{ord_item.id}-{line.material_id}"
                existing_po = self.db.scalar(select(PurchaseOrder).where(PurchaseOrder.po_number == po_num))
                if not existing_po:
                    po = PurchaseOrder(
                        factory_id=self.factory_id,
                        supplier_id=1,
                        po_number=po_num,
                        order_date=today_str,
                        expected_delivery=(datetime.utcnow() + timedelta(days=5)).strftime("%Y-%m-%d"),
                        status="planned",
                        total_value=gross_req * 1.5
                    )
                    self.db.add(po)
                    self.db.flush()
                    pol = PurchaseOrderLine(
                        po_id=po.id,
                        material_id=line.material_id,
                        qty_ordered=gross_req,
                        unit_price=1.5
                    )
                    self.db.add(pol)
                    pos_created += 1

        self.db.commit()
        return EngineResult(
            engine_name="MRPEngine",
            factory_id=self.factory_id,
            status="success",
            metrics={"planned_pos_generated": pos_created},
            message=f"MRP execution completed. {pos_created} draft POs generated."
        )
