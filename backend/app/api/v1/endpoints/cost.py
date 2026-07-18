from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.cost import ProductCost

router = APIRouter()

@router.get("/{factory_id}/product-costs")
def get_product_costs(factory_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(ProductCost).where(ProductCost.factory_id == factory_id)
    ).all()
    return {"success": True, "data": items, "total": len(items), "message": "Product costs fetched"}
