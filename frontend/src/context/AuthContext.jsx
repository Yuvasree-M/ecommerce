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

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      setLoading(true);

      try {

        if (currentUser) {

          // Get Firebase ID token
          const idToken = await currentUser.getIdToken(true);
          setToken(idToken);

          // Get user role from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {

            const userData = userSnap.data();

            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              name: userData.name || "User",
              role: userData.role || "USER"
            });

            setRole(userData.role || "USER");

          } else {

            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              name: "User"
            });

            setRole("USER");

          }

        } else {

          setUser(null);
          setRole(null);
          setToken(null);

        }

      } catch (error) {

        console.error("Auth error:", error);

        setUser(null);
        setRole(null);
        setToken(null);

      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  const value = useMemo(() => ({
    user,
    token,
    role,
    loading
  }), [user, token, role, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};