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
import { AdminTable, Invoice } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import DefaultTable from "../../../table";
import { handleRowClick } from "@/utils/modal";
import OrdersGrid from "../../ordersGrid";
import DataPagination from "@/components/serviette-ui/Pagination";

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
const AdminOrdersTable = ({
  children,
  view,
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  currentPage,
  setCurrentPage,
  total_pages,
  items_per_page,
  getPageNumbers,
  tabHeaders,
  tableHeaders,
  className,
}: AdminTable) => {
  let tabKey: any = "";
  let tabValue: any = "";

  const handleTabChange: any = (event: any, key: any, value: any) => {
    tabKey = key;
    tabValue = value;
  };

  return (
    <div>
      <Tabs defaultValue={Object.keys(tabHeaders || {})[0]} className="w-full">
        <div className="flex m-auto justify-between py-3 px-3 md:gapx-0 gap-x-2">
          <div className="md:block hidden">
            <Button variant={"ghost"} className="transparent-btn text-secondaryBorder border-[0.3px]">
              <p className="capitalize text-sm">bulk actions</p>
              <ChevronDown className="w-5" />
            </Button>
          </div>
          <TabsList className="w-fit bg-secondaryDark">
            {Object.entries(tabHeaders || {}).map(
              ([key, value], index): any => (
                <TabsTrigger
                  key={index}
                  value={key}
                  onClick={(event) => handleTabChange(event, key, value)}
                  className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                >
                  {value as string}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <div>
            <Button variant={"ghost"} className="md:rounded-xl border rounded-full px-3 transparent-btn text-secondaryBorder">
              <Filter className="md:w-5 w-4" />
              <ChevronDown className="md:block hidden w-5" />
            </Button>
          </div>
          <div>
            <SearchBar
              placeholder="Search for food, drinks and more"
              className="md:rounded-xl rounded-full px-3"
            />
          </div>
        </div>
        <div>
          <div
            className={`${
              view ? "px-4 bg-secondaryDarker" : ""
            }  flex py-4 justify-between`}
          >
            {Object.keys(tabHeaders || {}).map((item, index) => (
              <TabsContent key={index} value={item} className="w-full">
                {view ? (
                  <div>
                    <OrdersGrid
                      invoiceData={invoiceData}
                      setIsOpen={setIsOpen}
                      setSelectedInvoice={setSelectedInvoice}
                      selectedInvoice={selectedInvoice}
                    />
                  </div>
                ) : (
                  <div className={className}>
                    <DefaultTable
                      children={children}
                      tableHeaders={tableHeaders}
                    />
                  </div>
                )}
                <DataPagination
                  data={invoiceData}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  total_pages={total_pages}
                  items_per_page={items_per_page}
                  getPageNumbers={getPageNumbers}
                />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminOrdersTable;
