import {
  LayoutDashboard,
  NotepadText,
  UtensilsCrossed,
  ChartSpline,
  MessageSquarePlus,
  Bolt,
  ShieldQuestion,
  HandCoins,
  BriefcaseBusiness,
  Building2,
} from "lucide-react";
import { Dinner } from "@/components/serviette-icons";
import React from "react";
import { Mail, User, Users } from "lucide-react";
import Sidebar from "..";

const AdminSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      link: "/dashboard",
      tag: LayoutDashboard,
    },
    {
      title: "Businesses",
      link: "/businesses",
      tag: BriefcaseBusiness,
    },
    {
      title: "Users",
      link: "/users",
      tag: Users,
    },
    {
      title: "Payout Requests",
      link: "/request/payouts",
      tag: HandCoins,
    },
    {
      title: "Business Requests",
      link: "/request/business",
      tag: Building2,
    },
  ];

  const mobileNavItems = [
    {
      title: "Dashboard",
      link: "/dashboard",
      tag: LayoutDashboard,
    },
    {
      title: "Businesses",
      link: "/businesses",
      tag: BriefcaseBusiness,
    },
    {
      title: "Users",
      link: "/users",
      tag: Users,
    },
    {
      title: "Payout Requests",
      link: "/request/payouts",
      tag: HandCoins,
    },
    {
      title: "Business Requests",
      link: "/request/business",
      tag: Building2,
    },
  ];

  return (
    <>
      <Sidebar navItems={navItems} mobileNavItems={mobileNavItems} />
    </>
  );
};

export default AdminSidebar;
