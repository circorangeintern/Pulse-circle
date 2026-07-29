from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.user import UserRole


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class RecruiterCreate(UserBase):
    password: str = Field(..., min_length=8)
    cac_number: str = Field(..., min_length=5, max_length=50, description="CAC registration number e.g. RC123456")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    identifier: UUID
    role: UserRole
    is_active: bool
    company_name: Optional[str] = None
    cac_number: Optional[str] = None
    created_date: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    company_name: Optional[str] = None
    cac_number: Optional[str] = None


class CACVerifyRequest(BaseModel):
    cac_number: str = Field(..., min_length=5, max_length=50)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse