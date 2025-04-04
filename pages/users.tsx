"use client";
import { AdminLayout } from "@/components/layouts";
import UsersComp from "@/components/pages/users";
import React, { FC } from "react";

const Users: FC = () => {
  let title = "Users";

  return (
    <AdminLayout title={title}>
      <UsersComp />
    </AdminLayout>
  );
};

export default Users;
