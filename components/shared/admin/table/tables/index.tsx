import React, { useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable } from "@/types";
import DefaultTable from "../../../table";
import MenuGrid from "../../menuGrid";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { BusService, ItemService } from "@/services";
import { useAuthToken } from "@/hooks";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Circle, FolderOpen, Loader, Plus } from "lucide-react";
import { Dinner } from "@/components/serviette-icons";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddStaffModal from "@/components/shared/modal/add-staff";
import UpdateTableModal from "@/components/shared/modal/update-table";

const TablesTable = ({
  children,
  view,
  tabKey,
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
  const [success, setSuccess] = useState(false);

  // GET ITEMS
  const fetchItems = async () => {
    try {
      // setPage(pageParam);

      const response = await BusService.getAllTables(
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
    isLoading: isTablesLoading,
    isRefetching,
    refetch,
    isError,
    data: tablesData,
  } = useQuery<any, Error>({
    queryKey: ["get-tables", userData?.businessId || ""],
    queryFn: fetchItems,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  const handleTabChange: any = (key: any) => {
    if (key === "all") {
      tabKey = null;
    } else {
      tabKey = { status: key };
    }
    refetch();
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
                  onClick={(event) => handleTabChange(key)}
                  className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                >
                  {value as string}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <div>
            <SearchBar
              placeholder="Search for food, drinks and more"
              className="md:rounded-xl rounded-full md:px-3 px-1"
            />
          </div>
        </div>
        <div>
          <div
            className={`${
              view ? "px-4 bg-secondaryDarker" : ""
            }  flex py-4 justify-between`}
          >
            {tablesData &&
              !isTablesLoading &&
              !isRefetching &&
              tablesData.currentItemCount > 0 &&
              Object.keys(tabHeaders || {}).map((item: any, index: number) => (
                <TabsContent key={index} value={item} className="w-full">
                  {view ? (
                    <div>
                      <MenuGrid
                        invoiceData={tablesData}
                        isLoading={isTablesLoading}
                        currentPage={currentPage}
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
                          {tablesData?.tables.map(
                            (invoice: any, index: number) => (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <TableRow
                                    onClick={() => {
                                      setSuccess(false);
                                    }}
                                    key={index}
                                    className={`${
                                      selectedInvoice._id === invoice._id
                                        ? "border border-primaryGreen bg-selectedRow"
                                        : "bg-primaryDark"
                                    } truncate text-center py-2 rounded-lg cursor-pointer`}
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
                                    <TableCell>
                                      <div className="m-auto w-fit flex items-center gap-x-1">
                                        <div className="w-8 h-fit">
                                          {/* <img
                                        src={}
                                        className="w-10 h-8 rounded-full object-cover"
                                      /> */}
                                          <Dinner />
                                        </div>
                                      </div>
                                    </TableCell>

                                    <TableCell>
                                      #
                                      {String(invoice.tableNumber).padStart(
                                        2,
                                        "0"
                                      )}
                                    </TableCell>
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
                                </DialogTrigger>
                                <UpdateTableModal
                                  success={success}
                                  setSuccess={setSuccess}
                                  tableId={invoice._id}
                                  tableNumber={invoice.tableNumber}
                                  businessId={userData?.businessId || ""}
                                />
                              </Dialog>
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
                    total_items={tablesData.total}
                    total_pages={tablesData.totalPages}
                    items_per_page={tablesData.perPage}
                    current_item_count={tablesData.currentItemCount} // Total number of items matching the filter
                  />
                </TabsContent>
              ))}

            {tablesData?.currentItemCount < 1 &&
              !isRefetching &&
              !isTablesLoading && (
                <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                  <FolderOpen />
                  Empty
                </div>
              )}

            {(isTablesLoading || isRefetching) && (
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

export default TablesTable;
