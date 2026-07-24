from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin, get_current_recruiter
from app.models.company import Company
from app.models.review import Review
from app.models.job import Job
from app.models.user import User, UserRole
from app.schemas.company import (
    CompanyCreate, 
    CompanyUpdate, 
    CompanyResponse,
    CompanyVerifyRequest
)
from app.schemas.review import ReviewResponse

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/", response_model=List[CompanyResponse])
def get_companies(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    verified_only: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Get all companies with optional filters.
    """
    query = db.query(Company)
    
    # Filter by search term
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    
    # Filter by verification status
    if verified_only is not None:
        query = query.filter(Company.verified == verified_only)
    
    # Order by name
    query = query.order_by(Company.name)
    
    # Paginate
    companies = query.offset(skip).limit(limit).all()
    
    return companies


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get a specific company by ID.
    """
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    return company


@router.get("/{company_id}/reviews", response_model=List[ReviewResponse])
def get_company_reviews(
    company_id: UUID,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all reviews for a specific company.
    """
    # Check if company exists
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Get reviews
    reviews = db.query(Review).filter(
        Review.company_identifier == company_id
    ).order_by(Review.created_date.desc()).offset(skip).limit(limit).all()
    
    return reviews


@router.get("/{company_id}/average-rating")
def get_company_average_rating(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get the average rating for a company.
    """
    # Check if company exists
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Calculate average rating
    result = db.query(func.avg(Review.rating)).filter(
        Review.company_identifier == company_id
    ).first()
    
    avg_rating = float(result[0]) if result[0] is not None else 0.0
    
    # Count total reviews
    total_reviews = db.query(Review).filter(
        Review.company_identifier == company_id
    ).count()
    
    return {
        "company_id": company_id,
        "average_rating": round(avg_rating, 1),
        "total_reviews": total_reviews
    }


# --- ADMIN ONLY ENDPOINTS ---

@router.post("/", response_model=CompanyResponse)
def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new company. (Admin only)
    """
    # Check if company already exists
    existing = db.query(Company).filter(Company.name == company_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this name already exists"
        )
    
    # Create new company
    new_company = Company(
        name=company_data.name,
        logo_url=company_data.logo_url,
        location=company_data.location,
        industry=company_data.industry,
        about=company_data.about,
        verified=False,  # New companies start unverified
        created_by_identifier=current_user.identifier
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return new_company


@router.patch("/{company_id}/verify", response_model=CompanyResponse)
def verify_company(
    company_id: UUID,
    verify_data: CompanyVerifyRequest,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Verify or unverify a company. (Admin only)
    """
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    company.verified = verify_data.verified
    db.commit()
    db.refresh(company)
    
    return company


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update a company's details. (Admin only)
    """
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Update fields
    for field, value in company_data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    return company


@router.delete("/{company_id}")
def delete_company(
    company_id: UUID,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a company. (Admin only)
    """
    company = db.query(Company).filter(Company.identifier == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    db.delete(company)
    db.commit()
    
    return {"message": "Company deleted successfully"}


# ── RECRUITER ENDPOINTS ──────────────────────────────────────────────


@router.get("/my", response_model=CompanyResponse)
def get_my_company(
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """
    Get the company associated with the current recruiter. (Recruiter/Admin only)
    """
    if not current_user.company_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No company associated with your account"
        )
    
    company = db.query(Company).filter(
        Company.name == current_user.company_name
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return company


@router.patch("/my", response_model=CompanyResponse)
def update_my_company(
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """
    Update the recruiter's company profile. (Recruiter/Admin only)
    """
    if not current_user.company_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No company associated with your account"
        )
    
    company = db.query(Company).filter(
        Company.name == current_user.company_name
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    for field, value in company_data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    return company