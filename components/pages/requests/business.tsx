"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Circle,
  FolderOpen,
  Loader,
  LoaderCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAuthToken } from "@/hooks";
import DefaultTable from "@/components/shared/table";
import { handleAxiosError } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AdminService } from "@/services";
import DataPagination from "@/components/flenjo-ui/Pagination";
import { handleRowClick } from "@/utils/modal";
import { BusinessStatusEnum } from "@/types/enums";

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
  "CAC",
  "Creator's Name",
  "Creator's Email",
  "Date of Req",
  "Status",
  "Action",
];

const BusinessRequestsComp: FC = () => {
  const { userData } = useAuthToken();
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [dateKey, setDateKey] = useState<string>("");
  const [updated, setUpdated] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // GET BUSINESS REQUESTS
  const fetchBusinessRequests = async () => {
    try {
      const response = await AdminService.getBusinessRequests(page, dateKey);

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
    queryKey: ["get-business-requests"],
    queryFn: fetchBusinessRequests,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch();
  }, [dateKey]);

  console.log(dateKey);

  const updateBusinessStatusRequest: any = async (
    businessId: string,
    status: string
  ) => {
    try {
      const response = await AdminService.updateBusinessStatus(
        businessId,
        status
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const verifyMutation: any = useMutation({
    mutationFn: ({
      businessId,
      status,
    }: {
      businessId: string;
      status: string;
    }) => updateBusinessStatusRequest(businessId, status),
    onSuccess: (res: any, variables) => {
      setUpdated((prev) => ({
        ...prev,
        [variables?.businessId]: variables?.status,
      }));
    },
  });

  const handleSubmit = async (businessId: string, status: string) => {
    console.log(businessId, status);

    setLoading((prev) => ({ ...prev, [`${businessId}${status}`]: true }));

    verifyMutation.mutate(
      { businessId, status },
      {
        onSettled: (_: any, __: any, variables: any) => {
          setLoading((prev) => ({
            ...prev,
            [`${businessId}${status}`]: false,
          }));
          setUpdated((prev) => ({
            ...prev,
            [variables.businessId]: variables.status,
          }));
        },
      }
    );
  };
  console.log(data);

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
                              Business Requests
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
                                  {data?.requests
                                    .map((invoice: any, index: number) => (
                                      <TableRow
                                        key={index}
                                        className={`${
                                          selectedInvoice?._id === invoice._id
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
                                        <TableCell>
                                          {invoice.name}
                                        </TableCell>
                                        <TableCell className="lowercase">
                                          {invoice.email}
                                        </TableCell>
                                        <TableCell>
                                          <Link
                                            href={invoice.cac}
                                            target="_blank"
                                            className="text-blue-700 underline"
                                          >
                                            CAC
                                          </Link>
                                        </TableCell>
                                        <TableCell>
                                          {invoice.adminId.fullname}
                                        </TableCell>
                                        <TableCell className="lowercase">
                                          {invoice.adminId.email}
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
                                          <div className="flex justify-center">
                                            <div
                                              className={`font-medium text-center flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                                            >
                                              {invoice.status ===
                                                BusinessStatusEnum.PENDING &&
                                              !updated[invoice._id] ? (
                                                <div className="flex gap-x-3">
                                                  <button
                                                    onClick={() =>
                                                      handleSubmit(
                                                        invoice._id,
                                                        BusinessStatusEnum.APPROVED
                                                      )
                                                    }
                                                    disabled={
                                                      verifyMutation.isPending
                                                    }
                                                    className="text-white bg-primaryLime flex items-center gap-x-1 px-3 py-1 rounded-md"
                                                  >
                                                    Approve
                                                    {loading[
                                                      `${invoice._id}${BusinessStatusEnum.APPROVED}`
                                                    ] && (
                                                      <LoaderCircle className="flex w-4 h-5 rotate-icon" />
                                                    )}
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      handleSubmit(
                                                        invoice._id,
                                                        BusinessStatusEnum.DECLINED
                                                      )
                                                    }
                                                    disabled={
                                                      verifyMutation.isPending
                                                    }
                                                    className="text-white bg-cancel flex items-center gap-x-1 px-3 py-1 rounded-md"
                                                  >
                                                    Decline
                                                    {loading[
                                                      `${invoice._id}${BusinessStatusEnum.DECLINED}`
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

export default BusinessRequestsComp;
