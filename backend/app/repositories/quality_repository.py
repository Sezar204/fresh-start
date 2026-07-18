from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.quality import QualityCheck, NonConformanceReport, CAPARecord

class QualityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_checks(self, factory_id: int) -> List[QualityCheck]:
        return list(self.db.scalars(select(QualityCheck).where(QualityCheck.factory_id == factory_id)).all())

    def create_check(self, data: dict) -> QualityCheck:
        sample = data.get("sample_size", 100)
        defects = data.get("defects_found", 0)
        rate = (defects / sample * 100.0) if sample > 0 else 0.0
        status = "passed" if defects == 0 else "failed"
        qc = QualityCheck(defect_rate_pct=rate, status=status, **data)
        self.db.add(qc)
        self.db.commit()
        self.db.refresh(qc)
        return qc

    def get_ncrs(self, factory_id: int) -> List[NonConformanceReport]:
        return list(self.db.scalars(select(NonConformanceReport).where(NonConformanceReport.factory_id == factory_id)).all())

    def create_ncr(self, data: dict) -> NonConformanceReport:
        ncr = NonConformanceReport(**data)
        self.db.add(ncr)
        self.db.commit()
        self.db.refresh(ncr)
        return ncr

    def get_capas(self, factory_id: int) -> List[CAPARecord]:
        return list(self.db.scalars(select(CAPARecord).where(CAPARecord.factory_id == factory_id)).all())

    def create_capa(self, data: dict) -> CAPARecord:
        capa = CAPARecord(**data)
        self.db.add(capa)
        self.db.commit()
        self.db.refresh(capa)
        return capa
