import React, { FC } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import Orders from "@/components/pages/orders";
import TransactionsAdmin from "@/components/pages/payouts";

const Transactions: FC = () => {
  let title = "Payouts";

  return (
      <AdminLayout subtitle="Admin" title={title}>
        <TransactionsAdmin title={title} />
      </AdminLayout>
  );
};

export default Transactions;
