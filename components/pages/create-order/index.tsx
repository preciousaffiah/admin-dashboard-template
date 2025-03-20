import { GeneralLayout, StaffLayout } from "@layouts";
import React, { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MainNavbar } from "@/components/shared";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  EllipsisVertical,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UtensilsCrossed,
  Wine,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Container from "@/components/shared/container";
import { CartOrderItem, Menus, OrderItems, OrderMenuItem } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import orderImg2 from "public/auth-email.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import OrderDropDown from "@/components/shared/waiter/create-order-tab";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ItemService, OrderService } from "@/services";
import {
  useAuthToken,
  useBusinessDetailsWithoutAuth,
  useTabHeaders,
} from "@/hooks";
import { handleAxiosError } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataPagination from "@/components/serviette-ui/Pagination";
import { ToastMessage } from "@/components/serviette-ui";

const CreateOrder: FC = () => {
  const [order, setOrder] = useState<CartOrderItem[]>([]);
  const [success, setSuccess] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { userData } = useAuthToken();
  const [carted, setCarted] = useState(false);

  const [tableId, setTableId] = useState<string>("");
  const [tableError, setTableError] = useState<string | null>(null);

  const [tabKey, setTabKey] = useState<string>("");
  const { data } = useBusinessDetailsWithoutAuth({
    id: userData?.businessId || "",
  });

  const tabHeaders = useTabHeaders({
    id: userData?.businessId,
  });

  const createOrderRequest: any = async () => {
    try {
      const response = await OrderService.createOrder({
        businessId: userData?.businessId || "",
        tableId,
        items: order,
      });

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: createOrderRequest,
    onSuccess: (res: any) => {
      setSuccess(true);
    },
  });

  const onSubmit = () => {
    if (!tableId) {
      setTableError("select table number");
      return null;
    }
    mutation.mutate();
  };

  // GET ITEMS
  const fetchItems = async () => {
    try {
      const response = await ItemService.getItems(
        userData?.businessId || "",
        currentPage, // page
        { category: tabKey } // filters object
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: isItemsLoading,
    isRefetching,
    refetch,
    isError,
    data: itemsData,
  } = useQuery<any, Error>({
    queryKey: [
      "get-items-menu-staff",
      userData?.businessId || "",
      tabKey,
      currentPage,
    ],
    queryFn: fetchItems,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  const addOrder = (selectedItem: any) => {
    setActiveId(selectedItem._id);
    setCarted(true);

    const itemToOrder: CartOrderItem = {
      itemId: selectedItem._id,
      name: selectedItem.name,
      quantity: 1,
      discount: selectedItem.discount,
      image: selectedItem.image,
      price: selectedItem.price,
      total: (selectedItem.price - selectedItem.discount) * 1,
    };

    setOrder((prevOrder: CartOrderItem[]) => {
      if (!Array.isArray(prevOrder)) {
        return [itemToOrder];
      }

      const existingItem = prevOrder.find(
        (item: CartOrderItem) => item.itemId === itemToOrder.itemId
      );

      if (existingItem) {
        // Increase quantity if item exists
        return prevOrder.map((item: CartOrderItem) =>
          item.itemId === itemToOrder.itemId
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: item.price * (item.quantity + 1),
              }
            : item
        );
      } else {
        // Add new item
        return [...prevOrder, itemToOrder];
      }
    });
    setTimeout(() => setCarted(false), 2000); // Reset after 2 seconds
  };

  const handleQuantityChange = (itemId: string, type: string) => {
    setOrder((prevOrder: CartOrderItem[]) =>
      prevOrder.map((item) => {
        if (item.itemId === itemId) {
          const newQuantity =
            type === "increment"
              ? item.quantity + 1
              : Math.max(item.quantity - 1, 1); // Ensure quantity doesn't go below 1

          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.price, // Calculate total with updated quantity
          };
        }
        return item;
      })
    );
  };

  const removeOrder = (itemId: any) => {
    setOrder((prevOrder: any) =>
      prevOrder.filter((item: CartOrderItem) => item.itemId !== itemId)
    );
  };

  // Calculate total amount using prices from the Menu collection
  const { subTotal, totalDiscount, totalAmount } = order.reduce(
    (acc, item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const discount = Number(item.discount);

      acc.subTotal += price * quantity;
      acc.totalDiscount += discount * quantity;
      acc.totalAmount += Math.max(price - discount, 0) * quantity;

      return acc;
    },
    { subTotal: 0, totalDiscount: 0, totalAmount: 0 } // Initial values
  );

  const title = "Create Order";

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 md:py-24 py-16 md:h-fit lg:px-6 px-0">
          <div className="w-full bg-primaryDark pt-4 md:pb-0 pb-6 rounded-md">
            <div className="w-full h-full">
              <div className="px-3 flex pb-4 border-b border-primary-border">
                <div className="flex w-full items-center gap-x-8">
                  <h1 className="capitalize font-semibold text-txWhite text-xl">
                    Create Order
                  </h1>
                </div>
                <div></div>
              </div>
              <div className="flex gap-x-4 pt-6 md:pb-6 pb-20 justify-between md:px-8 px-4 text-secondaryBorder">
                <div className="lg:w-[60%] w-full flex flex-col gap-y-3">
                  <h1 className="pb-4">Order Details</h1>
                  <div className="flex flex-col gap-y-4">
                    <div className="w-full h-fit overflow-y-scroll bg-secondaryDark p-3 rounded-md">
                      <div className="flex text-txWhite w-full pb-4 justify-between">
                        <h2 className="font-medium">Add an item</h2>
                      </div>

                      <div className="text-txWhite w-full h-full flex-wrap flex gap-2">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <div className="bg-primaryDark cursor-pointer min-w-40 h-52 py-3 rounded-md items-center flex">
                              <Plus className="m-auto w-5" />
                            </div>
                          </DrawerTrigger>
                          <DrawerContent className="h-[85%] bg-secondaryDark border-secondary-transparent-border w-full flex px-4 pb-4">
                            <Tabs
                              defaultValue={Object.keys(tabHeaders || {})[0]}
                              className="w-full h-full"
                            >
                              <div className="bg-transparent h-fit w-full flex m-auto justify-between py-3 px-3 overflow-x-scroll md:gapx-0 gap-x-2">
                                <TabsList className="w-fit bg-secondaryDark">
                                  {Object.entries(tabHeaders || {}).map(
                                    ([key, value], index): any => (
                                      <TabsTrigger
                                        key={index}
                                        value={key}
                                        onClick={() => setTabKey(key)}
                                        className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                                      >
                                        {value as string}
                                      </TabsTrigger>
                                    )
                                  )}
                                </TabsList>
                              </div>
                              {itemsData &&
                                !isItemsLoading &&
                                //   !isRefetching &&
                                itemsData.currentItemCount > 0 &&
                                Object.keys(tabHeaders || {}).map(
                                  (item: any, index: number) => (
                                    <TabsContent
                                      key={index}
                                      value={item}
                                      className="w-full"
                                    >
                                      <div className="min-h-[70vh] py-4">
                                        <div>
                                          <div className="flex flex-wrap justify-center gap-4">
                                            {itemsData?.items.map(
                                              (item: Menus, index: number) => (
                                                <div
                                                  key={index}
                                                  className={` 
                                        ${
                                          activeId === item._id
                                            ? "border border-primaryGreen bg-selectedRow"
                                            : "bg-primaryDark"
                                        }
            md:w-[20rem] w-full cursor-pointer text-sm text-primary rounded-md border-2 pb-3`}
                                                >
                                                  <div className="flex w-full h-[10rem] border-b border-primary-border">
                                                    <div className="w-full">
                                                      <img
                                                        src={item.image}
                                                        className="w-full h-full rounded-t-md object-cover"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className=" px-4 pt-2 w-full">
                                                    <div className="flex justify-between gap-x-16 w-full">
                                                      <p className="capitalize text-lg w-[50%] font-medium text-ellipsis break-words">
                                                        {item.name}
                                                      </p>
                                                      <div className="w-[50%] justify-end gap-x-1 flex text-end font-medium text-lg">
                                                        {item.discount > 0 ? (
                                                          <>
                                                            <p className="line-through">
                                                              ₦
                                                              {item.price.toLocaleString()}
                                                            </p>

                                                            <p>
                                                              ₦
                                                              {(
                                                                item.price -
                                                                item.discount
                                                              ).toLocaleString()}
                                                            </p>
                                                          </>
                                                        ) : (
                                                          <p>
                                                            ₦
                                                            {item.price.toLocaleString()}
                                                          </p>
                                                        )}
                                                      </div>
                                                    </div>
                                                    {item.available ? (
                                                      <>
                                                        {activeId ===
                                                          item._id && carted ? (
                                                          <BadgeCheck className="fill-background text-primaryLime transition-all" />
                                                        ) : (
                                                          <p
                                                            onClick={() =>
                                                              addOrder(item)
                                                            }
                                                            className="flex text-xs bg-primaryGreen w-fit px-1.5 rounded-sm py-1 transition-all cursor-pointer"
                                                          >
                                                            Add item
                                                          </p>
                                                        )}
                                                      </>
                                                    ) : (
                                                      !item.available && (
                                                        <p className="flex text-xs font-medium w-fit px-1.5 border-2 border-cancel text-cancel rounded-sm py-1 transition-all">
                                                          Out of Stock
                                                        </p>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <DataPagination
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        refetch={refetch}
                                        total_items={itemsData.total}
                                        total_pages={itemsData.totalPages}
                                        items_per_page={itemsData.perPage}
                                        current_item_count={
                                          itemsData.currentItemCount
                                        } // Total number of items matching the filter
                                      />
                                    </TabsContent>
                                  )
                                )}
                            </Tabs>
                          </DrawerContent>
                        </Drawer>
                        {order.map((item, index) => (
                          <div key={index} className="flex flex-col gap-y-2">
                            <div className="bg-primaryDark cursor-pointer min-w-40 min-h-52 px-1 py-2 rounded-md items-center flex flex-col justify-center">
                              <div className="flex flex-col justify-center items-center">
                                <div
                                  className="flex justify-end w-full"
                                  onClick={() => removeOrder(item.itemId)}
                                >
                                  <Trash2 className="size-[1.1rem] cursor-pointer text-textCancelled" />
                                </div>
                                <img
                                  alt="img"
                                  src={`${item.image}`}
                                  className="w-24 h-24 rounded-full"
                                />
                                <h1 className="capitalize text-center pt-1 w-40 break-words">
                                  {item.name}
                                </h1>
                              </div>

                              <div className="flex justify-between items-center py-1 px-3 text-primary w-full bg-primaryDark">
                                <Plus
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.itemId,
                                      "increment"
                                    )
                                  }
                                  className="cursor-pointer rounded-md w-7 bg-neutral-200 px-2"
                                />
                                <p className="text-txWhite">{item.quantity}</p>
                                <Minus
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.itemId,
                                      "decrement"
                                    )
                                  }
                                  className="cursor-pointer rounded-md w-7 bg-neutral-200 px-2"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="w-fit">
                        {tableError && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ y: -20, opacity: 0.5 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0.2 }}
                            >
                              <ToastMessage message={tableError} />
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>

                      <div className="md:flex gap-x-3 items-baseline">
                        <h1>Table No.</h1>
                        <select
                          onChange={(e) => setTableId(e.target.value)}
                          className="md:w-[20%] w-full border-primary-border border-[1px] rounded-md p-2 bg-transparent"
                        >
                          <option value="none" selected disabled hidden>
                            Select table
                          </option>
                          {data?.tables?.map((item: any, index: number) => (
                            <option value={item._id} key={index}>
                              #{String(item.tableNumber).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[40%] lg:block hidden">
                  <h1 className="pb-4">Order Summary</h1>
                  <div className="w-full flex justify-center h-[40rem] bg-secondaryDark rounded-md">
                    {order.length < 1 ? (
                      <p className="w-full m-auto text-center px-3">
                        Your order summar will show here.
                      </p>
                    ) : (
                      <div className="w-full flex flex-col justify-between">
                        <div className="p-3 w-full">
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
                          <div className="flex justify-end pb-3">
                            <div className="flex w-[50%]">
                              <h1>Items</h1>
                            </div>
                            <div className="text-primary-border text-sm flex w-[50%] items-center justify-center gap-x-4">
                              <div className="w-[45%]">
                                <h1>Quantity</h1>
                              </div>
                              <div className="w-[40%]">
                                <h1>Price</h1>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-3 pb-4">
                            {order.map((item, index) => (
                              <div
                                key={index}
                                className="text-txWhite items-center flex gap-x-2 rounded-lg"
                              >
                                <div className="w-[50%] flex gap-x-1 items-center">
                                  <div className="w-[25%] h-12">
                                    <img
                                      src={`${item.image}`}
                                      alt="img"
                                      className="w-full h-full rounded-md object-cover"
                                    />
                                  </div>
                                  <p className="w-[75%] m-auto break-words">
                                    {item.name}
                                  </p>
                                </div>
                                <div className="w-[50%] text-center gap-x-2 flex">
                                  <div className="w-[30%]">
                                    <p className="transparent-btn rounded-lg justify-center">
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="w-[70%]">
                                    <p>
                                      ₦
                                      {(
                                        item.price - (item.discount || 0)
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex justify-between py-3 items-center border-t border-primary-border text-txWhite">
                              <div className="text-sm w-full text-secondaryBorder">
                                <div className="flex justify-between">
                                  <p>Sub-total</p>₦{subTotal.toLocaleString()}
                                </div>
                                <div className="flex justify-between">
                                  <p>Discount</p>₦
                                  {totalDiscount.toLocaleString() || 0}
                                </div>
                                <div className="flex justify-between text-base font-medium ">
                                  <p>Total</p>₦{totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 w-full bg-foreground rounded-b-md">
                          {success ? (
                            <button
                              disabled={true}
                              className={`place-menu-btn bg-primaryLime w-full py-2 text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                            >
                              <Wine />
                              Preparing Order
                              <Wine />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={mutation.isPending}
                              onClick={onSubmit}
                              className={`place-order-btn hover:bg-primaryLime bg-primaryGreen w-full py-2 rounded-md text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                            >
                              Place Order
                              {mutation.isPending && (
                                <LoaderCircle
                                  className="
                                  text-black size-5 rotate-icon"
                                />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:hidden flex bg-foreground px-4 h-32 fixed bottom-0 w-full z-50">
            <div className="text-xs flex flex-col w-full justify-between items-center">
              <div className="w-full text-base">
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
              <div className="text-txWhite h-full font-medium w-full flex justify-between">
                <Drawer>
                  <div className="w-full h-fit flex gap-x-1">
                    <DrawerTrigger asChild>
                      <Button className="capitalize transparent-btn bg-transparent rounded-lg text-secondaryBorder">
                        <ChevronUp className="w-5 h-5" />
                        Order Summary
                        <p className="rounded-full border-2 px-[0.3rem] flex border-primaryGreen">
                          {order.length}
                        </p>
                      </Button>
                    </DrawerTrigger>
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      onClick={onSubmit}
                      className="place-order-btn hover:bg-primaryLime bg-primaryGreen w-full py-2 rounded-md text-sm text-black flex items-center justify-center gap-x-2                            "
                    >
                      Place Order
                      {mutation.isPending && (
                        <LoaderCircle
                          className="
                                  text-black size-5 rotate-icon"
                        />
                      )}
                    </button>
                  </div>
                  <DrawerContent className="h-[90%]  text-secondaryBorder bg-secondaryDark border-secondary-transparent-border w-full flex px-4 pb-4">
                    <div>
                      <h1 className="pb-4 text-txWhite">Order Summary</h1>
                      <div className="w-full flex justify-center h-[40rem] bg-secondaryDark rounded-md">
                        <div className="w-full flex flex-col justify-between">
                          <div className="p-3 w-full">
                            <div className="flex justify-end pb-3">
                              <div className="flex w-[50%]">
                                <h1>Items</h1>
                              </div>
                              <div className="text-primary-border text-sm flex w-[50%] items-center justify-center gap-x-4">
                                <div className="w-[45%]">
                                  <h1>Quantity</h1>
                                </div>
                                <div className="w-[40%]">
                                  <h1>Price</h1>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-3 pb-4">
                              {order.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-txWhite items-center flex gap-x-2 rounded-lg"
                                >
                                  <div className="w-[50%] flex gap-x-1 items-center">
                                    <div className="w-[25%] h-12">
                                      <img
                                        src={`${item.image}`}
                                        alt="img"
                                        className="w-full h-full rounded-md object-cover"
                                      />
                                    </div>
                                    <p className="w-[75%] capitalize m-auto break-words">
                                      {item.name}
                                    </p>
                                  </div>
                                  <div className="w-[50%] text-center gap-x-2 flex">
                                    <div className="w-[30%]">
                                      <p className="transparent-btn rounded-lg justify-center">
                                        {item.quantity}
                                      </p>
                                    </div>
                                    <div className="w-[70%]">
                                      <p>
                                        ₦{Number(item.price).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="flex justify-between py-3 items-center border-t border-primary-border text-txWhite">
                                <div className="text-sm w-full">
                                  <div className="flex justify-between">
                                    <p>Sub-total</p>₦{subTotal.toLocaleString()}
                                  </div>
                                  <div className="flex justify-between">
                                    <p>Discount</p>₦
                                    {totalDiscount.toLocaleString() || 0}
                                  </div>
                                  <div className="flex justify-between text-base font-medium ">
                                    <p>Total</p>₦{totalAmount.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CreateOrder;
