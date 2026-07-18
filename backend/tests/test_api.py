import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data

def test_get_factories():
    response = client.get("/api/v1/factories/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1
    assert data["data"][0]["code"] == "CMP-01"

def test_get_corporate_overview():
    response = client.get("/api/v1/corporate/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "factories" in data["data"]
    assert "critical_alerts" in data["data"]
    assert "pending_decisions" in data["data"]

def test_run_engines():
    response = client.post("/api/v1/engines/run/all/1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_what_if_simulation():
    payload = {
        "scenario_type": "DEMAND_CHANGE",
        "parameters": {"pct_change": 25.0},
        "horizon_days": 30
    }
    response = client.post("/api/v1/engines/simulate/what-if/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["scenario"] == "DEMAND_CHANGE"
