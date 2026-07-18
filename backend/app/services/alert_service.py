from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.alert_repository import AlertRepository

class AlertService:
    def __init__(self, db: Session):
        self.repo = AlertRepository(db)

    def get_alerts(self, factory_id: int):
        return self.repo.get_alerts(factory_id)

    def mark_read(self, alert_id: int):
        return self.repo.mark_read(alert_id)

    def resolve_alert(self, alert_id: int):
        return self.repo.resolve_alert(alert_id)

    def get_pending_decisions(self, factory_id: int):
        return self.repo.get_pending_decisions(factory_id)

    def approve_decision(self, decision_id: int, notes: Optional[str] = None):
        return self.repo.approve_decision(decision_id, notes)

    def reject_decision(self, decision_id: int, notes: Optional[str] = None):
        return self.repo.reject_decision(decision_id, notes)
