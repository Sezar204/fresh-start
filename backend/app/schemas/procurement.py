from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class SupplierSchema(BaseModel):
    code: str
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    payment_terms_days: Optional[int] = 30
    rating: int = 5
    status: str = "active"
    notes: Optional[str] = None

class SupplierResponseSchema(SupplierSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)

class PurchaseOrderLineSchema(BaseModel):
    material_id: int
    qty_ordered: float
    unit_price: float
    notes: Optional[str] = None

class PurchaseOrderLineResponseSchema(PurchaseOrderLineSchema):
    id: int
    po_id: int
    qty_received: float = 0.0
    quality_status: str = "pending"
    model_config = ConfigDict(from_attributes=True)

class PurchaseOrderSchema(BaseModel):
    supplier_id: int
    po_number: str
    order_date: str
    expected_delivery: str
    actual_delivery: Optional[str] = None
    status: str = "planned"
    total_value: float = 0.0
    currency: str = "USD"
    notes: Optional[str] = None
    lines: Optional[List[PurchaseOrderLineSchema]] = None

class PurchaseOrderResponseSchema(BaseModel):
    id: int
    factory_id: int
    supplier_id: int
    po_number: str
    order_date: str
    expected_delivery: str
    actual_delivery: Optional[str] = None
    status: str
    total_value: float
    currency: str
    notes: Optional[str] = None
    lines: List[PurchaseOrderLineResponseSchema] = []
    supplier: Optional[SupplierResponseSchema] = None
    model_config = ConfigDict(from_attributes=True)
