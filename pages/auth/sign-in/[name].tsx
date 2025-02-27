"use client";

import { GeneralLayout, StaffLayout } from "@layouts";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/Logo.png";
import authEmImage from "../../../public/auth-email.png";
import authPwdImage from "../../../public/auth-pwd.png";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleSignIn } from "@/components/serviette-icons";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared";
import {
  CircleCheckBig,
  EyeIcon,
  EyeOff,
  File,
  FolderOpen,
  Loader,
  LoaderCircle,
} from "lucide-react";
import Container from "@/components/shared/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import useBusinessDetails from "@/hooks/useBusinessDetails";
import StaffSignIn from "@/components/pages/auth/sign-in/staff";

const StaffAuth: FC = () => {
  const router = useRouter();
  const slug = router.query.name as string;

  const decodedName = slug?.replace(/-/g, " ");
  // const decodedName = name ? decodeURIComponent(name as string) : "";

  const { isLoading, isError, data } = useBusinessDetails({
    name: decodedName,
  });

  if (isLoading) {
   return <Loader className="rotate-icon text-txWhite m-auto flex justify-center items-center h-screen size-8" />
  };

  // if (isError) {
  //   router.push("/");
  // }

  if (isError) {
    return (
      <div className="text-txWhite h-screen m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
        <FolderOpen />
        Ooops not found
      </div>
    );
  }

  return <StaffSignIn data={data} name={decodedName}/>;
};

export default StaffAuth;
