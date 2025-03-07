import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import Orders from "@/components/pages/orders";
import Settings from "@/components/pages/settings";

const BusinessSettings: FC = () => {
  let title = "Settings";

  return (
      <AdminLayout subtitle="Admin" title={title}>
        <Settings title={title} />
      </AdminLayout>
  );
};

export default BusinessSettings;
