from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.kpi import KPIDefinition, KPIValue

class KPIRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_definitions(self, factory_id: Optional[int] = None) -> List[KPIDefinition]:
        stmt = select(KPIDefinition).where(KPIDefinition.is_active == True)
        if factory_id:
            stmt = stmt.where((KPIDefinition.factory_id == factory_id) | (KPIDefinition.factory_id == None))
        return list(self.db.scalars(stmt).all())

    def get_values(self, factory_id: int, period_type: str = "daily") -> List[KPIValue]:
        return list(
            self.db.scalars(
                select(KPIValue).where(KPIValue.factory_id == factory_id, KPIValue.period_type == period_type)
            ).all()
        )
