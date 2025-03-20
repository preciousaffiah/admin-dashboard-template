import { motion, AnimatePresence } from "framer-motion";
import {
  Dot,
  FolderOpen,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingCart,
  Wine,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ItemService, StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleAxiosError } from "@/utils/axios";
import { CartOrderItem, Menus } from "@/types";
import OrderService from "@/services/order";

const CartModal = ({
  selectedInvoice,
  setSelectedInvoice,
  tableId,
  businessId,
  tableOrderData,
}: {
  selectedInvoice: any;
  setSelectedInvoice: any;
  tableId: string;
  businessId: string;
  tableOrderData: any;
}) => {
  const { userData } = useAuthToken();

  const [success, setSuccess] = useState(false);

  const createOrderRequest: any = async () => {
    try {
      const response = await OrderService.createOrder({
        businessId,
        tableId,
        items: selectedInvoice,
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
    mutation.mutate();
  };
  const handleQuantityChange = (itemId: string, type: string) => {
    setSelectedInvoice((prevOrder: CartOrderItem[]) =>
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

  const clearOrder = (itemId: string) => {
    setSelectedInvoice((prevOrder: any) =>
      prevOrder.filter((item: CartOrderItem) => item.itemId !== itemId)
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="py-1.5 px-2 cursor-pointer border border-gray-300 bg-primaryGreen rounded-full text-primary flex items-center ">
          <ShoppingCart />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0 border-none flex justify-start">
        {tableOrderData?.[0] ? (
          <div className="text-secondaryBorder w-full py-8 font-medium px-3 mt-7">
            <>
              <div className="h-full overflow-y-scroll">
                {tableOrderData?.[0].items.map(
                  (invoice: any, index: number) => (
                    <div
                      className="
       bg-primaryDark
       w-full mb-3 text-sm text-primary rounded-md border-[1px]"
                    >
                      <div className="p-2">
                        <div className="flex gap-x-2 w-full pb-4">
                          <div className="size-[3rem] rounded-full">
                            <img
                              src={`${invoice.image}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-ellipsis break-words capitalize">
                              {invoice.name}
                            </p>

                            <div className="flex items-center text-xs text-txWhite w-full text-end font-medium text-md">
                              <p>{invoice.quantity} items</p>
                              <Dot />
                              <p>₦{invoice.price.toLocaleString()}</p>
                            </div>
                            <div className="text-center text-xs text-txWhite w-full font-medium text-md">
                              <p>₦{(invoice.quantity * invoice.price).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                <div className="pt-6 text-center">
                  <p className="border-primary-orange text-primary-orange border-2 px-1.5 rounded-sm py-1">
                    Total {(tableOrderData?.[0].total).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="w-full left-0 absolute bottom-0 text-black">
                <button
                  type="submit"
                  // disabled={mutation.isPending}
                  // onClick={onSubmit}
                  className={`place-menu-btn bg-primaryGreen w-full py-2 text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                >
                  Checkout
                  {/* {mutation.isPending && (
                    <LoaderCircle className="text-black flex w-5 h-5 rotate-icon" />
                  )} */}
                </button>
              </div>
            </>
          </div>
        ) : (
          <div className="text-secondaryBorder w-full py-8 font-medium px-3 mt-7">
            {selectedInvoice.length < 1 ? (
              <div className="m-auto flex flex-col items-center justify-center h-full w-full">
                <FolderOpen className="size-8" />
                <p className="font-normal md:text-base text-sm">
                  Nothings in here
                </p>
              </div>
            ) : (
              <>
                <div className="h-full overflow-y-scroll">
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
                  {selectedInvoice?.map(
                    (invoice: CartOrderItem, index: number) => (
                      <div
                        className="
            bg-primaryDark
            w-full mb-3 text-sm text-primary rounded-md border-[1px]"
                      >
                        <div className="p-2">
                          <div className="flex gap-x-2 w-full pb-4">
                            <div className="size-[3rem] rounded-full">
                              <img
                                src={`${invoice.image}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-ellipsis break-words capitalize">
                                {invoice.name}
                              </p>

                              <div className="flex items-center text-xs text-txWhite w-full text-end font-medium text-md">
                                <p>{invoice.quantity} items</p>
                                <Dot />
                                <p>₦{invoice.price.toLocaleString()}</p>
                              </div>
                              <div className="text-center text-xs text-txWhite w-full font-medium text-md">
                                <p>₦{(invoice.quantity * invoice.price).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center gap-x-6 pb-2 items-center text-primary w-full">
                            <Plus
                              onClick={() =>
                                handleQuantityChange(
                                  invoice.itemId,
                                  "increment"
                                )
                              }
                              className="cursor-pointer rounded-md w-7 bg-neutral-200 px-2"
                            />
                            <p className="text-txWhite">{invoice.quantity}</p>
                            <Minus
                              onClick={() =>
                                handleQuantityChange(
                                  invoice.itemId,
                                  "decrement"
                                )
                              }
                              className="cursor-pointer rounded-md w-7 bg-neutral-200 px-2"
                            />
                          </div>
                          <div
                            onClick={() => clearOrder(invoice.itemId)}
                            className="px-4 text-center"
                          >
                            <p className="border-primary-orange text-primary-orange border px-1.5 rounded-sm py-1">
                              Clear
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <div className="pt-6 text-center">
                    <p className="border-primary-orange text-primary-orange border-2 px-1.5 rounded-sm py-1">
                      Total{" "}
                      {selectedInvoice.reduce(
                        (sum: number, item: CartOrderItem) => sum + item.total,
                        0
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-full left-0 absolute bottom-0 text-black">
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
                      className={`place-menu-btn bg-primaryGreen w-full py-2 text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                    >
                      Place Order
                      {mutation.isPending && (
                        <LoaderCircle className="text-black flex w-5 h-5 rotate-icon" />
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
