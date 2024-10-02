import { AuthLayout } from "@layouts";
import Link from "next/link";
import React, { FC, useState } from "react";
import { PageAnimation, SearchBar } from "@/components/serviette-ui";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AdminNavbar, Modal } from "@/components/shared";
import {
  Check,
  ChevronDown,
  Circle,
  Edit3,
  EllipsisVertical,
  Filter,
  List,
  LoaderCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types";
import orderImg from "public/orderimg.png";
import Image from "next/image";

const tabs = ["yesterday", "today", "This Week", "This Month", "This Year"];
const tabs2 = {
  all: "all",
  dine: "dine in",
  togo: "to go",
  delivery: "delivery",
};

const invoiceData = [
  {
    value: "all",
    OrderID: "11359",
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
    Price: "670",
    Discount: "10",
    subTotal: "660",
    amountPaid: "300",
    TimeofOrder: "1:00pm",
    Status: "pending",
  },
  {
    value: "dine",
    OrderID: "11357",
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
    Price: "160",
    Discount: "2",
    amountPaid: "158",
    TimeofOrder: "1:00pm",
    Status: "cancelled",
  },
  {
    value: "togo",
    OrderID: "11358",
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
    Price: "200",
    Discount: "0",
    amountPaid: "200",
    TimeofOrder: "1:00pm",
    Status: "pending",
  },
  {
    value: "delivery",
    OrderID: "11359",
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
    Price: "320",
    Discount: "5",
    amountPaid: "300",
    TimeofOrder: "1:00pm",
    Status: "completed",
  },
];
const defaultInvoice: Invoice = {
  OrderID: 0,
  Customer: "",
  TableNo: "",
  MenuItems: [],
  Price: 0,
  Discount: 0,
  amountPaid: 0,
  TimeofOrder: "",
  Status: "",
};
const Orders: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderHeader, setOrderHeader] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice>(defaultInvoice);

  const handleRowClick = (invoice: any) => {
    setIsOpen(true);
    setSelectedInvoice(invoice);
  };

  let tabKey: any = "";
  let tabValue: any = "";

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
    //TODO: heading all pages
    <AuthLayout heading={"Welcome"} title={"Sign-in"}>
      <AdminNavbar />
      <PageAnimation>
        <div className="authcard1">
          <div className="authcard2">
            <div className="authcard3 md:px-12 px-0">
              <Tabs defaultValue={tabs[0]} className="w-full">
                <ScrollArea className="px-3 w-full whitespace-nowrap">
                  <TabsList className="bg-transparent">
                    {tabs.map((item, index) => (
                      <>
                        <TabsTrigger
                          value={item}
                          className="active-main-tab text-sm px-6 capitalize"
                        >
                          {item}
                        </TabsTrigger>
                      </>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {tabs.map((item, index) => (
                  <TabsContent value={item}>
                    <div className="w-full bg-primary-dark py-4 rounded-md">
                      <div className="w-full h-full">
                        <div className="px-3 flex pb-4 border-b border-primary-border">
                          <div className="flex w-full items-center gap-x-8">
                            <h1 className="md:block hidden capitalize font-semibold text-white text-xl">
                              {item}'s Orders
                            </h1>
                            <Link
                              href="#"
                              className="authbtn w-fit m-0 px-1 py-2 text-sm font-semibold"
                            >
                              Create New Order
                            </Link>
                          </div>
                          <div>
                            <Button className="transparent-btn text-secondary-border">
                              <List className="w-5" />
                              <p className="capitalize text-sm">list view</p>
                            </Button>
                          </div>
                        </div>

                        <Tabs defaultValue={tabs2.all} className="w-full">
                          <div className="flex m-auto justify-between py-3 px-3">
                            <div className="md:block hidden">
                              <Button className="transparent-btn text-secondary-border border-[0.3px]">
                                <p className="capitalize text-sm">
                                  bulk actions
                                </p>
                                <ChevronDown className="w-5" />
                              </Button>
                            </div>
                            <TabsList className="w-fit bg-secondary-dark">
                              {Object.entries(tabs2).map(
                                ([key, value], index) => (
                                  <TabsTrigger
                                    value={key}
                                    onClick={(event) =>
                                      handleTabChange(event, key, value)
                                    }
                                    className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                                  >
                                    {value}
                                  </TabsTrigger>
                                )
                              )}
                            </TabsList>
                            <div>
                              <Button className="md:rounded-xl rounded-full transparent-btn text-secondary-border">
                                <Filter className="w-5" />
                                <ChevronDown className="md:block hidden w-5" />
                              </Button>
                            </div>
                            <div>
                              <SearchBar
                                placeholder="Search for food, drinks and more"
                                className="md:rounded-xl rounded-full"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              {Object.keys(tabs2).map((item, index) => (
                                <TabsContent value={item} className="w-full">
                                  <div>
                                    <Table className="table-auto border-separate border-spacing-0 text-white">
                                      <TableHeader>
                                        <TableRow className="px-3 bg-primary-dark">
                                          <TableHead className="orders-table-head">
                                            <Circle />
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            S/N
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Order ID
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Customer
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Table No.
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Menu Items
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Price
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Time of Order
                                          </TableHead>
                                          <TableHead className="orders-table-head">
                                            Status
                                          </TableHead>
                                          <TableHead className="text-right orders-table-head">
                                            Actions
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {invoiceData.map((invoice, index) => (
                                          <TableRow
                                            key={index}
                                            className="truncate text-center py-2 rounded-lg bg-primary-dark even:bg-primary-lighter"
                                            // onClick={() =>
                                            //   handleRowClick(invoice)
                                            // }
                                          >
                                            <TableCell className="truncate">
                                              <Circle className="text-primary-border" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                              {index + 1}
                                            </TableCell>
                                            <TableCell className="truncate">
                                              #{invoice.OrderID}
                                            </TableCell>
                                            <TableCell>
                                              {invoice.Customer}
                                            </TableCell>
                                            <TableCell>
                                              {invoice.TableNo}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-x-1">
                                                {invoice.MenuItems[0].name}
                                                {invoice.MenuItems.length >
                                                1 ? (
                                                  <h1 className="w-fit p-[0.1rem] border-2 border-text-completed border-dashed rounded-full font-medium">
                                                    +
                                                    {invoice.MenuItems.length -
                                                      1}
                                                  </h1>
                                                ) : null}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              ${invoice.Price}
                                            </TableCell>
                                            <TableCell>
                                              {invoice.TimeofOrder}
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
                                            <TableCell className="flex justify-center">
                                              <EllipsisVertical />
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TabsContent>
                              ))}
                            </div>
                          </div>
                        </Tabs>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div>
                <div className="border-b-[0.3px] border-b-primary-border -border">
                  <div className="px-3">
                    <div className="flex justify-between rounded-xl px-2 items-center bg-primary-forest-green h-20 text-white">
                      <div className="flex flex-col h-full justify-center gap-y-3">
                        <p className="bg-status-completed text-text-completed rounded-lg w-fit px-2 text-sm font-medium">
                          Dine in{tabValue}{" "}
                        </p>
                        <p className="text-lg font-medium">
                          Table No. {selectedInvoice.TableNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-border">
                          Order ID{" "}
                        </p>
                        <p className="text-lg font-medium">
                          {selectedInvoice.OrderID}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="my-2 flex justify-between px-2 items-center h-28 text-white">
                      <div className="flex flex-col h-full justify-center gap-y-3 text-secondary-border">
                        <p className="text-sm">Customer </p>
                        <p className="text-2xl font-medium capitalize text-white">
                          {selectedInvoice.Customer}
                        </p>
                        <p className="text-sm">
                          Amount paid:{" "}
                          <span className="font-medium text-white pl-1">
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
                            {selectedInvoice.MenuItems.map((menuItem) => (
                              <div className="text-white items-center flex border border-primary-border px-2.5 py-2 rounded-lg">
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
                            <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                              <div className=" w-full text-secondary-border">
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
                            <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                              <div className=" w-full text-white">
                                <div className="flex justify-between">
                                  <button className="flex rounded-xl bg-text-cancelled p-2 ">
                                    <X /> Cancel Order
                                  </button>
                                  <button className="flex rounded-xl bg-text-completed p-2 ">
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
                                <div className="text-white items-center border border-primary-border px-2.5 py-2 rounded-lg flex">
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
                                      {/* {loadingIndices.includes(mealIndex) ? (
                                        <LoaderCircle
                                        className="rotate-icon m-auto"
                                        />
                                      ) : ( */}
                                      <Trash2
                                        onClick={() => onDeleteItem(mealIndex)}
                                        className="m-auto cursor-pointer text-text-cancelled"
                                      />
                                      {/* )}                                       */}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between p-3 items-center border-t border-primary-border text-white">
                              <div className=" w-fit m-auto text-white">
                                <button className="flex rounded-xl bg-text-completed p-2 ">
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
        </div>
      </PageAnimation>
    </AuthLayout>
  );
};

export default Orders;
