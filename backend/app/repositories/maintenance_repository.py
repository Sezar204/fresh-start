from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.maintenance import MaintenanceSchedule, MaintenanceWorkOrder, MachineBreakdown

class MaintenanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_schedules(self, factory_id: int) -> List[MaintenanceSchedule]:
        return list(self.db.scalars(select(MaintenanceSchedule).where(MaintenanceSchedule.factory_id == factory_id)).all())

    def get_work_orders(self, factory_id: int) -> List[MaintenanceWorkOrder]:
        return list(self.db.scalars(select(MaintenanceWorkOrder).where(MaintenanceWorkOrder.factory_id == factory_id)).all())

    def create_work_order(self, data: dict) -> MaintenanceWorkOrder:
        wo = MaintenanceWorkOrder(**data)
        self.db.add(wo)
        self.db.commit()
        self.db.refresh(wo)
        return wo

    def get_breakdowns(self, factory_id: int) -> List[MachineBreakdown]:
        return list(self.db.scalars(select(MachineBreakdown).where(MachineBreakdown.factory_id == factory_id)).all())
