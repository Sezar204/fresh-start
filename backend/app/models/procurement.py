from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    contact_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    payment_terms_days: Mapped[Optional[int]] = mapped_column(Integer, default=30)
    rating: Mapped[int] = mapped_column(Integer, default=5) # 1..5
    status: Mapped[str] = mapped_column(String(20), default="active") # active, inactive, blacklisted
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SupplierMaterial(Base):
    __tablename__ = "supplier_materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    supplier_id: Mapped[int] = mapped_column(Integer, index=True)
    material_id: Mapped[int] = mapped_column(Integer, index=True)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=7)
    is_preferred: Mapped[bool] = mapped_column(Boolean, default=False)


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    po_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    order_date: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    expected_delivery: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    actual_delivery: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="planned") # planned, issued, confirmed, in_transit, received, closed, cancelled
    total_value: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lines: Mapped[List["PurchaseOrderLine"]] = relationship("PurchaseOrderLine", back_populates="po", cascade="all, delete-orphan")


class PurchaseOrderLine(Base):
    __tablename__ = "purchase_order_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    po_id: Mapped[int] = mapped_column(Integer, ForeignKey("purchase_orders.id"), index=True)
    material_id: Mapped[int] = mapped_column(Integer, index=True)
    qty_ordered: Mapped[float] = mapped_column(Float, default=0.0)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0)
    qty_received: Mapped[Optional[float]] = mapped_column(Float, default=0.0)
    quality_status: Mapped[str] = mapped_column(String(20), default="pending") # pending, accepted, rejected
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    po: Mapped["PurchaseOrder"] = relationship("PurchaseOrder", back_populates="lines")
