"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { FolderOpen, Loader } from "lucide-react";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import BusinessMenu from "@/components/pages/business/menu";
import Image from "next/image";
import cover from "public/cover.png";
import cover2 from "public/cover2.png";
import cover3 from "public/cover3.jpg";
import cover4 from "public/cover4.webp";
import ScannedComp from "@/components/pages/business/scannedComp";
import { BusService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from "@/hooks";
import { handleAxiosError } from "@/utils/axios";
import { TableContext } from "contexts/tableContext/index";

const BusinessMenuPage: FC = () => {
  const router = useRouter();
  const { name, number } = router.query;
  const slug = name as string;
  const { userData } = useAuthToken();

  const decodedName = slug?.replace(/-/g, " ");
  // const decodedName = name ? decodeURIComponent(name as string) : "";

  const { isLoading, isError, data } = useBusinessDetailsWithoutAuth({
    name: decodedName,
  });

  const fetchTableRequest = async () => {
    if (!number) return;

    try {
      const response = await BusService.getTable(
        data?._id || "",
        Number(number)
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.log("error messge:", error.response?.data?.message);
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: isTableLoading,
    isRefetching: isTableRefetching,
    refetch: tableRefetch,
    isError: isTableError,
    data: tableData,
  } = useQuery<any, Error>({
    queryKey: ["table", [userData?.businessId || "", number]],
    queryFn: fetchTableRequest,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  if (isTableLoading) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <Loader className="rotate-icon size-8" />
        Loading
      </div>
    );
  }

  if (isTableError || !tableData) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <FolderOpen />
        Ooops not found
      </div>
    );
  }

  return (
      <div>
        <ScannedComp
          businessId={tableData._id}
          BusinessName={decodedName}
          tabelNumber={number as string}
        />
      </div>
  );
};

export default BusinessMenuPage;
