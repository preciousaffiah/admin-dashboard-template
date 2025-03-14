import React, { useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { ItemService } from "@/services";
import { useAuthToken } from "@/hooks";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Circle, FolderOpen, Loader, ShoppingCart } from "lucide-react";
import ItemBox from "../itemBox";
import { Menus } from "@/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteItemModal from "@/components/shared/modal/delete-item";
import CartModal from "@/components/shared/modal/cart";
import logo from "public/Logo.png";
import Image from "next/image";
import Link from "next/link";

let tabKey: any = null;

const tabHeaders = {
  all: "all",
  wines: "wines",
  pasta: "pasta",
  pizza: "pizza",
  intercontinental: "intercontinental",
};

const defaultInvoice: Menus = {
  category: "",
  _id: "",
  available: false,
  image: "",
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};

const ScannedComp = ({
  businessId,
  BusinessName,
  tabelNumber
}: {
  businessId: string;
  BusinessName: string;
  tabelNumber: string
}) => {
  const { token, userData } = useAuthToken();

  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus>(defaultInvoice);

  // GET ITEMS
  const fetchItems = async () => {
    try {
      // setPage(pageParam);

      const response = await ItemService.getItems(
        businessId,
        page, // page
        tabKey // filters object
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
    queryKey: ["get-items", userData?.businessId || ""],
    queryFn: fetchItems,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

  const handleTabChange: any = (key: any) => {
    if (key === "all") {
      tabKey = null;
    } else {
      tabKey = { category: key };
    }
    refetch();
  };

  return (
    <div className=" min-h-screen font-edu text-primary m-auto w-full h-full flex gap-y-3 justify-center flex-col items-center py-16">
      <div className="w-[8rem] h-[8rem] border-2 flex items-center rounded-full  bg-black">
        <p className="text-background text-center m-auto uppercase font-medium text-2xl">
          {BusinessName}
        </p>
      </div>
      <p className="text-2xl">Welcome table {tabelNumber}!</p>

      <div className="text-xl flex gap-y-3 flex-col md:w-[27rem] w-[75%] text-center capitalize">
        <Link href={`/${BusinessName}/menu?number=${tabelNumber}`} className="w-full rounded-2xl py-4 border-[1px] border-neutral-500">
          menu
        </Link>
        <div className="w-full rounded-2xl py-4 border-[1px] border-neutral-500">
          nudge waiter 👋🏽
        </div>
        <Link href={`/${BusinessName}/menu`} className="w-full rounded-2xl py-4 border-[1px] border-neutral-500">
          checkout
        </Link>
      </div>
    </div>
  );
};

export default ScannedComp;
