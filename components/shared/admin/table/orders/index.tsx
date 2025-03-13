import React, { useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable, Invoice } from "@/types";
import DefaultTable from "../../../table";
import OrdersGrid from "../../ordersGrid";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useAuthToken } from "@/hooks";
import { ItemService } from "@/services";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Circle, FolderOpen, Loader } from "lucide-react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { handleRowClick } from "@/utils/modal";
import OrderService from "@/services/order";
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
const AdminOrdersTable = ({
  children,
  view,
  tabKey,
  invoiceData,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  currentPage,
  setCurrentPage,
  getPageNumbers,
  tabHeaders,
  tableHeaders,
  className,
}: AdminTable) => {
  const { token, userData } = useAuthToken();

  const [page, setPage] = useState(1);

  // GET ORDERS
  const fetchOrders = async () => {
    try {
      // setPage(pageParam);

      const response = await OrderService.getOrders(
        userData?.businessId || "", // businessId
        page, // page
        tabKey // filters object
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: isItemsLoading,
    isRefetching,
    refetch,
    isError,
    data: itemsData,
  } = useQuery<any, Error>({
    queryKey: ["get-orders", userData?.businessId || ""],
    queryFn: fetchOrders,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  const handleTabChange: any = (key: any) => {
    if (key === "all") {
      tabKey = null;
    } else {
      tabKey = { category: key };
    }
    refetch();
  };
  console.log(itemsData);

  return (
    <div>
      <Tabs defaultValue={Object.keys(tabHeaders || {})[0]} className="w-full">
        <div className="flex m-auto justify-between py-3 px-3 md:gapx-0 gap-x-2">
          {/* <div className="md:block hidden">
            <Button variant={"ghost"} className="transparent-btn text-secondaryBorder border-[0.3px]">
              <p className="capitalize text-sm">bulk actions</p>
              <ChevronDown className="w-5" />
            </Button>
          </div> */}
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
          {/* <div>
            <Button variant={"ghost"} className="md:rounded-xl border rounded-full px-3 transparent-btn text-secondaryBorder">
              <Filter className="md:w-5 w-4" />
              <ChevronDown className="md:block hidden w-5" />
            </Button>
          </div> */}
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
            {itemsData &&
              !isItemsLoading &&
              !isRefetching &&
              itemsData.currentItemCount > 0 &&
              Object.keys(tabHeaders || {}).map((item: any, index: number) => (
                <TabsContent key={index} value={item} className="w-full">
                  {view ? (
                    <div>
                      <OrdersGrid
                        invoiceData={itemsData}
                        isLoading={isItemsLoading}
                        currentPage={currentPage}
                        handleRowClick={undefined} //TODO:
                        setIsOpen={setIsOpen}
                        tabKey={tabKey}
                        setSelectedInvoice={setSelectedInvoice}
                        selectedInvoice={selectedInvoice}
                      />
                    </div>
                  ) : (
                    <div className={className}>
                      <DefaultTable
                        // children={children}
                        tableHeaders={tableHeaders}
                      >
                        <TableBody>
                          {itemsData?.orders.map(
                            (invoice: any, index: number) => (
                              <TableRow
                                key={index}
                                className={`${
                                  selectedInvoice?._id === invoice._id
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
                                selectedInvoice?._id === invoice._id
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
                                  #
                                  {String(invoice.tableId.tableNumber).padStart(
                                    2,
                                    "0"
                                  )}
                                </TableCell>
                                {/* <TableCell>{invoice.Customer}</TableCell> */}
                                {/* <TableCell>{invoice.tableId.tableNumber}</TableCell> */}
                                <TableCell>
                                  <div className="capitalize flex justify-center items-center gap-x-1">
                                    {invoice.items[0].itemId.name}
                                    {invoice.items.length > 1 ? (
                                      <h1 className="w-fit py-[0.1rem] px-[0.2rem] border-2 border-primaryLime border-dashed rounded-full font-medium">
                                        +{invoice.items.length - 1}
                                      </h1>
                                    ) : null}
                                  </div>
                                </TableCell>
                                <TableCell>₦{invoice.total}</TableCell>
                                <TableCell>
                                  {moment(invoice?.createdAt).format(
                                    "DD-MM-YY"
                                  )}
                                </TableCell>
                                {/* <TableCell>
                                <div className="w-fit flex items-center gap-x-1">
                                  <div className="w-8 h-4">
                                    <Image
                                      alt="img"
                                      src={invoice.item[0].image}
                                      className="w-10 h-8 rounded-full"
                                    />
                                  </div>
                                  <p className="flex break-words">
                                    {invoice.AssignedTo?.[0]?.name}
                                  </p>
                                </div>
                              </TableCell> */}

                                <TableCell>
                                  <div className="flex justify-center">
                                    <p
                                      className={`status-${invoice.status} text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                    >
                                      {invoice.status}
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </DefaultTable>
                    </div>
                  )}
                  <DataPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refetch={refetch}
                    total_items={itemsData.total}
                    total_pages={itemsData.totalPages}
                    items_per_page={itemsData.perPage}
                    current_item_count={itemsData.currentItemCount} // Total number of items matching the filter
                  />
                </TabsContent>
              ))}

            {itemsData?.currentItemCount < 1 &&
              !isRefetching &&
              !isItemsLoading && (
                <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                  <FolderOpen />
                  Empty
                </div>
              )}

            {(isItemsLoading || isRefetching) && (
              <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                <Loader className="rotate-icon size-8" />
                Loading
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminOrdersTable;
