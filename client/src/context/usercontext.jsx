import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [userProfile, setUserProfile] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);  // ← add kar
  const [loading, setLoading] = useState(true);      // ← add kar (optional but good)

  useEffect(() => {
    fetch("http://localhost:5000/dashboard", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUserProfile(data);   // ← setData hatav, direct setUserProfile vapar
        setLoggedIn(true);      // ← fixed spelling
        // console.log(data);
      })
      .catch(() => {
        setLoggedIn(false);
        setUserProfile(null);
      })
      .finally(() => {
        setLoading(false);      // ← loading done
      });
  }, []);

  return (
    <UserContext.Provider value={{
      userProfile,
      setUserProfile,
      loggedIn,        // ← expose kar
      setLoggedIn,
      loading          // ← expose kar
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}