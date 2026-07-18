from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ProductionLineSchema(BaseModel):
    code: str
    name: str
    type: str = "discrete"
    capacity_per_hour: float
    capacity_unit: str = "units"
    status: str = "active"
    changeover_minutes: int = 30
    notes: Optional[str] = None

class ProductionLineResponseSchema(ProductionLineSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)

class MachineSchema(BaseModel):
    code: str
    name: str
    line_id: Optional[int] = None
    type: Optional[str] = None
    capacity: Optional[float] = None
    capacity_unit: Optional[str] = None
    criticality: str = "medium"
    status: str = "active"
    purchase_date: Optional[str] = None
    warranty_expiry: Optional[str] = None
    notes: Optional[str] = None

class MachineResponseSchema(MachineSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)

class ShiftSchema(BaseModel):
    name: str
    start_time: str
    end_time: str
    break_minutes: int = 30
    days_of_week: List[int] = [1, 2, 3, 4, 5]
    headcount: int = 10
    is_active: bool = True

class ShiftResponseSchema(ShiftSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)
