import logging
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import text
from app.utils.backup import BackupService
from app.core.database import SessionLocal, engine

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()

def scheduled_daily_backup():
    try:
        logger.info("[Scheduler] Starting daily automatic backup...")
        svc = BackupService()
        res = svc.create_backup("auto")
        logger.info(f"[Scheduler] Daily backup complete: {res['filename']}")
    except Exception as e:
        logger.error(f"[Scheduler] Daily backup failed: {e}")

def scheduled_weekly_vacuum():
    try:
        logger.info("[Scheduler] Executing weekly database maintenance (VACUUM + ANALYZE)...")
        with engine.connect() as conn:
            conn.execute(text("VACUUM"))
            conn.execute(text("ANALYZE"))
        logger.info("[Scheduler] Weekly database maintenance finished.")
    except Exception as e:
        logger.error(f"[Scheduler] Maintenance failed: {e}")

def start_scheduler():
    if not scheduler.running:
        # Daily backup at 23:00
        scheduler.add_job(
            scheduled_daily_backup,
            trigger="cron",
            hour=23,
            minute=0,
            id="daily_backup_job",
            replace_existing=True
        )
        # Weekly VACUUM on Sunday at 02:00
        scheduler.add_job(
            scheduled_weekly_vacuum,
            trigger="cron",
            day_of_week="sun",
            hour=2,
            minute=0,
            id="weekly_vacuum_job",
            replace_existing=True
        )
        scheduler.start()
        logger.info("[Scheduler] Background job scheduler started.")
