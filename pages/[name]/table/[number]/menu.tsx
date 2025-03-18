"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { FolderOpen, Loader } from "lucide-react";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import BusinessMenu from "@/components/pages/business/menu";
import { useTableDetails } from "@/hooks";

const TableMenuPage: FC = () => {
  const router = useRouter();
  const slug = router.query.name as string;
  const number = router.query.number as string;

  const decodedName = slug?.replace(/-/g, " ");
  // const decodedName = name ? decodeURIComponent(name as string) : "";

  const { isLoading, isError, data } = useBusinessDetailsWithoutAuth({
    name: decodedName,
  });

  const {
    data: tableData,
    isError: isTableError,
    isLoading: isTableLoading,
  } = useTableDetails(data?._id, Number(number));

  if (isLoading || isTableLoading) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <Loader className="rotate-icon size-8" />
        Loading
      </div>
    );
  }

  if (isError || !data || isTableError || !tableData) {
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
        tableId={tableData._id}
        table={true}
      />
    </div>
  );
};

export default TableMenuPage;
