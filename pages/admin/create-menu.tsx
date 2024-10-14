import { AuthLayout } from "@layouts";
import React, { FC, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainNavbar } from "@/components/shared";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import {
  ChevronUp,
  CircleCheckBig,
  Clock,
  EllipsisVertical,
  LoaderCircle,
  Mail,
  Phone,
  Plus,
  Wrench,
  X,
} from "lucide-react";
import Container from "@/components/shared/container";
import { createMenu } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ComboboxDemo from "@/components/shared/waiter/combobox";
import Link from "next/link";

const defaultMenu: createMenu = {
  name: "",
  price: 0,
  category: "",
  description: "",
  mealImage: "",
  department: "",
};

const CreateMenu: FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const [menu, setMenu] = useState<createMenu>(defaultMenu);
  const [errorMsg, setErrorMsg] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image upload and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);

      setMenu((prevOrder) => ({
        ...prevOrder,
        mealImage: imageUrl,
      }));
      setImagePreview(imageUrl);
    }
  };

  // Function to trigger the file input click
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    setValue,
    setError,
    getValues,
  } = useForm({
    defaultValues: defaultMenu,
  });

  const onSubmit1 = (data: any) => {
    data.mealImage = menu.mealImage;

    if (!data.mealImage || "") {
      return setImgError(true);
    } else {
      setImgError(false);
    }
    if (
      !data.category ||
      data.category === "" ||
      !data.department ||
      data.department === ""
    )
      return setErrorMsg(true);

    setMenu((prevOrder) => ({
      ...prevOrder,
      ...data,
      price: Number(data.price),
    }));
    setErrorMsg(false);
  };

  const isOrderComplete = () => {
    return (
      menu.mealImage !== "" &&
      menu.name !== "" &&
      menu.category !== "" &&
      menu.department !== "" &&
      menu.description !== "" &&
      menu.price > 0
    );
  };
  console.log(menu);

  const handleMenu = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("...where submit menu aapi comes in");
      setSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        setMenu(defaultMenu); // clear menu
        console.log("menu created");

        return window.location.reload();
      }, 2000);
    }, 2000);
  };
  const title = "Create Menu";

  return (
    <AuthLayout title={title}>
      <MainNavbar title={title} />
      <div className="flex justify-end h-screen w-full">
        <Sidebar />

        <Container>
          <div className="authcard3 md:py-24 py-16 md:h-fit lg:px-6 md:px-8 px-0">
            {success ? (
              <div className="md:w-1/2 w-full h-screen m-auto bg-primary-dark z-50 rounded-xl">
                <div className="text-white gap-y-4 flex flex-col justify-center items-center h-full">
                  <CircleCheckBig
                    fill="green"
                    className="text-white md:w-24 md:h-20 w-16 h-20"
                  />
                  <p className="font-semibold text-lg">
                    Menu Created Successfully!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full bg-primary-dark pt-4 md:pb-0 pb-6 rounded-md">
                  <div className="w-full h-full">
                    <div className="px-3 flex pb-4 border-b border-primary-border">
                      <div className="flex w-full items-center gap-x-8">
                        <h1 className="capitalize font-semibold text-white text-xl">
                          Create Menu
                        </h1>
                      </div>
                      <div></div>
                    </div>
                    <div className="flex gap-x-4 pt-6 md:pb-6 pb-20 justify-between md:px-8 px-4 text-secondary-border">
                      <div className="md:w-[60%] w-full flex flex-col gap-y-3">
                        <h1 className="pb-4">Meal Details</h1>
                        <div className="flex flex-col gap-y-4">
                          <form
                            onSubmit={handleSubmit1(onSubmit1)}
                            className="w-full "
                          >
                            <div className="w-full text-white  bg-secondary-dark mb-4 p-3 rounded-md">
                              <div className="flex text-white w-full pb-4 justify-between">
                                <h2 className="font-medium">Add meal image</h2>
                              </div>

                              <div
                                onClick={handleIconClick}
                                className="gap-x-2 bg-primary-dark cursor-pointer w-52 h-52 rounded-md items-center flex"
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
                                <Input
                                  type="file"
                                  accept="image/*"
                                  {...register1("mealImage")}
                                  onChange={handleImageChange}
                                  ref={fileInputRef}
                                  className="hidden"
                                />

                                {!imagePreview && (
                                  <Plus className="m-auto w-5" />
                                )}
                              </div>
                              {imgError && (
                                <p className="text-text-cancelled text-sm">
                                  meal image is required
                                </p>
                              )}
                            </div>
                            <div className="bg-secondary-dark rounded-md">
                              <div className="flex items-center justify-between p-4">
                                <h4 className="text-sm font-semibold">
                                  Add Meal Details
                                </h4>
                              </div>
                              <div className="px-4 py-3">
                                <div className="pb-4">
                                  <Label
                                    htmlFor="fname"
                                    className="text-white font-normal"
                                  >
                                    Name
                                  </Label>

                                  <Input
                                    type="text"
                                    id="name"
                                    placeholder="Enter Meal Name"
                                    {...register1("name", {
                                      required: true,
                                    })}
                                    className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                  />
                                  {errors1.name && (
                                    <p className="text-text-cancelled text-sm">
                                      meal name is required
                                    </p>
                                  )}
                                </div>
                                <div className="pb-4">
                                  <Label
                                    htmlFor="price"
                                    className="text-white font-normal"
                                  >
                                    Price
                                  </Label>
                                  <Input
                                    type="number"
                                    id="price"
                                    placeholder="Enter Meal Price"
                                    {...register1("price", {
                                      required: true,
                                      min: 1,
                                    })}
                                    className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                  />
                                  {errors1.price && (
                                    <p className="text-text-cancelled text-sm">
                                      Invalid value
                                    </p>
                                  )}
                                </div>
                                <div className="pb-4">
                                  <Label
                                    htmlFor="phone"
                                    className="text-white font-normal"
                                  >
                                    Description
                                  </Label>
                                  <Input
                                    type="text"
                                    id="description"
                                    placeholder="Enter Meal Description"
                                    {...register1("description", {
                                      required: true,
                                    })}
                                    className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
                                  />
                                  {errors1.description && (
                                    <p className="text-text-cancelled text-sm">
                                      description is required
                                    </p>
                                  )}
                                </div>

                                <div className="pb-4">
                                  <div className="flex items-center gap-x-3">
                                    <h1>Category</h1>
                                    <ComboboxDemo
                                      selectValue="category"
                                      itemsArray={categoryArray}
                                      setValue={setValue}
                                    />
                                  </div>
                                </div>

                                <div className="pb-4">
                                  <div className="flex items-center gap-x-3">
                                    <h1>Handling Department</h1>
                                    <ComboboxDemo
                                      selectValue="department"
                                      itemsArray={deptArray}
                                      setValue={setValue}
                                    />
                                  </div>
                                </div>
                                {errorMsg && (
                                  <p className="text-text-cancelled text-sm">
                                    Please select the required inputs
                                  </p>
                                )}
                                <div className="md:w-1/2 w-full flex gap-x-4 justify-end text-primary-green font-medium">
                                  <button type="submit">Save</button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="w-[40%] md:block hidden">
                        <h1 className="pb-4">Menu Summary</h1>
                        <div className={`${!menu.mealImage ? "h-[40rem]" : "h-fit"} w-full flex justify-center bg-secondary-dark rounded-md`}>
                          {!menu.mealImage ? (
                            <p className="w-full m-auto text-center px-3">
                              Your menu summary will show here.
                            </p>
                          ) : (
                            <div className="w-full flex flex-col justify-between">
                              <div className="border-b-[0.3px] border-b-primary-border -border">
                                <div className="px-3 pt-3">
                                  <div className="flex justify-between rounded-xl px-2 items-center bg-primary-forest-green h-16 text-white">
                                    <div className="flex flex-col h-full justify-center gap-y-3">
                                      <p className="md:text-xl text-lg font-medium">
                                        Meal Details
                                      </p>
                                    </div>
                                    <div>
                                      <div className="flex justify-center">
                                        <p
                                          className={`capitalize text-white font-medium status-cancelled text-center  flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                        >
                                          {menu.department}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-white">
                                    <div className="gap-y-3 flex flex-col h-full justify-center text-secondary-border">
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
                                        <p className="text-2xl  break-all font-medium capitalize text-white">
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
                                    <div className="text-white justify-between w-full flex px-0 gap-x-4">
                                      <h1 className="">Menu Summary</h1>
                                      <h1 className="text-xs font-medium text-primary-green">
                                        See All
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div>
                                    <div>
                                      <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                                        <div className="flex flex-col gap-y-3 w-full">
                                          <div className="flex justify-between">
                                            <p>Department</p>
                                            <p className="text-white">
                                              {menu.department}
                                            </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Category</p>
                                            <p>{menu.category} </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Price</p>
                                            <p>{menu.price} </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Description</p>
                                            <p className="w-full truncate max-w-36">{menu.description} </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                                        <div className="p-3 w-full bg-neutral-700 rounded-b-md">
                                          <button
                                            disabled={!isOrderComplete()}
                                            onClick={() => handleMenu()}
                                            className={`place-menu-btn ${
                                              isOrderComplete()
                                                ? "bg-primary-green"
                                                : "bg-lime-700"
                                            } w-full py-2 rounded-md text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                                          >
                                            <LoaderCircle
                                              className={`${
                                                isLoading ? "flex" : "hidden"
                                              } text-black w-5 h-5 rotate-icon`}
                                            />
                                            Create Menu
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div></div>
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
                <div className="md:hidden flex bg-black px-4 h-20 fixed bottom-0 w-full z-50">
                  <div className="text-xs flex w-full justify-between items-center">
                    <div className="text-white font-medium w-full flex justify-between">
                      <Drawer>
                        <div className="w-full h-full flex gap-x-1">
                          <DrawerTrigger asChild>
                            <Button className="capitalize transparent-btn bg-transparent rounded-lg text-secondary-border">
                              <ChevronUp className="w-5 h-5" />
                              Menu Details
                            </Button>
                          </DrawerTrigger>
                          <button
                            disabled={!isOrderComplete()}
                            onClick={() => handleMenu()}
                            className={`place-menu-btn ${
                              isOrderComplete()
                                ? "bg-primary-green"
                                : "bg-lime-700"
                            } w-full py-2 rounded-md text-sm text-black
                             flex items-center justify-center gap-x-2
                            `}
                          >
                            <LoaderCircle
                              className={`${
                                isLoading ? "flex" : "hidden"
                              } text-black w-5 h-5 rotate-icon`}
                            />
                            Create Menu
                          </button>
                        </div>
                        <DrawerContent className="h-[85%]  text-secondary-border bg-secondary-dark border-secondary-transparent-border w-full flex px-4 pb-4">
                          <div>
                          <h1 className="pb-4">Menu Summary</h1>
                        <div className={`${!menu.mealImage ? "h-[40rem]" : "h-fit"} w-full flex justify-center bg-secondary-dark rounded-md`}>
                          {!menu.mealImage ? (
                            <p className="w-full m-auto text-center px-3">
                              Your menu summary will show here.
                            </p>
                          ) : (
                            <div className="w-full flex flex-col justify-between">
                              <div className="border-b-[0.3px] border-b-primary-border -border">
                                <div className="pt-3">
                                  <div className="flex justify-between rounded-xl px-2 items-center bg-primary-forest-green h-16 text-white">
                                    <div className="flex flex-col h-full justify-center gap-y-3">
                                      <p className="md:text-xl text-lg font-medium">
                                        Meal Details
                                      </p>
                                    </div>
                                    <div>
                                      <div className="flex justify-center">
                                        <p
                                          className={`capitalize text-white font-medium status-cancelled text-center  flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                        >
                                          {menu.department}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-white">
                                    <div className="gap-y-3 flex flex-col h-full justify-center text-secondary-border">
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
                                        <p className="text-2xl  break-all font-medium capitalize text-white">
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
                                    <div className="text-white justify-between w-full flex px-0 gap-x-4">
                                      <h1 className="">Menu Summary</h1>
                                      <h1 className="text-xs font-medium text-primary-green">
                                        See All
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div>
                                    <div>
                                      <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                                        <div className="flex flex-col gap-y-3 w-full">
                                          <div className="flex justify-between">
                                            <p>Department</p>
                                            <p className="text-white">
                                              {menu.department}
                                            </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Category</p>
                                            <p>{menu.category} </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <p>Price</p>
                                            <p>{menu.price} </p>
                                          </div>
                                          <div className="flex gap-x-5 justify-between">
                                            <p>Description</p>
                                            <p className="w-full truncate">{menu.description} </p>
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
    </AuthLayout>
  );
};

export default CreateMenu;
