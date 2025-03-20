import React, { useState } from "react";
import {
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";
import { CartOrderItem, Menus } from "@/types";

const defaultInvoice: Menus = {
  _id: "",
  price: 0,
  available: false,
  category: "",
  image: "",
  name: "",
  description: "",
  discount: 0,
  department: "",
};

const ItemBox = ({
  invoiceData,
  setSelectedInvoice,
  selectedInvoice,
  setCarted,
  table,
  carted,
  tableOrderData,
}: any) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const addToCart = (invoice: Menus) => {
    setActiveId(invoice._id);
    setCarted(true);

    const itemToOrder: CartOrderItem = {
      itemId: invoice._id,
      name: invoice.name,
      quantity: 1,
      discount: invoice.discount,
      image: invoice.image,
      price: invoice.price - invoice.discount,
      total: (invoice.price - invoice.discount) * 1,
    };

    setSelectedInvoice((prevOrder: CartOrderItem) => {
      if (!Array.isArray(prevOrder)) {
        return [itemToOrder];
      }

      const existingItem = prevOrder.find(
        (item: CartOrderItem) => item.itemId === itemToOrder.itemId
      );

      if (existingItem) {
        // Increase quantity if item exists
        return prevOrder.map((item: CartOrderItem) =>
          item.itemId === itemToOrder.itemId
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: item.price * (item.quantity + 1),
              }
            : item
        );
      } else {
        // Add new item
        return [...prevOrder, itemToOrder];
      }
    });
    setTimeout(() => setCarted(false), 2000); // Reset after 2 seconds
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {invoiceData?.items.map((invoice: Menus, index: number) => (
          <div
            className={`${
              activeId === invoice._id
                ? "border border-primaryGreen bg-selectedRow"
                : "bg-primaryDark"
            } md:w-[20rem] w-full cursor-pointer text-sm text-primary rounded-md border-2 pb-3`}
          >
            <div className="flex w-full h-[10rem] border-b border-primary-border">
              <div className="w-full">
                <img
                  src={invoice.image}
                  className="w-full h-full rounded-t-md object-cover"
                />
              </div>
            </div>
            <div className=" px-4 pt-2 w-full">
              <div className="flex justify-between gap-x-16 w-full">
                <p className="capitalize text-lg w-[50%] font-medium text-ellipsis break-words">
                  {invoice.name}
                </p>
                <div className="w-[50%] justify-end gap-x-1 flex text-end font-medium text-lg">
                  {invoice.discount > 0 ? (
                    <>
                      <p className="line-through">₦{Number(invoice.price).toLocaleString()}</p>

                      <p>₦{(invoice.price - invoice.discount).toLocaleString()}</p>
                    </>
                  ) : (
                    <p>₦{Number(invoice.price).toLocaleString()}</p>
                  )}
                </div>
              </div>
              {!tableOrderData && invoice.available && table ? (
                <>
                  {activeId === invoice._id && carted ? (
                    <BadgeCheck className="fill-background text-primaryLime transition-all" />
                  ) : (
                    <p
                      onClick={() => addToCart(invoice)}
                      className="flex text-xs bg-primaryGreen w-fit px-1.5 rounded-sm py-1 transition-all cursor-pointer"
                    >
                      Add to cart
                      <ShoppingCart className="size-4" />
                    </p>
                  )}
                </>
              ) : (
                !invoice.available && (
                  <p className="flex text-xs font-medium w-fit px-1.5 border-2 border-cancel text-cancel rounded-sm py-1 transition-all">
                    Out of Stock
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemBox;
