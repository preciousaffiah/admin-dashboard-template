import { AdminLayout, GeneralLayout } from "@layouts";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainNavbar } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import { ChevronUp, CircleCheckBig, LoaderCircle, Plus } from "lucide-react";
import Container from "@/components/shared/container";
import { createMenu } from "@/types";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ComboboxDemo from "@/components/shared/waiter/combobox";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemService } from "@/services";
import { useAuthToken, useTabHeaders } from "@/hooks";
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

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

const formSchema = z.object({
  name: z.string().min(1, "required"),
  price: z
    .string()
    .min(1, { message: "required" })
    .regex(/^\d+$/, { message: "digits only" }),
  description: z.string().min(1, "required"),
  department: z.string().min(1, "required"), //add field for other
  category: z.string().min(1, "required"), //add field for other
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

const CreateMenu: FC = () => {
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

  const [success, setSuccess] = useState(false);

  const [menu, setMenu] = useState<createMenu>(defaultMenu);
  const [saved, setSaved] = useState(false);
  const { userData } = useAuthToken();

  const tabHeaders = useTabHeaders({
    id: userData?.businessId || undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addItemRequest: any = async () => {
    try {
      const response = await ItemService.addItem(form.getValues());

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: addItemRequest,
    onSuccess: (res: any) => {
      setSuccess(true);
      setMenu(defaultMenu); // clear menu
      form.reset();
    },
  });

  const onSubmit = () => mutation.mutate();

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

        if (!isValid) {
          console.error(form.formState.errors.image?.message); // Log validation error
        }

        // form.handleSubmit(onSubmit)(); // Call your form submission logic
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  // Function to trigger the file input click
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const setItemPreview = async () => {
    await form.trigger();
    setMenu((prevOrder) => ({
      ...prevOrder,
      category: form.getValues("category"),
      description: form.getValues("description"),
      name: form.getValues("name"),
      department: form.getValues("department"),
      price: Number(form.getValues("price")),
    }));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Reset after 2 seconds
  };

  const title = "Add to Menu";

  return (
    <AdminLayout title={title}>
      <div className="flex justify-end h-screen w-full">
        <Container>
          <div className="authcard3 md:py-24 py-16 md:h-fit lg:px-6 md:px-8 px-0 md:bg-inherit bg-primaryDark">
            {success ? (
              <div className="md:w-1/2 w-full h-screen m-auto bg-primaryDark z-50 rounded-xl">
                <div className="text-txWhite gap-y-4 flex flex-col justify-center items-center h-full">
                  {/* <CircleCheckBig
                    fill="green"
                    className="text-txWhite md:w-24 md:h-20 w-16 h-20"
                  /> */}
                  <div className="w-fit">
                    <video
                      className="w-28 h-24"
                      src="/svg.mp4" // Place the MP4/WebM file in "public"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                  <p className="font-semibold text-lg">
                    Item Created Successfully!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full bg-primaryDark pt-4 md:pb-0 pb-6 rounded-md">
                  <div className="w-full h-full">
                    <div className="px-3 flex pb-4 border-b border-primary-border">
                      <div className="flex w-full items-center gap-x-8">
                        <h1 className="capitalize font-semibold text-txWhite text-xl">
                          Add to Menu
                        </h1>
                      </div>
                      <div></div>
                    </div>
                    <div className="flex gap-x-4 pt-6 md:pb-6 pb-20 justify-between md:px-8 px-4 text-secondaryBorder">
                      <div className="md:w-[60%] w-full flex flex-col gap-y-3">
                        <h1 className="pb-4">Item Details</h1>
                        <div className="flex flex-col gap-y-4">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="w-full "
                            >
                              <div className="w-full text-txWhite  bg-secondaryDark mb-4 p-3 rounded-md">
                                <div className="flex text-txWhite w-full pb-4 justify-between">
                                  <h2 className="font-medium">
                                    Add item image
                                  </h2>
                                </div>

                                <div
                                  onClick={handleIconClick}
                                  className="gap-x-2 bg-primaryDark cursor-pointer w-52 h-52 rounded-md items-center flex"
                                >
                                  {imagePreview && (
                                    <div className="relative w-full h-full">
                                      <Image
                                        src={imagePreview}
                                        alt="Uploaded Preview"
                                        layout="fill"
                                        objectFit="cover"
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  )}

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
                                  {!imagePreview && (
                                    <Plus className="m-auto w-5" />
                                  )}
                                </div>
                                {form.formState.errors.image && (
                                  <p className="text-cancel text-sm">
                                    {form.formState.errors.image.message}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col gap-y-6 py-3 bg-secondaryDark text-sm rounded-md px-4">
                                <div className="flex flex-col items-start justify-between py-4">
                                  <h4 className="font-semibold">
                                    Add Item Details
                                  </h4>
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
                                </div>

                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div>
                                        <p className="text-txWhite font-normal pb-2">
                                          Name
                                        </p>

                                        <FormControl>
                                          <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter Item Name"
                                            {...field}
                                            className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
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
                                      <div>
                                        <p className="text-txWhite font-normal pb-2">
                                          Price
                                        </p>
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
                                            className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
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
                                      <div>
                                        <p className="text-txWhite font-normal pb-2">
                                          Description
                                        </p>
                                        <FormControl>
                                          <input
                                            type="text"
                                            id="description"
                                            placeholder="Enter Item Description"
                                            {...field}
                                            className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none outline-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                          />
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
                                      <div className="flex items-center gap-x-3 pb-2 md:w-1/2 w-full justify-between  border-0">
                                        <h1>Category</h1>
                                        <FormControl>
                                          <select
                                            {...field}
                                            className="capitalize md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                          >
                                            <option
                                              value="none"
                                              selected
                                              disabled
                                              hidden
                                            >
                                              Select category
                                            </option>
                                            {Object.keys(tabHeaders || {})
                                              .slice(1)
                                              .map(
                                                (item: any, index: number) => (
                                                  <option
                                                    value={item}
                                                    key={index}
                                                  >
                                                    {item}
                                                  </option>
                                                )
                                              )}
                                          </select>
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
                                      <div className="flex items-center gap-x-3 pb-2 md:w-1/2 w-full justify-between  border-0">
                                        <h1 className="w-full">
                                          Handling Department
                                        </h1>
                                        <FormControl>
                                          <select
                                            {...field}
                                            className="capitalize md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                          >
                                            <option
                                              value="none"
                                              selected
                                              disabled
                                              hidden
                                            >
                                              Select department
                                            </option>
                                            <option value="bar">Bar</option>
                                            <option value="waiter">
                                              Waiter
                                            </option>
                                          </select>
                                        </FormControl>
                                      </div>
                                      <FormMessage className="pt-2" />
                                    </FormItem>
                                  )}
                                />
                                <div
                                  onClick={setItemPreview}
                                  className="md:w-1/2 w-full text-base flex gap-x-4 justify-end text-primaryLime font-medium"
                                >
                                  <p className="cursor-pointer">
                                    {saved ? "Saved" : "Save"}
                                  </p>
                                </div>
                              </div>
                            </form>
                          </Form>
                        </div>
                      </div>
                      <div className="w-[40%] md:block hidden">
                        <h1 className="pb-4">Item Summary</h1>
                        <div
                          className={`${
                            !menu.image ? "h-[40rem]" : "h-fit"
                          } w-full flex justify-center bg-secondaryDark rounded-md`}
                        >
                          {!menu.image ? (
                            <p className="w-full m-auto text-center px-3">
                              Your item summary will show here.
                            </p>
                          ) : (
                            <div className="w-full flex flex-col justify-between">
                              <div className="border-b-[0.3px] border-b-primary-border -border">
                                <div className="px-3 pt-3">
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
                                          {menu.department}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-txWhite">
                                    <div className="gap-y-3 flex flex-col h-full justify-center text-secondaryBorder">
                                      <div className="w-36 h-36 m-auto">
                                        {imagePreview && (
                                          <Image
                                            alt="img"
                                            src={imagePreview}
                                            className="w-full h-full rounded-full object-cover"
                                            width={128}
                                            height={128}
                                          />
                                        )}
                                      </div>
                                      <div className="w-full flex flex-col text-center">
                                        <p className="text-2xl  break-all font-medium capitalize text-txWhite">
                                          {menu.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

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
                                        <div className="capitalize flex flex-col gap-y-3 w-full">
                                          <div className="flex justify-between">
                                            <p>Department</p>
                                            <p className="text-txWhite">
                                              {menu.department}
                                            </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Category</p>
                                            <p>{menu.category} </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Price</p>
                                            <p>₦{menu.price} </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Description</p>
                                            <p className="first-letter:uppercase lowercase w-full word-breaks text-right">
                                              {menu.description}{" "}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                                        <div className="p-3 w-full bg-foreground rounded-b-md">
                                          <button
                                            type="submit"
                                            onClick={onSubmit}
                                            className={`place-menu-btn  ${
                                              form.formState.isValid
                                                ? "bg-primaryGreen"
                                                : "bg-lime-700"
                                            }  w-full py-2 rounded-md text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                                          >
                                            Add to Menu
                                            {form.formState.isValid &&
                                              mutation.isPending && (
                                                <LoaderCircle className="text-black flex w-5 h-5 rotate-icon" />
                                              )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:hidden flex bg-background px-4 h-20 fixed bottom-0 w-full z-50">
                  <div className="text-xs flex w-full justify-between items-center">
                    <div className="text-txWhite font-medium w-full flex justify-between">
                      <Drawer>
                        <div className="w-full h-full flex gap-x-1">
                          <DrawerTrigger asChild>
                            <Button className="capitalize transparent-btn bg-transparent rounded-lg text-secondaryBorder">
                              <ChevronUp className="w-5 h-5" />
                              Item Details
                            </Button>
                          </DrawerTrigger>
                          <button
                            type="submit"
                            onClick={onSubmit}
                            disabled={!form.formState.isValid}
                            className={`place-menu-btn 
                               ${
                                 form.formState.isValid
                                   ? "bg-primaryGreen"
                                   : "bg-lime-700"
                               } 
                             w-full py-2 rounded-md text-sm text-black
                             flex items-center justify-center gap-x-2
                            `}
                          >
                            {form.formState.isValid && mutation.isPending && (
                              <LoaderCircle className="text-black flex w-5 h-5 rotate-icon" />
                            )}
                            Add to Menu
                          </button>
                        </div>
                        <DrawerContent className="h-[85%]  text-secondaryBorder bg-secondaryDark border-secondary-transparent-border w-full flex px-4 pb-4">
                          <div>
                            <h1 className="pb-4">Item Summary</h1>
                            <div
                              className={`${
                                !menu.image ? "h-[40rem]" : "h-fit"
                              } w-full flex justify-center bg-secondaryDark rounded-md`}
                            >
                              {!menu.image ? (
                                <p className="w-full m-auto text-center px-3">
                                  Your item summary will show here.
                                </p>
                              ) : (
                                <div className="w-full flex flex-col justify-between">
                                  <div className="border-b-[0.3px] border-b-primary-border -border">
                                    <div className="pt-3">
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
                                              {menu.department}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-txWhite">
                                        <div className="gap-y-3 flex flex-col h-full justify-center text-secondaryBorder">
                                          <div className="w-36 h-36 m-auto">
                                            {imagePreview && (
                                              <Image
                                                alt="img"
                                                src={imagePreview}
                                                className="w-full h-full rounded-full"
                                                width={128}
                                                height={128}
                                              />
                                            )}
                                          </div>
                                          <div className="w-full flex flex-col text-center">
                                            <p className="text-2xl  break-all font-medium capitalize text-txWhite">
                                              {menu.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

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
                                                  {menu.department}
                                                </p>
                                              </div>
                                              <div className="flex justify-between">
                                                <p>Category</p>
                                                <p>{menu.category} </p>
                                              </div>
                                              <div className="flex justify-between">
                                                <p>Price</p>
                                                <p>₦{menu.price} </p>
                                              </div>
                                              <div className="flex gap-x-5 justify-between">
                                                <p>Description</p>
                                                <p className="w-full truncate text-end">
                                                  {menu.description}{" "}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </AdminLayout>
  );
};

export default CreateMenu;
