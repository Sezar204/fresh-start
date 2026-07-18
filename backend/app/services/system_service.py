import os
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.system import AppSetting
from app.core.config import DB_PATH

class SystemService:
    def __init__(self, db: Session):
        self.db = db

    def get_settings(self) -> dict:
        rows = self.db.scalars(select(AppSetting)).all()
        return {r.key: r.value for r in rows}

    def update_settings(self, settings_dict: dict) -> dict:
        for k, v in settings_dict.items():
            s = self.db.get(AppSetting, k)
            if not s:
                s = AppSetting(key=k, value=str(v))
                self.db.add(s)
            else:
                s.value = str(v)
        self.db.commit()
        return self.get_settings()

    def get_system_info(self) -> dict:
        db_size = DB_PATH.stat().st_size if DB_PATH.exists() else 0
        return {
            "os": os.name,
            "version": "1.0.0",
            "db_path": str(DB_PATH),
            "db_size_bytes": db_size,
        }
