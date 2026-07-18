from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class CustomerSchema(BaseModel):
    code: str
    name: str
    type: str = "b2b"
    priority: int = 3
    credit_limit: Optional[float] = None
    payment_terms_days: Optional[int] = 30
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    notes: Optional[str] = None

class CustomerResponseSchema(CustomerSchema):
    id: int
    factory_id: int
    model_config = ConfigDict(from_attributes=True)

class SalesOrderLineSchema(BaseModel):
    product_id: int
    quantity: float
    unit_price: float
    discount_pct: float = 0.0
    required_date: Optional[str] = None
    notes: Optional[str] = None

class SalesOrderLineResponseSchema(SalesOrderLineSchema):
    id: int
    order_id: int
    line_total: float
    status: str
    fulfilled_qty: float
    model_config = ConfigDict(from_attributes=True)

class SalesOrderSchema(BaseModel):
    customer_id: int
    order_number: str
    order_date: str
    required_delivery: str
    confirmed_delivery: Optional[str] = None
    status: str = "draft"
    total_value: float = 0.0
    currency: str = "USD"
    is_rush_order: bool = False
    priority: int = 3
    notes: Optional[str] = None
    lines: Optional[List[SalesOrderLineSchema]] = None

class SalesOrderResponseSchema(BaseModel):
    id: int
    factory_id: int
    customer_id: int
    order_number: str
    order_date: str
    required_delivery: str
    confirmed_delivery: Optional[str] = None
    status: str
    total_value: float
    currency: str
    is_rush_order: bool
    priority: int
    notes: Optional[str] = None
    lines: List[SalesOrderLineResponseSchema] = []
    customer: Optional[CustomerResponseSchema] = None
    model_config = ConfigDict(from_attributes=True)
