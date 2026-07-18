from sqlalchemy.orm import Session
from app.repositories.procurement_repository import ProcurementRepository

class ProcurementService:
    def __init__(self, db: Session):
        self.repo = ProcurementRepository(db)

    def get_pos(self, factory_id: int):
        return self.repo.get_pos(factory_id)

    def create_po(self, factory_id: int, header_data: dict, lines_data: list):
        header_data["factory_id"] = factory_id
        return self.repo.create_po(header_data, lines_data)
