import {
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { ItemService, StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleAxiosError } from "@/utils/axios";

const DeleteItemModal = ({ itemId }: { itemId: string }) => {
  const { userData } = useAuthToken();

  const [success, setSuccess] = useState(false);

  let businessId = userData?.businessId || "";

  const addStaffRequest: any = async () => {
    try {
      const response = await ItemService.deleteItem(itemId, businessId);

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: addStaffRequest,
    onSuccess: (res: any) => {
      setSuccess(true);
    },
  });

  const onSubmit = () => mutation.mutate();

  return (
    <DialogOverlay className="bg-[#bbc47c99] backdrop-blur-[5px]">
      <DialogContent showOverlay={false} className="sm:max-w-md text-black">
        {success ? (
          <div className="flex flex-col justify-center items-center">
            <video
              className="w-28 h-24"
              src="/svg.mp4" // Place the MP4/WebM file in "public"
              autoPlay
              muted
              playsInline
            />
            <p>Item deleted successfully</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                Are you sure you want to delete this item?
              </DialogTitle>
            </DialogHeader>
            <AnimatePresence>
              {mutation.isError && (
                <motion.div
                  initial={{ y: -20, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0.2 }}
                >
                  <ToastMessage
                    message={
                      mutation?.error?.message ||
                      "An error occured during sign up"
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <DialogFooter className="sm:justify-start font-edu flex md:flex-row flex-col gap-y-3">
              <Button
                onClick={onSubmit}
                variant="ghost"
                className="font-edu font-normal border-2 border-primary-orange text-primary-orange"
              >
                Yes, delete
                {mutation.isPending && (
                  <LoaderCircle className="text-primary-orange w-4 rotate-icon" />
                )}
              </Button>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-edu font-normal bg-primary-orange text-white"
                >
                  No, cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
};

export default DeleteItemModal;
