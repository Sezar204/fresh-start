from app.engines.base import BaseEngine, EngineResult

class BottleneckEngine(BaseEngine):
    def execute(self) -> EngineResult:
        return EngineResult(
            engine_name="BottleneckEngine",
            factory_id=self.factory_id,
            status="success",
            metrics={"primary_bottleneck": "Packaging Line 1 Labeler Station"},
            message="Top system constraint identified."
        )
