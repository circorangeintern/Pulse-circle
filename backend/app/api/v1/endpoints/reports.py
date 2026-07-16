from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID
from sqlalchemy import func

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin
from app.models.report import Report, ReportStatus, ReportReason
from app.models.job import Job
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a suspicious job posting. (Authenticated users only)
    """
    # Verify job exists
    job = db.query(Job).filter(Job.identifier == report_data.job_identifier).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if user has already reported this job
    existing_report = db.query(Report).filter(
        Report.job_identifier == report_data.job_identifier,
        Report.created_by_identifier == current_user.identifier,
        Report.status != ReportStatus.RESOLVED  # Allow re-reporting if resolved
    ).first()
    
    if existing_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reported this job. Please wait for review."
        )
    
    # Create new report
    new_report = Report(
        reason=report_data.reason,
        explanation=report_data.explanation,
        job_identifier=report_data.job_identifier,
        created_by_identifier=current_user.identifier,
        status=ReportStatus.PENDING
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report


@router.get("/my-reports", response_model=List[ReportResponse])
def get_my_reports(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reports submitted by the current user.
    """
    reports = db.query(Report).filter(
        Report.created_by_identifier == current_user.identifier
    ).order_by(Report.created_date.desc()).offset(skip).limit(limit).all()
    
    return reports


# --- ADMIN ONLY ENDPOINTS ---

@router.get("/admin/pending", response_model=List[ReportResponse])
def get_pending_reports(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all pending reports for admin review.
    """
    reports = db.query(Report).options(joinedload(Report.job)).filter(
        Report.status == ReportStatus.PENDING
    ).order_by(Report.created_date.desc()).offset(skip).limit(limit).all()
    
    return reports


@router.get("/admin/all", response_model=List[ReportResponse])
def get_all_reports(
    status: Optional[ReportStatus] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all reports with optional status filter. (Admin only)
    """
    query = db.query(Report).options(joinedload(Report.job))
    
    if status:
        query = query.filter(Report.status == status)
    
    reports = query.order_by(Report.created_date.desc()).offset(skip).limit(limit).all()
    
    return reports


@router.patch("/admin/{report_id}", response_model=ReportResponse)
def update_report_status(
    report_id: UUID,
    update_data: ReportUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update the status of a report (Pending → Reviewed/Resolved). (Admin only)
    """
    report = db.query(Report).filter(Report.identifier == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Update status
    report.status = update_data.status
    db.commit()
    db.refresh(report)
    
    return report


@router.get("/admin/stats")
def get_report_stats(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get report statistics for the admin dashboard.
    """
    total = db.query(Report).count()
    pending = db.query(Report).filter(Report.status == ReportStatus.PENDING).count()
    reviewed = db.query(Report).filter(Report.status == ReportStatus.REVIEWED).count()
    resolved = db.query(Report).filter(Report.status == ReportStatus.RESOLVED).count()
    
    # Reports by reason
    reason_counts = db.query(
        Report.reason,
        func.count(Report.identifier).label('count')
    ).group_by(Report.reason).all()
    
    return {
        "total": total,
        "pending": pending,
        "reviewed": reviewed,
        "resolved": resolved,
        "by_reason": [{"reason": r[0].value, "count": r[1]} for r in reason_counts]
    }