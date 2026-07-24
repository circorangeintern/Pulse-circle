from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
import logging

from app.core.database import get_db
from app.core.security import decode_access_token
from app.core.firebase_auth import verify_firebase_token
from app.models.user import User, UserRole

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user.
    
    Tries Firebase ID token first (used by the frontend), then falls back
    to our custom JWT (for API testing/Admin usage).
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    # Strategy 1 — Try Firebase token verification
    firebase_user = verify_firebase_token(token)
    if firebase_user:
        email = firebase_user.get("email", "")
        name = firebase_user.get("name", "")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase token missing email",
            )
        
        # Find or create user in our database
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Auto-create user from Firebase data with USER role
            user = User(
                identifier=uuid4(),
                full_name=name or email.split("@")[0],
                email=email,
                hashed_password="",  # Firebase handles password
                role=UserRole.USER,
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        return user
    
    # Strategy 2 — Fall back to custom JWT
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.identifier == UUID(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get the current user and verify they are an admin.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


def get_current_recruiter(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get the current user and verify they are a recruiter (or admin).
    """
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter privileges required"
        )
    return current_user