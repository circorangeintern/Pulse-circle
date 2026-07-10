from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid


class BaseModel(Base):
    __abstract__ = True
    
    identifier = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    created_date = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_date = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True
    )
    created_by_identifier = Column(
        UUID(as_uuid=True),
        nullable=True,
        index=True
    )