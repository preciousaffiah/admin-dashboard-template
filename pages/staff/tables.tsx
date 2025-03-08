import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { DeptEnum } from "@/types/enums";
import { useAuthToken } from "@/hooks";
import { StaffLayout } from "@/components/layouts";
import AuthenticatedStaffContainer from "@/components/shared/container/auth-staff";
import Tables from "@/components/pages/tables";

const GeneralTables: FC = () => {
  let title = "Tables";

  const { userData } = useAuthToken();

  return (
    <AuthenticatedStaffContainer>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <Tables />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <Tables />
        </StaffLayout>
      )}
    </AuthenticatedStaffContainer>
  );
};

export default GeneralTables;
