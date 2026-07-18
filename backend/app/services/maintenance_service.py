from sqlalchemy.orm import Session
from app.repositories.maintenance_repository import MaintenanceRepository

class MaintenanceService:
    def __init__(self, db: Session):
        self.repo = MaintenanceRepository(db)

    def get_schedules(self, factory_id: int):
        return self.repo.get_schedules(factory_id)

    def get_work_orders(self, factory_id: int):
        return self.repo.get_work_orders(factory_id)

    def create_work_order(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_work_order(data)

    def get_breakdowns(self, factory_id: int):
        return self.repo.get_breakdowns(factory_id)
