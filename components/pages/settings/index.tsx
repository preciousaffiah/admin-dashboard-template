import { AdminLayout, GeneralLayout } from "@layouts";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainNavbar } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import {
  ChevronUp,
  CircleCheckBig,
  CircleX,
  Edit,
  Edit2,
  Edit3,
  LoaderCircle,
  Plus,
} from "lucide-react";
import Container from "@/components/shared/container";
import { createMenu } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ComboboxDemo from "@/components/shared/waiter/combobox";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemService, StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ToastMessage } from "@/components/serviette-ui";
import { handleAxiosError } from "@/utils/axios";
import avatar from "public/avatar.png";
import { useQRCode } from "next-qrcode";

const categoryArray: any = ["intercontinental"];
const deptArray: any = [
  "kitchen",
  "bar",
  "reception",
  "hospitality",
  "bakery",
  "waiter",
  "counter",
  "utilities",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

const formSchema = z.object({
  name: z.string().min(1, "required"),
  price: z
    .string()
    .min(1, { message: "required" })
    .regex(/^\d+$/, { message: "digits only" }),
  description: z.string().min(1, "required"),
  department: z.enum([
    "kitchen",
    "bar",
    "reception",
    "hospitality",
    "bakery",
    "waiter",
    "counter",
    "utilities",
  ]), //add field for other

  category: z.enum(["intercontinental"]), //add field for other
  image: z
    .string()
    .refine((val) => val.startsWith("data:"), {
      message: "Invalid file format",
    })
    .refine((val) => val.length <= MAX_BASE64_LENGTH, {
      message: "File size must be less than 4MB.",
    }),
  businessId: z.string().min(1, "required").optional(),
});

const defaultMenu: createMenu = {
  name: "",
  price: 0,
  description: "",
  category: "",
  department: "",
  image: "",
  businessId: "",
};

const Settings = ({ title }: { title: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "0",
      description: "",
      category: undefined,
      department: undefined,
      image: "",
      businessId: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const { Image } = useQRCode();
  const [success, setSuccess] = useState(false);

  const [menu, setMenu] = useState<createMenu>(defaultMenu);
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageStatus, setImageStatus] = useState<"edit" | "loading" | "error">(
    "edit"
  );

  const [imagePreview, setImagePreview] = useState<string>("");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { userData, updateUser, token } = useAuthToken();

  const updateImageRequest: any = async (image: string) => {
    try {
      const response = await StaffService.updateStaff(userData?.user_id || "", {
        image: image,
        businessId: userData?.businessId || "",
      });

      return response.data;
    } catch (error: any) {
      setImageStatus("error"); // Update icon based on validation
      handleAxiosError(error, "");
    }
  };

  const imageMutation = useMutation({
    mutationFn: (image: string) => updateImageRequest(image),
    onSuccess: (res: any) => {
      setImageStatus("edit");
      updateUser({
        token: token || "",
        userData: {
          businessId: userData?.businessId || "",
          department: userData?.department || "",
          email: userData?.email || "",
          fullname: userData?.fullname || "",
          role: userData?.role || "",
          subscriptionPlan: userData?.subscriptionPlan || "",
          user_id: userData?.user_id || "",
          image: res.data.data.image,
        },
      });
    },
  });

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image upload and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string; // Get the base64 string
        form.setValue("image", base64);
        form.setValue("businessId", userData?.businessId || "");
        setMenu((prevOrder) => ({
          ...prevOrder,
          image: base64,
        }));
        setImagePreview(base64);

        // Validate only the 'image' field
        const isValid = await form.trigger("image");
        setImageStatus("loading"); // Update icon based on validation
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }

    imageMutation.mutate(imagePreview);
  };

  // Function to trigger the file input click
  const handleIconClick = () => {
    if (imageStatus === "loading") return null;
    fileInputRef.current?.click();
  };

  const handlePrint = () => {
    if (sectionRef.current) {
      const printContent = sectionRef.current.innerHTML;
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(`
        <html>
        <head>
            <style>
                @media print {
                    body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    }
                    .print-area {
                    max-width: 300px; /* Adjust size as needed */
                    padding: 20px;
                    border: 1px solid black;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-area">${printContent}</div>
        </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  return (
    <AdminLayout title={title}>
      <div className="flex justify-end h-screen w-full">
        <Container>
          <div className="authcard3 md:py-24 py-16 md:h-fit lg:px-6 md:px-8 px-0 md:bg-inherit bg-primaryDark">
            <>
              <div className="w-full bg-primaryDark pt-4 md:pb-0 pb-6 rounded-md">
                <div className="w-full h-full">
                  <div className="px-3 flex pb-4 border-b border-primary-border">
                    <div className="flex w-full items-center gap-x-8">
                      <h1 className="capitalize font-semibold text-txWhite text-xl">
                        Admin Settings
                      </h1>
                    </div>
                    <div></div>
                  </div>
                  <div className="flex gap-x-4 pt-6 md:pb-6 pb-20 justify-between md:px-8 px-4 text-secondaryBorder">
                    <div className="md:w-[60%] w-full flex flex-col gap-y-3">
                      <div className="flex flex-col gap-y-4">
                        <Form {...form}>
                          <form className="w-full ">
                            <div className="w-full bg-secondaryDark text-txWhite mb-4 p-3 rounded-md">
                              <div className="flex text-txWhite w-full pb-4 justify-between">
                                <h2 className="font-medium capitalize">
                                  Update profile image
                                </h2>
                              </div>

                              <div className="flex items-baseline">
                                <div
                                  onClick={handleIconClick}
                                  className="rounded-full cursor-pointer gap-x-2 bg-primaryDark w-52 h-52 items-center flex"
                                >
                                  <div className="relative w-full h-full">
                                    <img
                                      src={
                                        imagePreview ||
                                        `${userData?.image || avatar.src}`
                                      }
                                      alt="Uploaded Preview"
                                      className="object-cover rounded-full w-full h-full"
                                    />
                                  </div>

                                  <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                      <FormItem className="hidden">
                                        <FormControl>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                            className="hidden"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-end" />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                {/* {imageMutation.isPending && (
                                  <LoaderCircle className="text-black w-4 rotate-icon" />
                                )} */}
                                <div className="relative right-6 cursor-pointer">
                                  {imageStatus === "loading" && (
                                    <LoaderCircle className="text-secondaryBorder rotate-icon w-5" />
                                  )}
                                  {imageStatus === "error" && (
                                    <CircleX className="text-secondaryBorder text-cancel w-5" />
                                  )}
                                </div>
                              </div>
                              {form.formState.errors.image && (
                                <p className="text-cancel text-sm">
                                  {form.formState.errors.image.message}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-y-6 py-3 bg-secondaryDark text-primary text-sm rounded-md px-4">
                              <div className="flex flex-col items-start justify-between py-4">
                                <h4 className="font-semibold">
                                  Add Business Details
                                </h4>
                              </div>
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <div>
                                      <p className="text-txWhite font-normal pb-2">
                                        Create Tables
                                      </p>
                                      <div className="w-full flex items-end gap-x-2">
                                        <p className="text-txWhite font-normal">
                                          Number of Tables:
                                        </p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="price"
                                            {...field}
                                            onChange={(e) => {
                                              // Allow only numbers
                                              const numericValue =
                                                e.target.value.replace(
                                                  /\D/g,
                                                  ""
                                                );
                                              field.onChange(numericValue); // Update the form value
                                            }}
                                            value={field.value} // Ensure the value is controlled
                                            className="md:w-16 w-full border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                          />
                                        </FormControl>
                                        <p className="cursor-pointer text-primaryLime font-medium">
                                          {saved ? "Saved" : "Save"}
                                        </p>
                                      </div>
                                    </div>
                                    <FormMessage className="pt-2" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <div>
                                      <h4 className="font-semibold pb-2">
                                        Generate Table QR Code
                                      </h4>
                                      <div className="w-full flex gap-x-2 items-end">
                                        <p className="text-txWhite font-normal">
                                          Table Number:
                                        </p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="description"
                                            {...field}
                                            className="md:w-16 w-full border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                          />
                                        </FormControl>
                                        <p className="cursor-pointer text-primaryLime font-medium">
                                          {saved ? "Generated" : "Generate"}
                                        </p>
                                      </div>
                                    </div>
                                    <FormMessage className="pt-2" />
                                  </FormItem>
                                )}
                              />
                              <div className="flex items-end gap-x-2">
                                <div
                                  ref={sectionRef}
                                  className="p-4 border mt-4"
                                  id="print-section"
                                >
                                  <Image
                                    text={
                                      "https://github.com/bunlong/next-qrcode"
                                    }
                                    options={{
                                      type: "image/jpeg",
                                      errorCorrectionLevel: "M",
                                      margin: 2,
                                      scale: 1,
                                      width: 250,
                                    }}
                                  />
                                </div>

                                <p
                                  onClick={handlePrint}
                                  className="cursor-pointer text-primaryLime font-semibold pt-4 w-fit"
                                >
                                  Print
                                </p>
                              </div>
                            </div>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </Container>
      </div>
    </AdminLayout>
  );
};

export default Settings;
