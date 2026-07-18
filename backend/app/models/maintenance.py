from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    machine_id: Mapped[int] = mapped_column(Integer, index=True)
    title: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(20), default="preventive") # preventive, predictive
    frequency_days: Mapped[int] = mapped_column(Integer, default=30)
    last_performed: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    next_due: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MaintenanceWorkOrder(Base):
    __tablename__ = "maintenance_work_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    machine_id: Mapped[int] = mapped_column(Integer, index=True)
    wo_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    type: Mapped[str] = mapped_column(String(20), default="preventive") # preventive, corrective, emergency
    status: Mapped[str] = mapped_column(String(20), default="created") # created, assigned, in_progress, completed, cancelled
    priority: Mapped[str] = mapped_column(String(20), default="medium") # low, medium, high, critical
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    started_at: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    completed_at: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    downtime_hours: Mapped[float] = mapped_column(Float, default=0.0)
    root_cause: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolution: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class MachineBreakdown(Base):
    __tablename__ = "machine_breakdowns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    machine_id: Mapped[int] = mapped_column(Integer, index=True)
    occurred_at: Mapped[str] = mapped_column(String(20))
    resolved_at: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    duration_hours: Mapped[float] = mapped_column(Float, default=0.0)
    cause_category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    impact_on_production: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    work_order_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
