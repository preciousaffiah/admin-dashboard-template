"use client";
import { WaiterLayout } from "@layouts";
import React, { FC } from "react";

import Dashboard from "@/components/shared/dashboard";

const WaiterDashboard: FC = () => {
  let title = "Dashboard";

  return (
    <WaiterLayout subtitle="Waiter" title={title}>
      <Dashboard />
    </WaiterLayout>
  );
};

export default WaiterDashboard;
