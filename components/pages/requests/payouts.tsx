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
  LoaderCircle,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AdminService, BusService } from "@/services";
import { CustomChartTooltip } from "@/components/serviette-ui";
import DataPagination from "@/components/serviette-ui/Pagination";
import { handleRowClick } from "@/utils/modal";
import { PayoutRequestStatusEnum, PayoutStatusEnum } from "@/types/enums";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};

const tableHeaders = [
  "S/N",
  "Name",
  "Email",
  "Account Number",
  "Account Name",
  "Bank Name",
  "Date of Req",
  "Status",
  "Amount to Pay",
  "Action",
];

const PayoutRequestsComp: FC = () => {
  const { userData } = useAuthToken();
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [dateKey, setDateKey] = useState<string>("");
  const [updated, setUpdated] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // GET ALL USERS
  const fetchPayoutRequests = async () => {
    try {
      const response = await AdminService.getPayoutRequets(page, dateKey);

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const { isLoading, isRefetching, refetch, isError, data } = useQuery<
    any,
    Error
  >({
    queryKey: ["get-payout-requests"],
    queryFn: fetchPayoutRequests,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch();
  }, [dateKey]);

  console.log(dateKey);

  const updatePayoutStatusRequest: any = async (
    payoutId: string,
    status: string
  ) => {
    try {
      const response = await AdminService.updatePayoutStatus(payoutId, status);
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const verifyMutation: any = useMutation({
    mutationFn: ({ payoutId, status }: { payoutId: string; status: string }) =>
      updatePayoutStatusRequest(payoutId, status),
    onSuccess: (res: any, variables) => {
      setUpdated((prev) => ({
        ...prev,
        [variables?.payoutId]: variables?.status,
      }));
    },
  });

  const handleSubmit = async (payoutId: string, status: string) => {
    console.log(payoutId, status);

    setLoading((prev) => ({ ...prev, [`${payoutId}${status}`]: true }));

    verifyMutation.mutate(
      { payoutId, status },
      {
        onSettled: (_: any, __: any, variables: any) => {
          setLoading((prev) => ({ ...prev, [`${payoutId}${status}`]: false }));
          setUpdated((prev) => ({
            ...prev,
            [variables.payoutId]: variables.status,
          }));
        },
      }
    );
  };
  //   console.log("loading", loading[`${payoutId}${status}`]);
  console.log("updated1", updated[verifyMutation.variables?.payoutId]);
  //   console.log("updated2", updated[payoutId]);
  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit md:px-8 px-0">
          <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
            <ScrollArea className="px-3 w-full whitespace-nowrap">
              <TabsList className="bg-transparent">
                {Object.entries(tabs || {}).map(([key, value], index): any => (
                  <div key={index}>
                    <TabsTrigger
                      value={key}
                      className="active-main-tab text-sm px-6 capitalize"
                      onClick={() => setDateKey(key)}
                    >
                      {value as string}
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {Object.keys(tabs || {}).map((item: any, index: number) => (
              <TabsContent value={item} key={index}>
                <div className="w-full">
                  <div className="flex gap-y-6 md:px-0 px-3 flex-col w-full h-full">
                    <div className="pt-4 rounded-md px-3 gap-y-10 flex pb-4 gap-x-4 flex-col">
                      <div className="flex pb-4 flex-col bg-primaryDark pt-4 rounded-md">
                        <div className="pt-4 rounded-t-md px-3 flex pb-4 border-b border-primary-border">
                          <div className="flex justify-between w-full">
                            <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                              Payout Requests
                            </h1>
                          </div>
                        </div>

                        {data &&
                          !isLoading &&
                          !isRefetching &&
                          data.currentItemCount > 0 && (
                            <>
                              <DefaultTable tableHeaders={tableHeaders}>
                                <TableBody>
                                  {data?.payouts
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
                                        <TableCell className="capitalize">
                                          {invoice.businessId.name}
                                        </TableCell>
                                        <TableCell className="lowercase">
                                          {invoice.businessId.email}
                                        </TableCell>
                                        <TableCell>
                                          {invoice.businessId.accountNumber}
                                        </TableCell>
                                        <TableCell>
                                          {invoice.businessId.accountName}
                                        </TableCell>
                                        <TableCell>
                                          {invoice.businessId.bankName}
                                        </TableCell>
                                        <TableCell>
                                          {moment(invoice?.createdAt).format(
                                            "DD-MM-YY"
                                          )}
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
                                          ₦
                                          {invoice.amountToBePaid.toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                          <div className="flex justify-center">
                                            <div
                                              className={`font-medium text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                            >
                                              {invoice.status ===
                                                PayoutStatusEnum.PENDING &&
                                              !updated[invoice._id] ? (
                                                <div className="flex gap-x-3">
                                                  <button
                                                    onClick={() =>
                                                      handleSubmit(
                                                        invoice._id,
                                                        PayoutStatusEnum.PROCESSED
                                                      )
                                                    }
                                                    disabled={
                                                      verifyMutation.isPending
                                                    }
                                                    className="text-white bg-primaryLime flex items-center gap-x-1 px-3 py-1 rounded-md"
                                                  >
                                                    Approve
                                                    {loading[
                                                      `${invoice._id}${PayoutStatusEnum.PROCESSED}`
                                                    ] && (
                                                      <LoaderCircle className="flex w-4 h-5 rotate-icon" />
                                                    )}
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      handleSubmit(
                                                        invoice._id,
                                                        PayoutStatusEnum.DECLINED
                                                      )
                                                    }
                                                    disabled={
                                                      verifyMutation.isPending
                                                    }
                                                    className="text-white bg-cancel flex items-center gap-x-1 px-3 py-1 rounded-md"
                                                  >
                                                    Decline
                                                    {loading[
                                                      `${invoice._id}${PayoutStatusEnum.DECLINED}`
                                                    ] && (
                                                      <LoaderCircle className="flex w-4 h-5 rotate-icon" />
                                                    )}
                                                  </button>
                                                </div>
                                              ) : (
                                                <button className="capitalize text-primary bg-gray-200 px-3 py-1 rounded-md">
                                                  {updated[invoice._id]}
                                                </button>
                                              )}
                                            </div>
                                          </div>
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

export default PayoutRequestsComp;
