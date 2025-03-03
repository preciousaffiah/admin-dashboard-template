import React, { FC, useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared";
import moment from "moment";
import {
  Check,
  ChevronDown,
  Circle,
  Clock,
  Edit3,
  EllipsisVertical,
  Filter,
  FolderOpen,
  Loader,
  Minus,
  Plus,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminTable, Invoice, Menus } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import DefaultTable from "../../../table";
import MenuGrid from "../../menuGrid";
import DataPagination from "@/components/serviette-ui/Pagination";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import avatar from "public/avatar.png";

const AdminUsersTable = ({
  view,
  handleRowClick,
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

  // GET ITEMS
  const fetchStaffs = async () => {
    try {
      // setPage(pageParam);
      console.log("dd", currentPage);

      const response = await StaffService.getAllStaff(
        userData?.businessId || "", // businessId
        currentPage, // page
        tabKey // filters object
      );
      console.log(response?.data?.data);

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
    queryKey: ["get-staffs", userData?.businessId || ""],
    queryFn: fetchStaffs,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
  });

  const handleTabChange: any = (key: any) => {
    if (key === "all") {
      tabKey = null;
    } else {
      tabKey = { department: key };
    }
    refetch();
  };
console.log("isRefetching",isRefetching);

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
            {(staffsData && !isRefetching && !isItemsLoading &&
              staffsData.currentItemCount > 0 )&&
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
                            <TableCell>{invoice.email}</TableCell>
                            <TableCell>{invoice.department}</TableCell>
                            <TableCell>{invoice.phone}</TableCell>
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

            {(staffsData?.currentItemCount < 1 && !isRefetching && !isItemsLoading) && (
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
