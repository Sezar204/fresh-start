from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Worker(Base):
    __tablename__ = "workers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    department: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    role: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    skills: Mapped[dict] = mapped_column(JSON, default=list) # ["Packaging", "Assembly"]
    status: Mapped[str] = mapped_column(String(20), default="active") # active, inactive, on_leave
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ShiftAssignment(Base):
    __tablename__ = "shift_assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    worker_id: Mapped[int] = mapped_column(Integer, index=True)
    shift_id: Mapped[int] = mapped_column(Integer, index=True)
    assignment_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM-DD
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    worker_id: Mapped[int] = mapped_column(Integer, index=True)
    record_date: Mapped[str] = mapped_column(String(10), index=True) # YYYY-MM-DD
    status: Mapped[str] = mapped_column(String(20), default="present") # present, absent, late, leave
    ot_hours: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
