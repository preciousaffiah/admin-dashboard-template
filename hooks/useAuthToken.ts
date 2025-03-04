import { useEffect, useState } from "react";
import Router from "next/router";
import { deleteStore, loadStore, saveStore } from "@/utils/local-storage";
import { TAppUser, TAppUserState } from "@types";
import { usePathname } from "next/navigation";
import { StaffStatusEnum } from "@/types/enums";
import { updateLogoutStatus } from "@/utils/update-logout-status";

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<TAppUser | null>(null);
  const [onlineStat, setOnlineStat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const path = usePathname();

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
    console.log(
      userData?.user_id,
      userData?.businessId,
      StaffStatusEnum.INACTIVE
    );

    const updateStatus = updateLogoutStatus({
      staffId: userData?.user_id || "",
      businessId: userData?.businessId || "",
      status: StaffStatusEnum.INACTIVE,
    });

    deleteStore();
    if (path === "/") {
      Router.reload();
    } else {
      Router.replace("/");
    }
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
