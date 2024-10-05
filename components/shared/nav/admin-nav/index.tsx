import Image from "next/image";
import Link from "next/link";
import logo from "public/Logo.png";
import { Play, Search, Bell, ChevronDown } from "lucide-react";
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
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import orderImg from "public/orderimg.png";

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
      <div className="w-[25%] h-full flex gap-x-4 items-center">
        <div className=" bg-[#333232] h-fit bg-opacity-80 flex justify-center py-1 px-2 rounded-full w-fit">
          <Bell fill="white" className="w-[1.1rem]" />
        </div>
        <div className="w-full flex justify-center p-1rounded-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer bg-[#424141d6]">
              <div className="text-sm h-fit w-fit flex bg-gray-500 px-2 py-1 rounded-full">
                <div className="pr-2">
                  <Image alt="img" src={orderImg} className="rounded-full w-9" />
                </div>
                Hello,
                <br/>
                Victoria
                <ChevronDown className="w-8 m-auto text-secondary-border" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard className="mr-2 h-4 w-4" />
                  <span>Keyboard shortcuts</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-fit h-fit bg-primary-orange flex justify-center px-3 p-1 rounded-md">
          <p>Invite</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
