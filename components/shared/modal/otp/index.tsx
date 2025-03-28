import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { PayoutsService, StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { handleAxiosError } from "@/utils/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PayoutRequestStatusEnum } from "@/types/enums";

const OtpModal = ({
  isOpen,
  onClose,
  payoutRequest,
  setOtp,
  otp,
  setTimer,
  timer,
  isResendDisabled,
  setIsResendDisabled,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const { userData } = useAuthToken();
  const [success, setSuccess] = useState(false);

  const otpMutation: any = useMutation({
    mutationFn: payoutRequest,
    onSuccess: (res: any) => {
      if (res.data.data.status === PayoutRequestStatusEnum.OTPSENT) {
        setTimer(59);
      } else if (res.data.data.status === PayoutRequestStatusEnum.REQUESTED) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 4000); // 4 seconds delay before closing
      } else {
        onClose();
      }
    },
  });

  const handleSubmit = () => otpMutation.mutate();

  const handleResendOtp = () => {
    setOtp("");
    setIsResendDisabled(true);
    handleSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-black">
        {success ? (
          <div className="flex flex-col items-center">
            <p className="md:text-2xl text-xl font-medium">Request Sent</p>
            <Clock className="size-9 text-primary-orange" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Enter OTP</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex flex-col gap-y-3 items-center">
                <AnimatePresence>
                  {otpMutation.isError && (
                    <motion.div
                      initial={{ y: -20, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0.2 }}
                    >
                      <ToastMessage
                        message={
                          otpMutation?.error?.message ||
                          "An error occured during process"
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    // Allow only numbers
                    const numericValue = value.replace(/\D/g, ""); // Remove non-digits
                    setOtp(numericValue);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <DialogDescription>
                  Please enter the OTP sent to your email.
                </DialogDescription>
                <button
                  onClick={handleSubmit}
                  disabled={otpMutation.isPending || !otp}
                  className="text-white w-fit bg-primary-orange px-3 py-1 rounded-md flex gap-x-1"
                >
                  Submit
                  {otpMutation.isPending && (
                    <LoaderCircle className="text-white w-4 rotate-icon" />
                  )}
                </button>
                {/* Timer and Resend Button */}
                <div className="text-sm text-gray-500 mt-2">
                  {timer > 0 ? (
                    <p>Resend OTP in {timer}s</p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResendDisabled || otpMutation.isPending}
                      className="text-primary-orange font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
