from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.review import Review
from app.models.company import Company
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit a review for a company. (Authenticated users only)
    """
    # Verify company exists
    company = db.query(Company).filter(
        Company.identifier == review_data.company_identifier
    ).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Check if user already reviewed this company
    existing_review = db.query(Review).filter(
        Review.company_identifier == review_data.company_identifier,
        Review.created_by_identifier == current_user.identifier
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this company"
        )
    
    # Create new review
    new_review = Review(
        rating=review_data.rating,
        comment=review_data.comment,
        company_identifier=review_data.company_identifier,
        created_by_identifier=current_user.identifier
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return new_review


@router.get("/my-reviews", response_model=List[ReviewResponse])
def get_my_reviews(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reviews submitted by the current user.
    """
    reviews = db.query(Review).filter(
        Review.created_by_identifier == current_user.identifier
    ).order_by(Review.created_date.desc()).offset(skip).limit(limit).all()
    
    return reviews