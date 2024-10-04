import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types";
import { Circle, EllipsisVertical } from "lucide-react";
const tableHeader = [
  "S/N",
  "OrderID",
  "Customer",
  "Table No.",
  "Menu Items",
  "Price",
  "Time of Order",
  "Assigned to",
  "Status",
  "Actions",
];

const DefaultTable = ({ children }: any) => {
  return (
    <Table className="table-auto border-separate border-spacing-0 text-white">
      <TableHeader>
        <TableRow className="px-3 bg-primary-dark">
          <TableHead className="orders-table-head">
            <Circle />
          </TableHead>
          {tableHeader.map((header, index) => (
            <TableHead key={index} className="orders-table-head">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {children}
    </Table>
  );
};

export default DefaultTable;
