import React, { useMemo, useState } from 'react'
import Page from '../dashboard/page'
import { useMutation, useQuery ,useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Loader2,
  Delete,
  Trash2,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BASE_URL from '@/config/BaseUrl';
import { useNavigate } from 'react-router-dom';


const BusinessOppList = () => {
  const queryClient = useQueryClient();
  const usertype = Number(localStorage.getItem("userType")); 

  const isRestrictedUserDelete = [1, 2, 4].includes(usertype);
  const {
    data: business,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-busopp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.busopp;
    },
  });

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/panel-delete-busopp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["business"]); // Refresh the list after deletion
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });
  const handleDelete = (e,id)=>{
    e.preventDefault()
    // https://agsrebuild.store/public/api/panel-delete-busopp/${id}
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  }

  const handleCompanyStatusLabel = (status) => {
    switch (status) {
      case '0':
        return "Pending";
      case '1':
        return "Cleared";
      case '2':
        return "Expired";
      default:
        return "Unknown";
    }
  };

  // Define columns for the table
  const columns = [
   
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
    },
    {
      accessorKey: "brand_name",
      header: "Brand",
      cell: ({ row }) => <div>{row.getValue("brand_name")}</div>,
    },
    {
      accessorKey: "mobile_no",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("mobile_no")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "product_type",
      header: "Product Type",
      cell: ({ row }) => <div>{row.getValue("product_type")}</div>,
    },
    {
      accessorKey: "investment_amount",
      header: "Investment Amount",
      cell: ({ row }) => <div>{row.getValue("investment_amount")}</div>,
    },
    {
      accessorKey: "buss_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("buss_status");
        const label = handleCompanyStatusLabel(status)
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              status == "0"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {label }
          </span>
        );
      },
    },
    {
      id: "actions",

      header: "Action",
      cell: ({ row }) => {
        const registration = row.original.id;

        return (
          <div className='flex flex-row'>
          <Button
            variant="ghost"
            size="icon"
            onClick={()=>navigate(`/business-opp-edit/${registration}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={()=>navigate(`/business-opp-view/${registration}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {!isRestrictedUserDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e)=>handleDelete(e,registration)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
             )}
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: business || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  // Render loading state
  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Business Opp.
          </Button>
        </div>
      </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Business Opp.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
   <Page>
        <div className="w-full p-4">
        <div className="flex text-left text-xl text-gray-800 font-[400]" >Business Expansion List</div>
        {/* searching and column filter  */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Full names..."
            value={table.getColumn("full_name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("full_name")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* table  */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* row slection and pagintaion button  */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
   </Page>
  )
}

export default BusinessOppList