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

const BarChart = dynamic(
  () => import("recharts").then((recharts) => recharts.BarChart),
  { ssr: false }
);

export const description = "A line chart with dots";

const profitChartData = [
  {
    month: "Jan",
    amt: 9400,
  },
  {
    month: "Feb",
    amt: 5210,
  },
  {
    month: "Mar",
    amt: 73290,
  },
  {
    month: "Apr",
    amt: 12000,
  },
  {
    month: "May",
    amt: 91181,
  },
  {
    month: "Jun",
    amt: 21500,
  },
  {
    month: "Jul",
    amt: 70100,
  },
  {
    month: "Aug",
    amt: 12000,
  },
  {
    month: "Sep",
    amt: 91181,
  },
  {
    month: "Oct",
    amt: 21500,
  },
  {
    month: "Nov",
    amt: 70100,
  },
  {
    month: "Dec",
    amt: 12000,
  },
];

const customersChartData = [
  { month: "January", desktop: 80 },
  { month: "February", desktop: 105 },
  { month: "March", desktop: 137 },
  { month: "April", desktop: 173 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
];

const ordersChartData = [
  { month: "January", desktop: 80 },
  { month: "February", desktop: 105 },
  { month: "March", desktop: 137 },
  { month: "April", desktop: 173 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
];

const revenuesChartData = [
  { month: "January", desktop: 80 },
  { month: "February", desktop: 105 },
  { month: "March", desktop: 137 },
  { month: "April", desktop: 173 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "June", desktop: 214 },
];

const salesChartData = [
  {
    name: "Mon",
    inc: 4000,
    dec: 2400,
    amt: 2400,
  },
  {
    name: "Tue",
    inc: 3000,
    dec: 1398,
    amt: 2210,
  },
  {
    name: "Wed",
    inc: 2000,
    dec: 9800,
    amt: 2290,
  },
  {
    name: "Thu",
    inc: 2780,
    dec: 3908,
    amt: 2000,
  },
  {
    name: "Fri",
    inc: 1890,
    dec: 4800,
    amt: 2181,
  },
  {
    name: "Sat",
    inc: 2390,
    dec: 3800,
    amt: 2500,
  },
  {
    name: "Sun",
    inc: 3490,
    dec: 4300,
    amt: 2100,
  },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#0000FF",
  },
} satisfies ChartConfig;

const tabs = ["today", "yesterday", "This Week", "This Month", "This Year"];

const tableHeaders = [
  "S/N",
  "Table No.",
  "Menu Items",
  "Total",
  "Time of Order",
  "Status",
];

const Dashboard: FC = () => {
  const { userData } = useAuthToken();
  const { data } = useBusinessDetailsWithoutAuth({
    id: userData?.businessId || undefined,
  });

  const url: any = slugify(data?.name || "");

  const [domain, setDomain] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Check if window is defined (client side)
    if (typeof window !== "undefined") {
      setDomain(window.location.origin);
    }
  }, []);

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

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
          <Tabs defaultValue={tabs[0]} className="w-full">
            <ScrollArea className="px-3 w-full whitespace-nowrap">
              <div className="flex justify-between items-center lg:flex-row flex-col-reverse">
                <TabsList className="bg-transparent">
                  {tabs.map((item, index) => (
                    <div key={index}>
                      <TabsTrigger
                        value={item}
                        className="active-main-tab text-sm px-6 capitalize"
                      >
                        {item}
                      </TabsTrigger>
                    </div>
                  ))}
                </TabsList>
                <div className="text-primary md:text-sm text-xs gap-x-1 md: flex w-full items-center lg:justify-end justify-start sm:justify-center md:pl-0 pl-4 md:text-end text-center font-medium">
                  Sign in link:
                  <span className="font-normal text-xs">
                    {`${domain}/auth/sign-in/${url}`}
                  </span>
                  <Copy textToCopy={`${domain}/auth/sign-in/${url}`} />
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {tabs.map((item, index) => (
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
                                      <p className="font-medium">673</p>
                                      <div className="flex w-28 items-center">
                                        <TrendingDown className="w-8 pr-1 text-red-600" />

                                        <p className="text-sm font-medium leading-4">
                                          5% less than last month
                                        </p>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={customersChartData}
                                        margin={{
                                          left: 12,
                                          right: 12,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={<ChartTooltipContent />}
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
                                          dataKey="desktop"
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
                                      <p className="font-medium">865</p>
                                      <div className="flex w-28 items-center">
                                        <TrendingUp className="w-8 pr-1 text-green-600" />

                                        <p className="text-sm font-medium leading-4">
                                          10% more than last month
                                        </p>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={ordersChartData}
                                        margin={{
                                          left: 12,
                                          right: 12,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={<ChartTooltipContent />}
                                        />
                                        <defs>
                                          <linearGradient
                                            id="fillDesktop"
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
                                          dataKey="desktop"
                                          type="natural"
                                          fill="url(#fillDesktop)"
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
                                      <p className="font-medium">$95000</p>
                                      <div className="flex w-28 items-center">
                                        <TrendingUp className="w-8 pr-1 text-green-600" />

                                        <p className="text-sm font-medium leading-4">
                                          5% more than last month
                                        </p>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 h-20">
                                    <ChartContainer
                                      config={chartConfig}
                                      className="w-full h-full"
                                    >
                                      <AreaChart
                                        accessibilityLayer
                                        data={revenuesChartData}
                                        margin={{
                                          left: 12,
                                          right: 12,
                                        }}
                                      >
                                        <ChartTooltip
                                          cursor={false}
                                          content={<ChartTooltipContent />}
                                        />
                                        <defs>
                                          <linearGradient
                                            id="fillDesktop"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                          >
                                            <stop
                                              offset="5%"
                                              stopColor="white"
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
                                          dataKey="desktop"
                                          type="natural"
                                          fill="url(#fillDesktop)"
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
                                        <TableCell>₦{invoice.total.toLocaleString()}</TableCell>
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
