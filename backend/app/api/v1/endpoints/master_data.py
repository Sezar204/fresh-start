from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.master_data_service import MasterDataService

router = APIRouter()

# Production Lines
@router.get("/{factory_id}/lines")
def get_lines(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_lines(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Lines fetched"}

@router.post("/{factory_id}/lines")
def create_line(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_line(factory_id, body)
    return {"success": True, "data": item, "message": "Line created"}

# Machines
@router.get("/{factory_id}/machines")
def get_machines(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_machines(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Machines fetched"}

@router.post("/{factory_id}/machines")
def create_machine(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_machine(factory_id, body)
    return {"success": True, "data": item, "message": "Machine created"}

# Shifts
@router.get("/{factory_id}/shifts")
def get_shifts(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_shifts(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Shifts fetched"}

@router.post("/{factory_id}/shifts")
def create_shift(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_shift(factory_id, body)
    return {"success": True, "data": item, "message": "Shift created"}

# Products
@router.get("/{factory_id}/products")
def get_products(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_products(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Products fetched"}

@router.post("/{factory_id}/products")
def create_product(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_product(factory_id, body)
    return {"success": True, "data": item, "message": "Product created"}

# BOM
@router.get("/{factory_id}/bom")
def get_boms(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_boms(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "BOMs fetched"}

@router.post("/{factory_id}/bom")
def create_bom(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    header = body.get("header", body)
    lines = body.get("lines", [])
    item = svc.create_bom(factory_id, header, lines)
    return {"success": True, "data": item, "message": "BOM created"}

# Raw Materials
@router.get("/{factory_id}/raw-materials")
def get_raw_materials(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_raw_materials(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Raw materials fetched"}

@router.post("/{factory_id}/raw-materials")
def create_raw_material(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_raw_material(factory_id, body)
    return {"success": True, "data": item, "message": "Raw material created"}

# Suppliers
@router.get("/{factory_id}/suppliers")
def get_suppliers(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_suppliers(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Suppliers fetched"}

@router.post("/{factory_id}/suppliers")
def create_supplier(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_supplier(factory_id, body)
    return {"success": True, "data": item, "message": "Supplier created"}

# Customers
@router.get("/{factory_id}/customers")
def get_customers(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_customers(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Customers fetched"}

@router.post("/{factory_id}/customers")
def create_customer(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_customer(factory_id, body)
    return {"success": True, "data": item, "message": "Customer created"}

# Warehouses
@router.get("/{factory_id}/warehouses")
def get_warehouses(factory_id: int, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    items = svc.get_warehouses(factory_id)
    return {"success": True, "data": items, "total": len(items), "message": "Warehouses fetched"}

@router.post("/{factory_id}/warehouses")
def create_warehouse(factory_id: int, body: dict, db: Session = Depends(get_db)):
    svc = MasterDataService(db)
    item = svc.create_warehouse(factory_id, body)
    return {"success": True, "data": item, "message": "Warehouse created"}
