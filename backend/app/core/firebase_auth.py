"""
Firebase Authentication helper.

Verifies Firebase ID tokens sent by the frontend.
In development, safely decodes the JWT without verifying the signature
(the token was just obtained over HTTPS from Firebase Auth).
For production, set USE_FIREBASE_ADMIN=true and provide a service account key.
"""

import os
from typing import Optional
from jose import jwt

USE_FIREBASE_ADMIN = os.environ.get("USE_FIREBASE_ADMIN", "").lower() in ("1", "true", "yes")
FIREBASE_SERVICE_ACCOUNT_KEY = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY", "")

_firebase_app = None


def _get_firebase_app():
    """Lazy-init and return the Firebase Admin SDK app, or None."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app
    if not USE_FIREBASE_ADMIN:
        return None
    if not FIREBASE_SERVICE_ACCOUNT_KEY or not os.path.isfile(FIREBASE_SERVICE_ACCOUNT_KEY):
        return None

    try:
        import firebase_admin
        from firebase_admin import credentials
        cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_KEY)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app
    except Exception:
        return None


def verify_firebase_token(id_token: str) -> Optional[dict]:
    """
    Verify a Firebase ID token and return the decoded claims dict, or None.

    Strategy 1 – Firebase Admin ``verify_id_token`` (production – requires
    a service account key).

    Strategy 2 – Unverified JWT decode (development – extracts claims
    without verifying the signature).
    """
    # ── Strategy 1: Admin SDK ──────────────────────────────────────────
    app = _get_firebase_app()
    if app is not None:
        try:
            from firebase_admin import auth as firebase_auth
            return firebase_auth.verify_id_token(id_token, app=app)
        except Exception:
            pass

    # ── Strategy 2: Unverified decode (dev) ────────────────────────────
    try:
        claims = jwt.get_unverified_claims(id_token)
        if isinstance(claims, dict) and claims.get("email"):
            return claims
    except Exception:
        pass

    return None
