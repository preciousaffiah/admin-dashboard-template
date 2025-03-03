import Image from "next/image";
import logo from "public/Logo.png";
import { Bell, ChevronDown, SearchIcon } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/serviette-ui";
import { LogOut, Mail, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";

import avatar from "public/avatar.png"
import { useAuthToken } from "@/hooks";
import { deleteStore } from "@/utils/local-storage";
import useBusinessDetails from "@/hooks/useBusinessDetails";
import Link from "next/link";

const MainNavbar = ({ title, subtitle }: any) => {
  const navItems = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "About",
      link: "/",
    },
    {
      title: "Partners",
      link: "/",
    },
    {
      title: "Documentation",
      link: "/",
    },
  ];
  const { userData, logout } = useAuthToken();
  const { data } = useBusinessDetails({ id: userData?.businessId || "" });
  const router = useRouter();

  return (
    <div className="fixed top-0 z-[100] flex w-full bg-background justify-between py-3 text-txWhite items-center px-4">
      <>
        <div className="flex w-fit h-full pb-1 items-center">
          <Link href="#">
            <p className="text-xl text-secondaryBorder font-medium uppercase">
              {data?.name || ""}
            </p>

            {/* <Image alt="logo" src={logo} className="w-32 h-8" /> */}
          </Link>
        </div>
        <div className="md:flex hidden w-fit h-full justify-start items-center xl:gap-x-64 lg:gap-x-40 md:gap-x-1">
          <div>
            <h1 className="text-xl text-secondaryBorder font-medium">
              {subtitle} {title}
            </h1>
          </div>
          {/* <SearchBar
            placeholder="Search for menus, orders, food and more"
            className="lg:w-80 py-1"
          /> */}
        </div>
        <div className="flex  w-fit h-full gap-x-4 items-center">
          {/* <div className=" bg-[#333232] h-fit bg-opacity-80 flex justify-center py-1 px-2 rounded-full w-fit">
              <Bell fill="white" className="w-[1.1rem]" />
            </div>
            <div className="md:w-fit h-fit bg-primary-orange flex justify-center px-3 p-1 rounded-md">
              <p>Invite</p>
            </div> */}
          <div className="w-full flex justify-center p-1rounded-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="items-center text-xs leading-4 h-fit w-fit flex bg-foreground px-1 py-1 rounded-full gap-x-1">
                  <div>
                    <img
                      src={`${userData?.image ? userData.image : avatar}`}
                      className="rounded-full size-10 object-cover"
                    />
                  </div>

                  <span className="max-w-32 truncate">
                    Hello,
                    <br />
                    {userData?.fullname}
                  </span>
                  <LogOut
                    onClick={logout}
                    color="#c01c28"
                    className="size-6 m-auto text-secondaryBorder"
                  />
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </div>
      </>
      <>
        {/* <div className="md:hidden flex w-fit h-full justify-start items-center gap-x-2">
          <div className="bg-foreground h-fit bg-opacity-80 flex justify-center py-1 px-2 rounded-full w-fit">
            <SearchIcon className="w-[1.1rem]" />
          </div>
          <div className="bg-foreground h-fit bg-opacity-80 flex justify-center py-1 px-2 rounded-full w-fit">
            <Bell fill="white" className="w-[1.1rem]" />
          </div>
        </div> */}
      </>
    </div>
  );
};

export default MainNavbar;
