import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainNavbar, Modal } from "@/components/shared";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Menus, TablesType } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import { handleRowClick } from "@/utils/modal";
import Sidebar from "@/components/shared/nav/sidebar/admin";
import orderImg2 from "public/auth-email.png";
import AdminMenuTable from "@/components/shared/admin/table/menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LayoutGrid, List } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { useAuthToken } from "@/hooks";
import { handleAxiosError } from "@/utils/axios";
import { ItemService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import TablesTable from "@/components/shared/admin/table/tables";

let tabKey: string = "";

const tabHeaders = {
  all: "all",
  available: "Available",
  occupied: "Occupied",
};
const defaultInvoice: TablesType = {
  _id: "",
  tableNumber: "",
  status: "",
  image: "",
};

const defaultValues = {
  businessId: null,
  tableId: null,
  status: null,
};
const tableHeaders = ["S/N", "Table", "Table Number", "Status"];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

// TODO: compress files and images using sharp

const formSchema = z
  .object({
    status: z.enum(["available", "occupied"]).optional(), //add field for other
    businessId: z.string().min(1, "required").optional(),
    tableId: z.string().min(1, "required").optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined && value !== ""),
    { message: "At least one field must be filled" }
  );

const Tables: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Ensures validation checks on each change
  });
  const { token, userData } = useAuthToken();

  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<TablesType>(defaultInvoice);
  const [currentPage, setCurrentPage] = useState(1);

  const updateItemRequest: any = async () => {
    try {
      form.setValue("businessId", userData?.businessId || "");

      const response = await ItemService.updateItem(
        selectedInvoice._id,
        form.getValues()
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: updateItemRequest,
    onSuccess: (res: any) => {
      form.reset();
    },
  });

  const onSubmit = () => mutation.mutate();

  return (
    <div className="flex justify-end h-screen w-full">
      <Container>
        <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
          <div className="w-full bg-primaryDark pt-4 rounded-md">
            <div className="w-full h-full">
              <div className="px-3 flex pb-4 border-b border-primary-border">
                <div className="flex w-full items-center gap-x-8">
                  <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                    Tables
                  </h1>
                </div>
                <div>
                  <Button
                    onClick={() => setView(!view)}
                    className="transparent-btn text-secondaryBorder"
                  >
                    {view ? (
                      <>
                        <LayoutGrid className="w-5" />
                        <p className="capitalize text-sm">Grid view</p>
                      </>
                    ) : (
                      <>
                        <List className="w-5" />
                        <p className="capitalize text-sm">List view</p>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <TablesTable
                view={view}
                currentPage={currentPage}
                tableHeaders={tableHeaders}
                tabHeaders={tabHeaders}
                tabKey={tabKey}
                setIsOpen={setIsOpen}
                setSelectedInvoice={setSelectedInvoice}
                selectedInvoice={selectedInvoice}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Tables;
