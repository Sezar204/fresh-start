from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    sku: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="pcs")
    standard_cost: Mapped[float] = mapped_column(Float, default=0.0)
    selling_price: Mapped[float] = mapped_column(Float, default=0.0)
    min_order_qty: Mapped[float] = mapped_column(Float, default=1.0)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=1)
    shelf_life_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    type: Mapped[str] = mapped_column(String(20), default="finished") # finished, semi-finished
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BOMHeader(Base):
    __tablename__ = "bom_headers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), index=True)
    version: Mapped[str] = mapped_column(String(20), default="1.0")
    name: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="active") # active, inactive, draft
    yield_pct: Mapped[float] = mapped_column(Float, default=100.0)
    effective_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lines: Mapped[List["BOMLine"]] = relationship("BOMLine", back_populates="header", cascade="all, delete-orphan")


class BOMLine(Base):
    __tablename__ = "bom_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bom_id: Mapped[int] = mapped_column(Integer, ForeignKey("bom_headers.id"), index=True)
    material_id: Mapped[int] = mapped_column(Integer, index=True)
    quantity_required: Mapped[float] = mapped_column(Float, default=1.0)
    unit: Mapped[str] = mapped_column(String(20), default="kg")
    loss_factor_pct: Mapped[float] = mapped_column(Float, default=0.0)
    is_alternative: Mapped[bool] = mapped_column(Boolean, default=False)
    alt_material_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sequence_no: Mapped[int] = mapped_column(Integer, default=1)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    header: Mapped["BOMHeader"] = relationship("BOMHeader", back_populates="lines")
