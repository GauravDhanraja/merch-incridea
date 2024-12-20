import { ColumnDef } from "@tanstack/react-table";

export type Merch = {
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  available: boolean;
  stock: number;
};

export const columns: ColumnDef<Merch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "originalPrice",
    header: "Original Price",
  },
  {
    accessorKey: "discountPrice",
    header: "Discount Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "image",
    header: "Sales",
  },
];
