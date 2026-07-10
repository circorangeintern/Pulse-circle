from sqlalchemy import Column, Integer, Text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Review(BaseModel):
    __tablename__ = "reviews"
    
    rating = Column(Integer, nullable=False)  # This is to attach rating to a review made by a user
    comment = Column(Text, nullable=True)
    company_identifier = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.identifier", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    company = relationship("Company", backref="reviews")
    
    # Only one user can review a company
    __table_args__ = (
        UniqueConstraint(
            'created_by_identifier',
            'company_identifier',
            name='unique_user_company_review'
        ),
    )
    
    def __repr__(self):
        return f"<Review {self.rating} stars for {self.company_identifier}>"