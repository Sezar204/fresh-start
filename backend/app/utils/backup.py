import os
import shutil
import sqlite3
from datetime import datetime
from pathlib import Path
from sqlalchemy import select, desc
from app.core.config import settings, BACKUP_DIR, DB_PATH
from app.core.database import SessionLocal
from app.models.system import BackupLog

class BackupService:
    def __init__(self):
        self.backup_dir = BACKUP_DIR
        self.db_path = DB_PATH

    def create_backup(self, backup_type: str = "manual") -> dict:
        now_str = datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"emicp_backup_{now_str}_{backup_type}.db"
        dest_path = self.backup_dir / filename

        db = SessionLocal()
        try:
            # Native SQLite online backup API
            src_conn = sqlite3.connect(str(self.db_path))
            dest_conn = sqlite3.connect(str(dest_path))
            with dest_conn:
                src_conn.backup(dest_conn)
            dest_conn.close()
            src_conn.close()

            size_bytes = dest_path.stat().st_size if dest_path.exists() else 0

            log = BackupLog(
                filename=filename,
                backup_type=backup_type,
                file_size_bytes=size_bytes,
                file_path=str(dest_path),
                status="success"
            )
            db.add(log)
            db.commit()

            # Cleanup old backups
            self._cleanup_old_backups(db)

            return {
                "filename": filename,
                "backup_type": backup_type,
                "file_size_bytes": size_bytes,
                "created_at": datetime.utcnow().isoformat(),
                "status": "success",
                "file_path": str(dest_path)
            }
        except Exception as e:
            db.rollback()
            log = BackupLog(
                filename=filename,
                backup_type=backup_type,
                file_size_bytes=0,
                file_path=str(dest_path),
                status="failed"
            )
            db.add(log)
            db.commit()
            raise RuntimeError(f"Backup creation failed: {str(e)}")
        finally:
            db.close()

    def list_backups() -> list:
        db = SessionLocal()
        try:
            logs = db.scalars(select(BackupLog).order_by(desc(BackupLog.created_at))).all()
            result = []
            for l in logs:
                result.append({
                    "filename": l.filename,
                    "backup_type": l.backup_type,
                    "file_size_bytes": l.file_size_bytes,
                    "created_at": l.created_at.isoformat() if l.created_at else "",
                    "status": l.status,
                    "file_path": l.file_path
                })
            return result
        finally:
            db.close()

    def restore_backup(self, filename: str) -> bool:
        target_file = self.backup_dir / filename
        if not target_file.exists():
            raise FileNotFoundError(f"Backup file {filename} not found.")

        # Create safety backup first
        self.create_backup("safety_before_restore")

        # Replace database file
        shutil.copy2(target_file, self.db_path)
        return True

    def _cleanup_old_backups(self, db):
        keep_limit = settings.BACKUP_KEEP
        logs = db.scalars(
            select(BackupLog).order_by(desc(BackupLog.created_at))
        ).all()

        if len(logs) > keep_limit:
            to_remove = logs[keep_limit:]
            for l in to_remove:
                p = Path(l.file_path)
                if p.exists():
                    try:
                        p.unlink()
                    except Exception:
                        pass
                db.delete(l)
            db.commit()
