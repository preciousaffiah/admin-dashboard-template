import { useEffect, useState } from "react";
import Router from "next/router";
import { deleteStore, loadStore, saveStore } from "@/utils/local-storage";
import { TAppUser, TAppUserState } from "@types";

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<TAppUser | null>(null);
  const [onlineStat, setOnlineStat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (user: TAppUserState) => {
    if (user) {
      saveStore(user);
      setToken(user?.token);
      setUserData(user?.userData);
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
      setUserData(storeData?.userData);
      setOnlineStat(true);
    }
    setIsLoading(false);
  }, []);

  return { token, userData, isLoading, updateUser, logout, onlineStat };
}

export default useAuthToken;
