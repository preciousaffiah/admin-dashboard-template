"use client";
import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import Dashboard from "@/components/shared/dashboard";

const AdminDashboard: FC = () => {
  let title = "Dashboard";

  return (
    <AdminLayout title={title}>
      <Dashboard/>
    </AdminLayout>
  );
};

export default AdminDashboard;
