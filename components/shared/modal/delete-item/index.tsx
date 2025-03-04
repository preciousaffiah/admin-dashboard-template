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
import { StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

const formSchema = z
  .object({
    email: z.string().email("invalid email address"),
    businessId: z.string(),
    fullname: z
      .string()
      .min(1, "fullname is required")
      .regex(/^[A-Za-z\s]+$/, {
        message: "can only contain letters.", //revisit
      })
      .trim()
      .regex(/[a-zA-Z]/, {
        message: "must contain at least one letter.",
      })
      .refine((value) => !/\s{2,}/.test(value), {
        message: "contain multiple consecutive spaces.",
      }),
    phone: z.string().min(10, "must be at least 10 digits"),
    department: z.enum(["kitchen", "waiter", "bar"]), //add field for other
    image: z
      .string()
      .refine((val) => val.startsWith("data:"), {
        message: "Invalid file format",
      })
      .refine((val) => val.length <= MAX_BASE64_LENGTH, {
        message: "File size must be less than 4MB.",
      }), //TODO: add width and height
    password: z
      .string()
      .min(6, "must be at least 6 characters")
      .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  })
  .required();

const DeleteItemModal = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
      phone: "",
      department: undefined,
      image: "",
      password: "",
      businessId: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [showPassword, setShowPassword] = useState(false);
  const { userData } = useAuthToken();
  const addStaffRequest: any = async () => {
    form.setValue("businessId", userData?.businessId || "");

    try {
      const response = await StaffService.addStaff(form.getValues());

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "An error occurred"
      );
    }
  };

  const mutation: any = useMutation({
    mutationFn: addStaffRequest,
    onSuccess: (res: any) => {
      // setSuccess(true);
      form.reset();
    },
  });

  const onSubmit = () => mutation.mutate();

  return (
    //   <DialogContent className="sm:max-w-[425px] text-black">
    <DialogOverlay className="bg-[#bbc47c99] backdrop-blur-[5px]">
      <DialogContent showOverlay={false} className="sm:max-w-md text-black">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Are you sure you want to delete this item?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-start font-edu flex md:flex-row flex-col gap-y-3">
          <Button
            type="button"
            variant="ghost"
            className="font-edu font-normal border-2 border-primary-orange text-primary-orange"
          >
            Yes, delete
            {form.formState.isValid && mutation.isPending && (
              <LoaderCircle className="text-white w-4 rotate-icon" />
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
      </DialogContent>
    </DialogOverlay>
  );
};

export default DeleteItemModal;
