import React, { FC, useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared";
import {
  Check,
  ChevronDown,
  Circle,
  Clock,
  Edit3,
  EllipsisVertical,
  Filter,
  Minus,
  Plus,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import DefaultTable from "../../table";
import { handleRowClick } from "@/utils/modal";

const tabs2 = {
  all: "all",
  dine: "dine in",
  togo: "to go",
  delivery: "delivery",
};

const tableHeader = [
  "S/N",
  "OrderID",
  "Customer",
  "Table No.",
  "Menu Items",
  "Price",
  "Time of Order",
  "Assigned to",
  "Status",
  "Actions",
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
const AdminTable = ({
  children,
  view,
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
}: any) => {
  let tabKey: any = "";
  let tabValue: any = "";

  const handleTabChange: any = (event: any, key: any, value: any) => {
    tabKey = key;
    tabValue = value;
  };
  console.log(view);

  return (
    <div>
      <Tabs defaultValue={tabs2.all} className="w-full">
        <div className="flex m-auto justify-between py-3 px-3">
          <div className="md:block hidden">
            <Button className="transparent-btn text-secondary-border border-[0.3px]">
              <p className="capitalize text-sm">bulk actions</p>
              <ChevronDown className="w-5" />
            </Button>
          </div>
          <TabsList className="w-fit bg-secondary-dark">
            {Object.entries(tabs2).map(([key, value], index) => (
              <TabsTrigger
                value={key}
                onClick={(event) => handleTabChange(event, key, value)}
                className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
              >
                {value}
              </TabsTrigger>
            ))}
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
          <div
            className={`${
              view ? "px-4 bg-secondary-darker" : ""
            }  flex py-4 justify-between`}
          >
            {Object.keys(tabs2).map((item, index) => (
              <TabsContent value={item} className="w-full">
                {view ? (
                  <div>
                    <div className="flex flex-wrap md:justify-start justify-center gap-4">
                      {invoiceData.map((invoice: Invoice, index: number) => (
                        <div
                          onClick={() =>
                            handleRowClick(
                              invoice,
                              setIsOpen,
                              setSelectedInvoice
                            )
                          }
                          className={`${
                            selectedInvoice.OrderID === invoice.OrderID
                              ? "border border-primary-green bg-[#1e240a]"
                              : "bg-primary-dark"
                          } cursor-pointer text-sm text-white rounded-md py-3`}
                        >
                          <div className="border-b border-primary-border pb-3 px-4">
                            <div className="flex justify-start text-primary-border pb-1">
                              <div className="text-md flex gap-x-4">
                                {invoice.Customer}
                              </div>
                            </div>
                            <div className="text-base flex justify-between">
                              <p>Table No. {invoice.TableNo}</p>
                              <p>#{invoice.OrderID}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-x-1  justify-between">
                                <div className="flex gap-x-2">
                                  <div className="w-8 m-auto">
                                    <Image
                                      alt="img"
                                      src={orderImg}
                                      className="w-10 h-8 rounded-md"
                                    />
                                  </div>
                                  <div className="w-28">
                                    <p className="text-ellipsis overflow-hidden">
                                      {invoice.MenuItems[0].name}
                                    </p>
                                  </div>
                                  {invoice.MenuItems.length > 1 ? (
                                    <h1 className="m-auto w-fit h-fit py-[0.1rem] px-[0.3rem] border-2 border-primary-green border-dashed rounded-full font-medium">
                                      +{invoice.MenuItems.length - 1}
                                    </h1>
                                  ) : null}
                                </div>
                                <p>${invoice.Price}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-secondary-border">
                            <div className="px-4 py-6">
                              <div className="pl-1 flex justify-between">
                                <h1 className="text-primary-green font-medium">
                                  View Details
                                </h1>
                                <div className="flex gap-x-4">
                                  <X />
                                  <Edit3 />
                                </div>
                              </div>
                            </div>
                            <div className="gap-x-8 px-4 flex justify-between">
                              <div className="flex gap-x-2">
                                <div className="flex gap-x-1">
                                  <UtensilsCrossed className="w-4" />
                                  <h1>Dine in</h1>
                                </div>
                                <div className="flex gap-x-1">
                                  <Clock className="w-4" />
                                  <h1>{invoice.TimeofOrder}</h1>
                                </div>
                              </div>
                              <p
                                className={`status-${invoice.Status} font-medium status-pending text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                              >
                                {invoice.Status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <DefaultTable children={children} />
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminTable;
