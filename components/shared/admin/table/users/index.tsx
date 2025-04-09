import React, { FC, useEffect, useState } from "react";
import { SearchBar } from "@/components/flenjo-ui";
import { Button } from "@/components/ui/button";
import moment from "moment";
import {
  Circle,
  FolderOpen,
  Loader,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { AdminTable, Menus } from "@/types";
import DefaultTable from "../../../table";
import DataPagination from "@/components/flenjo-ui/Pagination";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import avatar from "public/avatar.png";

const AdminUsersTable = ({
  view,
  handleRowClick,
  tabKey,
  setTabKey,
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

  // GET ITEMS
  const fetchStaffs = async () => {
    try {
      // setPage(pageParam);
      const response = await StaffService.getAllStaff(
        userData?.businessId || "", // businessId
        currentPage, // page
        { department: tabKey } // filters object
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
    data: staffsData,
  } = useQuery<any, Error>({
    queryKey: ["get-staffs", userData?.businessId || "", tabKey, currentPage],
    queryFn: fetchStaffs,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [tabKey]);

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
            {staffsData &&
              !isItemsLoading &&
              !isRefetching &&
              staffsData.currentItemCount > 0 &&
              Object.keys(tabHeaders || {}).map((item, index) => (
                <TabsContent key={index} value={item} className="w-full">
                  <div className={className}>
                    <DefaultTable tableHeaders={tableHeaders}>
                      <TableBody>
                        {staffsData?.user.map((invoice: any, index: number) => (
                          <TableRow
                            key={index}
                            className={`${
                              selectedInvoice._id === invoice._id
                                ? "border border-primaryGreen bg-selectedRow"
                                : "bg-primaryDark"
                            } capitalize truncate text-center py-2 rounded-lg cursor-pointer`}
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
                                  <img
                                    src={`${invoice.image || avatar.src}`}
                                    className="w-10 h-8 rounded-full object-cover"
                                  />
                                </div>
                                <p className="flex break-words">
                                  {invoice.fullname}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="lowercase">
                              {invoice.email}
                            </TableCell>
                            <TableCell>{invoice.department}</TableCell>
                            <TableCell>{`${
                              !invoice.phone ? "nill" : invoice.phone
                            }`}</TableCell>
                            <TableCell>
                              {moment(invoice?.createdAt).format("DD-MM-YY")}
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
                        ))}
                      </TableBody>
                    </DefaultTable>
                  </div>
                  <DataPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refetch={refetch}
                    total_items={staffsData.total}
                    total_pages={staffsData.totalPages}
                    items_per_page={staffsData.perPage}
                    current_item_count={staffsData.currentItemCount}
                  />
                </TabsContent>
              ))}

            {staffsData?.currentItemCount < 1 &&
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

export default AdminUsersTable;
