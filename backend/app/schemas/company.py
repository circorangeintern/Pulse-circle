from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    logo_url: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    about: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    logo_url: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    about: Optional[str] = None


class CompanyResponse(CompanyBase):
    identifier: UUID
    verified: bool
    created_date: datetime
    updated_date: Optional[datetime]
    
    class Config:
        from_attributes = True


class CompanyVerifyRequest(BaseModel):
    verified: bool = True