from typing import Optional
from pydantic import BaseModel, ConfigDict

class WarehouseSchema(BaseModel):
    code: str
    name: str
    type: str = "general"
    total_capacity: float = 1000.0
    capacity_unit: str = "sqm"
    storage_conditions: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class WarehouseResponseSchema(WarehouseSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)
