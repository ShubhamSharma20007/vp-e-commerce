import { createContext, useEffect, useState } from "react";
import { USER_PROFILE } from "../utils/constant";
import { Instance } from "../lib/instance";
import { customToast } from "../lib/customToast";
import Loading from "../components/Loading";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const request = await Instance.get(USER_PROFILE, {
        withCredentials: true,
      });
      const response = await request.data;
      if (response.success) {
        setCurrentUser(null);
        setCurrentUser(response.user);
        setLoading(false);
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        console.log(err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
