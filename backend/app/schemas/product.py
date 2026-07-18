from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ProductSchema(BaseModel):
    sku: str
    name: str
    category: Optional[str] = None
    unit_of_measure: str = "pcs"
    standard_cost: float = 0.0
    selling_price: float = 0.0
    min_order_qty: float = 1.0
    lead_time_days: int = 1
    shelf_life_days: Optional[int] = None
    type: str = "finished"
    notes: Optional[str] = None

class ProductResponseSchema(ProductSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)

class BOMLineSchema(BaseModel):
    material_id: int
    quantity_required: float
    unit: str = "kg"
    loss_factor_pct: float = 0.0
    is_alternative: bool = False
    alt_material_id: Optional[int] = None
    sequence_no: int = 1
    notes: Optional[str] = None

class BOMLineResponseSchema(BOMLineSchema):
    id: int
    bom_id: int
    material_name: Optional[str] = None
    material_code: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class BOMHeaderSchema(BaseModel):
    product_id: int
    version: str = "1.0"
    name: str
    status: str = "active"
    yield_pct: float = 100.0
    effective_date: Optional[str] = None
    notes: Optional[str] = None
    lines: Optional[List[BOMLineSchema]] = None

class BOMHeaderResponseSchema(BaseModel):
    id: int
    factory_id: int
    product_id: int
    version: str
    name: str
    status: str
    yield_pct: float
    effective_date: Optional[str] = None
    notes: Optional[str] = None
    lines: List[BOMLineResponseSchema] = []
    model_config = ConfigDict(from_attributes=True)
