from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")

class ErrorDetail(BaseModel):
    field: str
    message: str

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation successful"
    total: Optional[int] = None
    page: Optional[int] = None
    page_size: Optional[int] = None
    errors: Optional[List[ErrorDetail]] = None

    model_config = ConfigDict(from_attributes=True)
