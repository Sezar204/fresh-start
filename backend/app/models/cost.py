from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class ProductCost(Base):
    __tablename__ = "product_costs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    period_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM
    std_material_cost: Mapped[float] = mapped_column(Float, default=0.0)
    act_material_cost: Mapped[float] = mapped_column(Float, default=0.0)
    std_labor_cost: Mapped[float] = mapped_column(Float, default=0.0)
    act_labor_cost: Mapped[float] = mapped_column(Float, default=0.0)
    std_overhead_cost: Mapped[float] = mapped_column(Float, default=0.0)
    act_overhead_cost: Mapped[float] = mapped_column(Float, default=0.0)
    std_total_cost: Mapped[float] = mapped_column(Float, default=0.0)
    act_total_cost: Mapped[float] = mapped_column(Float, default=0.0)
    variance_pct: Mapped[float] = mapped_column(Float, default=0.0)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    gross_margin_pct: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
