from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    name: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(20), default="b2b") # b2b, b2c, distributor
    priority: Mapped[int] = mapped_column(Integer, default=3) # 1..5
    credit_limit: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    payment_terms_days: Mapped[Optional[int]] = mapped_column(Integer, default=30)
    contact_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("customers.id"), index=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    order_date: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    required_delivery: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    confirmed_delivery: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="draft")
    total_value: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    is_rush_order: Mapped[bool] = mapped_column(Boolean, default=False)
    priority: Mapped[int] = mapped_column(Integer, default=3)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lines: Mapped[List["SalesOrderLine"]] = relationship("SalesOrderLine", back_populates="order", cascade="all, delete-orphan")


class SalesOrderLine(Base):
    __tablename__ = "sales_order_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("sales_orders.id"), index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    quantity: Mapped[float] = mapped_column(Float, default=1.0)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0)
    discount_pct: Mapped[float] = mapped_column(Float, default=0.0)
    line_total: Mapped[float] = mapped_column(Float, default=0.0)
    required_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    committed_date: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    fulfilled_qty: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    order: Mapped["SalesOrder"] = relationship("SalesOrder", back_populates="lines")


class DemandForecast(Base):
    __tablename__ = "demand_forecasts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    product_id: Mapped[int] = mapped_column(Integer, index=True)
    period_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM-DD
    historical_qty: Mapped[float] = mapped_column(Float, default=0.0)
    system_forecast: Mapped[float] = mapped_column(Float, default=0.0)
    manual_adjusted: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    final_forecast: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
