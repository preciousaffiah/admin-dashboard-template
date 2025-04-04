import React, { useEffect, useState } from "react";
import { SearchBar, ToastMessage } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable } from "@/types";
import DefaultTable from "../../../table";
import MenuGrid from "../../menuGrid";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { ItemService, OrderTransService } from "@/services";
import { useAuthToken } from "@/hooks";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Circle, FolderOpen, Loader, LoaderCircle } from "lucide-react";
import { TransactionStatusEnum } from "@/types/enums";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const OrderTransactionsTable = ({
  children,
  view,
  handleRowClick,
  tabKey,
  setTabKey,
  dateKey,
  setIsOpen,
  setSelectedInvoice,
  selectedInvoice,
  tabHeaders,
  tableHeaders,
  currentPage,
  setCurrentPage,
  getPageNumbers,
  className,
}: AdminTable) => {
  const { token, userData } = useAuthToken();

  const [page, setPage] = useState(1);
  const [verified, setVerified] = useState<string | null>(null);
  const [loadingReferences, setLoadingReferences] = useState<
    Record<string, boolean>
  >({});

  // GET HISTORY
  const fetchHistory = async () => {
    try {
      // setPage(pageParam);

      const response = await OrderTransService.getOrderTransactions(
        userData?.businessId || "", // businessId
        page, // page
        { status: tabKey, dateFilter: dateKey } // filters object
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
    queryKey: [
      "get-order-transactions",
      userData?.businessId || "",
      tabKey,
      dateKey,
      page,
    ],
    queryFn: fetchHistory,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });
  console.log("itemsData", itemsData);

  useEffect(() => {
    refetch();
  }, [tabKey, dateKey]);

  const verfiyStatusRequest: any = async (
    orderId: string,
    reference: string
  ) => {
    try {
      const response = await OrderTransService.verifyOrderTransaction(
        orderId,
        reference
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const verifyMutation: any = useMutation({
    mutationFn: ({
      orderId,
      reference,
    }: {
      orderId: string;
      reference: string;
    }) => verfiyStatusRequest(orderId, reference),
    onSuccess: (res: any) => {
      setVerified(res.data.data.message);

      setInterval(() => {
        setVerified(null);
      }, 6000);
    },
  });

  const handleSubmit = async (orderId: string, reference: string) => {
    setLoadingReferences((prev) => ({ ...prev, [reference]: true }));

    verifyMutation.mutate(
      { orderId, reference },
      {
        onSettled: () => {
          setLoadingReferences((prev) => ({ ...prev, [reference]: false }));
        },
      }
    );
  };

  return (
    <div>
      <Tabs defaultValue={Object.keys(tabHeaders || {})[0]} className="w-full">
        <div className="flex m-auto justify-between py-3 px-3 overflow-x-scroll md:gapx-0 gap-x-2">
          <TabsList className="w-fit bg-secondaryDark">
            {Object.entries(tabHeaders || {}).map(
              ([key, value], index): any => (
                <TabsTrigger
                  key={index}
                  value={key}
                  onClick={() => setTabKey(key)}
                  className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                >
                  {value as string}
                </TabsTrigger>
              )
            )}
          </TabsList>
          {/* <div>
            <SearchBar
              placeholder="Search for food, drinks and more"
              className="md:rounded-xl rounded-full md:px-3 px-1"
            />
          </div> */}
          <h1 className="pr-20 text-txWhite font-medium text-xl">
            Order Transactions
          </h1>
        </div>
        <div className="px-4 w-full flex flex-col items-end justify-end">
          <AnimatePresence>
            {verified && (
              <motion.div
                initial={{ y: -20, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0.2 }}
              >
                <ToastMessage error={false} message={verified} />
              </motion.div>
            )}

            {verifyMutation.isError && (
              <motion.div
                initial={{ y: -20, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0.2 }}
              >
                <ToastMessage
                  message={
                    verifyMutation?.error?.message ||
                    "An error occured during process"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
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
                  (
                  <div className={className}>
                    <DefaultTable
                      // children={children}
                      tableHeaders={tableHeaders}
                    >
                      <TableBody>
                        {itemsData?.transactions.map(
                          (invoice: any, index: number) => (
                            <TableRow
                              key={index}
                              className={`${
                                selectedInvoice._id === invoice._id
                                  ? "border border-primaryGreen bg-selectedRow"
                                  : "bg-primaryDark"
                              } capitalize truncate text-center py-2 rounded-lg cursor-pointer`}
                              onClick={() => {
                                handleRowClick(
                                  invoice,
                                  setIsOpen,
                                  setSelectedInvoice
                                );
                                // reset();
                              }}
                            >
                              <TableCell className="truncate">
                                <Circle
                                  fill={`
                                  ${
                                    selectedInvoice._id === invoice._id
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
                                {String(
                                  invoice.orderId?.tableId.tableNumber
                                ).padStart(2, "0")}
                              </TableCell>
                              <TableCell>
                                <div className="capitalize flex justify-center items-center gap-x-1">
                                  {invoice.orderId?.items[0].itemId.name}
                                  {invoice.orderId?.items.length > 1 ? (
                                    <h1 className="w-fit py-[0.1rem] px-[0.2rem] border-2 border-primaryLime border-dashed rounded-full font-medium">
                                      +{invoice.orderId?.items.length - 1}
                                    </h1>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell>{invoice.reference}</TableCell>
                              <TableCell>
                                ₦{Number(invoice.amount)?.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <p
                                    className={`capitalize status-${invoice.status} text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                  >
                                    {invoice.status}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {moment(invoice?.createdAt).format("DD-MM-YY")}
                              </TableCell>
                              <TableCell>
                                {moment(invoice?.createdAt).format("LT")}
                              </TableCell>

                              <TableCell>
                                <div className="flex justify-center">
                                  <div
                                    className={`font-medium text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                  >
                                    {invoice.status !==
                                    TransactionStatusEnum.SUCCESS ? (
                                      <button
                                        onClick={() =>
                                          handleSubmit(
                                            invoice.orderId._id,
                                            invoice.reference
                                          )
                                        }
                                        disabled={
                                          loadingReferences[invoice.reference]
                                        }
                                        className="text-white bg-primary-orange flex items-center gap-x-1 px-3 py-1 rounded-md"
                                      >
                                        Verify
                                        {loadingReferences[
                                          invoice.reference
                                        ] && (
                                          <LoaderCircle className="flex w-4 h-5 rotate-icon" />
                                        )}
                                      </button>
                                    ) : (
                                      <button className="text-white bg-primary-orange px-3 py-1 rounded-md">
                                        None
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </DefaultTable>
                  </div>
                  )
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

export default OrderTransactionsTable;
