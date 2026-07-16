from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin
from app.models.job import Job, JobType
from app.models.company import Company
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=List[JobResponse])
def get_jobs(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    job_type: Optional[JobType] = None,
    location: Optional[str] = None,
    company_id: Optional[UUID] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Get all job listings with optional filters.
    """
    query = db.query(Job).options(joinedload(Job.company))
    
    # Filter by search term (title or company name)
    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) |
            (Job.company.has(Company.name.ilike(f"%{search}%")))
        )
    
    # Filter by job type
    if job_type:
        query = query.filter(Job.job_type == job_type)
    
    # Filter by location
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    
    # Filter by company
    if company_id:
        query = query.filter(Job.company_identifier == company_id)
    
    # Filter to only verified companies
    if verified_only:
        query = query.filter(Job.company.has(Company.verified == True))
    
    # Order by newest first
    query = query.order_by(Job.created_date.desc())
    
    # Paginate
    jobs = query.offset(skip).limit(limit).all()
    
    return jobs


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get a specific job by ID.
    """
    job = db.query(Job).options(joinedload(Job.company)).filter(
        Job.identifier == job_id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


@router.post("/", response_model=JobResponse)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new job listing. (Admin only)
    """
    # Verify company exists
    company = db.query(Company).filter(
        Company.identifier == job_data.company_identifier
    ).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Create new job
    new_job = Job(
        title=job_data.title,
        company_identifier=job_data.company_identifier,
        location=job_data.location,
        job_type=job_data.job_type,
        description=job_data.description,
        created_by_identifier=current_user.identifier
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    # Refresh to load company relationship
    job = db.query(Job).options(joinedload(Job.company)).filter(
        Job.identifier == new_job.identifier
    ).first()
    
    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: UUID,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update a job listing. (Admin only)
    """
    job = db.query(Job).filter(Job.identifier == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Update fields
    for field, value in job_data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    
    # Refresh to load company relationship
    job = db.query(Job).options(joinedload(Job.company)).filter(
        Job.identifier == job_id
    ).first()
    
    return job


@router.delete("/{job_id}")
def delete_job(
    job_id: UUID,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a job listing. (Admin only)
    """
    job = db.query(Job).filter(Job.identifier == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    db.delete(job)
    db.commit()
    
    return {"message": "Job deleted successfully"}