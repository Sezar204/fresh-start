from fastapi import APIRouter
from app.api.v1.endpoints import (
    system, factories, master_data, sales, production, inventory,
    procurement, quality, maintenance, workforce, cost, kpis, alerts,
    decisions, reports, engines, corporate, import_export
)

api_router = APIRouter()

api_router.include_router(system.router,          prefix="/system",          tags=["System"])
api_router.include_router(factories.router,       prefix="/factories",       tags=["Factories"])
api_router.include_router(master_data.router,     prefix="/factories",       tags=["Master Data"])
api_router.include_router(sales.router,           prefix="/factories",       tags=["Sales"])
api_router.include_router(production.router,      prefix="/factories",       tags=["Production"])
api_router.include_router(inventory.router,       prefix="/factories",       tags=["Inventory"])
api_router.include_router(procurement.router,     prefix="/factories",       tags=["Procurement"])
api_router.include_router(quality.router,         prefix="/factories",       tags=["Quality"])
api_router.include_router(maintenance.router,     prefix="/factories",       tags=["Maintenance"])
api_router.include_router(workforce.router,       prefix="/factories",       tags=["Workforce"])
api_router.include_router(cost.router,            prefix="/factories",       tags=["Cost"])
api_router.include_router(kpis.router,            prefix="/factories",       tags=["KPIs"])
api_router.include_router(alerts.router,          prefix="/factories/alerts",tags=["Alerts"])
api_router.include_router(decisions.router,       prefix="/factories/decisions", tags=["Decisions"])
api_router.include_router(reports.router,         prefix="/factories",       tags=["Reports"])
api_router.include_router(engines.router,         prefix="/engines",         tags=["Engines"])
api_router.include_router(corporate.router,       prefix="/corporate",       tags=["Corporate"])
api_router.include_router(import_export.router,   prefix="/import",          tags=["Import"])
