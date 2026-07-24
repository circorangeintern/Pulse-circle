from fastapi import APIRouter
from app.api.v1.endpoints import auth, companies, jobs, reviews, reports, users
from app.api.v1.admin import dashboard
api_router = APIRouter()

# All endpoint routers
api_router.include_router(auth.router)
api_router.include_router(companies.router)
api_router.include_router(jobs.router)
api_router.include_router(reviews.router)
api_router.include_router(reports.router)
api_router.include_router(users.router)
api_router.include_router(dashboard.router)
