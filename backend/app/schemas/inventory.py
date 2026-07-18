from typing import Optional
from pydantic import BaseModel, ConfigDict

class RawMaterialSchema(BaseModel):
    code: str
    name: str
    category: Optional[str] = None
    unit_of_measure: str = "kg"
    standard_cost: float = 0.0
    safety_stock_qty: float = 100.0
    reorder_point_qty: float = 150.0
    lead_time_days: int = 7
    shelf_life_days: Optional[int] = None
    storage_conditions: Optional[str] = None
    notes: Optional[str] = None

class RawMaterialResponseSchema(RawMaterialSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)
