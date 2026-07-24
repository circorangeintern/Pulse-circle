import { createContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.js";

export const AuthContext = createContext({
  user: null,
  loading: true,
  isEmailVerified: false,
  markEmailVerified: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // In development, all signed-in users are considered email-verified.
  // Remove this once email verification is fully integrated.
  const isEmailVerified = !!user;

  const value = useMemo(
    () => ({ user, loading, isEmailVerified, markEmailVerified: () => {} }),
    [user, loading, isEmailVerified]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
