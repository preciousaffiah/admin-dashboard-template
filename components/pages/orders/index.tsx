"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MainNavbar, Modal } from "@/components/shared";
import {
  Check,
  CheckCheck,
  Circle,
  Edit3,
  EllipsisVertical,
  LayoutGrid,
  List,
  LoaderCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Invoice } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { handleRowClick } from "@/utils/modal";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import AdminOrdersTable from "@/components/shared/admin/table/orders";
import AdminLayout from "@/components/layouts/admin-layout";
import { OrderStatusEnum, PaymentStatusEnum } from "@/types/enums";
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import OrderService from "@/services/order";
const Paystack = dynamic(() => import("@paystack/inline-js") as any, {
  ssr: false,
});

import { PaymnetsService } from "@/services";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteItemModal from "@/components/shared/modal/delete-item";
import CheckoutModal from "@/components/shared/modal/checkout";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};
const tableHeaders = [
  "S/N",
  // "_id",
  // "Customer",
  "Table No.",
  "Menu Items",
  "Total",
  "Date of Order",
  // "Assigned to",
  "Status",
];
const tabHeaders = {
  all: "all",
  pending: "pending",
  served: "served",
  cancelled: "cancelled",
};

const defaultInvoice: any = {
  _id: "",
  // Customer: "",
  tableNumber: "",
  items: [],
  itemId: null,
  // AssignedTo: [],
  total: 0,
  discount: 0,
  amountPaid: 0,
  createdAt: "",
  status: "",
};
const Orders: FC = () => {
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orderHeader, setOrderHeader] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(defaultInvoice);

  const [currentPage, setCurrentPage] = useState(1);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [dateKey, setDateKey] = useState<string>("");
  const [tabKey, setTabKey] = useState<string>("");
  // if (typeof window !== 'undefined') {

  // const popup = new Paystack(process.env.PAYSTACK_PUBLIC_KEY as string);
  // }
  let title = "Orders";

  const updatedInvoice = { ...selectedInvoice };

  const handleQuantityChange = (itemIndex: number, type: string) => {
    if (type === "increment") {
      updatedInvoice.items[itemIndex].quantity += 1;
    } else if (
      type === "decrement" &&
      updatedInvoice.items[itemIndex].quantity > 1
    ) {
      updatedInvoice.items[itemIndex].quantity -= 1;
    }
    setSelectedInvoice(updatedInvoice);
  };

  const onDeleteItem = (itemIndex: number) => {
    if (selectedInvoice.items.length < 2) {
      return null;
    }

    const updateditems = selectedInvoice.items.filter(
      (item: any, index: number) => index !== itemIndex
    );
    setSelectedInvoice({
      ...selectedInvoice,
      items: updateditems,
    });
  };

  const updateOrderStatusRequest: any = async (status: OrderStatusEnum) => {
    try {
      const response = await OrderService.updateOrder(selectedInvoice._id, {
        status,
      });

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  const orderStatusMutation = useMutation({
    mutationFn: (status: OrderStatusEnum) => updateOrderStatusRequest(status),
    onSuccess: (res: any) => {
      setLoadingButton(null);
    },
    onError: (error: any) => {
      setLoadingButton(null);
    },
  });

  const onUpdateStatusOrder = (status: OrderStatusEnum, action: string) => {
    setLoadingButton(action);
    orderStatusMutation.mutate(status);
  };

  const updateOrderItemsRequest: any = async () => {
    try {
      const itemData = selectedInvoice.items.map((item: any) => ({
        itemId: item.itemId._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await OrderService.updateOrderItems(
        selectedInvoice._id,
        {
          itemData,
        }
      );

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const orderItemsMutation = useMutation({
    mutationFn: updateOrderItemsRequest,
    onSuccess: (res: any) => {},
  });

  const onUpdateOrderItems = () => {
    // console.log(selectedInvoice);

    orderItemsMutation.mutate();
  };

  console.log("selectedInvoice", selectedInvoice);

  return (
    <div className="flex justify-end h-screen w-full">
      <Sidebar />
      <Container>
        <div className="authcard3 h-fit lg:px-6 md:px-8 px-0">
          <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
            <ScrollArea className="px-3 w-full whitespace-nowrap">
              <TabsList className="bg-transparent">
                {Object.entries(tabs || {}).map(([key, value], index): any => (
                  <div key={index}>
                    <TabsTrigger
                      value={key}
                      className="active-main-tab text-sm px-6 capitalize"
                      onClick={() => setDateKey(key)}
                    >
                      {value as string}
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {Object.keys(tabs || {}).map((item: any, index: number) => (
              <TabsContent key={index} value={item} className="md:px-0 px-2">
                <div className="w-full bg-primaryDark pt-4 rounded-md">
                  <div className="w-full h-full">
                    <div className="px-3 flex pb-4 border-b border-primary-border">
                      <div className="flex w-full items-center gap-x-8">
                        <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                          {item}'s Orders
                        </h1>
                        <Link
                          href="/staff/create-order"
                          className="authbtn w-fit m-0 px-1 py-2 text-sm font-semibold"
                        >
                          Create New Order
                        </Link>

                        <Link
                          href="/staff/order-transactions"
                          className="authbtn w-fit m-0 px-1 py-2 text-sm font-semibold"
                        >
                          View Order Transactions
                        </Link>
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

                    <AdminOrdersTable
                      view={view}
                      currentPage={currentPage}
                      // handleRowClick={handleRowClick}
                      tableHeaders={tableHeaders}
                      tabHeaders={tabHeaders}
                      tabKey={tabKey}
                      setTabKey={setTabKey}
                      dateKey={dateKey}
                      setIsOpen={setIsOpen}
                      setSelectedInvoice={setSelectedInvoice}
                      selectedInvoice={selectedInvoice}
                      setCurrentPage={setCurrentPage}

                      // total_pages={total_pages}
                      // items_per_page={items_per_page}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>
              <div className="border-b-[0.3px] border-b-primary-border -border">
                <div className="px-3">
                  <div className="flex justify-between rounded-xl px-2 items-center bg-selectedRow h-20 text-txWhite">
                    <div className="flex flex-col h-full justify-center gap-y-3">
                      {/* <p className="bg-statusCompleted text-textCompleted rounded-lg w-fit px-2 text-sm font-medium">
                        Dine in{tabValue}{" "}
                      </p> */}
                      <p className="text-lg font-medium">
                        Table No.{" "}
                        {String(selectedInvoice.tableId?.tableNumber).padStart(
                          2,
                          "0"
                        )}
                      </p>
                    </div>
                    {/* <div>
                        <p className="text-sm font-medium text-secondaryBorder">
                          Order ID{" "}
                        </p>
                        <p className="text-lg font-medium">
                          {selectedInvoice._id}{" "}
                        </p>
                      </div> */}
                  </div>
                  <div className="my-2 md:mb-2 md:mt-12 flex justify-between px-2 items-center py-6 text-txWhite">
                    <div className="capitalize flex h-full justify-between w-full text-primary">
                      <p className="font-medium flex h-fit gap-x-2">
                        Order Status:{" "}
                        <span
                          className={`status-${selectedInvoice.status} text-sm font-medium text-center flex items-center rounded-xl py-[0.1rem] px-2 w-fit`}
                        >
                          {selectedInvoice.status}
                        </span>{" "}
                      </p>
                      <p className="font-medium flex h-fit gap-x-2">
                        Payment Status:{" "}
                        <span
                          className={`status-${selectedInvoice.paymentStatus} text-sm font-medium text-center flex items-center rounded-xl py-[0.1rem] px-2 w-fit`}
                        >
                          {selectedInvoice.paymentStatus}
                        </span>{" "}
                      </p>
                    </div>
                    {/* <div>
                      <button className="text-sm transparent-btn rounded-xl p-2">
                        Give Refund
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>

              <div>
                <Tabs
                  defaultValue="items"
                  className="md:text-base text-sm w-full"
                >
                  <div className="flex py-2 px-6">
                    <div className="w-[60%]">
                      <TabsList className="w-fit flex px-0 gap-x-4">
                        <TabsTrigger
                          value="items"
                          className="active-order-tab px-0 py-1 rounded-lg capitalize"
                          onClick={() => setOrderHeader(false)}
                        >
                          items
                        </TabsTrigger>
                        {selectedInvoice.paymentStatus ===
                        PaymentStatusEnum.PENDING ? (
                          <TabsTrigger
                            value="edit"
                            className="active-order-tab px-0 py-1 rounded-lg capitalize"
                            onClick={() => setOrderHeader(true)}
                          >
                            <Edit3 />
                            edit
                          </TabsTrigger>
                        ) : null}
                      </TabsList>
                    </div>
                    {orderHeader ? (
                      <div className="text-primary-border flex w-[40%] items-center justify-between">
                        <div className="w-[35%]">
                          <h1>Quantity</h1>
                        </div>
                        <div className="w-[30%]">
                          <h1>Action</h1>
                        </div>
                      </div>
                    ) : (
                      <div className="text-primary-border flex w-[40%] items-center justify-center gap-x-4">
                        <div className="w-[35%]">
                          <h1>Quantity</h1>
                        </div>
                        <div className="w-[35%]">
                          <h1>Price</h1>
                        </div>
                        <div className="w-[30%]">
                          <h1>Action</h1>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <TabsContent value="items" className="w-full">
                        <div className="flex flex-col gap-y-3 px-3 pb-4">
                          {selectedInvoice?.items.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="text-sm text-txWhite items-center flex border border-primary-border px-2.5 py-2 rounded-lg"
                              >
                                <div className="w-[60%] items-center capitalize flex gap-x-3">
                                  <div>
                                    <img
                                      src={item.itemId.image}
                                      alt="img"
                                      className="rounded-md w-11 object-cover"
                                    />
                                  </div>
                                  <p>{item.itemId.name}</p>
                                </div>
                                <div className="w-[40%] text-center flex">
                                  <div className="w-[30%]">
                                    <p className="transparent-btn justify-center">
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="w-[45%] text-[0.8rem]">
                                    <p>₦{item.price.toLocaleString()}</p>
                                  </div>
                                  <div className="w-[25%]">
                                    <EllipsisVertical className="m-auto w-5" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          {selectedInvoice.paymentStatus !==
                            PaymentStatusEnum.PAID &&
                            selectedInvoice.status !==
                              OrderStatusEnum.CANCELLED && (
                              <>
                                <Dialog>
                                  <DialogTrigger
                                    asChild
                                    onClick={() => setIsOtpModalOpen(true)}
                                  >
                                    <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                                      <button className="flex m-auto items-center gap-x-1 rounded-xl font-medium bg-primaryLime text-primaryDark px-3 py-2 ">
                                        Checkout
                                      </button>
                                    </div>
                                  </DialogTrigger>
                                  <CheckoutModal
                                    selectedInvoice={selectedInvoice}
                                    isOpen={isOtpModalOpen}
                                    onClose={() => {
                                      setIsOtpModalOpen(false);
                                    }}
                                    setIsOtpModalOpen={setIsOtpModalOpen}
                                  />
                                </Dialog>
                              </>
                            )}
                        </div>

                        <div>
                          <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                            <div className=" w-full text-secondaryBorder">
                              <div className="flex justify-between">
                                <p>Sub-total</p>
                                <p>
                                  ₦{selectedInvoice?.subTotal?.toLocaleString()}{" "}
                                </p>
                              </div>
                              <div className="flex justify-between">
                                <p>Discount</p>
                                <p>
                                  ₦
                                  {selectedInvoice?.totalDiscount?.toLocaleString()}{" "}
                                </p>
                              </div>
                              <div className="flex justify-between text-lg font-medium ">
                                <p>Total</p>
                                <p>
                                  ₦{selectedInvoice?.total.toLocaleString()}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between p-3 text-background items-center border-t border-primary-border">
                            <button
                              onClick={() =>
                                onUpdateStatusOrder(
                                  OrderStatusEnum.CANCELLED,
                                  "cancel"
                                )
                              }
                              className="flex m-auto rounded-xl bg-cancel p-2 gap-x-1 "
                            >
                              <X /> Cancel Order
                              {loadingButton === "cancel" && (
                                <LoaderCircle className="text-txwhite rotate-icon w-5" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                onUpdateStatusOrder(
                                  OrderStatusEnum.SERVED,
                                  "serve"
                                )
                              }
                              className="flex m-auto rounded-xl bg-primaryLime p-2 "
                            >
                              <CheckCheck /> Serve Order
                              {loadingButton === "serve" && (
                                <LoaderCircle className="text-txwhite rotate-icon w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="edit" className="w-full">
                        <div className="flex flex-col gap-y-3 px-3 pb-4">
                          {selectedInvoice.items.map(
                            (item: any, itemIndex: number) => (
                              <div
                                key={itemIndex}
                                className="text-sm text-txWhite items-center flex border border-primary-border px-2.5 py-2 rounded-lg"
                              >
                                <div className="w-[60%] items-center capitalize flex gap-x-3">
                                  <div>
                                    <img
                                      src={item.itemId.image}
                                      alt="img"
                                      className="rounded-md w-11 object-cover"
                                    />
                                  </div>
                                  <p>{item.itemId.name}</p>
                                </div>
                                <div className="w-[40%] text-center flex">
                                  <div className="w-[70%] flex justify-evenly">
                                    <p
                                      onClick={() =>
                                        handleQuantityChange(
                                          itemIndex,
                                          "increment"
                                        )
                                      }
                                      className="transparent-btn cursor-pointer rounded-lg bg-white text-black justify-center"
                                    >
                                      <Plus className="w-3" />
                                    </p>
                                    <p className="transparent-btn rounded-lg justify-center">
                                      {item.quantity}
                                    </p>
                                    <p
                                      onClick={() =>
                                        handleQuantityChange(
                                          itemIndex,
                                          "decrement"
                                        )
                                      }
                                      className="transparent-btn cursor-pointer rounded-lg bg-white text-black justify-center"
                                    >
                                      <Minus className="w-3" />
                                    </p>
                                  </div>
                                  <div className="w-[30%]">
                                    <Trash2
                                      onClick={() => onDeleteItem(itemIndex)}
                                      className="m-auto cursor-pointer text-textCancelled"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                            <div className=" w-fit m-auto text-white">
                              <button
                                onClick={onUpdateOrderItems}
                                className="flex rounded-xl bg-primaryLime p-2 "
                              >
                                <Check /> Save Changes
                                {orderItemsMutation.isPending && (
                                  <LoaderCircle className="text-txwhite rotate-icon w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>
          </Modal>
        </div>
      </Container>
    </div>
  );
};

export default Orders;
