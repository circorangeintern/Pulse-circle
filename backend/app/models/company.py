from sqlalchemy import Column, String, Boolean, Text
from app.models.base import BaseModel


class Company(BaseModel):
    __tablename__ = "companies"
    
    name = Column(String(200), nullable=False, index=True)
    logo_url = Column(String(500), nullable=True)
    location = Column(String(200), nullable=True)
    industry = Column(String(100), nullable=True)
    about = Column(Text, nullable=True)
    verified = Column(Boolean, default=False, nullable=False)
    
    def __repr__(self):
        return f"<Company {self.name}>"