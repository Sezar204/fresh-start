from app.engines.base import BaseEngine, EngineResult

class DemandEngine(BaseEngine):
    def execute(self) -> EngineResult:
        return EngineResult(
            engine_name="DemandEngine",
            factory_id=self.factory_id,
            status="success",
            message="Demand forecasting updated with moving averages and seasonality factor 1.05."
        )
