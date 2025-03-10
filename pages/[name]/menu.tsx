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

const BusinessMenuPage: FC = () => {
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

  if (isError || !data) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <FolderOpen />
        Ooops not found
      </div>
    );
  }

  return (
    <div>
      <BusinessMenu businessId={data._id} BusinessName={decodedName} />
    </div>
  );
};

export default BusinessMenuPage;
