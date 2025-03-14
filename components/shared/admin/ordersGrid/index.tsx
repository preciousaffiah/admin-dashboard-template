import React from "react";
import { Clock, Edit3, UtensilsCrossed, X } from "lucide-react";
import { AdminTable, Invoice } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { handleRowClick } from "@/utils/modal";
import moment from "moment";

const defaultInvoice: Invoice = {
  _id: "",
  // Customer: "",
  tableNumber: "",
  items: [],
  total: 0,
  discount: 0,
  amountPaid: 0,
  createdAt: "",
  status: "",
};
const OrdersGrid = ({
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
}: AdminTable) => {
  let tabKey: any = null;
  let tabValue: any = "";

  const handleTabChange: any = (event: any, key: any, value: any) => {
    tabKey = key;
    tabValue = value;
  };

  return (
    <div>
      <div className="flex flex-wrap md:justify-start justify-center gap-4">
        {invoiceData?.orders.map((invoice: any, index: number) => (
          <div
            onClick={() =>
              handleRowClick(invoice, setIsOpen, setSelectedInvoice)
            }
            className={`${
              selectedInvoice._id === invoice._id
                ? "border border-primaryGreen bg-selectedRow"
                : "bg-primaryDark"
            }  md:w-[17.5rem] w-full cursor-pointer text-sm text-txWhite rounded-md py-3`}
          >
            <div className="border-b border-primary-border pb-3 px-4">
              <div className="flex justify-start text-primary-border pb-1">
                <div className="text-md flex gap-x-4">{invoice.Customer}</div>
              </div>
              <div className="text-base flex justify-between">
                <p>
                  Table No. {""}
                  {String(invoice.tableId.tableNumber).padStart(2, "0")}
                </p>
                <p> {index + 1}</p>
              </div>
              <div>
                <div className="flex items-center gap-x-1  justify-between">
                  <div className="flex items-center gap-x-2">
                    <div className="w-8 m-auto">
                      <img
                        alt="img"
                        src={invoice.items[0].itemId.image}
                        className="w-10 h-8 rounded-md"
                      />
                    </div>
                    <div className="w-28">
                      <p className="capitalize text-ellipsis overflow-hidden">
                        {invoice.items[0].itemId.name}
                      </p>
                    </div>
                  </div>
                  <p>₦{invoice.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="text-secondaryBorder">
              <div className="px-4 py-6">
                <div className="pl-1 flex justify-between">
                  <h1 className="text-primaryLime font-medium">View Details</h1>
                  <div className="flex gap-x-4">
                    <X />
                    <Edit3 />
                  </div>
                </div>
              </div>
              <div className="gap-x-8 px-4 flex justify-between">
                <div className="flex gap-x-1">
                  <Clock className="w-4" />
                  <h1>{moment(invoice.createdAt).format("LT")}</h1>
                </div>
                <p
                  className={`status-${invoice.status} font-medium text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                >
                  {invoice.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersGrid;
