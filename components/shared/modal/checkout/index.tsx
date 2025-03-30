import {
  Dialog,
  DialogClose,
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
import { Copy, EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { ItemService, PaymnetsService, StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleAxiosError } from "@/utils/axios";

const formSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
  })
  .required();

const CheckoutModal = ({
  selectedInvoice,
  isOpen,
  onClose,
  setIsOtpModalOpen,
}: {
  selectedInvoice: any;
  isOpen: boolean;
  onClose: any;
  setIsOtpModalOpen: any;
}) => {
  const { userData } = useAuthToken();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [success, setSuccess] = useState(false);
  const [popup, setPopup] = useState<any>(null);

  let businessId = userData?.businessId || "";

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

  const initPaymentRequest: any = async () => {
    try {
      const response = await PaymnetsService.initPayment(
        selectedInvoice._id,
        selectedInvoice.businessId,
        form.getValues("email")
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const initMutation: any = useMutation({
    mutationFn: initPaymentRequest,
    onSuccess: (res: any) => {
      setIsOtpModalOpen(false);
      popup.resumeTransaction(res.data.data.data.access_code);
    },
  });

  const handlePayment = () => {
    initMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-[#bbc47c99] backdrop-blur-[5px]">
        <DialogContent showOverlay={false} className="sm:max-w-md text-black">
          <>
            <AnimatePresence>
              {initMutation.isError && (
                <motion.div
                  initial={{ y: -20, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0.2 }}
                >
                  <ToastMessage
                    message={
                      initMutation?.error?.message ||
                      "An error occured during sign up"
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <DialogHeader>
              <DialogTitle className="text-lg">
                Enter your email to continue checkout
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePayment)}
                className="w-full flex flex-col m-auto justify-center"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 w-full pb-4">
                      <FormControl>
                        <input
                          autoComplete="off"
                          type="email"
                          placeholder="email"
                          {...field}
                          className="md:pt-0 pt-2 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="sm:justify-start font-edu flex md:flex-row flex-col gap-y-3">
                  <Button
                    variant="ghost"
                    type="submit"
                    disabled={initMutation.isPending}
                    className="font-edu font-normal bg-primary-orange text-white"
                  >
                    Checkout
                    {initMutation.isPending && (
                      <LoaderCircle className=" flex w-4 rotate-icon" />
                    )}
                  </Button>

                  {/* <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-edu font-normal bg-primary-orange text-white"
                >
                  No, cancel
                </Button>
              </DialogClose> */}
                </DialogFooter>
              </form>
            </Form>
          </>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default CheckoutModal;
