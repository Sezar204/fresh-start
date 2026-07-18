from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class KPIDefinitionSchema(BaseModel):
    code: str
    name: str
    category: str = "Production"
    formula: Optional[str] = None
    unit: Optional[str] = None
    target_value: Optional[float] = None
    warning_threshold: Optional[float] = None
    critical_threshold: Optional[float] = None
    higher_is_better: bool = True
    display_format: str = "number"

class KPIDefinitionResponseSchema(KPIDefinitionSchema):
    id: int
    factory_id: Optional[int] = None
    is_custom: bool = False
    is_active: bool = True
    model_config = ConfigDict(from_attributes=True)

class KPIValueResponseSchema(BaseModel):
    id: int
    kpi_id: int
    factory_id: int
    period_type: str
    period_date: str
    value: float
    status: str
    calculated_at: str
    kpi: Optional[KPIDefinitionResponseSchema] = None
    trend: List[float] = []
    model_config = ConfigDict(from_attributes=True)
