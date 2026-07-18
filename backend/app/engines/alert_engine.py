from sqlalchemy import select
from app.engines.base import BaseEngine, EngineResult
from app.models.inventory import InventoryRawMaterial, RawMaterial
from app.models.alert import Alert

class AlertEngine(BaseEngine):
    def execute(self) -> EngineResult:
        alerts_created = 0
        inv_items = self.db.scalars(
            select(InventoryRawMaterial).where(InventoryRawMaterial.factory_id == self.factory_id)
        ).all()

        for inv in inv_items:
            rm = self.db.get(RawMaterial, inv.material_id)
            if not rm:
                continue

            if inv.qty_on_hand == 0:
                # Check duplicate
                existing = self.db.scalar(
                    select(Alert).where(
                        Alert.factory_id == self.factory_id,
                        Alert.alert_type == "RAW_MATERIAL_ZERO",
                        Alert.source_id == rm.id,
                        Alert.is_resolved == False
                    )
                )
                if not existing:
                    a = Alert(
                        factory_id=self.factory_id,
                        alert_type="RAW_MATERIAL_ZERO",
                        severity="emergency",
                        title=f"CRITICAL: Out of Stock - {rm.name}",
                        message=f"Stock for {rm.name} is completely depleted (0 {rm.unit_of_measure}).",
                        source_module="Inventory",
                        source_id=rm.id
                    )
                    self.db.add(a)
                    alerts_created += 1
            elif inv.qty_on_hand < rm.safety_stock_qty:
                existing = self.db.scalar(
                    select(Alert).where(
                        Alert.factory_id == self.factory_id,
                        Alert.alert_type == "BELOW_SAFETY_STOCK",
                        Alert.source_id == rm.id,
                        Alert.is_resolved == False
                    )
                )
                if not existing:
                    a = Alert(
                        factory_id=self.factory_id,
                        alert_type="BELOW_SAFETY_STOCK",
                        severity="warning",
                        title=f"Low Stock Warning - {rm.name}",
                        message=f"Stock ({inv.qty_on_hand}) is below safety threshold ({rm.safety_stock_qty}).",
                        source_module="Inventory",
                        source_id=rm.id
                    )
                    self.db.add(a)
                    alerts_created += 1

        self.db.commit()
        return EngineResult(
            engine_name="AlertEngine",
            factory_id=self.factory_id,
            status="success",
            alerts_generated=alerts_created,
            message=f"Alert engine scan finished. {alerts_created} new alerts generated."
        )
