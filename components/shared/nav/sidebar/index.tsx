import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  NotepadText,
  UtensilsCrossed,
  Users,
  Bolt,
} from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { Mail, User } from "lucide-react";

const Sidebar = ({ navItems, mobileNavItems }: any) => {
  const path = usePathname();

  return (
    <div className="h-screen">
      <div className=" bg-background md:flex hidden group transition-all duration-300 ease-in overflow-y-scroll top-16 left-0 fixed h-screen  text-secondaryBorder flex-col hover:w-[14rem] w-14  z-50 py-3 px-4">
        <div className="flex h-fit flex-col gap-y-8">
          <Menu className="w-8 h-8" />

          {navItems.map((item: any, index: number) => (
            <Link
              key={index}
              href={item.link}
              className={`${
                item.link === path
                  ? "group/tag hover:bg-primaryGreen hover:text-black"
                  : " hover:bg-gray-300/30"
              } cursor-pointer transition hover:backdrop-blur-sm rounded-md duration-300 flex gap-x-4 items-center w-48`}
            >
              <item.tag
                className={`${
                  item.link === path
                    ? "text-black bg-primaryGreen rounded-md group-hover/tag:text-black"
                    : ""
                }  w-[2.3rem] px-1.5 h-10 `}
              />
              <p className="text-sm">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="md:hidden flex bg-background px-4 h-[4rem] fixed bottom-0 w-full z-50">
        <div className="flex w-full justify-between items-center">
          {mobileNavItems.map((item: any, index: number) => (
            <div
              className={`nav-item ${
                item.link === path
                  ? "text-black bg-primaryGreen rounded-md p-2"
                  : "text-secondaryBorder"
              }`}
            >
              <Link key={index} href={item.link}>
                <item.tag className="m-auto size-[1.75rem]" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
