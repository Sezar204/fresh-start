from sqlalchemy.orm import Session
from app.repositories.quality_repository import QualityRepository

class QualityService:
    def __init__(self, db: Session):
        self.repo = QualityRepository(db)

    def get_checks(self, factory_id: int):
        return self.repo.get_checks(factory_id)

    def create_check(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_check(data)

    def get_ncrs(self, factory_id: int):
        return self.repo.get_ncrs(factory_id)

    def create_ncr(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_ncr(data)

    def get_capas(self, factory_id: int):
        return self.repo.get_capas(factory_id)

    def create_capa(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_capa(data)
