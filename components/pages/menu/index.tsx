import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainNavbar, Modal } from "@/components/shared";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Menus } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { handleRowClick } from "@/utils/modal";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import orderImg2 from "public/auth-email.png";
import AdminMenuTable from "@/components/shared/admin/table/menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  Circle,
  CircleX,
  Edit3,
  EllipsisVertical,
  LayoutGrid,
  List,
  LoaderCircle,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";
import { Input } from "@/components/ui/input";
import { DeptEnum } from "@/types/enums";
import { useAuthToken } from "@/hooks";
import { handleAxiosError } from "@/utils/axios";
import { ItemService } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { ToastMessage } from "@/components/serviette-ui";

let tabKey: string = "";

const tabs = ["yesterday", "today", "This Week", "This Month", "This Year"];

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
  image: "",
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};
const defaultValues = {
  category: null,
  image: null,
  name: null,
  price: null,
  discount: null,
  description: null,
  department: null,
};
const tableHeaders = [
  "S/N",
  "Menu Item",
  "Category",
  "price",
  "Discount",
  "Department",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

// TODO: compress files and images using sharp

const formSchema = z
  .object({
    price: z
      .string()
      .min(1, { message: "required" })
      .regex(/^\d+$/, { message: "digits only" })
      .optional(),
    discount: z
      .string()
      .min(1, { message: "required" })
      .regex(/^\d+$/, { message: "digits only" })
      .optional(),
    description: z.string().min(1, "required").optional(),
    department: z
      .enum([
        "kitchen",
        "bar",
        "reception",
        "hospitality",
        "bakery",
        "waiter",
        "counter",
        "utilities",
      ])
      .optional(), //add field for other

    category: z.enum(["intercontinental"]).optional(), //add field for other
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
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined && value !== ""),
    { message: "At least one field must be filled" }
  );

const Menu: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Ensures validation checks on each change
  });
  const { token, userData } = useAuthToken();

  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus>(defaultInvoice);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHeader, setMenuHeader] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState<"edit" | "loading" | "error">(
    "edit"
  );

  const categoryArray = ["intercontinental"];
  const deptArray = [
    "kitchen",
    "bar",
    "reception",
    "hospitality",
    "bakery",
    "counter",
    "utilities",
  ];

  // Handle image upload and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageStatus("loading"); // Show loading icon
      // setIsImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string; // Get the base64 string
        form.setValue("image", base64);
        form.setValue("businessId", userData?.businessId || "");
        setImagePreview(base64);

        // Validate only the 'image' field
        const isValid = await form.trigger("image");

        if (!isValid) {
          console.error(form.formState.errors.image?.message); // Log validation error
        }
        setImageStatus(isValid ? "edit" : "error"); // Update icon based on validation

        // await form.trigger(); // Ensure validation runs before submitting
        form.handleSubmit(onSubmit)(); // Call your form submission logic
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to trigger the file input click
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const updateItemRequest: any = async () => {
    try {
      form.setValue("businessId", userData?.businessId || "");

      const response = await ItemService.updateItem(
        selectedInvoice._id,
        form.getValues()
      );
      console.log("form response", response.data);
      return response.data;
    } catch (error: any) {
      console.log("form error response", error.response.data);

      throw new Error(
        error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "An error occurred"
      );
    }
  };

  const mutation: any = useMutation({
    mutationFn: updateItemRequest,
    onSuccess: (res: any) => {
      setImageStatus("edit");
      form.reset();
    },
  });

  const onSubmit = () => mutation.mutate();

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
          <Tabs defaultValue={tabs[0]} className="w-full md:px-0 px-2">
            <div className="w-full bg-primaryDark pt-4 rounded-md">
              <div className="w-full h-full">
                <div className="px-3 flex pb-4 border-b border-primary-border">
                  <div className="flex w-full items-center gap-x-8">
                    <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                      Your Menu
                    </h1>
                    {userData?.department === DeptEnum.ADMIN ? (
                      <Link
                        href="/admin/create-menu"
                        target="_blank"
                        className="authbtn w-fit m-0 px-1 py-2 text-sm font-semibold"
                      >
                        Add to Menu
                      </Link>
                    ) : null}
                  </div>
                  <div>
                    <Button
                      onClick={() => setView(!view)}
                      className="transparent-btn text-secondaryBorder"
                    >
                      {view ? (
                        <>
                          <LayoutGrid className="w-5" />
                          <p className="capitalize text-sm">Grid view</p>
                        </>
                      ) : (
                        <>
                          <List className="w-5" />
                          <p className="capitalize text-sm">List view</p>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <AdminMenuTable
                  view={view}
                  currentPage={currentPage}
                  handleRowClick={handleRowClick}
                  tableHeaders={tableHeaders}
                  tabHeaders={tabHeaders}
                  tabKey={tabKey}
                  setIsOpen={setIsOpen}
                  setSelectedInvoice={setSelectedInvoice}
                  selectedInvoice={selectedInvoice}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </Tabs>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>
              <div className="">
                <div className="px-3">
                  <div className="flex justify-between rounded-xl px-2 items-center bg-selectedRow h-16 text-txWhite">
                    <div className="flex flex-col h-full justify-center gap-y-3">
                      <p className="md:text-xl text-lg font-medium">
                        Item Details
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-center">
                        <p
                          className={`capitalize text-txWhite font-medium status-cancelled text-center  flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                        >
                          {selectedInvoice.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-txWhite">
                    <div className="gap-y-3 flex flex-col h-full justify-center text-secondaryBorder">
                      <div className="flex w-full h-full justify-center items-end">
                        <div className="w-36 h-36">
                          {imagePreview ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={imagePreview}
                                alt="img"
                                layout="fill"
                                objectFit="cover"
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) : (
                            <img
                              src={selectedInvoice.image}
                              className="w-full h-full rounded-full object-cover"
                            />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          className="hidden"
                        />

                        <div className="relative right-6 cursor-pointer">
                          {imageStatus === "edit" && (
                            <Edit3
                              onClick={handleIconClick}
                              className="text-primaryLime"
                            />
                          )}
                          {imageStatus === "loading" && (
                            <LoaderCircle className="text-secondaryBorder rotate-icon" />
                          )}
                          {imageStatus === "error" && (
                            <CircleX
                              onClick={handleIconClick}
                              className="text-secondaryBorder text-cancel"
                            />
                          )}
                        </div>
                      </div>
                      {form.formState.errors.image && (
                        <p className="text-cancel text-sm">
                          {form.formState.errors.image.message}
                        </p>
                      )}
                      <div className="w-full flex flex-col text-center">
                        <p className="text-2xl font-medium capitalize text-txWhite">
                          {selectedInvoice.name}
                        </p>
                      </div>
                      <div className="m-auto">
                        <p className="flex bg-primaryGreen rounded-md items-center text-background 1 w-fit m-0 px-6 py-2 text-sm font-semibold">
                          Full Menu
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Tabs
                defaultValue="items"
                className="md:text-base text-sm w-full
                    border-b-[0.3px] border-b-primary-border -border"
              >
                <div className="w-full px-4">
                  <TabsList className="w-fit flex px-0 gap-x-4">
                    <TabsTrigger
                      value="items"
                      className="active-order-tab px-0 py-1 rounded-lg capitalize"
                      onClick={() => setMenuHeader(false)}
                    >
                      items
                    </TabsTrigger>
                    <TabsTrigger
                      value="edit"
                      className="active-order-tab px-0 py-1 rounded-lg capitalize"
                      onClick={() => setMenuHeader(true)}
                    >
                      <Edit3 />
                      edit
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="items" className="w-full">
                  <div>
                    <div className="flex py-2 px-4">
                      <div className="w-full">
                        <div className="text-txWhite justify-between w-full flex px-0 gap-x-4">
                          <h1 className="">Item Summary</h1>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>
                          <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                            <div className="flex flex-col gap-y-3 w-full">
                              <div className="flex justify-between">
                                <p>Department</p>
                                <p className="text-txWhite">
                                  {selectedInvoice.department}{" "}
                                </p>
                              </div>
                              <div className="flex justify-between">
                                <p>Category</p>
                                <p>{selectedInvoice.category} </p>
                              </div>
                              <div className="flex justify-between">
                                <p>Discount</p>
                                <p>
                                  ₦
                                  {Number(selectedInvoice.discount)?.toFixed(2)}{" "}
                                </p>
                              </div>
                              <div className="flex justify-between">
                                <p>Price</p>
                                <p>
                                  ₦{Number(selectedInvoice?.price)?.toFixed(2)}{" "}
                                </p>
                              </div>
                              <div className="flex justify-between gap-x-8">
                                <p>Description</p>
                                <p>{selectedInvoice.description} </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                            <button className="flex text-white m-auto rounded-xl bg-cancel p-2 ">
                              <X /> Delete Item
                            </button>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="w-full">
                  <div>
                    <div>
                      <div>
                        <div>
                          <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full flex flex-col gap-y-5"
                              >
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
                                          "An error occured during process"
                                        }
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <FormField
                                  control={form.control}
                                  name="discount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex justify-between items-baseline">
                                        <p
                                        // className="text-txWhite font-normal pb-2"
                                        >
                                          Discount
                                        </p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="discount"
                                            placeholder="Enter Item Discount Price"
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
                                            className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex justify-between items-baseline">
                                        <p>Price</p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="price"
                                            placeholder="Enter Iteem Price"
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
                                            className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                          />
                                        </FormControl>
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
                                      <div className="md:flex justify-between items-baseline">
                                        <p>Description</p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="description"
                                            placeholder="Enter Item Description"
                                            {...field}
                                            className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="department"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="md:flex justify-between items-baseline">
                                        <h1>Department</h1>
                                        <FormControl>
                                          <select
                                            {...field}
                                            className="md:w-9/12 w-full border-primary-border border-[1px] rounded-md p-2 bg-transparent"
                                          >
                                            <option
                                              value="none"
                                              selected
                                              disabled
                                              hidden
                                            >
                                              Select department
                                            </option>
                                            <option value="waiter">
                                              waiter
                                            </option>
                                            <option value="bar">bar</option>
                                            <option value="kitchen">
                                              kitchen
                                            </option>
                                          </select>
                                        </FormControl>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="category"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="md:flex justify-between items-baseline">
                                        <h1>Category</h1>
                                        <FormControl>
                                          <select
                                            {...field}
                                            className="md:w-9/12 w-full border-primary-border border-[1px] rounded-md p-2 bg-transparent"
                                          >
                                            <option
                                              value="none"
                                              selected
                                              disabled
                                              hidden
                                            >
                                              Select category
                                            </option>
                                            <option value="intercontinental">
                                              intercontinental
                                            </option>
                                          </select>
                                        </FormControl>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-between p-3 items-center text-txWhite">
                                  <button
                                    type="submit"
                                    disabled={!form.formState.isValid}
                                    className={`place-order-btn text-white font-medium cursor-pointer ${
                                      form.formState.isValid
                                        ? "bg-primaryGreen"
                                        : "bg-lime-600"
                                    }
                                      flex items-center gap-x-1 m-auto rounded-xl p-2`}
                                  >
                                    Save
                                    {form.formState.isValid &&
                                    mutation.isPending ? (
                                      <LoaderCircle className="w-5 h-5 rotate-icon" />
                                    ) : (
                                      <Check />
                                    )}
                                  </button>
                                </div>
                              </form>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Modal>
        </div>
      </Container>
    </div>
  );
};

export default Menu;
