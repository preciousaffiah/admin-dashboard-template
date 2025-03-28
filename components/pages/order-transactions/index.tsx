import React, { FC, useState } from "react";
import Container from "@/components/shared/container";
import { Menus } from "@/types";
import { handleRowClick } from "@/utils/modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTransactionsTable from "@/components/shared/admin/table/orderTransactions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import OrderTransactionsTable from "@/components/shared/admin/table/orderTransactions";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};

const defaultInvoice: Menus = {
  category: "",
  _id: "",
  image: "",
  available: false,
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};

const tableHeaders = [
  "S/N",
  "Table No.",
  "Order",
  "Reference",
  "Amount",
  "Status",
  "Transaction Date",
  "Transaction Time",
  "Action",
];

const tabHeaders = {
  all: "all",
  pending: "pending",
  success: "success",
  failed: "failed",
};

const OrderTransactions: FC = () => {
  const [tabKey, setTabKey] = useState<string>("");
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus>(defaultInvoice);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateKey, setDateKey] = useState<string>("");

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0 flex flex-col gap-y-3">
          <div className="w-full bg-primaryDark pt-4 rounded-md">
            <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
              <ScrollArea className="px-3 w-full whitespace-nowrap">
                <TabsList className="bg-transparent">
                  {Object.entries(tabs || {}).map(
                    ([key, value], index): any => (
                      <div key={index}>
                        <TabsTrigger
                          value={key}
                          className="active-main-tab text-sm px-6 capitalize"
                          onClick={() => setDateKey(key)}
                        >
                          {value as string}
                        </TabsTrigger>
                      </div>
                    )
                  )}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="w-full h-full">
                <OrderTransactionsTable
                  view={view}
                  currentPage={currentPage}
                  handleRowClick={handleRowClick}
                  tableHeaders={tableHeaders}
                  tabHeaders={tabHeaders}
                  tabKey={tabKey}
                  setTabKey={setTabKey}
                  dateKey={dateKey}
                  setIsOpen={setIsOpen}
                  setSelectedInvoice={setSelectedInvoice}
                  selectedInvoice={selectedInvoice}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </Tabs>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderTransactions;
