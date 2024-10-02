import Image from "next/image";
import Link from "next/link";
import logo from "public/Logo.png";
import { Play, Search, Bell } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { FC } from "react";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { SearchBar } from "@/components/serviette-ui";

const AdminNavbar: FC = () => {
  const navItems = [
    {
      title: "Home",
      link: "/auth/sign-up",
    },
    {
      title: "About",
      link: "/auth/sign-in",
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
  const path = usePathname();

  return (
    <div className="md:flex hidden w-full bg-black py-3 text-[#FEFEFE] items-center px-4">
      <div className="w-[20%] h-full">
        <Image alt="logo" src={logo} className="w-32 h-8" />
      </div>
      <div className="w-[55%] h-full flex pl-5">
        <SearchBar placeholder="Search for menus, orders, food and more" />
      </div>
      <div className="w-[25%] h-full flex gap-x-4">
        <div className=" bg-[#333232] bg-opacity-80 flex justify-center py-1 px-2 rounded-full w-fit">
          <Bell fill="white" className="w-[1.1rem]" />
        </div>
        <div className="w-full bg-primary-orange flex justify-center p-1rounded-md">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="w-fit bg-primary-orange flex justify-center px-3 p-1 rounded-md">
          <p>Invite</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
