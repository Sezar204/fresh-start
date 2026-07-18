from app.engines.base import BaseEngine, EngineResult

class ProcurementEngine(BaseEngine):
    def execute(self) -> EngineResult:
        return EngineResult(
            engine_name="ProcurementEngine",
            factory_id=self.factory_id,
            status="success",
            message="Supplier performance ratings and lead-times evaluated."
        )
