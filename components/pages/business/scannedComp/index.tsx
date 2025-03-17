import React, { useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { ItemService } from "@/services";
import { useAuthToken, useSocket } from "@/hooks";
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
  tabelNumber,
}: {
  businessId: string;
  BusinessName: string;
  tabelNumber: string;
}) => {
  useSocket();

  const { nudgeWaiter } = useSocket();
  const [nudged, setNudged] = useState(false);

  const handleNudged = () => {
    nudgeWaiter(businessId, Number(tabelNumber));
    setNudged(true);
    setTimeout(() => setNudged(false), 4000); // Reset after 4 seconds
  };

  return (
    <div className=" min-h-screen font-edu text-primary m-auto w-full h-full flex gap-y-3 justify-center flex-col items-center py-16">
      <div className="w-[8rem] h-[8rem] border-2 flex items-center rounded-full bg-black">
        <p className="text-background text-center m-auto uppercase font-medium text-2xl">
          {BusinessName}
        </p>
      </div>
      <p className="text-2xl">Welcome table {tabelNumber}!</p>

      <div className="text-xl flex gap-y-3 flex-col md:w-[27rem] w-[75%] text-center capitalize">
        <Link
          href={`/${BusinessName}/menu?number=${tabelNumber}`}
          className="w-full rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          menu
        </Link>
        <div
          onClick={handleNudged}
          className="w-full cursor-pointer rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          {nudged ? "Nudged 👍🏽" : " Nudge waiter 👋🏽"}
        </div>
        <Link
          href={`/${BusinessName}/menu`}
          className="w-full rounded-2xl py-4 border-[1px] border-neutral-500"
        >
          checkout
        </Link>
      </div>
    </div>
  );
};

export default ScannedComp;
