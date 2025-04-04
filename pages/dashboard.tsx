"use client";
import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import DashboardComp from "@/components/pages/dashboard";

const Dashboard: FC = () => {
  let title = "Dashboard";

  return (
    <AdminLayout title={title}>
      <DashboardComp />
    </AdminLayout>
  );
};

export default Dashboard;
