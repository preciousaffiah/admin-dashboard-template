import { AdminLayout, StaffLayout } from "@layouts";
import React, { FC } from "react";
import { useAuthToken } from "@/hooks";
import { DeptEnum } from "@/types/enums";
import CreateOrder from "@/components/pages/create-order";
import AuthenticatedStaffContainer from "@/components/shared/container/auth-staff";

const GeneralCreateOrder: FC = () => {
  const title = "Create Order";

  const { userData } = useAuthToken();

  return (
    <AuthenticatedStaffContainer>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <CreateOrder />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <CreateOrder />
        </StaffLayout>
      )}
    </AuthenticatedStaffContainer>
  );
};

export default GeneralCreateOrder;
