from dataclasses import dataclass
from typing import List, Dict, Any
from sqlalchemy.orm import Session

@dataclass
class EngineResult:
    engine_name: str
    factory_id: int
    status: str # success, warning, error
    alerts_generated: int = 0
    decisions_generated: int = 0
    metrics: Dict[str, Any] = None
    message: str = ""

class BaseEngine:
    def __init__(self, db: Session, factory_id: int):
        self.db = db
        self.factory_id = factory_id

    def execute(self) -> EngineResult:
        raise NotImplementedError("Engine subclasses must implement execute()")
