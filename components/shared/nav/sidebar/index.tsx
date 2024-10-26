import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  NotepadText,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { Mail, User } from "lucide-react";

const Sidebar = ({ navItems, mobileNavItems }: any) => {
  const path = usePathname();

  return (
    <div className="h-screen">
      <div className="md:flex hidden group transition-all duration-300 ease-in overflow-y-scroll top-16 left-0 fixed h-screen  text-secondary-border flex-col hover:w-[20%] w-14  z-50 bg-black py-3 px-4">
        <div className="flex h-fit flex-col gap-y-4 ">
          <Menu className="w-7 h-7" />

          {navItems.map((item: any, index: number) => (
            <Link
              key={index}
              href={item.link}
              className={`${
                item.link === path
                  ? "group/tag hover:bg-primary-green hover:text-black"
                  : " hover:bg-gray-300/30"
              } cursor-pointer transition hover:backdrop-blur-sm rounded-md duration-300 flex items-center w-40`}
            >
              <item.tag
                className={`${
                  item.link === path
                    ? "text-primary-green group-hover/tag:text-black"
                    : ""
                } pl-1 pr-4 w-10 h-8`}
              />
              <p className="text-sm">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="md:hidden flex bg-black px-4 h-16 fixed bottom-0 w-full z-50">
        <div className="text-xs flex w-full justify-between items-center">
          <div
            className={`nav-item ${
              path === mobileNavItems.dashboard
                ? "text-white border-primary-green border-b-2"
                : "text-secondary-border"
            }`}
          >
            <Link href={mobileNavItems.dashboard}>
              <LayoutDashboard className="m-auto w-6" />
              <h1>Dashboard</h1>
            </Link>
          </div>
          <div
            className={`nav-item ${
              path === mobileNavItems.menus
                ? "text-white border-primary-green border-b-2"
                : "text-secondary-border"
            }`}
          >
            <Link href={mobileNavItems.menus}>
              <UtensilsCrossed className="m-auto w-6" />
              <h1>Menu</h1>
            </Link>
          </div>
          <div
            className={`nav-item ${
              path === mobileNavItems.orders
                ? "text-white border-primary-green border-b-2"
                : "text-secondary-border"
            }`}
          >
            <Link href={mobileNavItems.orders}>
              <NotepadText className="m-auto w-6" />
              <h1>Orders</h1>
            </Link>
          </div>
          <div
            className={`nav-item ${
              path === "#"
                ? "text-white border-primary-green border-b-2"
                : "text-secondary-border"
            }`}
          >
            <Link href={mobileNavItems.profile}>
              <User className="m-auto w-6" />
              <h1>Profile</h1>
            </Link>
          </div>
          <div
            className={`nav-item ${
              path === mobileNavItems.profile
                ? "text-white border-primary-green border-b-2"
                : "text-secondary-border"
            }`}
          >
            <Link href="#">
              <Mail className="m-auto w-6" />
              <h1>Messages</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
