from typing import List
from sqlalchemy.orm import Session
from app.repositories.sales_repository import SalesRepository

class SalesService:
    def __init__(self, db: Session):
        self.repo = SalesRepository(db)

    def get_orders(self, factory_id: int):
        return self.repo.get_orders(factory_id)

    def create_order(self, factory_id: int, header_data: dict, lines_data: List[dict]):
        header_data["factory_id"] = factory_id
        return self.repo.create_order(header_data, lines_data)

    def get_forecasts(self, factory_id: int):
        return self.repo.get_forecasts(factory_id)
