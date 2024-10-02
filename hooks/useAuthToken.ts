import { useEffect, useState } from "react";
import Router from "next/router";
import { deleteStore, loadStore, saveStore } from "@/utils/local-storage";
import { TAppUser, TAppUserState } from "@types";

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<TAppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (userData: TAppUserState) => {
    if (userData) {
      saveStore(userData);
      setToken(userData?.token);
      setUser(userData?.user);
    } else {
      setToken("");
    }
  };

  const logout = () => {
    deleteStore();
    Router.replace("/auth/sign-in");
  };

  useEffect(() => {
    const storeData = loadStore();
    if (storeData) {
      setToken(storeData?.token);
      setUser(storeData?.user);
    }
    setIsLoading(false);
  }, []);

  return { token, user, isLoading, updateUser, logout };
}

export default useAuthToken;
