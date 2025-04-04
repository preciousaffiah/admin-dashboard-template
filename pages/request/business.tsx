"use client";
import { AdminLayout } from "@/components/layouts";
import BusinessRequestsComp from "@/components/pages/requests/business";
import React, { FC } from "react";

const BusinessRequests: FC = () => {
  let title = "Business Requests";

  return (
    <AdminLayout title={title}>
      <BusinessRequestsComp />
    </AdminLayout>
  );
};

export default BusinessRequests;
