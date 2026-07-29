from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.models.company import Company
from app.models.job import Job
from app.models.review import Review
from app.models.report import Report, ReportStatus, ReportReason

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def get_admin_stats(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get overall platform statistics for the admin dashboard."""
    total_users = db.query(User).count()
    total_companies = db.query(Company).count()
    verified_companies = db.query(Company).filter(Company.verified == True).count()
    total_jobs = db.query(Job).count()
    total_reviews = db.query(Review).count()
    total_reports = db.query(Report).count()
    pending_reports = db.query(Report).filter(Report.status == ReportStatus.PENDING).count()
    
    # Reports by reason
    reason_counts = db.query(
        Report.reason,
        func.count(Report.identifier).label('count')
    ).group_by(Report.reason).all()
    
    # Average rating across all companies
    avg_rating_result = db.query(func.avg(Review.rating)).first()
    average_rating = float(avg_rating_result[0]) if avg_rating_result[0] is not None else 0.0
    
    # Recent signups (last 7 days count)
    from datetime import datetime, timedelta
    from sqlalchemy import cast, Date
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_signups = db.query(User).filter(
        func.date(User.created_date) >= week_ago.date()
    ).count()
    
    return {
        "total_users": total_users,
        "total_companies": total_companies,
        "verified_companies": verified_companies,
        "total_jobs": total_jobs,
        "total_reviews": total_reviews,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "average_rating": round(average_rating, 1),
        "recent_signups": recent_signups,
        "reports_by_reason": [
            {"reason": r[0].value, "count": r[1]} for r in reason_counts
        ],
    }
