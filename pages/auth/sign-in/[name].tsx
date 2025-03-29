"use client";

import React, { FC } from "react";
import { useRouter } from "next/router";
import {
  FolderOpen,
  Loader,
} from "lucide-react";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import StaffSignIn from "@/components/pages/auth/sign-in/staff";

const StaffAuth: FC = () => {
  const router = useRouter();
  const slug = router.query.name as string;

  const decodedName = slug?.replace(/-/g, " ");
  // const decodedName = name ? decodeURIComponent(name as string) : "";

  const { isLoading, isError, data } = useBusinessDetailsWithoutAuth({
    name: decodedName,
  });

  if (isLoading) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <Loader className="rotate-icon size-8" />
        Loading
      </div>
    );
  }

  // if (isError) {
  //   router.push("/");
  // }

  if (isError || !data) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <FolderOpen />
        Ooops not found
      </div>
    );
  }

  return <StaffSignIn data={data} name={decodedName} />;
};

export default StaffAuth;
