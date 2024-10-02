import {
  Rocket,
  Users,
  ChartColumn,
  TableProperties,
  Bug,
  PlugZap,
  ScanEye,
  ShieldCheck,
  Layers,
  Unplug,
} from "lucide-react";

interface LinkItem {
  icon?: React.ComponentType<any>;
  title: string;
  path: string;
  activePaths: string[];
  children?: LinkItem[] | undefined;
}

export const linkList: { title: string; links: LinkItem[] }[] = [
  {
    title: "",
    links: [
      {
        icon: Rocket,
        title: "Start here",
        path: "/user",
        activePaths: ["/user"],
      },
      {
        icon: Users,
        title: "Teams",
        path: "/user/teams",
        activePaths: ["/user/teams"],
      },
    ],
  },
  {
    title: "Ledger",
    links: [
      {
        icon: ChartColumn,
        title: "Insights",
        path: "/user/insights",
        activePaths: ["/user/insights"],
      },
      {
        icon: TableProperties,
        title: "Data tables",
        path: "",
        activePaths: [
          "/user/insights",
          "/user/tables/ledgers",
          "/user/tables/ledger-balances",
          "/user/tables/balance-monitors",
        ],
        children: [
          {
            title: "Ledgers",
            path: "/user/tables/ledgers",
            activePaths: ["/user/tables/ledgers"],
          },
          {
            title: "Ledger balances",
            path: "/user/tables/ledger-balances",
            activePaths: ["/user/tables/ledger-balances"],
          },
          {
            title: "Transactions",
            path: "/user/tables/transactions",
            activePaths: ["/user/tables/transactions"],
          },
          {
            title: "Balance monitors",
            path: "/user/tables/balance-monitors",
            activePaths: ["/user/tables/balance-monitors"],
          },
        ],
      },
      {
        icon: Bug,
        title: "Anomalies",
        path: "/user/anomalies",
        activePaths: ["/user/anomalies"],
      },
      {
        icon: PlugZap,
        title: "Reconciliation",
        path: "/user/reconciliation",
        activePaths: ["/user/reconciliation"],
      },
    ],
  },
  {
    title: "Identity",
    links: [
      {
        icon: ScanEye,
        title: "Vision",
        path: "/user/vision",
        activePaths: ["/user/vision"],
      },
      {
        icon: ShieldCheck,
        title: "Vault",
        path: "/user/vault",
        activePaths: ["/user/vault"],
      },
    ],
  },
  {
    title: "Developers",
    links: [
      {
        icon: Layers,
        title: "Instances",
        path: "/user/instances",
        activePaths: ["/user/instances"],
      },
      {
        icon: Unplug,
        title: "Plugins",
        path: "/user/plugins",
        activePaths: ["/user/plugins"],
      },
    ],
  },
];
