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
import { useQuery } from "@tanstack/react-query";

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
  _id: 0,
  image: "",
  name: "",
  price: 0,
  discount: "",
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

const validationSchema = z.object({
  Department: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),
  Name: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),

  itemImage: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),
  Category: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),
  Discount: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),
  Price: z
    .union([z.number().min(1, "Price must be at least 1"), z.null()])
    .transform((value: any) => (value === "" ? null : value)),

  Description: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.trim() !== "", {
      message: "Cannot contain whitespace", // Error message
    }),
});

const Menu: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const { token, userData } = useAuthToken();
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus>(defaultInvoice);
  // const [invoiceData, setInvoiceData] = useState<Menus[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHeader, setMenuHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);



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
      const imageUrl = URL.createObjectURL(file);

      setIsImageLoading(true);
      setTimeout(() => {
        console.log("...where image upload aapi comes in");
        setImagePreview(imageUrl);

        return setIsImageLoading(false);
      }, 3000);
    }
  };

    // Ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Function to trigger the file input click
    const handleIconClick = () => {
      fileInputRef.current?.click();
    };

  const formCheck = () => {
    // Filter out empty values
    const nonEmptyValues = Object.fromEntries(
      Object.entries(getValues()).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    // Check if all values are empty; if so, exit early
    if (Object.keys(nonEmptyValues).length === 0) {
      return false;
    }

    return nonEmptyValues;
  };

  useEffect(() => {
    const subscription = watch(() => {
      setIsButtonEnabled(!!formCheck());
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = () => {
    const nonEmptyValues = formCheck(); // Store result of formCheck

    if (!nonEmptyValues) {
      return null; // Stop if all values are empty
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log("...where update item api comes in");
      setIsLoading(false);
      return setSuccess(true);
    }, 2000);
  };


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
                              className="w-full h-full rounded-full"
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
                        {isImageLoading ? (
                          <LoaderCircle className="text-secondaryBorder rotate-icon" />
                        ) : (
                          <Edit3
                            onClick={handleIconClick}
                            className="text-primaryLime cursor-pointer"
                          />
                        )}
                      </div>

                      <div className="w-full flex flex-col text-center">
                        <p className="text-2xl font-medium capitalize text-txWhite">
                          {selectedInvoice.name}
                        </p>
                      </div>
                      <div className="m-auto">
                        <p className="flex bg-primaryGreen rounded-md items-center text-background 1 w-fit m-0 px-6 py-2 text-sm font-semibold">
                          View Full Menu
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
                                <p>₦{Number(selectedInvoice.discount)?.toFixed(2)} </p>
                              </div>
                              <div className="flex justify-between">
                                <p>Price</p>
                                <p>₦{Number(selectedInvoice?.price)?.toFixed(2)} </p>
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
                              <X /> Remove Menu
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
                            <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="flex flex-col gap-y-3 w-full text-base"
                            >
                              <div>
                                <div className="flex justify-between items-baseline">
                                  <label>Discount</label>
                                  <Input
                                    {...register("discount")}
                                    autoComplete="off"
                                    type="text"
                                    placeholder={selectedInvoice.discount}
                                    className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                  />
                                </div>
                                <p className="text-red-400 text-end text-sm">
                                  {errors.discount?.message}
                                </p>
                              </div>
                              <div>
                                <div className="flex justify-between items-baseline">
                                  <label>Price</label>
                                  <Input
                                    {...register("price")}
                                    autoComplete="off"
                                    type="number"
                                    placeholder={selectedInvoice?.price?.toString()}
                                    className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                  />
                                </div>
                                <p className="text-red-400 text-end text-sm">
                                  {errors.price?.message}
                                </p>
                              </div>
                              <div>
                                <div className="flex justify-between gap-x-8 items-baseline">
                                  <label>Description</label>
                                  <Input
                                    {...register("description")}
                                    autoComplete="off"
                                    type="text"
                                    placeholder={selectedInvoice.description}
                                    className="text-txWhite bg-transparent md:w-9/12 w-full md:placeholder:text-end border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0"
                                  />
                                </div>
                                <p className="text-red-400 text-end text-sm">
                                  {errors.description?.message}
                                </p>
                              </div>
                              <div>
                                <div className="md:flex justify-between items-baseline">
                                  <label>department</label>
                                  <select
                                    {...register("department")}
                                    id="department"
                                    className="md:w-9/12 w-full border-primary-border border-[1px] rounded-md p-2 bg-transparent"
                                  >
                                    <option value="" disabled selected hidden>
                                      Select an option
                                    </option>
                                    {deptArray.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <p className="text-red-400 text-end text-sm">
                                  {errors.department?.message}
                                </p>
                              </div>
                              <div>
                                <div className="flex justify-between items-baseline">
                                  <label>Category</label>
                                  <select
                                    {...register("category")}
                                    id="category"
                                    className="md:w-9/12 w-full border-primary-border border-[1px] rounded-md p-2 bg-transparent"
                                  >
                                    <option value="" disabled selected hidden>
                                      Select an option
                                    </option>
                                    {categoryArray.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <p className="text-red-400 text-end text-sm">
                                  {errors.category?.message}
                                </p>
                              </div>
                              <div>
                                <div className="flex justify-between p-3 items-center text-txWhite">
                                  <button
                                    disabled={!isButtonEnabled}
                                    className={`place-order-btn text-white font-medium ${
                                      isButtonEnabled
                                        ? "bg-primaryGreen"
                                        : "bg-lime-600"
                                    }
                                      flex items-center gap-x-1 m-auto rounded-xl p-2`}
                                  >
                                    Save
                                    {isLoading ? (
                                      <LoaderCircle className="w-5 h-5 rotate-icon" />
                                    ) : (
                                      <Check />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </form>
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
