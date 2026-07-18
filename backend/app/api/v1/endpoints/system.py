from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db, check_integrity
from app.services.system_service import SystemService
from app.utils.backup import BackupService

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@router.get("/info")
def get_info(db: Session = Depends(get_db)):
    svc = SystemService(db)
    return {"success": True, "data": svc.get_system_info(), "message": "System info fetched"}

@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    svc = SystemService(db)
    return {"success": True, "data": svc.get_settings(), "message": "Settings fetched"}

@router.put("/settings")
def update_settings(body: dict, db: Session = Depends(get_db)):
    svc = SystemService(db)
    updated = svc.update_settings(body)
    return {"success": True, "data": updated, "message": "Settings updated"}

@router.post("/backup/now")
def backup_now():
    svc = BackupService()
    info = svc.create_backup("manual")
    return {"success": True, "data": info, "message": "Backup created successfully"}

@router.get("/backup/list")
def list_backups():
    svc = BackupService()
    backups = svc.list_backups()
    return {"success": True, "data": backups, "message": "Backups fetched"}

@router.post("/backup/restore/{filename}")
def restore_backup(filename: str):
    svc = BackupService()
    success = svc.restore_backup(filename)
    return {"success": success, "data": None, "message": f"Restored {filename}"}

@router.get("/integrity-check")
def integrity_check():
    res = check_integrity()
    return {"success": res["status"] == "ok", "data": res, "message": "Integrity check complete"}
