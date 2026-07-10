from sqlalchemy import Column, String, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum


class JobType(str, enum.Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"
    REMOTE = "Remote"


class Job(BaseModel):
    __tablename__ = "jobs"
    
    title = Column(String(200), nullable=False)
    company_identifier = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.identifier", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    location = Column(String(200), nullable=True)
    job_type = Column(Enum(JobType), nullable=True)
    description = Column(Text, nullable=True)
    
    # Relationships
    company = relationship("Company", backref="jobs")
    
    def __repr__(self):
        return f"<Job {self.title}>"