"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { FolderOpen, Loader } from "lucide-react";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import BusinessMenu from "@/components/pages/business/menu";

const BusinessMenuPage: FC = () => {
  const router = useRouter();
  const slug = router.query.name as string;

  const decodedName = slug?.replace(/-/g, " ");

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

  if (isError || !data ) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <FolderOpen />
        Ooops not found
      </div>
    );
  }

  return (
    <div>
      <BusinessMenu
        businessId={data._id}
        BusinessName={decodedName}
        tableId=""
        table={false}
      />
    </div>
  );
};

export default BusinessMenuPage;
