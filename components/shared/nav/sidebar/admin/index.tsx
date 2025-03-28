import {
  LayoutDashboard,
  NotepadText,
  UtensilsCrossed,
  ChartSpline,
  MessageSquarePlus,
  Bolt,
  ShieldQuestion,
  HandCoins,
} from "lucide-react";
import { Dinner } from "@/components/serviette-icons";
import React from "react";
import { Mail, User, Users } from "lucide-react";
import Sidebar from "..";

const AdminSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      link: "/staff/dashboard",
      tag: LayoutDashboard,
    },
    {
      title: "Menu",
      link: "/staff/menu",
      tag: UtensilsCrossed,
    },
    {
      title: "Tables",
      link: "/staff/tables",
      tag: Dinner,
    },
    {
      title: "Orders",
      link: "/staff/orders",
      tag: NotepadText,
    },
    {
      title: "User Management",
      link: "/admin/users",
      tag: Users,
    },
    {
      title: "Payouts",
      link: "/admin/payouts",
      tag: HandCoins,
    },
    {
      title: "Settings",
      link: "/admin/settings",
      tag: Bolt,
    },
    // {
    //   title: "Help Center",
    //   link: "/",
    //   tag: ShieldQuestion,
    // },
  ];

  const mobileNavItems = [
    {
      title: "Dashboard",
      link: "/staff/dashboard",
      tag: LayoutDashboard,
    },
    {
      title: "Menu",
      link: "/staff/menu",
      tag: UtensilsCrossed,
    },
    {
      title: "Orders",
      link: "/staff/orders",
      tag: NotepadText,
    },
    {
      title: "User Management",
      link: "/admin/users",
      tag: Users,
    },
    {
      title: "Settings",
      link: "/admin/settings",
      tag: Bolt,
    },
  ];

  return (
    <>
      <Sidebar navItems={navItems} mobileNavItems={mobileNavItems} />
    </>
  );
};

export default AdminSidebar;
