from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, RecruiterCreate, UserLogin, TokenResponse, UserResponse, CACVerifyRequest
from app.core.config import settings
from app.services.cac import verify_cac_number

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new job-seeker user."""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.USER
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.identifier), "role": new_user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(new_user)
    )


@router.post("/register/recruiter", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_recruiter(user_data: RecruiterCreate, db: Session = Depends(get_db)):
    """Register a new recruiter user with CAC verification."""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Check if CAC number is already used
    existing_cac = db.query(User).filter(User.cac_number == user_data.cac_number).first()
    if existing_cac:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This CAC number is already registered to another account"
        )
    
    # Verify CAC number
    cac_result = await verify_cac_number(user_data.cac_number)
    
    if not cac_result.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=cac_result.error or "Invalid CAC registration number"
        )
    
    # Create new recruiter user
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.RECRUITER,
        company_name=cac_result.company_name,
        cac_number=user_data.cac_number.upper().strip(),
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.identifier), "role": new_user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(new_user)
    )


@router.post("/verify-cac", status_code=status.HTTP_200_OK)
async def verify_cac(data: CACVerifyRequest):
    """
    Verify a CAC number and return company details.
    Used by the frontend to look up company info before form submission.
    """
    result = await verify_cac_number(data.cac_number)
    
    if not result.is_valid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.error or "CAC number not found"
        )
    
    return {
        "is_valid": True,
        "company_name": result.company_name,
        "status": result.status,
    }


# In-memory store for verification codes (demo purposes)
import random
_verification_codes: dict = {}


@router.post("/send-code", status_code=status.HTTP_200_OK)
async def send_verification_code(data: dict):
    """Send a 6-digit verification code to the given email."""
    email = data.get("email", "")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    code = str(random.randint(100000, 999999))
    _verification_codes[email] = code
    
    # In production, send this via email. For demo, log to console.
    print(f"\n📧 Verification code for {email}: {code}\n")
    
    return {"message": "Verification code sent", "email": email, "dev_code": code}


@router.post("/verify-code", status_code=status.HTTP_200_OK)
async def verify_email_code(data: dict):
    """Verify a 6-digit code sent to the user's email."""
    email = data.get("email", "")
    code = data.get("code", "")
    
    stored = _verification_codes.get(email)
    if not stored:
        raise HTTPException(status_code=400, detail="No code was sent to this email. Request a new one.")
    
    if stored != code:
        raise HTTPException(status_code=400, detail="Invalid code. Please try again.")
    
    # Code used — clean up
    del _verification_codes[email]
    
    return {"message": "Email verified successfully", "verified": True}


@router.post("/resend-code", status_code=status.HTTP_200_OK)
async def resend_verification_code(data: dict):
    """Resend a verification code."""
    return await send_verification_code(data)


@router.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login an existing user."""
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.identifier), "role": user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )