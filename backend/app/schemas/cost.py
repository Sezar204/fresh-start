from typing import Optional
from pydantic import BaseModel, ConfigDict

class ProductCostSchema(BaseModel):
    product_id: int
    period_date: str
    std_material_cost: float = 0.0
    act_material_cost: float = 0.0
    std_labor_cost: float = 0.0
    act_labor_cost: float = 0.0
    std_overhead_cost: float = 0.0
    act_overhead_cost: float = 0.0
    revenue: float = 0.0

class ProductCostResponseSchema(ProductCostSchema):
    id: int
    factory_id: int
    std_total_cost: float
    act_total_cost: float
    variance_pct: float
    gross_margin_pct: float
    model_config = ConfigDict(from_attributes=True)
