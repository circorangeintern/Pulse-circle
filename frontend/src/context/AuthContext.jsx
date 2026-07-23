import { createContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.js";

export const AuthContext = createContext({
  user: null,
  loading: true,
  isEmailVerified: false,
  markEmailVerified: () => {},
});

// Demo-only persistence for the "has this user completed the code step"
// flag. In production, prefer a backend-set custom claim on the Firebase
// ID token (refreshed via user.getIdToken(true) after verification) instead
// of trusting client-side localStorage.
function readVerifiedFlag(uid) {
  if (!uid) return false;
  return localStorage.getItem(`verifyhire:verified:${uid}`) === "true";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsEmailVerified(
        firebaseUser?.providerData?.[0]?.providerId === "google.com"
          ? true // Google sign-in already verifies the email address
          : readVerifiedFlag(firebaseUser?.uid)
      );
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function markEmailVerified() {
    if (user?.uid) {
      localStorage.setItem(`verifyhire:verified:${user.uid}`, "true");
    }
    setIsEmailVerified(true);
  }

  const value = useMemo(
    () => ({ user, loading, isEmailVerified, markEmailVerified }),
    [user, loading, isEmailVerified]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
