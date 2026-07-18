from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class RawMaterial(Base):
    __tablename__ = "raw_materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="kg")
    standard_cost: Mapped[float] = mapped_column(Float, default=0.0)
    safety_stock_qty: Mapped[float] = mapped_column(Float, default=100.0)
    reorder_point_qty: Mapped[float] = mapped_column(Float, default=150.0)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=7)
    shelf_life_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    storage_conditions: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class InventoryRawMaterial(Base):
    __tablename__ = "inventory_raw_materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    material_id: Mapped[int] = mapped_column(Integer, index=True)
    warehouse_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    qty_on_hand: Mapped[float] = mapped_column(Float, default=0.0)
    qty_reserved: Mapped[float] = mapped_column(Float, default=0.0)
    qty_available: Mapped[float] = mapped_column(Float, default=0.0)
    batch_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expiry_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class InventoryFinishedGoods(Base):
    __tablename__ = "inventory_finished_goods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    warehouse_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    qty_on_hand: Mapped[float] = mapped_column(Float, default=0.0)
    qty_reserved: Mapped[float] = mapped_column(Float, default=0.0)
    qty_available: Mapped[float] = mapped_column(Float, default=0.0)
    batch_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expiry_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class InventoryWIP(Base):
    __tablename__ = "inventory_wip"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    order_id: Mapped[int] = mapped_column(Integer, index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    line_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    quantity: Mapped[float] = mapped_column(Float, default=0.0)
    stage: Mapped[str] = mapped_column(String(50), default="In Progress")
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
