"""
Database seed script — populates the database with sample data for presentation.

Usage:
    cd backend
    python seed.py
"""

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.job import Job, JobType
from app.models.review import Review
from app.models.report import Report, ReportReason, ReportStatus
from datetime import datetime, timezone
import uuid


def seed():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already has data. Skipping seed.")
            return
        
        # ── Users ──
        admin = User(
            identifier=uuid.uuid4(),
            full_name="Alice Admin",
            email="admin@verifyhire.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        user1 = User(
            identifier=uuid.uuid4(),
            full_name="Bob Seeker",
            email="bob@example.com",
            hashed_password=get_password_hash("password123"),
            role=UserRole.USER,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        user2 = User(
            identifier=uuid.uuid4(),
            full_name="Carol Reviewer",
            email="carol@example.com",
            hashed_password=get_password_hash("password123"),
            role=UserRole.USER,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        recruiter = User(
            identifier=uuid.uuid4(),
            full_name="David Recruiter",
            email="david@techcorp.com",
            hashed_password=get_password_hash("password123"),
            role=UserRole.RECRUITER,
            is_active=True,
            company_name="TechCorp Global Ltd",
            cac_number="RC123456",
            created_date=datetime.now(timezone.utc),
        )
        db.add_all([admin, user1, user2, recruiter])
        db.commit()
        
        # ── Companies ──
        techcorp = Company(
            identifier=uuid.uuid4(),
            name="TechCorp Global",
            logo_url=None,
            location="San Francisco, CA",
            industry="Technology",
            about="Leading software company building the future of cloud computing. We're on a mission to connect the world through innovative technology solutions.",
            verified=True,
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        greenenergy = Company(
            identifier=uuid.uuid4(),
            name="GreenEnergy Solutions",
            logo_url=None,
            location="Berlin, Germany",
            industry="Renewable Energy",
            about="Sustainable energy startup focused on solar and wind power innovations. Join us in creating a greener tomorrow.",
            verified=True,
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        healthplus = Company(
            identifier=uuid.uuid4(),
            name="HealthPlus Medical",
            logo_url=None,
            location="New York, NY",
            industry="Healthcare",
            about="Modern healthcare provider leveraging AI for better patient outcomes. Certified and trusted by leading medical institutions.",
            verified=True,
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        unknown = Company(
            identifier=uuid.uuid4(),
            name="QuickCash Jobs",
            logo_url=None,
            location="Remote",
            industry="Unknown",
            about="Easy money, work from home, get paid instantly! No experience needed.",
            verified=False,
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        db.add_all([techcorp, greenenergy, healthplus, unknown])
        db.commit()
        
        # ── Jobs ──
        job1 = Job(
            identifier=uuid.uuid4(),
            title="Senior Software Engineer",
            company_identifier=techcorp.identifier,
            location="San Francisco, CA",
            job_type=JobType.FULL_TIME,
            description="We're looking for an experienced software engineer to join our platform team. You'll build scalable microservices and mentor junior developers. 5+ years experience required.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job2 = Job(
            identifier=uuid.uuid4(),
            title="Frontend Developer (React)",
            company_identifier=techcorp.identifier,
            location="Remote",
            job_type=JobType.REMOTE,
            description="Build beautiful and responsive UIs using React and TypeScript. Work with a distributed team across 4 time zones.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job3 = Job(
            identifier=uuid.uuid4(),
            title="Solar Panel Technician",
            company_identifier=greenenergy.identifier,
            location="Berlin, Germany",
            job_type=JobType.FULL_TIME,
            description="Install and maintain solar panel systems for residential and commercial clients. Training provided. German language required.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job4 = Job(
            identifier=uuid.uuid4(),
            title="Marketing Intern",
            company_identifier=greenenergy.identifier,
            location="Berlin, Germany",
            job_type=JobType.INTERNSHIP,
            description="Support our marketing team with social media campaigns and event coordination. Perfect for students in their final year.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job5 = Job(
            identifier=uuid.uuid4(),
            title="Registered Nurse",
            company_identifier=healthplus.identifier,
            location="New York, NY",
            job_type=JobType.FULL_TIME,
            description="Join our patient care team. Must have valid NY nursing license and 2+ years hospital experience. Competitive salary and benefits.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job6 = Job(
            identifier=uuid.uuid4(),
            title="Data Analyst (Contract)",
            company_identifier=healthplus.identifier,
            location="Remote",
            job_type=JobType.CONTRACT,
            description="Analyze patient data and generate insights for our AI-driven diagnostics team. 6-month contract with potential extension.",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        job7 = Job(
            identifier=uuid.uuid4(),
            title="Make $5000/Week Working From Home!",
            company_identifier=unknown.identifier,
            location="Remote",
            job_type=JobType.REMOTE,
            description="No skills needed! Just pay a small registration fee and start earning thousands. Limited spots available!",
            created_by_identifier=admin.identifier,
            created_date=datetime.now(timezone.utc),
        )
        db.add_all([job1, job2, job3, job4, job5, job6, job7])
        db.commit()
        
        # ── Reviews ──
        review1 = Review(
            identifier=uuid.uuid4(),
            rating=5,
            comment="Great company to work with! The interview process was transparent and the team is very professional. Highly recommended.",
            company_identifier=techcorp.identifier,
            created_by_identifier=user1.identifier,
            created_date=datetime.now(timezone.utc),
        )
        review2 = Review(
            identifier=uuid.uuid4(),
            rating=4,
            comment="Applied for a position here. The recruitment team was responsive and kept me updated throughout the process.",
            company_identifier=greenenergy.identifier,
            created_by_identifier=user1.identifier,
            created_date=datetime.now(timezone.utc),
        )
        review3 = Review(
            identifier=uuid.uuid4(),
            rating=1,
            comment="This company looks suspicious. They asked for payment to process my application. Stay away!",
            company_identifier=unknown.identifier,
            created_by_identifier=user2.identifier,
            created_date=datetime.now(timezone.utc),
        )
        review4 = Review(
            identifier=uuid.uuid4(),
            rating=5,
            comment="Excellent healthcare provider. The hiring process was smooth and they offer great benefits.",
            company_identifier=healthplus.identifier,
            created_by_identifier=user2.identifier,
            created_date=datetime.now(timezone.utc),
        )
        db.add_all([review1, review2, review3, review4])
        db.commit()
        
        # ── Reports ──
        report1 = Report(
            identifier=uuid.uuid4(),
            reason=ReportReason.SCAM,
            explanation="This job asks for a registration fee before allowing applicants to proceed. Definitely a scam.",
            status=ReportStatus.PENDING,
            job_identifier=job7.identifier,
            created_by_identifier=user1.identifier,
            created_date=datetime.now(timezone.utc),
        )
        db.add(report1)
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"   Users: {db.query(User).count()} (admin, 2 seekers, 1 recruiter)")
        print(f"   Companies: {db.query(Company).count()}")
        print(f"   Jobs: {db.query(Job).count()}")
        print(f"   Reviews: {db.query(Review).count()}")
        print(f"   Reports: {db.query(Report).count()}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
