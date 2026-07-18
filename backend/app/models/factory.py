from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Factory(Base):
    __tablename__ = "factories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(20), default="hybrid") # b2b, b2c, hybrid
    status: Mapped[str] = mapped_column(String(20), default="active") # active, inactive, maintenance
    location: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    working_start: Mapped[str] = mapped_column(String(10), default="08:00")
    working_end: Mapped[str] = mapped_column(String(10), default="17:00")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FactoryCalendar(Base):
    __tablename__ = "factory_calendars"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    calendar_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM-DD
    is_working_day: Mapped[bool] = mapped_column(Boolean, default=True)
    holiday_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
