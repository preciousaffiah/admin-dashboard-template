import React from "react";
import { Edit3, X } from "lucide-react";
import { AdminTable, Menus, TablesType } from "@/types";
import { handleRowClick } from "@/utils/modal";
import { Dinner } from "@/components/serviette-icons";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UpdateTableModal from "../../modal/update-table";

const defaultInvoice: TablesType = {
  _id: "",
  tableNumber: "",
  status: "",
  image: "",
};

const TablesGrid = ({
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  success,
  setSuccess,
  businessId,
}: AdminTable) => {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {invoiceData?.tables.map((invoice: TablesType, index: number) => (
          <Dialog>
            <DialogTrigger asChild>
              <div
                onClick={() =>
                  handleRowClick(invoice, setIsOpen, setSelectedInvoice)
                }
                className={`${
                  selectedInvoice._id === invoice._id
                    ? "border border-primaryGreen bg-selectedRow"
                    : "bg-primaryDark"
                } md:w-[17rem] w-full cursor-pointer text-sm text-txWhite rounded-md py-3`}
              >
                <div className="flex w-full border-b border-primary-border pb-3 px-4">
                  <div className="w-full flex flex-col items-center gap-x-1  justify-between">
                    <p className="w-full text-end font-medium text-lg">
                      #{String(invoice.tableNumber).padStart(2, "0")}
                    </p>

                    <div className="flex flex-col gap-x-2 w-full">
                      <div className="size-14">
                        <Dinner className="size-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-secondaryBorder flex flex-col gap-y-3 px-2">
                  <div className="pt-3">
                    <p
                      className={`status-${invoice.status} font-medium text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                    >
                      {invoice.status}
                    </p>
                  </div>
                  <div className="pl-1 flex justify-between">
                    <h1 className="text-primaryLime font-medium">
                      Update Status
                    </h1>
                    <div className="flex gap-x-4">
                      <X />
                      <Edit3 />
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <UpdateTableModal
              success={success || false}
              setSuccess={setSuccess}
              tableId={invoice._id}
              tableNumber={invoice.tableNumber}
              businessId={businessId || ""}
            />
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default TablesGrid;
