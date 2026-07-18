from typing import Optional
from pydantic import BaseModel, ConfigDict

class MaintenanceWorkOrderSchema(BaseModel):
    machine_id: int
    type: str = "preventive"
    priority: str = "medium"
    description: Optional[str] = None
    assigned_to: Optional[str] = None

class MaintenanceWorkOrderResponseSchema(MaintenanceWorkOrderSchema):
    id: int
    factory_id: int
    wo_number: str
    status: str
    downtime_hours: float
    model_config = ConfigDict(from_attributes=True)
