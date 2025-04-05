import React, { FC, useEffect } from "react";
import { useAuthToken } from "@/hooks";
import { useRouter } from "next/router";

const AuthenticatedStaffContainer = ({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}) => {
  const router = useRouter();

  const { token, userData, isLoading } = useAuthToken();

  useEffect(() => {
    if (isLoading) return;
    if (!token || !userData?.businessId) router.push("/");
  }, [isLoading, router, token]);
  return <>{children}</>;
};

export default AuthenticatedStaffContainer;
