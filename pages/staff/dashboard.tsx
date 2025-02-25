"use client";
import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import Dashboard from "@/components/pages/dashboard";
import { useAuthToken } from "@/hooks";
import { DeptEnum } from "@/types/enums";
import { StaffLayout } from "@/components/layouts";
import AuthenticatedStaffContainer from "@/components/shared/container/auth-staff";

const GeneralDashboard: FC = () => {
  let title = "Dashboard";

  const { userData } = useAuthToken();

  return (
    <AuthenticatedStaffContainer>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <Dashboard />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <Dashboard />
        </StaffLayout>
      )}
    </AuthenticatedStaffContainer>
  );
};

export default GeneralDashboard;
