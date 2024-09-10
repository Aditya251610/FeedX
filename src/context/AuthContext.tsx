import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "../types/index";
import { getCurrentUser } from "../lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAndRedirect = async () => {
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (cookieFallback !== "[]" && cookieFallback !== null && cookieFallback !== undefined) {
        const loggedIn = await checkAuthUser();
        if (loggedIn) {
          // Check if the user is on the sign-up page
          if (location.pathname !== "/sign-up") {
            navigate("/");
          }
        }
      } else {
        // Avoid redirecting from sign-up page to sign-in
        if (location.pathname !== "/sign-up") {
          navigate("/sign-in");
        }
      }
    };
  
    checkAndRedirect();
    // Adding an empty dependency array will ensure that this effect runs only once (on mount)
  }, []); // <-- Add an empty array here
  
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
