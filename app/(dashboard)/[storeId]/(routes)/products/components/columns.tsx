"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { PuffLoader } from "react-spinners";

export type ProductColumn = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  stockCount: string;
  size: string | null;
  color: string | null;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isArchived",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.isArchived === true ? (
          <>
            <div className="flex flex-col justify-center items-center space-y-2 text-sm">
              <PuffLoader color='#671e21' size={25}>
                <div className="h-4 w-4 rounded-full border bg-red-500" />
              </PuffLoader>

              <p className="text-sm">Inactive</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center space-y-2 text-sm">
              <PuffLoader color="#50e3c2" size={25}>
                <div className="h-4 w-4 rounded-full border bg-[#50e3c2]" />
              </PuffLoader>

              <p className="text-sm">Active</p>
            </div>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stockCount",
    header: "Stock Count",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.size ? <>{row.original.size}</> : "No sizes defined"}
      </div>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color ? (
          <>
            {row.original.color}
            <div
              className="h-6 w-6 rounded-full border"
              style={{ backgroundColor: row?.original?.color }}
            />
          </>
        ) : (
          "No colors defined"
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
