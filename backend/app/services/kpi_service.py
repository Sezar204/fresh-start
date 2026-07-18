from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.kpi_repository import KPIRepository

class KPIService:
    def __init__(self, db: Session):
        self.repo = KPIRepository(db)

    def get_definitions(self, factory_id: Optional[int] = None):
        return self.repo.get_definitions(factory_id)

    def get_values(self, factory_id: int, period_type: str = "daily"):
        return self.repo.get_values(factory_id, period_type)
