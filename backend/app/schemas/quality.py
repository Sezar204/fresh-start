from typing import Optional
from pydantic import BaseModel, ConfigDict

class QualityCheckSchema(BaseModel):
    check_type: str = "ipqc"
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None
    product_id: Optional[int] = None
    material_id: Optional[int] = None
    sample_size: int = 100
    defects_found: int = 0
    decision: Optional[str] = None
    notes: Optional[str] = None

class QualityCheckResponseSchema(QualityCheckSchema):
    id: int
    factory_id: int
    defect_rate_pct: float
    status: str
    checked_at: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
