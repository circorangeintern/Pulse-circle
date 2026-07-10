from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.report import ReportReason, ReportStatus


class ReportBase(BaseModel):
    reason: ReportReason
    explanation: Optional[str] = None


class ReportCreate(ReportBase):
    job_identifier: UUID


class ReportUpdate(BaseModel):
    status: ReportStatus


class ReportResponse(ReportBase):
    identifier: UUID
    job_identifier: UUID
    status: ReportStatus
    created_date: datetime
    created_by_identifier: UUID
    
    class Config:
        from_attributes = True