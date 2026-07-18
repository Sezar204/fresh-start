from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.sales import SalesOrder, SalesOrderLine, DemandForecast

class SalesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_orders(self, factory_id: int) -> List[SalesOrder]:
        return list(self.db.scalars(select(SalesOrder).where(SalesOrder.factory_id == factory_id, SalesOrder.is_deleted == False)).all())

    def create_order(self, header_data: dict, lines_data: List[dict]) -> SalesOrder:
        order = SalesOrder(**header_data)
        self.db.add(order)
        self.db.flush()
        total = 0.0
        for ld in lines_data:
            ltotal = ld.get("quantity", 0) * ld.get("unit_price", 0) * (1 - ld.get("discount_pct", 0) / 100.0)
            line = SalesOrderLine(order_id=order.id, line_total=ltotal, **ld)
            self.db.add(line)
            total += ltotal
        order.total_value = total
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_forecasts(self, factory_id: int) -> List[DemandForecast]:
        return list(self.db.scalars(select(DemandForecast).where(DemandForecast.factory_id == factory_id)).all())
