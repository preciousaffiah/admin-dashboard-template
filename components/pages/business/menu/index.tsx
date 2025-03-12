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
  image: "",
  name: "",
  price: 0,
  discount: 0,
  description: "",
  department: "",
};

const BusinessMenu = ({
  businessId,
  BusinessName,
}: {
  businessId: string;
  BusinessName: string;
}) => {
  const { token, userData } = useAuthToken();

  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus[]>([]);
  const [carted, setCarted] = useState(false);

  // GET ITEMS
  const fetchItems = async () => {
    try {
      // setPage(pageParam);

      const response = await ItemService.getItems(
        businessId,
        page, // page
        tabKey ? tabKey : null // filters object
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
    <div>
      <Tabs
        defaultValue={Object.keys(tabHeaders || {})[0]}
        className="w-full h-full"
      >
        <div className="bg-transparent backdrop-blur-sm fixed h-fit w-full flex m-auto justify-between py-3 px-3 overflow-x-scroll md:gapx-0 gap-x-2">
          <TabsList className="w-fit bg-secondaryDark">
            {Object.entries(tabHeaders || {}).map(
              ([key, value], index): any => (
                <TabsTrigger
                  key={index}
                  value={key}
                  onClick={(event) => handleTabChange(key)}
                  className="active-sub-tab text-xs md:px-6 py-1 rounded-lg capitalize"
                >
                  {value as string}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <div>
            <SearchBar
              placeholder="Search for food, drinks and more"
              className="md:flex hidden md:rounded-xl rounded-full md:px-3 px-1"
            />
          </div>
          <div>
            <CartModal
              selectedInvoice={selectedInvoice}
              setSelectedInvoice={setSelectedInvoice}
            />
          </div>
        </div>
        <div>
          <div
            className={`
            flex py-4 justify-between px-2 pt-16`}
          >
            {itemsData &&
              !isItemsLoading &&
              //   !isRefetching &&
              itemsData.currentItemCount > 0 &&
              Object.keys(tabHeaders || {}).map((item: any, index: number) => (
                <TabsContent key={index} value={item} className="w-full">
                  <div className="md:h-[20rem] h-[10rem] bg-black m-auto rounded-md">
                    <p className="md:text-5xl text-4xl text-center m-auto flex items-center justify-center h-full uppercase font-edu">
                      {BusinessName} menu
                    </p>
                  </div>
                  <div className="min-h-[70vh] py-4">
                    <ItemBox
                      invoiceData={itemsData}
                      setSelectedInvoice={setSelectedInvoice}
                      selectedInvoice={selectedInvoice}
                      setCarted={setCarted}
                      carted={carted}
                    />
                  </div>
                  <DataPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refetch={refetch}
                    total_items={itemsData.total}
                    total_pages={itemsData.totalPages}
                    items_per_page={itemsData.perPage}
                    current_item_count={itemsData.currentItemCount} // Total number of items matching the filter
                  />
                </TabsContent>
              ))}

            {itemsData?.currentItemCount < 1 &&
              !isRefetching &&
              !isItemsLoading && (
                <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                  <FolderOpen />
                  Empty
                </div>
              )}

            {isItemsLoading && (
              // ||
              // isRefetching
              <div className="text-txWhite h-[18rem] m-auto flex flex-col justify-center items-center font-medium text-lg font-edu">
                <Loader className="rotate-icon size-8" />
                Loading
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessMenu;
