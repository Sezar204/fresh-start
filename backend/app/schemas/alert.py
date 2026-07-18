from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class AlertResponseSchema(BaseModel):
    id: int
    factory_id: int
    alert_type: str
    severity: str
    title: str
    message: Optional[str] = None
    source_module: Optional[str] = None
    source_id: Optional[int] = None
    is_read: bool
    is_resolved: bool
    created_at: str
    resolved_at: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class DecisionResponseSchema(BaseModel):
    id: int
    factory_id: int
    decision_type: str
    title: str
    description: Optional[str] = None
    recommendation: Optional[str] = None
    impact_summary: dict = {}
    status: str
    priority: str
    created_at: str
    decided_at: Optional[str] = None
    decision_notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
