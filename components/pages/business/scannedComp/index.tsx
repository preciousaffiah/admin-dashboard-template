"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks";
import { Menus } from "@/types";
import Link from "next/link";
import { PaymentStatusEnum } from "@/types/enums";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CheckoutModal from "@/components/shared/modal/checkout";

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
  const { nudgeWaiter } = useSocket();
  const [nudged, setNudged] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleNudged = () => {
    nudgeWaiter(businessId, Number(tabelNumber));
    setNudged(true);
    setTimeout(() => setNudged(false), 4000); // Reset after 4 seconds
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
        {amountToCheckout &&
          amountToCheckout.paymentStatus !== PaymentStatusEnum.PAID &&
          amountToCheckout.total && (
            <Dialog>
              <DialogTrigger asChild onClick={() => setIsOtpModalOpen(true)}>
                <button className="w-full flex  justify-center items-center gap-x-1 rounded-2xl py-4 border-[1px] border-neutral-500">
                  Checkout{" "}
                  {amountToCheckout &&
                    `₦${(amountToCheckout?.total).toLocaleString()}`}
                </button>
              </DialogTrigger>
              <CheckoutModal
                selectedInvoice={amountToCheckout._id}
                isOpen={isOtpModalOpen}
                onClose={() => {
                  setIsOtpModalOpen(false);
                }}
                setIsOtpModalOpen={setIsOtpModalOpen}
              />
            </Dialog>
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
