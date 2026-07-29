from app.core.database import SessionLocal
from app.models import User, Company, Job, Review

db = SessionLocal()
print(f"Users:     {db.query(User).count()}")
print(f"Companies: {db.query(Company).count()}")
print(f"Jobs:      {db.query(Job).count()}")
print(f"Reviews:   {db.query(Review).count()}")
db.close()
