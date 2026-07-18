from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class ProductionLine(Base):
    __tablename__ = "production_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(30), default="discrete") # discrete, process, batch
    capacity_per_hour: Mapped[float] = mapped_column(Float, default=100.0)
    capacity_unit: Mapped[str] = mapped_column(String(20), default="units")
    status: Mapped[str] = mapped_column(String(20), default="active") # active, idle, maintenance, down
    changeover_minutes: Mapped[int] = mapped_column(Integer, default=30)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    line_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    capacity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    capacity_unit: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    criticality: Mapped[str] = mapped_column(String(20), default="medium") # low, medium, high, critical
    status: Mapped[str] = mapped_column(String(20), default="active") # active, idle, maintenance, down
    purchase_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    warranty_expiry: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Shift(Base):
    __tablename__ = "shifts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    name: Mapped[str] = mapped_column(String(50))
    start_time: Mapped[str] = mapped_column(String(10)) # HH:MM
    end_time: Mapped[str] = mapped_column(String(10)) # HH:MM
    break_minutes: Mapped[int] = mapped_column(Integer, default=30)
    days_of_week: Mapped[dict] = mapped_column(JSON, default=lambda: [1, 2, 3, 4, 5]) # Mon=1..Sun=7
    headcount: Mapped[int] = mapped_column(Integer, default=10)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProductionOrder(Base):
    __tablename__ = "production_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    line_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    sales_order_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    planned_qty: Mapped[float] = mapped_column(Float, default=0.0)
    actual_qty: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(20), default="planned") # planned, in_progress, completed, cancelled
    scheduled_start: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    scheduled_end: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    actual_start: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    actual_end: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    adherence_pct: Mapped[float] = mapped_column(Float, default=100.0)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
