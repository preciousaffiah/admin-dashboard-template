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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useBusinessDetailsWithoutAuth from "@/hooks/useBusinessDetailsWithoutAuth";
import { useAuthToken } from "@/hooks";
import { slugify } from "@/utils/slugify";
import DefaultTable from "@/components/shared/table";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AdminService } from "@/services";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};

const tableHeaders = [
  "S/N",
  "Table No.",
  "Menu Items",
  "Total",
  "Date of Order",
  "Status",
];

const DashboardComp: FC = () => {
  const { userData } = useAuthToken();
  const { data } = useBusinessDetailsWithoutAuth({
    id: userData?.businessId || undefined,
  });
  const [dateKey, setDateKey] = useState<string>("today");

  const url: any = slugify(data?.name || "");

  const [page, setPage] = useState(1);

  // GET TotalStats
  const fetchTotalStats = async () => {
    try {
      const response = await AdminService.getTotalStats();

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: totalStatsLoading,
    isRefetching: isTotalStatsRefetching,
    refetch: totalStatsRefetch,
    isError: isTotalStatsError,
    data: totalStatsData,
  } = useQuery<any, Error>({
    queryKey: ["get-total-stats", userData?.businessId || ""],
    queryFn: fetchTotalStats,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });


    // GET PAYOUT REQUESTS
    const fetchPayoutRequests = async () => {
      try {
        const response = await AdminService.getPayoutRequets(page, "");
  
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
      queryKey: ["get-payout-requests", userData?.businessId || ""],
      queryFn: fetchPayoutRequests,
      gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
      refetchOnWindowFocus: true,
    });

    
  // GET STATS
  const fetchBusinessStats = async () => {
    try {
      const response = await AdminService.getDashboardStats(
        dateKey
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const {
    isLoading: isStatsLoading,
    isRefetching: isStatsRefetching,
    refetch: statsRefetch,
    isError: isStatsError,
    data: statsData,
  } = useQuery<any, Error>({
    queryKey: ["get-stats", userData?.businessId || "", dateKey],
    queryFn: fetchBusinessStats,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    statsRefetch();
  }, [dateKey]);
console.log("itemsData", itemsData);

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
          <div className="lg:w-[100%] w-full h-fit flex flex-col gap-y-4 md:pb-0 pb-3 justify-between">
            <div className="w-full overflow-x-scroll flex md:justify-start gap-x-4">
              <div
                className={`
                                    bg-primaryDark md:min-w-max min-w-80 w-full h-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
              >
                <div className="text-secondaryBorder w-full flex flex-col gap-y-10">
                  <div className="p-2">
                    <div className="text-secondaryBorder font-medium flex justify-between">
                      <h1 className="text-lg">Total Users</h1>
                      <UsersRound />
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                      <CardHeader className="px-2 py-2">
                        <CardTitle className="flex justify-between">
                          <p className="font-medium">
                            {totalStatsData?.usersCount.toLocaleString()}
                          </p>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </div>
              <div
                className={`
                                    bg-primaryDark h-full md:min-w-max min-w-80 w-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
              >
                <div className="text-secondaryBorder w-full flex flex-col gap-y-10">
                  <div className="p-2">
                    <div className="text-secondaryBorder font-medium flex justify-between">
                      <h1 className="text-lg">Total Businesses</h1>
                      <BriefcaseBusiness />
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                      <CardHeader className="px-2 py-2">
                        <CardTitle className="flex justify-between">
                          <p className="font-medium">{totalStatsData?.businessesCount.toLocaleString()}</p>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultValue={Object.keys(tabs || {})[0]}
            className="w-full pt-8"
          >
            <ScrollArea className="px-3 w-full whitespace-nowrap">
              <div className="flex justify-between items-center lg:flex-row flex-col-reverse">
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
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {Object.keys(tabs || {}).map((item: any, index: number) => (
              <TabsContent value={item} key={index}>
                <div className="w-full">
                  <div className="flex gap-y-6 md:px-0 px-3 flex-col w-full h-full">
                    <div className="pt-4 rounded-md px-3 gap-y-10 flex pb-4 gap-x-4 flex-col">
                      <div className="lg:w-[100%] w-full h-fit flex flex-col gap-y-4 md:pb-0 pb-3 justify-between">
                        <div className="w-full overflow-x-scroll flex md:justify-start gap-x-4">
                          <div
                            className={`
                                    bg-primaryDark md:min-w-max min-w-80 w-full h-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
                          >
                            <div className="text-secondaryBorder w-full flex flex-col gap-y-10">
                              <div className="p-2">
                                <div className="text-secondaryBorder font-medium flex justify-between">
                                  <h1 className="text-lg">New Users</h1>
                                  <UsersRound />
                                </div>
                              </div>
                              <div className="w-full flex justify-between">
                                <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                                  <CardHeader className="px-2 py-2">
                                    <CardTitle className="flex justify-between">
                                      <p className="font-medium">
                                        {statsData?.user.stat.toLocaleString()}
                                      </p>
                                      <div className="flex w-28 items-center">
                                        {statsData?.user.indicator ===
                                          "less" && (
                                          <TrendingDown className="w-8 pr-1 text-red-600" />
                                        )}
                                        {statsData?.user.indicator ===
                                          "more" && (
                                          <TrendingUp className="w-8 pr-1 text-green-600" />
                                        )}
                                        {statsData?.user.indicator && (
                                          <>
                                            <p className="text-sm font-medium leading-4">
                                              {statsData?.user.percentage}%{" "}
                                              {statsData?.user.indicator}{" "}
                                              than last time
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                </Card>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`
                                    bg-primaryDark h-full md:min-w-max min-w-80 w-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
                          >
                            <div className="text-secondaryBorder w-full flex flex-col gap-y-10">
                              <div className="p-2">
                                <div className="text-secondaryBorder font-medium flex justify-between">
                                  <h1 className="text-lg">New Businesses</h1>
                                  <BriefcaseBusiness />
                                </div>
                              </div>
                              <div className="w-full flex justify-between">
                                <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                                  <CardHeader className="px-2 py-2">
                                    <CardTitle className="flex justify-between">
                                      <p className="font-medium">
                                        {statsData?.business.stat.toLocaleString()}
                                      </p>

                                      <div className="flex w-28 items-center">
                                        {statsData?.business.indicator ===
                                          "less" && (
                                          <TrendingDown className="w-8 pr-1 text-red-600" />
                                        )}
                                        {statsData?.business.indicator ===
                                          "more" && (
                                          <TrendingUp className="w-8 pr-1 text-green-600" />
                                        )}

                                        {statsData?.business.indicator && (
                                          <>
                                            <p className="text-sm font-medium leading-4">
                                              {statsData?.business.percentage}%{" "}
                                              {statsData?.business.indicator} than
                                              last time
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                </Card>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex pb-4 flex-col bg-primaryDark pt-4 rounded-md">
                        <div className="pt-4 rounded-t-md px-3 flex pb-4 border-b border-primary-border">
                          <div className="flex justify-between w-full">
                            <p className="capitalize text-lg font-medium text-secondaryBorder">
                              Today's Payout Requests
                            </p>
                            <EllipsisVertical className="capitalize text-lg font-medium text-secondaryBorder" />
                          </div>
                        </div>

                        {itemsData &&
                          !isItemsLoading &&
                          !isRefetching &&
                          itemsData.currentItemCount > 0 && (
                            <>
                              <DefaultTable
                                // children={children}
                                tableHeaders={tableHeaders}
                              >
                                <TableBody>
                                  {itemsData?.payouts
                                    .slice(0, 5)
                                    .map((invoice: any, index: number) => (
                                      <TableRow
                                        key={index}
                                        className="bg-primaryDark truncate text-center py-2 rounded-lg"
                                      >
                                        <TableCell className="truncate">
                                          <Circle
                                            fill="none"
                                            className={` text-primary-border`}
                                          />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                          {index + 1}
                                        </TableCell>
                                        <TableCell>
                                          #
                                          {String(
                                            invoice.tableId.tableNumber
                                          ).padStart(2, "0")}
                                        </TableCell>
                                        <TableCell>
                                          <div className="capitalize flex justify-center items-center gap-x-1">
                                            {invoice.items[0].itemId.name}
                                            {invoice.items.length > 1 ? (
                                              <h1 className="w-fit py-[0.1rem] px-[0.2rem] border-2 border-textCompleted border-dashed rounded-full font-medium">
                                                +{invoice.items.length - 1}
                                              </h1>
                                            ) : null}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          ₦{invoice.total.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                          {moment(invoice?.createdAt).format(
                                            "DD-MM-YY"
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
                                    ))}
                                </TableBody>
                              </DefaultTable>

                              <Link
                                href="orders"
                                className="text-txWhite md:text-base text-sm mt-4 py-2 m-auto transparent-btn w-fit px-5"
                              >
                                View All Orders
                                <ChevronRight color="#c0bfbc" />
                              </Link>
                            </>
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
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default DashboardComp;
