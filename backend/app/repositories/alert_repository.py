from datetime import datetime
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.alert import Alert, Decision

class AlertRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_alerts(self, factory_id: int) -> List[Alert]:
        return list(self.db.scalars(select(Alert).where(Alert.factory_id == factory_id)).all())

    def mark_read(self, alert_id: int) -> Optional[Alert]:
        alert = self.db.get(Alert, alert_id)
        if alert:
            alert.is_read = True
            self.db.commit()
            self.db.refresh(alert)
        return alert

    def resolve_alert(self, alert_id: int) -> Optional[Alert]:
        alert = self.db.get(Alert, alert_id)
        if alert:
            alert.is_resolved = True
            alert.resolved_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(alert)
        return alert

    def get_pending_decisions(self, factory_id: int) -> List[Decision]:
        return list(
            self.db.scalars(
                select(Decision).where(Decision.factory_id == factory_id, Decision.status == "pending")
            ).all()
        )

    def approve_decision(self, decision_id: int, notes: Optional[str] = None) -> Optional[Decision]:
        dec = self.db.get(Decision, decision_id)
        if dec:
            dec.status = "approved"
            dec.decided_at = datetime.utcnow()
            dec.decision_notes = notes
            self.db.commit()
            self.db.refresh(dec)
        return dec

    def reject_decision(self, decision_id: int, notes: Optional[str] = None) -> Optional[Decision]:
        dec = self.db.get(Decision, decision_id)
        if dec:
            dec.status = "rejected"
            dec.decided_at = datetime.utcnow()
            dec.decision_notes = notes
            self.db.commit()
            self.db.refresh(dec)
        return dec
