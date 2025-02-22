import Link from "next/link";
import React, { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MainNavbar, Modal } from "@/components/shared";
import {
  Check,
  Circle,
  Edit3,
  EllipsisVertical,
  LayoutGrid,
  List,
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

const tabs = ["yesterday", "today", "This Week", "This Month", "This Year"];
const tableHeaders = [
  "S/N",
  "OrderID",
  "Customer",
  "Table No.",
  "Menu Items",
  "Price",
  "Time of Order",
  "Assigned to",
  "Status",
];
const tabHeaders = {
  all: "all",
  dine: "dine in",
  togo: "to go",
  delivery: "delivery",
};
const data = [
  {
    value: "all",
    OrderID: 11356,
    Customer: "Chima Paul",
    TableNo: "A103",
    MenuItems: [
      {
        mealImage: "macaroni-image.jpg",
        name: "Macaroni with Chicken",
        quantity: 2,
        price: 335,
      },
      {
        mealImage: "macaroni-image.jpg",
        name: "Chicken Burger",
        quantity: 2,
        price: 335,
      },
      {
        mealImage: "macaroni-image.jpg",
        name: "Bread With Veggies",
        quantity: 5,
        price: 1105,
      },
    ],
    Price: 670,
    Discount: 10,
    subTotal: "660",
    amountPaid: 300,
    TimeofOrder: "1:00pm",
    AssignedTo: [
      {
        staffImage: "macaroni-image.jpg",
        name: "Susan Jackson",
      },
    ],
    Status: "pending",
  },
  {
    value: "dine",
    OrderID: 11357,
    Customer: "David Strong",
    TableNo: "A103",
    MenuItems: [
      {
        mealImage: "macaroni-image.jpg",
        name: "Macaroni with Chicken",
        quantity: 2,
        price: 335,
      },
    ],
    Price: 160,
    Discount: 2,
    amountPaid: 158,
    TimeofOrder: "1:00pm",
    AssignedTo: [
      {
        staffImage: "macaroni-image.jpg",
        name: "David Mark",
      },
    ],
    Status: "cancelled",
  },
  {
    value: "togo",
    OrderID: 11358,
    Customer: "Alice Strong",
    TableNo: "A103",
    MenuItems: [
      {
        mealImage: "macaroni-image.jpg",
        name: "Chicken Burger",
        quantity: 2,
        price: 335,
      },
      {
        mealImage: "macaroni-image.jpg",
        name: "Macaroni with Chicken",
        quantity: 7,
        price: 235,
      },
    ],
    Price: 200,
    Discount: 0,
    amountPaid: 200,
    TimeofOrder: "1:00pm",
    AssignedTo: [
      {
        staffImage: "macaroni-image.jpg",
        name: "Susan Jackson",
      },
    ],
    Status: "pending",
  },
  {
    value: "delivery",
    OrderID: 11359,
    Customer: "David Strong",
    TableNo: "A103",
    MenuItems: [
      {
        mealImage: "macaroni-image.jpg",
        name: "Macaroni with Chicken",
        quantity: 2,
        price: 335,
      },
    ],
    Price: 320,
    Discount: 5,
    amountPaid: 300,
    TimeofOrder: "1:00pm",
    AssignedTo: [
      {
        staffImage: "macaroni-image.jpg",
        name: "Jason Mason",
      },
    ],
    Status: "completed",
  },
];
const defaultInvoice: Invoice = {
  OrderID: 0,
  Customer: "",
  TableNo: "",
  MenuItems: [],
  AssignedTo: [],
  Price: 0,
  Discount: 0,
  amountPaid: 0,
  TimeofOrder: "",
  Status: "",
};
const AdminOrders: FC = () => {
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orderHeader, setOrderHeader] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice>(defaultInvoice);

  const [invoiceData, setInvoiceData] = useState<Invoice[]>(data);
  const [currentPage, setCurrentPage] = useState(1);

  const items_per_page = 10;
  const total_pages = Math.ceil(data.length / items_per_page);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * items_per_page;
    const endIndex = startIndex + items_per_page;
    return invoiceData.slice(startIndex, endIndex);
  };

  let tabKey: any = "";
  let tabValue: any = "";
  let title = "Orders";

  const handleTabChange: any = (event: any, key: any, value: any) => {
    tabKey = key;
    tabValue = value;
  };

  const updatedInvoice = { ...selectedInvoice };

  const handleQuantityChange = (mealIndex: number, type: string) => {
    if (type === "increment") {
      updatedInvoice.MenuItems[mealIndex].quantity += 1;
    } else if (
      type === "decrement" &&
      updatedInvoice.MenuItems[mealIndex].quantity > 0
    ) {
      updatedInvoice.MenuItems[mealIndex].quantity -= 1;
    }
    setSelectedInvoice(updatedInvoice);
  };

  const onDeleteItem = (mealIndex: number) => {
    const updatedMenuItems = selectedInvoice.MenuItems.filter(
      (menuItem, index) => index !== mealIndex
    );
    setSelectedInvoice({
      ...selectedInvoice,
      MenuItems: updatedMenuItems,
    });
  };

  return (
    <AdminLayout title={title}>
      <div className="flex justify-end h-screen w-full">
        <Sidebar />
        <Container>
          <div className="authcard3 h-fit lg:px-6 md:px-8 px-0">
            <Tabs defaultValue={tabs[0]} className="w-full">
              <ScrollArea className="px-3 w-full whitespace-nowrap">
                <TabsList className="bg-transparent">
                  {tabs.map((item, index) => (
                    <div key={index}>
                      <TabsTrigger
                        value={item}
                        className="active-main-tab text-sm px-6 capitalize"
                      >
                        {item}
                      </TabsTrigger>
                    </div>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              {tabs.map((item, index) => (
                <TabsContent key={index} value={item} className="md:px-0 px-2">
                  <div className="w-full bg-primaryDark pt-4 rounded-md">
                    <div className="w-full h-full">
                      <div className="px-3 flex pb-4 border-b border-primary-border">
                        <div className="flex w-full items-center gap-x-8">
                          <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                            {item}'s Orders
                          </h1>
                          <Link
                            href="/create-order"
                            className="authbtn w-fit m-0 px-1 py-2 text-sm font-semibold"
                          >
                            Create New Order
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
                        tableHeaders={tableHeaders}
                        tabHeaders={tabHeaders}
                        invoiceData={getPaginatedData}
                        setIsOpen={setIsOpen}
                        setSelectedInvoice={setSelectedInvoice}
                        selectedInvoice={selectedInvoice}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        total_pages={total_pages}
                        items_per_page={items_per_page}
                      >
                        <TableBody>
                          {getPaginatedData().map((invoice, index) => (
                            <TableRow
                              key={index}
                              className={`${
                                selectedInvoice.OrderID === invoice.OrderID
                                  ? "border border-primaryGreen bg-selectedRow"
                                  : "bg-primaryDark"
                              } truncate text-center py-2 rounded-lg cursor-pointer`}
                              onClick={() =>
                                handleRowClick(
                                  invoice,
                                  setIsOpen,
                                  setSelectedInvoice
                                )
                              }
                            >
                              <TableCell className="truncate">
                                <Circle
                                  fill={`
                              ${
                                selectedInvoice.OrderID === invoice.OrderID
                                  ? "lime"
                                  : "none"
                              }
                              `}
                                  className={` text-primary-border`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell className="truncate">
                                #{invoice.OrderID}
                              </TableCell>
                              <TableCell>{invoice.Customer}</TableCell>
                              <TableCell>{invoice.TableNo}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-x-1">
                                  {invoice.MenuItems[0].name}
                                  {invoice.MenuItems.length > 1 ? (
                                    <h1 className="w-fit py-[0.1rem] px-[0.2rem] border-2 border-primaryLime border-dashed rounded-full font-medium">
                                      +{invoice.MenuItems.length - 1}
                                    </h1>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell>${invoice.Price}</TableCell>
                              <TableCell>{invoice.TimeofOrder}</TableCell>
                              <TableCell>
                                <div className="w-fit flex items-center gap-x-1">
                                  <div className="w-8 h-4">
                                    <Image
                                      alt="img"
                                      src={orderImg}
                                      className="w-10 h-8 rounded-full"
                                    />
                                  </div>
                                  <p className="flex break-words">
                                    {invoice.AssignedTo?.[0]?.name}
                                  </p>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex justify-center">
                                  <p
                                    className={`status-${invoice.Status} text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                  >
                                    {invoice.Status}
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </AdminOrdersTable>
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
                        <p className="bg-statusCompleted text-textCompleted rounded-lg w-fit px-2 text-sm font-medium">
                          Dine in{tabValue}{" "}
                        </p>
                        <p className="text-lg font-medium">
                          Table No. {selectedInvoice.TableNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondaryBorder">
                          Order ID{" "}
                        </p>
                        <p className="text-lg font-medium">
                          {selectedInvoice.OrderID}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="my-2 md:mb-2 md:mt-12 flex justify-between px-2 items-center h-28 text-txWhite">
                      <div className="flex flex-col h-full justify-center gap-y-3 text-secondaryBorder">
                        <p className="text-sm">Customer </p>
                        <p className="text-2xl font-medium capitalize text-txWhite">
                          {selectedInvoice.Customer}
                        </p>
                        <p className="text-sm">
                          Amount paid:{" "}
                          <span className="font-medium text-txWhite pl-1">
                            ${selectedInvoice.Price}
                          </span>{" "}
                        </p>
                      </div>
                      <div>
                        <button className="text-sm transparent-btn rounded-xl p-2">
                          Give Refund
                        </button>
                      </div>
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
                          <TabsTrigger
                            value="edit"
                            className="active-order-tab px-0 py-1 rounded-lg capitalize"
                            onClick={() => setOrderHeader(true)}
                          >
                            <Edit3 />
                            edit
                          </TabsTrigger>
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
                            {selectedInvoice.MenuItems.map((menuItem, index) => (
                              <div
                                key={index}
                                className="text-txWhite items-center flex border border-primary-border px-2.5 py-2 rounded-lg"
                              >
                                <div className="w-[60%] flex gap-x-3">
                                  <div>
                                    <Image
                                      src={orderImg}
                                      alt="img"
                                      className=""
                                    />
                                  </div>
                                  <p className="m-auto">{menuItem.name}</p>
                                </div>
                                <div className="w-[40%] text-center flex">
                                  <div className="w-[35%]">
                                    <p className="transparent-btn justify-center">
                                      {menuItem.quantity}
                                    </p>
                                  </div>
                                  <div className="w-[35%]">
                                    <p>${menuItem.price}</p>
                                  </div>
                                  <div className="w-[30%]">
                                    <EllipsisVertical className="m-auto" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div>
                            <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                              <div className=" w-full text-secondaryBorder">
                                <div className="flex justify-between">
                                  <p>Sub-total</p>
                                  <p>${selectedInvoice.Price} </p>
                                </div>
                                <div className="flex justify-between">
                                  <p>Discount</p>
                                  <p>${selectedInvoice.Discount} </p>
                                </div>
                                <div className="flex justify-between text-lg font-medium ">
                                  <p>Total amount to be paid</p>
                                  <p>${selectedInvoice.amountPaid} </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                              <div className=" w-full text-white">
                                <div className="flex justify-between">
                                  <button className="flex rounded-xl bg-cancel p-2 ">
                                    <X /> Cancel Order
                                  </button>
                                  <button className="flex rounded-xl bg-approve p-2 ">
                                    <Check /> Approve
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="edit" className="w-full">
                          <div className="flex flex-col gap-y-3 px-3 pb-4">
                            {selectedInvoice.MenuItems.map(
                              (menuItem, mealIndex) => (
                                <div
                                  key={mealIndex}
                                  className="text-txWhite items-center border border-primary-border px-2.5 py-2 rounded-lg flex"
                                >
                                  <div className="w-[60%] flex gap-x-3">
                                    <div>
                                      <Image
                                        src={orderImg}
                                        alt="img"
                                        className=""
                                      />
                                    </div>
                                    <p className="m-auto">{menuItem.name}</p>
                                  </div>
                                  <div className="w-[40%] text-center flex">
                                    <div className="w-[70%] flex justify-evenly">
                                      <p
                                        onClick={() =>
                                          handleQuantityChange(
                                            mealIndex,
                                            "increment"
                                          )
                                        }
                                        className="transparent-btn cursor-pointer rounded-lg bg-white text-black justify-center"
                                      >
                                        <Plus className="w-3" />
                                      </p>
                                      <p className="transparent-btn rounded-lg justify-center">
                                        {menuItem.quantity}
                                      </p>
                                      <p
                                        onClick={() =>
                                          handleQuantityChange(
                                            mealIndex,
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
                                        onClick={() => onDeleteItem(mealIndex)}
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
                              <div className=" w-fit m-auto text-primary">
                                <button className="flex rounded-xl bg-primaryGreen p-2 ">
                                  <Check /> Save Changes
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
    </AdminLayout>
  );
};

export default AdminOrders;
