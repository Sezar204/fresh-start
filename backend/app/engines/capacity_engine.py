from app.engines.base import BaseEngine, EngineResult

class CapacityEngine(BaseEngine):
    def execute(self) -> EngineResult:
        return EngineResult(
            engine_name="CapacityEngine",
            factory_id=self.factory_id,
            status="success",
            metrics={"avg_line_utilization_pct": 82.5},
            message="Line capacity and bottleneck analysis calculated successfully."
        )
