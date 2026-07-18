from typing import List
from sqlalchemy.orm import Session
from app.repositories.master_data_repository import MasterDataRepository

class MasterDataService:
    def __init__(self, db: Session):
        self.repo = MasterDataRepository(db)

    def get_lines(self, factory_id: int):
        return self.repo.get_lines(factory_id)

    def create_line(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_line(data)

    def get_machines(self, factory_id: int):
        return self.repo.get_machines(factory_id)

    def create_machine(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_machine(data)

    def get_shifts(self, factory_id: int):
        return self.repo.get_shifts(factory_id)

    def create_shift(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        return self.repo.create_shift(data)

    def get_products(self, factory_id: int):
        return self.repo.get_products(factory_id)

    def create_product(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["sku"] = data["sku"].upper()
        return self.repo.create_product(data)

    def get_boms(self, factory_id: int):
        return self.repo.get_boms(factory_id)

    def create_bom(self, factory_id: int, header_data: dict, lines_data: List[dict]):
        header_data["factory_id"] = factory_id
        return self.repo.create_bom(header_data, lines_data)

    def get_raw_materials(self, factory_id: int):
        return self.repo.get_raw_materials(factory_id)

    def create_raw_material(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_raw_material(data)

    def get_suppliers(self, factory_id: int):
        return self.repo.get_suppliers(factory_id)

    def create_supplier(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_supplier(data)

    def get_customers(self, factory_id: int):
        return self.repo.get_customers(factory_id)

    def create_customer(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_customer(data)

    def get_warehouses(self, factory_id: int):
        return self.repo.get_warehouses(factory_id)

    def create_warehouse(self, factory_id: int, data: dict):
        data["factory_id"] = factory_id
        data["code"] = data["code"].upper()
        return self.repo.create_warehouse(data)
