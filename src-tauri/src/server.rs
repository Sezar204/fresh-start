use std::process::{Command, Child};
use std::sync::Mutex;
use std::time::Duration;
use tokio::time::sleep;

static BACKEND: Mutex<Option<Child>> = Mutex::new(None);

pub fn start_backend() {
    let mut lock = BACKEND.lock().unwrap();
    if lock.is_none() {
        if let Ok(child) = Command::new("python").args(["backend/main.py"]).spawn() {
            *lock = Some(child);
        }
    }
}

pub fn stop_backend() {
    let mut lock = BACKEND.lock().unwrap();
    if let Some(mut child) = lock.take() {
        let _ = child.kill();
    }
}

pub async fn wait_for_backend() -> bool {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(2))
        .build()
        .unwrap();

    for _ in 0..15 {
        if let Ok(res) = client.get("http://127.0.0.1:37210/health").send().await {
            if res.status().is_success() {
                return true;
            }
        }
        sleep(Duration::from_millis(500)).await;
    }
    false
}
