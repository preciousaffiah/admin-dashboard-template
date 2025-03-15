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
  FolderOpen,
  Loader,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";
import Container from "@/components/shared/container";
import { createMenu, settings } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ComboboxDemo from "@/components/shared/waiter/combobox";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusService, ItemService, StaffService } from "@/services";
import { useAuthToken, useBusinessDetails } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const departments: string[] = [
  "kitchen",
  "bar",
  "reception",
  "hospitality",
  "bakery",
  "counter",
  "utilities",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

const formSchema = z.object({
  accountNumber: z
    .string()
    .min(1, { message: "required" })
    .regex(/^\d+$/, { message: "digits only" })
    .optional(),
  bankName: z
    .string()
    .min(1, { message: "required" })
    .regex(/^[A-Za-z\s]+$/, { message: "letters only" })
    .optional(),
  accountName: z
    .string()
    .min(1, { message: "required" })
    .regex(/^[A-Za-z\s]+$/, { message: "letters only" })
    .optional(),
  menuCategories: z
    .array(
      z
        .string()
        .min(1, { message: "required" })
        .regex(/^[A-Za-z\s]+$/, { message: "letters only" })
    )
    .min(1, { message: "required" })
    .optional(),
  tableQuantity: z
    .string()
    .min(1, { message: "required" })
    .regex(/^\d+$/, { message: "digits only" })
    .optional(),
  tableNumber: z
    .string()
    .min(1, { message: "required" })
    .regex(/^\d+$/, { message: "digits only" })
    .optional(),
  image: z
    .string()
    .refine((val) => val.startsWith("data:"), {
      message: "Invalid file format",
    })
    .refine((val) => val.length <= MAX_BASE64_LENGTH, {
      message: "File size must be less than 4MB.",
    })
    .optional(),
  businessId: z.string().min(1, "required").optional(),
});

const defaultMenu: settings = {
  accountNumber: 0,
  bankName: "",
  accountName: "",
  menuCategories: [],
  tableQuantity: 0,
  tableNumber: 0,
  image: "",
  businessId: "",
};

const Settings = ({ title }: { title: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      accountName: "",
      menuCategories: [],
      bankName: "",
      tableQuantity: "",
      tableNumber: "",
      image: "",
      businessId: "",
    },
  });

  const { Image } = useQRCode();
  const [menu, setMenu] = useState<settings>(defaultMenu);
  const [imageStatus, setImageStatus] = useState<"edit" | "loading" | "error">(
    "edit"
  );

  const { userData, updateUser, token } = useAuthToken();

  const { data, isLoading } = useBusinessDetails({
    id: userData?.businessId || undefined,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [imagePreview, setImagePreview] = useState<string>("");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [domain, setDomain] = useState("");

  useEffect(() => {
    // Check if window is defined (client side)
    if (typeof window !== "undefined") {
      setDomain(window.location.origin);
    }
  }, []);

  // Sync categories with businessData
  useEffect(() => {
    if (data?.menuCategories) {
      setCategories(data.menuCategories);
      form.setValue("menuCategories", data.menuCategories);
    }
  }, [data, form.setValue]);

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

        if (!isValid) {
          return null;
        }
        imageMutation.mutate();

        setImageStatus("loading"); // Update icon based on validation
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const updateImageRequest: any = async () => {
    try {
      const response = await StaffService.updateStaff(userData?.user_id || "", {
        image: form.getValues("image"),
        businessId: userData?.businessId || "",
      });

      return response.data;
    } catch (error: any) {
      setImageStatus("error"); // Update icon based on validation
      handleAxiosError(error, "");
    }
  };

  const imageMutation = useMutation({
    mutationFn: updateImageRequest,
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
      form.reset();
    },
  });

  // Function to trigger the file input click
  const handleIconClick = () => {
    if (imageStatus === "loading") return null;
    fileInputRef.current?.click();
  };

  const handleCreateTable = async () => {
    // Validate only the 'image' field
    const isValid = await form.trigger("tableQuantity");

    if (!isValid) {
      return null;
    }

    tablesMutation.mutate();
  };

  const createTablesRequest: any = async () => {
    try {
      const response = await BusService.createTables({
        businessId: userData?.businessId || "",
        tableQuantity: form.getValues("tableQuantity") || "",
      });

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const tablesMutation = useMutation({
    mutationFn: createTablesRequest,
    onSuccess: (res: any) => {
      form.reset();
    },
  });

  const handleAccountDetails = async () => {
    // Check if at least one field has a value
    const hasAtLeastOneValue = [
      form.getValues("accountNumber"),
      form.getValues("bankName"),
      form.getValues("accountName"),
    ].some((value) => value && value.trim() !== "");

    if (!hasAtLeastOneValue) {
      return null;
    }
    accountMutation.mutate();
  };

  const accountDetailsRequest: any = async () => {
    try {
      const response = await BusService.updateBusiness(
        userData?.businessId || "",
        { ...form.getValues(), menuCategories: categories }
      );

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const accountMutation = useMutation({
    mutationFn: accountDetailsRequest,
    onSuccess: (res: any) => {
      form.reset();
    },
  });

  const categoriesMutation = useMutation({
    mutationFn: accountDetailsRequest,
    onSuccess: (res: any) => {
      form.reset();
    },
  });

  // Remove category
  const handleRemoveCategory = (category: string) => {
    const updatedCategories = categories.filter((c) => c !== category);
    setCategories(updatedCategories);
    form.setValue("menuCategories", updatedCategories);
  };

  // Add category
  const handleAddCategory = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const menuCategories = form.getValues("menuCategories") ?? [];
    if (
      newCategory.trim() !== "" ||
      (categories !== menuCategories && menuCategories.length > 0)
    ) {
      e.preventDefault();

      // Split input by space and filter out empty values
      const newCategoriesArray = newCategory
        .trim()
        .split(" ")
        .filter((item) => item !== "");

      // Ensure no duplicates
      const updatedCategories = Array.from(
        new Set([...categories, ...newCategoriesArray])
      );

      setCategories(updatedCategories);
      form.setValue("menuCategories", updatedCategories);

      categoriesMutation.mutate();
      setNewCategory(""); // Clear input
    }
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

  // GET ITEMS
  const fetchTable = async () => {
    try {
      const response = await BusService.getTable(
        userData?.businessId || "", // businessId
        Number(form.getValues("tableNumber"))
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: isTableLoading,
    isError: isTableError,
    data: tableData,
    refetch: tableRefetch,
    isRefetching: isTableRefetching,
  } = useQuery<any, Error>({
    queryKey: [
      "get-table",
      userData?.businessId || "",
      form.getValues("tableNumber"),
    ],
    queryFn: fetchTable,
    enabled: false,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
  });

  const handleGenerateQrCode = async () => {
    const isValid = await form.trigger("tableNumber");
    if (!isValid) {
      return null;
    }
    tableRefetch();
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
                    <div className="w-full">
                      <div className="flex flex-col gap-y-4">
                        <Form {...form}>
                          <form className="w-full flex md:flex-row flex-col gap-x-4">
                            <div className="md:w-[60%] w-full flex flex-col gap-y-3">
                              <div className="w-full bg-secondaryDark text-txWhite p-3 rounded-md">
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
                                <p className="text-xs text-secondaryBorder font-medium">
                                  *Image must be less than 4MB
                                </p>
                              </div>

                              <div className="flex flex-col gap-y-3 py-3 bg-secondaryDark text-primary text-sm rounded-md px-4">
                                <div className="flex flex-col items-start justify-between py-4">
                                  <h4 className="font-semibold text-lg">
                                    Business Bank Details
                                  </h4>
                                  <AnimatePresence>
                                    {accountMutation.isError && (
                                      <motion.div
                                        initial={{ y: -20, opacity: 0.5 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0.2 }}
                                      >
                                        <ToastMessage
                                          message={
                                            accountMutation?.error?.message ||
                                            "An error occured during sign up"
                                          }
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <p className="text-primary font-medium">
                                  Update details
                                </p>
                                <FormField
                                  control={form.control}
                                  name="accountNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <div className="w-full flex items-end gap-x-2">
                                          <p className="text-txWhite font-normal">
                                            Account Number:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="accountNumber"
                                              {...field}
                                              onChange={(e) => {
                                                const numericValue =
                                                  e.target.value.replace(
                                                    /^0+|[^0-9]/g,
                                                    ""
                                                  );

                                                field.onChange(numericValue); // Update the form value
                                              }}
                                              value={field.value} // Ensure the value is controlled
                                              className="lg:w-1/5 w-1/2 border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                        </div>
                                        <p className="font-medium">
                                          {data?.accountNumber}
                                        </p>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="accountName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <div className="w-full flex items-end gap-x-2">
                                          <p className="text-txWhite font-normal">
                                            Account Name:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="accountName"
                                              {...field}
                                              onChange={(e) => {
                                                const letterValue =
                                                  e.target.value.replace(
                                                    /[^A-Za-z\s]/g,
                                                    ""
                                                  ); // Remove anything that's not a letter or space
                                                field.onChange(letterValue); // Update the form value
                                              }}
                                              value={field.value} // Ensure the value is controlled
                                              className="lg:w-1/5 w-1/2 border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                        </div>
                                        <p className="font-medium">
                                          {data?.accountName}
                                        </p>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="bankName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <div className="w-full flex items-end gap-x-2">
                                          <p className="text-txWhite font-normal">
                                            Bank Name:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="bankName"
                                              {...field}
                                              onChange={(e) => {
                                                const letterValue =
                                                  e.target.value.replace(
                                                    /[^A-Za-z\s]/g,
                                                    ""
                                                  ); // Remove anything that's not a letter or space
                                                field.onChange(letterValue); // Update the form value
                                              }}
                                              value={field.value}
                                              className="lg:w-1/5 w-1/2 border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                        </div>
                                        <p className="font-medium">
                                          {data?.bankName}
                                        </p>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />

                                {!accountMutation.isPending && (
                                  <button
                                    onClick={handleAccountDetails}
                                    type="button"
                                    className="bg-primaryGreen rounded-sm text-xs text-primary px-2 py-1  w-fit cursor-pointer font-medium"
                                  >
                                    Save
                                  </button>
                                )}

                                {accountMutation.isPending && (
                                  <LoaderCircle className="text-secondaryBorder w-5 h-5 rotate-icon" />
                                )}
                              </div>
                            </div>

                            <div className="md:w-[40%] w-full flex flex-col gap-y-3">
                              <div className="flex flex-col gap-y-3 py-3 bg-secondaryDark text-primary text-sm rounded-md px-4">
                                <div className="flex flex-col items-start justify-between py-4">
                                  <h4 className="font-semibold text-lg">
                                    Tables
                                  </h4>
                                  <AnimatePresence>
                                    {tablesMutation.isError && (
                                      <motion.div
                                        initial={{ y: -20, opacity: 0.5 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0.2 }}
                                      >
                                        <ToastMessage
                                          message={
                                            tablesMutation?.error?.message ||
                                            "An error occured during sign up"
                                          }
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <FormField
                                  control={form.control}
                                  name="tableQuantity"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <p className="text-primary font-medium pb-2">
                                          Add more Tables
                                        </p>
                                        <div className="w-full flex items-end gap-x-2">
                                          <p className="text-txWhite font-normal">
                                            Number of Tables:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="tableQuantity"
                                              {...field}
                                              onChange={(e) => {
                                                const numericValue =
                                                  e.target.value.replace(
                                                    /^0+|[^0-9]/g,
                                                    ""
                                                  );

                                                field.onChange(numericValue); // Update the form value
                                              }}
                                              value={field.value ?? ""}
                                              className="w-16 border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                          {!tablesMutation.isPending && (
                                            <button
                                              onClick={handleCreateTable}
                                              type="button"
                                              disabled={
                                                !form
                                                  .getValues("tableQuantity")
                                                  ?.trim()
                                              }
                                              className="bg-primaryGreen rounded-sm text-xs text-primary px-2 py-1 cursor-pointer font-medium"
                                            >
                                              Save
                                            </button>
                                          )}

                                          {tablesMutation.isPending && (
                                            <LoaderCircle className="text-secondaryBorder w-5 h-5 rotate-icon" />
                                          )}
                                        </div>
                                      </div>

                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="tableNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <h4 className="font-medium pb-2">
                                          Generate Table QR Code
                                        </h4>
                                        <div className="w-full flex gap-x-2 items-end">
                                          <p className="text-txWhite font-normal">
                                            Table Number:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="tableNumber"
                                              {...field}
                                              onChange={(e) => {
                                                const numericValue =
                                                  e.target.value.replace(
                                                    /^0+|[^0-9]/g,
                                                    ""
                                                  );

                                                field.onChange(numericValue); // Update the form value
                                              }}
                                              value={field.value ?? ""}
                                              className="w-16 border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                          <button
                                            onClick={handleGenerateQrCode}
                                            type="button"
                                            disabled={
                                              !form
                                                .getValues("tableNumber")
                                                ?.trim()
                                            }
                                            className="bg-primaryGreen rounded-sm text-xs text-primary px-2 py-1  cursor-pointer font-medium"
                                          >
                                            Generate
                                          </button>
                                        </div>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                {(isTableRefetching || isTableLoading) && (
                                  <div className="w-1/2 flex justify-center">
                                    <LoaderCircle className="text-secondaryBorder rotate-icon" />
                                  </div>
                                )}

                                {isTableError && (
                                  <div className="w-1/2 text-xs flex flex-col items-center justify-center">
                                    <FolderOpen className="w-4 text-secondaryBorder" />
                                    Table not found
                                  </div>
                                )}

                                {tableData &&
                                  !isTableRefetching &&
                                  !isTableLoading && (
                                    <div className="flex items-end gap-x-2">
                                      <div
                                        ref={sectionRef}
                                        className="p-4 border mt-4"
                                        id="print-section"
                                      >
                                        <Image
                                          text={`${domain}/${
                                            data?.name
                                          }/table/${form.getValues(
                                            "tableNumber"
                                          )}`}
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
                                  )}
                              </div>

                              <div className="flex flex-col gap-y-3 py-3 bg-secondaryDark text-primary text-sm rounded-md px-4">
                                <div className="flex flex-col items-start justify-between py-4">
                                  <h4 className="font-semibold text-lg">
                                    Menu
                                  </h4>
                                  <AnimatePresence>
                                    {categoriesMutation.isError && (
                                      <motion.div
                                        initial={{ y: -20, opacity: 0.5 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0.2 }}
                                      >
                                        <ToastMessage
                                          message={
                                            categoriesMutation?.error
                                              ?.message ||
                                            "An error occured during sign up"
                                          }
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <p className="text-primary font-medium">
                                  Update categories
                                </p>
                                <FormField
                                  control={form.control}
                                  name="menuCategories"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <div className="w-full flex items-end gap-x-2">
                                          <p className="text-txWhite font-normal">
                                            Categories:
                                          </p>
                                          <FormControl>
                                            <input
                                              type="text"
                                              id="menuCategories"
                                              {...field}
                                              onChange={(e) => {
                                                const letterValue =
                                                  e.target.value.replace(
                                                    /[^A-Za-z\s]/g,
                                                    ""
                                                  ); // Remove anything tha's not a letter or space
                                                field.onChange(letterValue); // Update the form value
                                                setNewCategory(letterValue);
                                              }}
                                              value={newCategory}
                                              className="w-full border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                            />
                                          </FormControl>
                                        </div>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <div className="w-full flex gap-2 flex-wrap p-3">
                                  {categories.map((category, index) => (
                                    <div
                                      key={index}
                                      className="capitalize flex items-center justify-center bg-primaryDark hover:bg-[#ff831754] hover:px-5 transition-all w-fit cursor-pointer text-sm text-gray-800 rounded-xl px-3 py-1"
                                    >
                                      <p>{category}</p>
                                      <X
                                        onClick={() =>
                                          handleRemoveCategory(category)
                                        }
                                        className="w-3.5 ml-1 text-secondaryBorder hover:text-primary-border"
                                      />
                                    </div>
                                  ))}
                                </div>
                                {!categoriesMutation.isPending && (
                                  <button
                                    onClick={(e: any) => handleAddCategory(e)}
                                    type="button"
                                    className="bg-primaryGreen rounded-sm text-xs text-primary px-2 py-1  w-fit cursor-pointer font-medium"
                                  >
                                    Save
                                  </button>
                                )}

                                {categoriesMutation.isPending && (
                                  <LoaderCircle className="text-secondaryBorder w-5 h-5 rotate-icon" />
                                )}
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
