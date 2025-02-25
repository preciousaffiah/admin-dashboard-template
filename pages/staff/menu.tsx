import React, { FC, useEffect } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { DeptEnum } from "@/types/enums";
import { useAuthToken } from "@/hooks";
import { StaffLayout } from "@/components/layouts";
import Menu from "@/components/pages/menu";
import { useRouter } from "next/router";


const GeneralMenu: FC = () => {
 
  let title = "Menu";
  const router = useRouter();

  const { token, userData, isLoading } = useAuthToken();

  useEffect(() => {
    if (isLoading) return;
    if (!token || !userData?.businessId) router.push("/");
  }, [isLoading, router, token]);

  return (
    <>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <Menu />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <Menu />
        </StaffLayout>
      )}
    </>
  );
};

export default GeneralMenu;
