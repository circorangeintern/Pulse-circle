from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.job import JobType
from app.schemas.company import CompanyResponse


class JobBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    description: Optional[str] = None


class JobCreate(JobBase):
    company_identifier: UUID


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    description: Optional[str] = None


class JobResponse(JobBase):
    identifier: UUID
    company_identifier: UUID
    company: CompanyResponse  
    created_date: datetime
    updated_date: Optional[datetime]
    
    class Config:
        from_attributes = True