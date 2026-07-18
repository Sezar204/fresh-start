from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class QualityCheck(Base):
    __tablename__ = "quality_checks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    check_type: Mapped[str] = mapped_column(String(20), default="ipqc") # iqc, ipqc, oqc
    reference_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    reference_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    product_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    material_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending") # pending, passed, failed, on_hold
    checked_at: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    sample_size: Mapped[int] = mapped_column(Integer, default=100)
    defects_found: Mapped[int] = mapped_column(Integer, default=0)
    defect_rate_pct: Mapped[float] = mapped_column(Float, default=0.0)
    decision: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class NonConformanceReport(Base):
    __tablename__ = "non_conformance_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    ncr_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    severity: Mapped[str] = mapped_column(String(20), default="warning") # info, warning, critical, emergency
    quality_check_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="open") # open, investigating, resolved, closed
    root_cause: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    opened_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class CAPARecord(Base):
    __tablename__ = "capa_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    factory_id: Mapped[int] = mapped_column(Integer, index=True)
    capa_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    type: Mapped[str] = mapped_column(String(20), default="corrective") # corrective, preventive
    ncr_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(Text)
    responsible_person: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    due_date: Mapped[str] = mapped_column(String(10)) # YYYY-MM-DD
    status: Mapped[str] = mapped_column(String(20), default="open") # open, in_progress, implemented, closed
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
