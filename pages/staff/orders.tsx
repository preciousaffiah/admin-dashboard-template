import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { DeptEnum } from "@/types/enums";
import { useAuthToken } from "@/hooks";
import { StaffLayout } from "@/components/layouts";
import Orders from "@/components/pages/orders";
import AuthenticatedStaffContainer from "@/components/shared/container/auth-staff";

const GeneralOrders: FC = () => {
  let title = "Orders";

  const { userData } = useAuthToken();

  return (
    <AuthenticatedStaffContainer>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <Orders />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <Orders />
        </StaffLayout>
      )}
    </AuthenticatedStaffContainer>
  );
};

export default GeneralOrders;
