from typing import Optional
from pydantic import BaseModel, ConfigDict

class SettingsUpdateSchema(BaseModel):
    settings: dict

class BackupInfoSchema(BaseModel):
    filename: str
    backup_type: str
    file_size_bytes: int
    created_at: str
    status: str
    file_path: str

    model_config = ConfigDict(from_attributes=True)
