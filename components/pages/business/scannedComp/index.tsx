"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { PaymnetsService } from "@/services";
import { useSocket } from "@/hooks";
import { LoaderCircle } from "lucide-react";
import { Menus } from "@/types";
import Link from "next/link";
import { PaymentStatusEnum } from "@/types/enums";
const Paystack = dynamic(() => import("@paystack/inline-js") as any, {
  ssr: false,
});

let tabKey: any = null;

const tabHeaders = {
  all: "all",
  wines: "wines",
  pasta: "pasta",
  pizza: "pizza",
  intercontinental: "intercontinental",
};

const defaultInvoice: Menus = {
  category: "",
  _id: "",
  available: false,
  image: "",
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};

const ScannedComp = ({
  businessId,
  BusinessName,
  tabelNumber,
  amountToCheckout,
}: {
  businessId: string;
  BusinessName: string;
  tabelNumber: string;
  amountToCheckout: any;
}) => {
  useSocket();
  const [popup, setPopup] = useState<any>(null);
  const { nudgeWaiter } = useSocket();
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const PaystackInline = require("@paystack/inline-js").default;
      setPopup(
        new PaystackInline(
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string
        )
      );
    }
  }, []);
  const handleNudged = () => {
    nudgeWaiter(businessId, Number(tabelNumber));
    setNudged(true);
    setTimeout(() => setNudged(false), 4000); // Reset after 4 seconds
  };

  const initPaymentRequest: any = async () => {
    try {
      const response = await PaymnetsService.initPayment(amountToCheckout._id);

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const initMutation: any = useMutation({
    mutationFn: initPaymentRequest,
    onSuccess: (res: any) => {
      console.log("onSuccess", res);
      popup.resumeTransaction(res.data.data.data.access_code);
    },
  });

  const handlePayment = () => {
    initMutation.mutate();
  };

  return (
    <div className=" min-h-screen font-edu text-primary m-auto w-full h-full flex gap-y-3 justify-center flex-col items-center py-16">
      <div className="w-[8rem] h-[8rem] border-2 flex items-center rounded-full bg-black">
        <p className="text-background text-center m-auto uppercase font-medium text-2xl">
          {BusinessName}
        </p>
      </div>
      <p className="text-2xl">Welcome table {tabelNumber}!</p>

      <div className="text-xl flex gap-y-3 flex-col md:w-[27rem] w-[75%] text-center capitalize">
        <Link
          href={`/${BusinessName}/table/${tabelNumber}/menu`}
          className="w-full rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          menu
        </Link>
        <div
          onClick={handleNudged}
          className="w-full cursor-pointer rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          {nudged ? "Nudged 👍🏽" : " Nudge waiter 👋🏽"}
        </div>
        {amountToCheckout && amountToCheckout.paymentStatus !== PaymentStatusEnum.PAID &&
          amountToCheckout.total && (
            <button
              type="submit"
              disabled={initMutation.isPending}
              onClick={handlePayment}
              className="w-full flex  justify-center items-center gap-x-1 rounded-2xl py-4 border-[1px] border-neutral-500"
            >
              checkout{" "}
              {amountToCheckout &&
                `₦${(amountToCheckout?.total).toLocaleString()}`}
              {initMutation.isPending && (
                <LoaderCircle className="flex w-5 h-5 rotate-icon" />
              )}
            </button>
          )}
        <Link
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL as string}`}
          className="w-full rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          Servlette
        </Link>
      </div>
    </div>
  );
};

export default ScannedComp;
