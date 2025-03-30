import React, { useEffect, useState } from "react";
import Container from "@/components/shared/container";
import { Menus } from "@/types";
import { handleRowClick } from "@/utils/modal";
import {
  Clock,
  LoaderCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";
import { Input } from "@/components/ui/input";
import { DeptEnum, PayoutRequestStatusEnum } from "@/types/enums";
import { useAuthToken, useBusinessDetails, useTabHeaders } from "@/hooks";
import { handleAxiosError } from "@/utils/axios";
import { ItemService, PayoutsService } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { ToastMessage } from "@/components/serviette-ui";
import { Dialog, DialogOverlay, DialogTrigger } from "@/components/ui/dialog";
import DeleteItemModal from "@/components/shared/modal/delete-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminTransactionsTable from "@/components/shared/admin/table/orderTransactions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AdminPayoutsAndTransactionsTable from "@/components/shared/admin/table/payouts";
import OtpModal from "@/components/shared/modal/otp";

const tabs = {
  today: "today",
  yesterday: "yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  thisYear: "This Year",
};

const defaultInvoice: Menus = {
  category: "",
  _id: "",
  image: "",
  available: false,
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};
const defaultValues = {
  category: null,
  image: null,
  name: null,
  price: null,
  discount: null,
  description: null,
  department: null,
};
const tableHeaders = [
  "S/N",
  "Table No.",
  "Order",
  "Reference",
  "Amount",
  "Status",
  "Transaction Date",
  "Transaction Time",
  "Action",
];

const TransactionsAdmin = ({ title }: { title: string }) => {
  const { token, userData } = useAuthToken();
  const { data } = useBusinessDetails({ id: userData?.businessId || "" });

  const [tabKey, setTabKey] = useState<string>("");
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus>(defaultInvoice);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [underReview, setUnderReview] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string>("today");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showResendBtn, setShowResendBtn] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev: any) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const payoutRequest: any = async () => {
    try {
      const response = await PayoutsService.requestPayout({
        businessId: userData?.businessId || "",
        otp,
      });
      setOtp("");
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: payoutRequest,
    onSuccess: (res: any) => {
      if (res.data.data.status === PayoutRequestStatusEnum.OTPSENT) {
        setTimer(59);
        setIsOtpModalOpen(true);
      } else if (res.data.data.status === PayoutRequestStatusEnum.UNDERREVIEW) {
        setUnderReview(res.data.data.message);
      }
    },
  });

  const onSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0 flex flex-col gap-y-3">
          <div className="flex flex-col md:items-start items-center gap-y-3">
            <Card className="bg-white text-txWhite rounded-md w-[22rem]">
              <CardHeader className="py-2 px-3 bg-primaryLime/45 rounded-t-md">
                <CardTitle className="font-normal text-xl">
                  <p>Wallet Balance</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-28 px-3">
                <p className="font-medium text-3xl flex items-end h-full justify-end">
                  ₦{(data?.balance || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <div>
              <button
                onClick={onSubmit}
                className="text-white bg-primary-orange px-3 py-1 rounded-md flex gap-x-1"
              >
                Request Payout
                {mutation.isPending && (
                  <LoaderCircle className="text-white w-4 rotate-icon" />
                )}
              </button>
              <div className="w-fit">
                {underReview && (
                  <motion.div
                    initial={{ y: -20, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0.2 }}
                  >
                    <ToastMessage error={false} message={underReview}>
                      <Clock className="text-primaryLime" />
                    </ToastMessage>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full bg-primaryDark pt-4 rounded-md">
            <Tabs defaultValue={Object.keys(tabs || {})[0]} className="w-full">
              <ScrollArea className="px-3 w-full whitespace-nowrap">
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="w-full h-full">
                <AdminPayoutsAndTransactionsTable
                  view={view}
                  currentPage={currentPage}
                  handleRowClick={handleRowClick}
                  tableHeaders={tableHeaders}
                  tabKey={tabKey}
                  setTabKey={setTabKey}
                  dateKey={dateKey}
                  setIsOpen={setIsOpen}
                  setSelectedInvoice={setSelectedInvoice}
                  selectedInvoice={selectedInvoice}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </Tabs>
          </div>

          <OtpModal
            isOpen={isOtpModalOpen}
            onClose={() => {
              setIsOtpModalOpen(false);
              setTimer(0);
            }}
            payoutRequest={payoutRequest}
            setOtp={setOtp}
            otp={otp}
            setTimer={setTimer}
            timer={timer}
            isResendDisabled={isResendDisabled}
            setIsResendDisabled={setIsResendDisabled}
            showResendBtn={showResendBtn}
            setShowResendBtn={setShowResendBtn}
          />
        </div>
      </Container>
    </div>
  );
};

export default TransactionsAdmin;
