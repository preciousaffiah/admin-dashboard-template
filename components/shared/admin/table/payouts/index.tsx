import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable } from "@/types";
import DefaultTable from "../../../table";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { ItemService, OrderTransService, PayoutsService } from "@/services";
import { useAuthToken } from "@/hooks";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Circle, FolderOpen, Loader } from "lucide-react";
import { PayoutTypeEnum, TransactionStatusEnum } from "@/types/enums";
import moment from "moment";

const AdminPayoutsAndTransactionsTable = ({
  children,
  view,
  handleRowClick,
  tabKey,
  setTabKey,
  dateKey,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  tableHeaders,
  currentPage,
  setCurrentPage,
  getPageNumbers,
  className,
}: AdminTable) => {
  const { token, userData } = useAuthToken();

  const [page, setPage] = useState(1);

  // GET HISTORY
  const fetchHistory = async () => {
    try {
      // setPage(pageParam);

      const response = await PayoutsService.getPayouts(
        userData?.businessId || "", // businessId
        page, // page
        { dateFilter: dateKey } // filters object
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
    queryKey: ["get-payout-history", userData?.businessId || "", dateKey, page],
    queryFn: fetchHistory,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch();
  }, [dateKey]);
  console.log(itemsData);

  return (
    <div>
      <div className="flex m-auto justify-between py-3 px-3 overflow-x-scroll md:gapx-0 gap-x-2">
        <h1 className="pr-20 text-txWhite font-medium text-xl">
          Payouts & Transactions History
        </h1>
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
            itemsData.currentItemCount > 0 && (
              <TabsContent value={dateKey || ""} className="w-full">
                <Table>
                  <TableBody>
                    {itemsData?.payouts.map((invoice: any, index: number) => (
                      <TableRow key={index}>
                        <div className="py-3 border-y-[1px] text-primary px-4">
                          {invoice.type === PayoutTypeEnum.REQUEST && (
                            <div className="flex">
                              <p className="pr-1">{index + 1}.</p>
                              You requested for payout on{" "}
                              {moment(invoice.createdAt).format("ll")} -{" "}
                              <p
                                className={`capitalize ml-1 px-1.5 py-0.5 rounded-md status-${invoice.status}`}
                              >
                                {invoice.status}
                              </p>
                            </div>
                          )}
                          {invoice.type === PayoutTypeEnum.TRANSACTION && (
                            <div className="flex">
                              <p className="pr-1">{index + 1}.</p>₦
                              {(invoice?.amount || 0).toLocaleString()} has been
                              sent to {invoice.accountName} - {invoice.bankName}{" "}
                              {moment(invoice.createdAt).format("ll")} -{" "}
                            </div>
                          )}
                        </div>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            )}

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
    </div>
  );
};

export default AdminPayoutsAndTransactionsTable;
