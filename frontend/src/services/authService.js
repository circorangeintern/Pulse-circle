import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.js";
import api from "./api.js";

/**
 * Maps raw Firebase Auth error codes to friendly, user-facing copy.
 * Firebase throws error.code values like "auth/popup-closed-by-user" —
 * we translate the ones relevant to this flow and fall back to a generic message.
 */
export function getAuthErrorMessage(error) {
  const code = error?.code || "";

  const messages = {
    "auth/popup-closed-by-user":
      "The Google sign-in window was closed before completing. Please try again.",
    "auth/cancelled-popup-request":
      "Sign-in was cancelled. Please try again.",
    "auth/popup-blocked":
      "Your browser blocked the sign-in popup. Please allow popups for this site and try again.",
    "auth/network-request-failed":
      "Network error. Check your connection and try again.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method.",
    "auth/email-already-in-use":
      "An account with this email already exists. Try logging in instead.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a moment and try again.",
  };

  return messages[code] || error?.message || "Something went wrong. Please try again.";
}

/** Create a new account with email/password and set the user's display name. */
export async function signUpWithEmail({ fullName, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (fullName) {
    await updateProfile(credential.user, { displayName: fullName });
  }
  return credential.user;
}

/** Sign in an existing user with email/password. */
export async function signInWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Sign in (or sign up) using a Google popup. */
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

/** Sign the current user out. */
export function logout() {
  return signOut(auth);
}

/**
 * Requests a fresh 6-digit verification code be emailed to the given address.
 *
 * NOTE: This calls your backend, which is responsible for generating a
 * short-lived code, persisting it (e.g. Firestore with a TTL/expiry), and
 * emailing it via a transactional email provider (SendGrid, Postmark, etc).
 * See README.md for a reference Cloud Function implementation.
 */
export function sendVerificationCode(email) {
  return api.post("/auth/send-code", { email });
}

/** Submits the code the user typed in for verification against the backend. */
export function verifyEmailCode(email, code) {
  return api.post("/auth/verify-code", { email, code });
}

/** Requests the backend issue a new code, e.g. after the previous one expired. */
export function resendVerificationCode(email) {
  return api.post("/auth/resend-code", { email });
}
