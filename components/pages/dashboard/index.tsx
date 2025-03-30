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
import { BusService } from "@/services";
import { CustomChartTooltip } from "@/components/serviette-ui";

const BarChart = dynamic(
  () => import("recharts").then((recharts) => recharts.BarChart),
  { ssr: false }
);

export const description = "A line chart with dots";

const customersChartData = [
  { month: "Start", cusomers: 0 },
  { month: "Stop", cusomers: 0 },
];

const ordersChartData = [
  { month: "Start", orders: 0 },
  { month: "Stop", orders: 0 },
];

const revenuesChartData = [
  { month: "Start", revenue: 0 },
  { month: "Stop", revenue: 0 },
];

const chartCusomersConfig = {
  Customers: {
    label: "Customers",
    color: "#0000FF",
  },
} satisfies ChartConfig;

const chartOrdersConfig = {
  Orders: {
    label: "Orders",
    color: "#0000FF",
  },
} satisfies ChartConfig;

const chartRevenuesConfig = {
  Revenue: {
    label: "Revenue",
    color: "#0000FF",
  },
} satisfies ChartConfig;

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

const Dashboard: FC = () => {
  const { userData } = useAuthToken();
  const { data } = useBusinessDetailsWithoutAuth({
    id: userData?.businessId || undefined,
  });
  const [dateKey, setDateKey] = useState<string>("today");

  const url: any = slugify(data?.name || "");

  const [page, setPage] = useState(1);

  // GET ORDERS
  const fetchOrders = async () => {
    try {
      // setPage(pageParam);

      const response = await OrderService.getOrders(
        userData?.businessId || "", // businessId
        page, // page
        {} // filters object
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

  // GET STATS
  const fetchBusinessStats = async () => {
    try {
      const response = await BusService.getBusinessStats(
        userData?.businessId || "", // businessId
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

  const customersChartData2: any = () => {
    if (
      !statsData?.charts ||
      statsData.charts.length === 0 ||
      isStatsRefetching
    )
      return customersChartData;
    return [
      { month: "Start", customers: 0 }, // Initial baseline point
      ...statsData?.charts.map((item: any) => ({
        month: item.label,
        customers: item.totalCustomers,
      })),
    ];
  };

  const ordersChartData2: any = () => {
    if (
      !statsData?.charts ||
      statsData.charts.length === 0 ||
      isStatsRefetching
    )
      return ordersChartData;
    return [
      { month: "Start", orders: 0 }, // Initial baseline point
      ...statsData?.charts.map((item: any) => ({
        month: item.label,
        orders: item.totalOrders,
      })),
    ];
  };

  const revenuesChartData2: any = () => {
    if (
      !statsData?.charts ||
      statsData.charts.length === 0 ||
      isStatsRefetching
    )
      return revenuesChartData;
    return [
      { month: "Start", revenue: 0 }, // Initial baseline point
      ...statsData?.charts.map((item: any) => ({
        month: item.label,
        revenue: item.totalRevenue,
      })),
    ];
  };

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
          <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
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
                <div className="text-primary md:text-sm text-xs gap-x-1 md: flex w-full items-center lg:justify-end justify-start sm:justify-center md:pl-0 pl-4 md:text-end text-center font-medium">
                  Sign in link:
                  <span className="font-normal text-xs">
                    {`${
                      process.env.NEXT_PUBLIC_FRONTEND_URL as string
                    }/auth/sign-in/${url}`}
                  </span>
                  <Copy
                    textToCopy={`${
                      process.env.NEXT_PUBLIC_FRONTEND_URL as string
                    }/auth/sign-in/${url}`}
                  />
                </div>
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
                            <div className="text-secondaryBorder w-full">
                              <div className="p-2">
                                <div className="text-secondaryBorder font-medium flex justify-between">
                                  <h1 className="text-lg">Customers</h1>
                                  <div className="flex gap-x-4">
                                    <EllipsisVertical />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-between">
                                <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                                  <CardHeader className="px-2 py-2">
                                    <CardTitle className="flex justify-between">
                                      <p className="font-medium">
                                        {statsData?.customer.stat}
                                      </p>
                                      <div className="flex w-28 items-center">
                                        {statsData?.customer.indicator ===
                                          "less" && (
                                          <TrendingDown className="w-8 pr-1 text-red-600" />
                                        )}
                                        {statsData?.customer.indicator ===
                                          "more" && (
                                          <TrendingUp className="w-8 pr-1 text-green-600" />
                                        )}
                                        {statsData?.customer.indicator ===
                                        "nill" ? null : (
                                          <>
                                            <p className="text-sm font-medium leading-4">
                                              {statsData?.customer.percentage}%{" "}
                                              {statsData?.customer.indicator}{" "}
                                              than last time
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartCusomersConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={customersChartData2()}
                                        margin={{
                                          left: 5,
                                          right: 5,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={({ payload }) => {
                                            return (
                                              <CustomChartTooltip
                                                payload={payload}
                                                tabKey={dateKey}
                                              />
                                            );
                                          }}
                                        />
                                        <defs>
                                          <linearGradient
                                            id="fillDesktop1"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                          >
                                            <stop
                                              offset="5%"
                                              stopColor="red"
                                              stopOpacity={0.8}
                                            />
                                            <stop
                                              offset="95%"
                                              stopColor="white"
                                              stopOpacity={0.1}
                                            />
                                          </linearGradient>
                                        </defs>
                                        <Area
                                          className="w-full"
                                          dataKey="customers"
                                          type="natural"
                                          fill="url(#fillDesktop1)"
                                          fillOpacity={0.2}
                                          stroke="red"
                                          color="white"
                                          stackId="a"
                                        />
                                      </AreaChart>
                                    </ChartContainer>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`
                                    bg-primaryDark h-full md:min-w-max min-w-80 w-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
                          >
                            <div className="text-secondaryBorder w-full">
                              <div className="p-2">
                                <div className="text-secondaryBorder font-medium flex justify-between">
                                  <h1 className="text-lg">Orders</h1>
                                  <div className="flex gap-x-4">
                                    <EllipsisVertical />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-between">
                                <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                                  <CardHeader className="px-2 py-2">
                                    <CardTitle className="flex justify-between">
                                      <p className="font-medium">
                                        {statsData?.order.stat}
                                      </p>

                                      <div className="flex w-28 items-center">
                                        {statsData?.order.indicator ===
                                          "less" && (
                                          <TrendingDown className="w-8 pr-1 text-red-600" />
                                        )}
                                        {statsData?.order.indicator ===
                                          "more" && (
                                          <TrendingUp className="w-8 pr-1 text-green-600" />
                                        )}

                                        {statsData?.order.indicator ===
                                        "nill" ? null : (
                                          <>
                                            <p className="text-sm font-medium leading-4">
                                              {statsData?.order.percentage}%{" "}
                                              {statsData?.order.indicator} than
                                              last time
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartOrdersConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={ordersChartData2()}
                                        margin={{
                                          left: 5,
                                          right: 5,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={({ payload }) => {
                                            return (
                                              <CustomChartTooltip
                                                payload={payload}
                                                tabKey={dateKey}
                                              />
                                            );
                                          }}
                                        />
                                        <defs>
                                          <linearGradient
                                            id="fillDesktop2"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                          >
                                            <stop
                                              offset="5%"
                                              stopColor="#ff7800"
                                              stopOpacity={0.8}
                                            />
                                            <stop
                                              offset="95%"
                                              stopColor="white"
                                              stopOpacity={0.1}
                                            />
                                          </linearGradient>
                                        </defs>
                                        <Area
                                          className="w-full"
                                          dataKey="orders"
                                          type="natural"
                                          fill="url(#fillDesktop2)"
                                          fillOpacity={0.2}
                                          stroke="#ff7800"
                                          stackId="a"
                                        />
                                      </AreaChart>
                                    </ChartContainer>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`
                                    bg-primaryDark h-full md:min-w-max min-w-80 w-full cursor-pointer text-sm text-txWhite rounded-md py-1`}
                          >
                            <div className="text-secondaryBorder w-full">
                              <div className="p-2">
                                <div className="text-secondaryBorder font-medium flex justify-between">
                                  <h1 className="text-lg">Revenue</h1>
                                  <div className="flex gap-x-4">
                                    <EllipsisVertical />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-between">
                                <Card className="text-txWhite w-full rounded-none bg-transparent border-none">
                                  <CardHeader className="px-2 py-2">
                                    <CardTitle className="flex justify-between">
                                      <p className="font-medium">
                                        ₦
                                        {statsData?.revenue.stat?.toLocaleString()}
                                      </p>
                                      <div className="flex w-28 items-center">
                                        {statsData?.revenue.indicator ===
                                          "less" && (
                                          <TrendingDown className="w-8 pr-1 text-red-600" />
                                        )}
                                        {statsData?.revenue.indicator ===
                                          "more" && (
                                          <TrendingUp className="w-8 pr-1 text-green-600" />
                                        )}

                                        {statsData?.revenue.indicator ===
                                        "nill" ? null : (
                                          <>
                                            <p className="text-sm font-medium leading-4">
                                              {statsData?.revenue.percentage}%{" "}
                                              {statsData?.revenue.indicator}{" "}
                                              than last time
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartRevenuesConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={revenuesChartData2()}
                                        margin={{
                                          left: 5,
                                          right: 5,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={({ payload }) => {
                                            return (
                                              <CustomChartTooltip
                                                payload={payload}
                                                tabKey={dateKey}
                                              />
                                            );
                                          }}
                                        />
                                        <defs>
                                          <linearGradient
                                            id="fillDesktop3"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                          >
                                            <stop
                                              offset="5%"
                                              stopColor="green"
                                              stopOpacity={0.8}
                                            />
                                            <stop
                                              offset="95%"
                                              stopColor="white"
                                              stopOpacity={0.1}
                                            />
                                          </linearGradient>
                                        </defs>
                                        <Area
                                          className="w-full"
                                          dataKey="revenue"
                                          type="natural"
                                          fill="url(#fillDesktop3)"
                                          fillOpacity={0.2}
                                          stroke="green"
                                          stackId="a"
                                        />
                                      </AreaChart>
                                    </ChartContainer>
                                  </CardContent>
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
                              Today's Orders
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
                                  {itemsData?.orders
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

export default Dashboard;
