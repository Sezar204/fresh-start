from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.production import ProductionLine, Machine, Shift
from app.models.product import Product, BOMHeader, BOMLine
from app.models.inventory import RawMaterial
from app.models.procurement import Supplier
from app.models.sales import Customer
from app.models.warehouse import Warehouse

class MasterDataRepository:
    def __init__(self, db: Session):
        self.db = db

    # Production Lines
    def get_lines(self, factory_id: int) -> List[ProductionLine]:
        return list(self.db.scalars(select(ProductionLine).where(ProductionLine.factory_id == factory_id, ProductionLine.is_deleted == False)).all())

    def create_line(self, data: dict) -> ProductionLine:
        obj = ProductionLine(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Machines
    def get_machines(self, factory_id: int) -> List[Machine]:
        return list(self.db.scalars(select(Machine).where(Machine.factory_id == factory_id, Machine.is_deleted == False)).all())

    def create_machine(self, data: dict) -> Machine:
        obj = Machine(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Shifts
    def get_shifts(self, factory_id: int) -> List[Shift]:
        return list(self.db.scalars(select(Shift).where(Shift.factory_id == factory_id, Shift.is_deleted == False)).all())

    def create_shift(self, data: dict) -> Shift:
        obj = Shift(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Products
    def get_products(self, factory_id: int) -> List[Product]:
        return list(self.db.scalars(select(Product).where(Product.factory_id == factory_id, Product.is_deleted == False)).all())

    def create_product(self, data: dict) -> Product:
        obj = Product(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # BOM
    def get_boms(self, factory_id: int) -> List[BOMHeader]:
        return list(self.db.scalars(select(BOMHeader).where(BOMHeader.factory_id == factory_id, BOMHeader.is_deleted == False)).all())

    def create_bom(self, header_data: dict, lines_data: List[dict]) -> BOMHeader:
        bom = BOMHeader(**header_data)
        self.db.add(bom)
        self.db.flush()
        for line_d in lines_data:
            line = BOMLine(bom_id=bom.id, **line_d)
            self.db.add(line)
        self.db.commit()
        self.db.refresh(bom)
        return bom

    # Raw Materials
    def get_raw_materials(self, factory_id: int) -> List[RawMaterial]:
        return list(self.db.scalars(select(RawMaterial).where(RawMaterial.factory_id == factory_id, RawMaterial.is_deleted == False)).all())

    def create_raw_material(self, data: dict) -> RawMaterial:
        obj = RawMaterial(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Suppliers
    def get_suppliers(self, factory_id: int) -> List[Supplier]:
        return list(self.db.scalars(select(Supplier).where(Supplier.factory_id == factory_id, Supplier.is_deleted == False)).all())

    def create_supplier(self, data: dict) -> Supplier:
        obj = Supplier(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Customers
    def get_customers(self, factory_id: int) -> List[Customer]:
        return list(self.db.scalars(select(Customer).where(Customer.factory_id == factory_id, Customer.is_deleted == False)).all())

    def create_customer(self, data: dict) -> Customer:
        obj = Customer(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # Warehouses
    def get_warehouses(self, factory_id: int) -> List[Warehouse]:
        return list(self.db.scalars(select(Warehouse).where(Warehouse.factory_id == factory_id, Warehouse.is_deleted == False)).all())

    def create_warehouse(self, data: dict) -> Warehouse:
        obj = Warehouse(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj
