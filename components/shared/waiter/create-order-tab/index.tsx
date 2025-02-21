"use client";

import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ComboboxDemo from "../combobox";

const OrderDropDown = ({
  itemsArray,
  handleSubmit2,
  onSubmit2,
  register2,
  setValue,
  selectValue,
  errors2,
  isFormValid,
  setSelectedTab,
  selectedTab,
}: any) => {
  return (
    <form onSubmit={handleSubmit2(onSubmit2)} className="w-full">
      <Tabs defaultValue="toGo" className="w-full">
        <TabsList className="bg-primaryDark grid w-full grid-cols-3">
          <TabsTrigger
            value="toGo"
            onClick={() => setSelectedTab("toGo")}
            className="active-sub-tab text-xs md:px-6 py-1 rounded-lg"
          >
            To Go
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            onClick={() => setSelectedTab("delivery")}
            className="active-sub-tab text-xs md:px-6 py-1 rounded-lg"
          >
            Delivery
          </TabsTrigger>
          <TabsTrigger
            value="dineIn"
            onClick={() => setSelectedTab("dineIn")}
            className="active-sub-tab text-xs md:px-6 py-1 rounded-lg"
          >
            Dine In
          </TabsTrigger>
        </TabsList>
        <TabsContent value="toGo">
          {selectedTab === "toGo" && (
            <div className="flex items-center gap-x-3">
              <span className="flex gap-x-2">
                Default Value:{" "}
                <h1 className="font-medium text-neutral-300"> To Go</h1>
              </span>
            </div>
          )}
        </TabsContent>
        <TabsContent value="delivery" className="flex flex-col gap-y-4">
          <div>
            <Label htmlFor="location" className="text-txWhite font-normal">
              Delivery To
            </Label>
            <div className="flex items-end">
              <Input
                type="text"
                id="location"
                placeholder="Enter a location"
                {...register2("location", {
                  required: false,
                })}
                className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none peer focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
              />
              <MapPin className="w-5 h-5 peer-focus:text-primary-orange" />
            </div>
            {errors2.location && (
              <p className="text-textCancelled text-sm">
                Location is required
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="location" className="text-txWhite font-normal">
              Order Time
            </Label>
            <div className="flex items-end">
              <Input
                type="time"
                id="time"
                placeholder="Enter time of order"
                {...register2("orderTime", {
                  required: false,
                })}
                className="md:w-1/2 w-full border-y-0 border-x-0 rounded-none peer focus:border-b-primary-orange transition-colors duration-300 border-b border-primary-border focus-visible:ring-offset-0 focus-visible:ring-0 px-0 bg-transparent"
              />
              <Clock className="w-5 h-5 peer-focus:text-primary-orange" />
            </div>
            {errors2.orderTime && (
              <p className="text-textCancelled text-sm">Time is required</p>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <Button className="transparent-btn">Estimate Delivery Time</Button>
            <p className="font-medium text-txWhite">10:00 AM</p>
          </div>
        </TabsContent>
        <TabsContent value="dineIn">
          {selectedTab === "dineIn" && (
            <div className="flex items-center gap-x-3">
              <h1>Table Number</h1>
              <ComboboxDemo
                itemsArray={itemsArray}
                selectValue={selectValue}
                setValue={setValue}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="md:w-1/2 w-full flex gap-x-4 justify-end text-primaryGreen font-medium">
        <button type="submit">Save</button>
      </div>
      {!isFormValid && (
        <p className="text-textCancelled text-sm">
          Please fill in the required fields for the selected tab
        </p>
      )}
    </form>
  );
};
export default OrderDropDown;
