from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.factory import Factory, FactoryCalendar

class FactoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Factory]:
        return list(self.db.scalars(select(Factory).where(Factory.is_deleted == False)).all())

    def get_by_id(self, factory_id: int) -> Optional[Factory]:
        return self.db.scalar(
            select(Factory).where(Factory.id == factory_id, Factory.is_deleted == False)
        )

    def create(self, obj_in: dict) -> Factory:
        factory = Factory(**obj_in)
        self.db.add(factory)
        self.db.commit()
        self.db.refresh(factory)
        return factory

    def update(self, factory: Factory, obj_in: dict) -> Factory:
        for key, value in obj_in.items():
            if hasattr(factory, key) and value is not None:
                setattr(factory, key, value)
        self.db.commit()
        self.db.refresh(factory)
        return factory

    def soft_delete(self, factory: Factory) -> None:
        factory.is_deleted = True
        self.db.commit()

    def get_calendar(self, factory_id: int, month: str) -> List[FactoryCalendar]:
        return list(
            self.db.scalars(
                select(FactoryCalendar)
                .where(
                    FactoryCalendar.factory_id == factory_id,
                    FactoryCalendar.calendar_date.like(f"{month}%")
                )
            ).all()
        )

    def set_calendar_day(self, factory_id: int, date_str: str, is_working: bool, holiday_name: Optional[str] = None) -> FactoryCalendar:
        cal = self.db.scalar(
            select(FactoryCalendar).where(
                FactoryCalendar.factory_id == factory_id,
                FactoryCalendar.calendar_date == date_str
            )
        )
        if not cal:
            cal = FactoryCalendar(
                factory_id=factory_id,
                calendar_date=date_str,
                is_working_day=is_working,
                holiday_name=holiday_name
            )
            self.db.add(cal)
        else:
            cal.is_working_day = is_working
            cal.holiday_name = holiday_name
        self.db.commit()
        self.db.refresh(cal)
        return cal
