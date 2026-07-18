from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/{factory_id}/library")
def get_report_library(factory_id: int):
    reports = [
        {"id": 1, "title": "Daily Production Summary", "category": "Production", "description": "Output and plan adherence per line for today."},
        {"id": 2, "title": "Weekly Performance Report", "category": "Executive", "description": "Consolidated weekly KPIs, downtime, and output summary."},
        {"id": 3, "title": "Monthly Executive Summary", "category": "Executive", "description": "High-level overview of factory capacity, revenue, and quality."},
        {"id": 4, "title": "Inventory Status Report", "category": "Inventory", "description": "Raw material stock, safety thresholds, and critical items."},
        {"id": 5, "title": "Supplier Performance Report", "category": "Procurement", "description": "On-time delivery % and defect rates per supplier."},
        {"id": 6, "title": "Quality Summary Report", "category": "Quality", "description": "First pass yield (FPY) and open NCR / CAPA status."},
        {"id": 7, "title": "Maintenance Status Report", "category": "Maintenance", "description": "Overdue PMs, breakdown durations, MTBF/MTTR metrics."},
        {"id": 8, "title": "Cost Analysis Report", "category": "Finance", "description": "Standard vs actual cost variances and product gross margins."},
    ]
    return {"success": True, "data": reports, "total": len(reports), "message": "Report library fetched"}

@router.post("/{factory_id}/generate")
def generate_report(factory_id: int, body: dict):
    report_id = body.get("report_id", 1)
    preview_rows = [
        {"item": "Line 1 Packaging", "planned": 4000, "actual": 3850, "adherence": "96.2%"},
        {"item": "Line 2 Assembly", "planned": 1600, "actual": 1520, "adherence": "95.0%"},
        {"item": "Line 3 Processing", "planned": 8000, "actual": 8100, "adherence": "101.2%"},
    ]
    return {
        "success": True,
        "data": {
            "report_id": report_id,
            "preview": preview_rows,
            "generated_at": "2026-07-18 18:00:00"
        },
        "message": "Report generated"
    }
