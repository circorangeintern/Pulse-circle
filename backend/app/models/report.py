from sqlalchemy import Column, String, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum


class ReportReason(str, enum.Enum):
    SCAM = "Scam"
    FAKE_COMPANY = "Fake company"
    SUSPICIOUS_CONTACT = "Suspicious contact"
    TOO_EXPENSIVE = "Too expensive"


class ReportStatus(str, enum.Enum):
    PENDING = "Pending"
    REVIEWED = "Reviewed"
    RESOLVED = "Resolved"


class Report(BaseModel):
    __tablename__ = "reports"
    
    reason = Column(Enum(ReportReason), nullable=False)
    explanation = Column(Text, nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    job_identifier = Column(
        UUID(as_uuid=True),
        ForeignKey("jobs.identifier", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationship
    job = relationship("Job", backref="reports")
    
    def __repr__(self):
        return f"<Report {self.reason} for Job {self.job_identifier}>"