import React, { FC, useState } from "react";
import {
  Edit3,
  FolderOpen,
  Loader,
  ShoppingCart,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AdminTable, Menus } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { handleRowClick } from "@/utils/modal";

const defaultInvoice: Menus = {
  _id: "",
  price: 0,
  category: "",
  image: "",
  name: "",
  description: "",
  discount: 0,
  department: "",
};

const ItemBox = ({ invoiceData, setSelectedInvoice, selectedInvoice }: any) => {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {invoiceData?.items.map((invoice: Menus, index: number) => (
          <div
            className={`${
              selectedInvoice._id === invoice._id
                ? "border border-primaryGreen bg-selectedRow"
                : "bg-primaryDark"
            } md:w-[20rem] w-full cursor-pointer text-sm text-primary rounded-md border-2 pb-3`}
          >
            <div className="flex w-full h-[10rem] border-b border-primary-border">
              <div className="w-full">
                <img
                  src={invoice.image}
                  className="w-full h-full rounded-t-md object-cover"
                />
              </div>
            </div>
            <div className=" px-4 pt-2 w-full">
              <div className="flex justify-between gap-x-16 w-full">
                <p className="text-lg w-[10rem] font-medium text-ellipsis break-words">
                  {invoice.name}
                </p>
                <p className="w-full text-end font-medium text-lg">
                  ₦{invoice.price}
                </p>
              </div>
              <p className="flex text-xs">
                Add to cart
                <ShoppingCart className="size-4" />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemBox;
