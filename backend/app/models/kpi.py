from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class KPIDefinition(Base):
    __tablename__ = "kpi_definitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50), default="Production")
    formula: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    target_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    warning_threshold: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    critical_threshold: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    higher_is_better: Mapped[bool] = mapped_column(Boolean, default=True)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)
    display_format: Mapped[str] = mapped_column(String(20), default="number") # number, percentage, currency
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class KPIValue(Base):
    __tablename__ = "kpi_values"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kpi_id: Mapped[int] = mapped_column(Integer, index=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    period_type: Mapped[str] = mapped_column(String(20), default="daily") # daily, weekly, monthly
    period_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM-DD
    value: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(20), default="good") # good, warning, critical
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    trend_json: Mapped[dict] = mapped_column(JSON, default=list)
