"use client";
import { AdminLayout } from "@/components/layouts";
import PayoutRequestsComp from "@/components/pages/requests/payouts";
import React, { FC } from "react";

const PayoutRequests: FC = () => {
  let title = "Payout Requests";

  return (
    <AdminLayout title={title}>
      <PayoutRequestsComp />
    </AdminLayout>
  );
};

export default PayoutRequests;
