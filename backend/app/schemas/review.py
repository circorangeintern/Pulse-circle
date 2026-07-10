from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    company_identifier: UUID


class ReviewResponse(ReviewBase):
    identifier: UUID
    company_identifier: UUID
    created_by_identifier: UUID
    created_date: datetime
    
    class Config:
        from_attributes = True