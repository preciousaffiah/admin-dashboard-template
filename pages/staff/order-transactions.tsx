import { AdminLayout, StaffLayout } from "@layouts";
import React, { FC } from "react";
import { useAuthToken } from "@/hooks";
import { DeptEnum } from "@/types/enums";
import CreateOrder from "@/components/pages/create-order";
import AuthenticatedStaffContainer from "@/components/shared/container/auth-staff";
import OrderTransactions from "@/components/pages/order-transactions";

const GeneralOrderTransactions: FC = () => {
  const title = "Order Transactions";

  const { userData } = useAuthToken();

  return (
    <AuthenticatedStaffContainer>
      {userData?.department === DeptEnum.ADMIN ? (
        <AdminLayout subtitle="Admin" title={title}>
          <OrderTransactions />
        </AdminLayout>
      ) : (
        <StaffLayout subtitle="Staff" title={title}>
          <OrderTransactions />
        </StaffLayout>
      )}
    </AuthenticatedStaffContainer>
  );
};

export default GeneralOrderTransactions;
