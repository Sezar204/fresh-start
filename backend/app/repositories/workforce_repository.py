from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.workforce import Worker, ShiftAssignment, AttendanceRecord

class WorkforceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_workers(self, factory_id: int) -> List[Worker]:
        return list(self.db.scalars(select(Worker).where(Worker.factory_id == factory_id, Worker.is_deleted == False)).all())

    def create_worker(self, data: dict) -> Worker:
        w = Worker(**data)
        self.db.add(w)
        self.db.commit()
        self.db.refresh(w)
        return w

    def get_attendance(self, factory_id: int) -> List[AttendanceRecord]:
        return list(self.db.scalars(select(AttendanceRecord).where(AttendanceRecord.factory_id == factory_id)).all())
