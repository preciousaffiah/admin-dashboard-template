"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  ChevronRight,
  Circle,
  EllipsisVertical,
  TrendingDown,
  FolderOpen,
  Loader,
  UsersRound,
  BriefcaseBusiness,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { Area, AreaChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dynamic from "next/dynamic";
import AdminOrdersTable from "@/components/shared/admin/table/orders";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import { useAuthToken } from "@/hooks";
import { slugify } from "@/utils/slugify";
import Copy from "@/components/serviette-ui/copy-button";
import DefaultTable from "@/components/shared/table";
import { handleAxiosError } from "@/utils/axios";
import OrderService from "@/services/order";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AdminService, BusService } from "@/services";
import { CustomChartTooltip } from "@/components/serviette-ui";
import DataPagination from "@/components/serviette-ui/Pagination";
import { handleRowClick } from "@/utils/modal";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};

const tableHeaders = [
  "S/N",
  "FullName",
  "Email",
  "Phone",
  "Role",
  //   "Creator's Name",
  //   "Creator's Email",
  "Date of Reg",
];

const UsersComp: FC = () => {
  const { userData } = useAuthToken();
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);

  // GET ALL USERS
  const fetchAllUsers = async () => {
    try {
      const response = await AdminService.getAllUsers(page);

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading,
    isRefetching,
    refetch,
    isError,
    data,
  } = useQuery<any, Error>({
    queryKey: ["get-users"],
    queryFn: fetchAllUsers,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit md:px-8 px-0">
          <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
            {Object.keys(tabs || {}).map((item: any, index: number) => (
              <TabsContent value={item} key={index}>
                <div className="w-full">
                  <div className="flex gap-y-6 md:px-0 px-3 flex-col w-full h-full">
                    <div className="pt-4 rounded-md px-3 gap-y-10 flex pb-4 gap-x-4 flex-col">
                      <div className="flex pb-4 flex-col bg-primaryDark pt-4 rounded-md">
                        <div className="pt-4 rounded-t-md px-3 flex pb-4 border-b border-primary-border">
                          <div className="flex justify-between w-full">
                            <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                              All Users
                            </h1>
                          </div>
                        </div>

                        {data &&
                          !isLoading &&
                          !isRefetching &&
                          data.currentItemCount > 0 && (
                            <>
                              <DefaultTable
                                // children={children}
                                tableHeaders={tableHeaders}
                              >
                                <TableBody>
                                  {data?.users
                                    .slice(0, 5)
                                    .map((invoice: any, index: number) => (
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
                                              selectedInvoice?._id ===
                                              invoice._id
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
                                        <TableCell>{invoice.fullname}</TableCell>
                                        <TableCell>{invoice.email}</TableCell>
                                        <TableCell>{invoice.phone || "nill"}</TableCell>
                                        <TableCell className="capitalize">{invoice.role}</TableCell>
                                        <TableCell>
                                          {moment(invoice?.createdAt).format(
                                            "DD-MM-YY"
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </DefaultTable>

                              <DataPagination
                                currentPage={page}
                                setCurrentPage={setPage}
                                refetch={refetch}
                                total_items={data.total}
                                total_pages={data.totalPages}
                                items_per_page={data.perPage}
                                current_item_count={data.currentItemCount} // Total number of items matching the filter
                              />
                            </>
                          )}

                        {data?.currentItemCount < 1 &&
                          !isRefetching &&
                          !isLoading && (
                            <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                              <FolderOpen />
                              Empty
                            </div>
                          )}

                        {(isLoading || isRefetching) && (
                          <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                            <Loader className="rotate-icon size-8" />
                            Loading
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default UsersComp;
