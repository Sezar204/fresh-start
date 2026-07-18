from sqlalchemy.orm import Session
from app.repositories.workforce_repository import WorkforceRepository

class WorkforceService:
    def __init__(self, db: Session):
        self.repo = WorkforceRepository(db)

    def get_workers(self, factory_id: int):
        return self.repo.get_workers(factory_id)

    def create_worker(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_worker(data)

    def get_attendance(self, factory_id: int):
        return self.repo.get_attendance(factory_id)
