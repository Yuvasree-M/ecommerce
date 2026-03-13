import { createContext, useEffect, useState, useMemo } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // isLoggedIn is purely derived from Firebase session — no localStorage
  // This means a new browser/tab/incognito always starts fresh correctly
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          const idToken = await currentUser.getIdToken(true);
          setToken(idToken);

          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              name: userData.name || "User",
              role: userData.role || "USER",
              phone: userData.phone || "",
              address: userData.address || "",
            });
            setRole(userData.role || "USER");
          } else {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              name: "User",
              phone: "",
              address: "",
            });
            setRole("USER");
          }

          // Firebase confirmed a valid session exists
          setIsLoggedIn(true);

        } else {
          // No Firebase session — new browser, incognito, or logged out
          setUser(null);
          setRole(null);
          setToken(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
        setRole(null);
        setToken(null);
        setIsLoggedIn(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show nothing until Firebase has resolved the auth state
  // This prevents ANY flicker of wrong navbar on refresh or new tab
  const value = useMemo(() => ({
    user,
    setUser,
    token,
    role,
    loading,
    isLoggedIn,
    setIsLoggedIn,
  }), [user, token, role, loading, isLoggedIn]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};