import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/serviette-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataPagination from "@/components/serviette-ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { handleAxiosError } from "@/utils/axios";
import { ItemService } from "@/services";
import { useAuthToken, useBusinessDetails } from "@/hooks";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Circle, FolderOpen, Loader, ShoppingCart } from "lucide-react";
import ItemBox from "../itemBox";
import { Menus } from "@/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteItemModal from "@/components/shared/modal/delete-item";
import CartModal from "@/components/shared/modal/cart";
import logo from "public/Logo.png";
import Image from "next/image";
import OrderService from "@/services/order";
const staticTabHeaders = {
  all: "all",
};

const defaultInvoice: Menus = {
  category: "",
  available: false,
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
  tableId,
  table,
}: {
  businessId: string;
  BusinessName: string;
  tableId: string;
  table: boolean;
}) => {
  const { token, userData } = useAuthToken();
  const { data, isLoading } = useBusinessDetails({
    id: userData?.businessId || undefined,
  });

  const categoryTabs =
    data?.menuCategories?.reduce((acc: any, category: any) => {
      acc[category] = category;
      return acc;
    }, {} as Record<string, string>) || {};

  const tabHeaders = { ...staticTabHeaders, ...categoryTabs };

  const [tabKey, setTabKey] = useState<string>("");
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Menus[]>([]);
  const [carted, setCarted] = useState(false);
  console.log("tabkey", tabKey);

  // GET ITEMS
  const fetchItems = async () => {
    try {
      // setPage(pageParam);

      const response = await ItemService.getItems(
        businessId,
        page, // page
        { category: tabKey } // filters object
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

  useEffect(() => {
    console.log("Updated dateKey:", tabKey);
    refetch();
  }, [tabKey]);
  console.log("itemsData", itemsData);

  // GET ORDER
  const fetchLastOrder = async () => {
    try {
      const response = await OrderService.getTableOrder(businessId, tableId);

      return response?.data?.data?.data;
    } catch (error: any) {
      console.error(error?.response?.data?.message || "An error occurred");
      handleAxiosError(error, "");
    }
  };

  const { isLoading: isTableOrderLoading, data: tableOrderData } = useQuery<
    any,
    Error
  >({
    queryKey: ["get-table-order", tableId],
    queryFn: fetchLastOrder,
    gcTime: 1000 * 60 * 15, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: true,
  });

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
                  onClick={() => setTabKey(key)}
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
          {table && (
            <div>
              <CartModal
                selectedInvoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                tableId={tableId}
                businessId={businessId}
                tableOrderData={tableOrderData}
              />
            </div>
          )}
        </div>
        <div>
          <div
            className={`
            flex flex-col py-4 justify-between px-2 pt-16`}
          >
            <div className="w-full md:h-[20rem] h-[10rem] bg-black m-auto rounded-md">
              <p className="md:text-5xl text-4xl text-center m-auto flex items-center justify-center h-full uppercase font-edu">
                {BusinessName} menu
              </p>
            </div>
            {itemsData &&
              !isItemsLoading &&
              //   !isRefetching &&
              itemsData.currentItemCount > 0 &&
              Object.keys(tabHeaders || {}).map((item: any, index: number) => (
                <TabsContent key={index} value={item} className="w-full">
                  <div className="min-h-[70vh] py-4">
                    <ItemBox
                      invoiceData={itemsData}
                      setSelectedInvoice={setSelectedInvoice}
                      selectedInvoice={selectedInvoice}
                      setCarted={setCarted}
                      carted={carted}
                      tableOrderData={tableOrderData?.[0]}
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
