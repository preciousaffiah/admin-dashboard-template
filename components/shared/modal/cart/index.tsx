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
import {
  AlignRight,
  Copy,
  Dot,
  EyeIcon,
  EyeOff,
  FolderOpen,
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleAxiosError } from "@/utils/axios";
import { CartOrderItem, Menus } from "@/types";

const CartModal = ({
  selectedInvoice,
  setSelectedInvoice,
}: {
  selectedInvoice: any;
  setSelectedInvoice: any;
}) => {
  const { userData } = useAuthToken();

  const [success, setSuccess] = useState(false);

  let businessId = userData?.businessId || "";

  // const addStaffRequest: any = async () => {
  //   try {
  //     const response = await ItemService.deleteItem(tableId, businessId);

  //     return response.data;
  //   } catch (error: any) {
  //     handleAxiosError(error, "");
  //   }
  // };

  // const mutation: any = useMutation({
  //   mutationFn: addStaffRequest,
  //   onSuccess: (res: any) => {
  //     setSuccess(true);
  //   },
  // });

  // const onSubmit = () => mutation.mutate();
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
                {selectedInvoice?.map(
                  (invoice: CartOrderItem, index: number) => (
                    <div
                      className="
            bg-primaryDark
            w-full cursor-pointer text-sm text-primary rounded-md border-[1px]"
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
                              <p>₦{invoice.price}</p>
                            </div>
                            <div className="text-center text-xs text-txWhite w-full font-medium text-md">
                              <p>₦{invoice.total}</p>
                            </div>
                          </div>
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
                <button
                  type="submit"
                  // onClick={onSubmit}
                  className={`place-menu-btn bg-primaryGreen w-full py-2 text-black flex items-center justify-center md:gap-x-4 gap-x-2`}
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
