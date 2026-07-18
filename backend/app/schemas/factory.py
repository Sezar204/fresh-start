from typing import Optional
from pydantic import BaseModel, ConfigDict

class FactoryCreateSchema(BaseModel):
    code: str
    name: str
    type: str = "hybrid"
    status: str = "active"
    location: Optional[str] = None
    currency: str = "USD"
    timezone: str = "UTC"
    working_start: str = "08:00"
    working_end: str = "17:00"
    notes: Optional[str] = None

class FactoryUpdateSchema(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    working_start: Optional[str] = None
    working_end: Optional[str] = None
    notes: Optional[str] = None

class FactoryResponseSchema(BaseModel):
    id: int
    code: str
    name: str
    type: str
    status: str
    location: Optional[str] = None
    currency: str
    timezone: str
    working_start: str
    working_end: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
