from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class WorkerSchema(BaseModel):
    employee_id: str
    name: str
    department: Optional[str] = None
    role: Optional[str] = None
    skills: List[str] = []
    status: str = "active"
    notes: Optional[str] = None

class WorkerResponseSchema(WorkerSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)
