import React from "react";
import { Edit3, UtensilsCrossed, X } from "lucide-react";
import { AdminTable, Menus, TablesType } from "@/types";
import { handleRowClick } from "@/utils/modal";
import { Dinner } from "@/components/serviette-icons";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UpdateTableModal from "../../modal/update-table";
import Image from "next/image";

const defaultInvoice: TablesType = {
  _id: "",
  tableNumber: "",
  status: "",
  image: "",
};

const MenuGrid = ({
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  success,
  setSuccess,
  businessId,
}: AdminTable) => {
  console.log(invoiceData);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {invoiceData?.items.map((invoice: Menus, index: number) => (
          <div
            onClick={() =>
              handleRowClick(invoice, setIsOpen, setSelectedInvoice)
            }
            className={`${
              selectedInvoice._id === invoice._id
                ? "border border-primaryGreen bg-selectedRow"
                : "bg-primaryDark"
            }  md:w-[20rem] w-full cursor-pointer text-sm text-txWhite rounded-md py-3`}
          >
            <div className="flex w-full h-[10rem] border-b border-primary-border pb-3 px-4">
              <div className="w-full flex flex-col items-center gap-x-1  justify-between">
                <p className="w-full text-end font-medium text-lg">
                  ₦{invoice.price}
                </p>

                <div className="flex flex-col gap-x-2 w-full">
                  <div className="size-16">
                    <img
                      src={`${invoice.image}`}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="max-w-60">
                    <p className="text-lg font-medium text-ellipsis break-words">
                      {invoice.name}
                    </p>
                    <p className="text-ellipsis truncate">
                      {invoice.description}
                    </p>
                  </div>
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
                <div className="flex gap-x-2">
                  <div className="flex gap-x-1">
                    <UtensilsCrossed className="w-4" />
                    <h1>{invoice.category}</h1>
                  </div>
                </div>
                <p
                  className={`status-cancelled font-medium statusPending text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                >
                  {invoice.department}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
