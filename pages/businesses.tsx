"use client";
import { AdminLayout } from "@/components/layouts";
import BusinessesComp from "@/components/pages/businesses";
import React, { FC } from "react";

const Businesses: FC = () => {
  let title = "Businesses";

  return (
    <AdminLayout title={title}>
      <BusinessesComp />
    </AdminLayout>
  );
};

export default Businesses;
