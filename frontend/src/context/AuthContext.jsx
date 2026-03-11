import { createContext, useEffect, useState } from "react";
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

      if (currentUser) {
        try {
          // Get Firebase ID token
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          // Fetch Firestore user document
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser(userData);          // contains name, email, role
            setRole(userData.role || "USER");
          } else {
            setUser({ email: currentUser.email, name: "Unknown User" });
            setRole("USER");
          }
        } catch (error) {
          console.error("Failed to fetch Firestore user:", error);
          setUser({ email: currentUser.email, name: "Unknown User" });
          setRole("USER");
        }
      } else {
        setUser(null);
        setToken(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};