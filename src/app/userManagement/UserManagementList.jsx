import BASE_URL from "@/config/BaseUrl";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  FilePlus,
  FilePenLine,
  Delete,
  Trash2,
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
import { useNavigate } from "react-router-dom";
import Page from "../dashboard/page";
import EditManagement from "./EditManagement";
import { ContextPanel } from "@/lib/ContextPanel";




const GroupedTable = ({ data, title, columns, onRowClick }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
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
        pageSize: 5,
      },
    },
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={table.getState().globalFilter || ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick(row.original.id)}
                  className="cursor-pointer hover:bg-gray-100"
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} total rows
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
  );
};




const UserManagementList = () => {
  const queryClient = useQueryClient();
 const {fetchPermissions} = useContext(ContextPanel)
  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
 const [selectedId, setSelectedId] = useState(null);
   const [isViewExpanded, setIsViewExpanded] = useState(false);
  const navigate = useNavigate();


  const {
    data: registrations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-usercontrol`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.usercontrol;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/panel-delete-usercontrol/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations"]);
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });
  const handleDelete = (e, id) => {
    e.preventDefault();
    // https://agsrebuild.store/public/api/panel-delete-busopp/${id}
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
      fetchPermissions()
    }
  };
  const userTypeMapping = {
    1: "testuser",
    2: "admin",
    3: "superadmin",
    4: "sigaadmin",
  };
 
  // Define columns for the table
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "button",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Button Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("button")}</div>,
    },
    
   
    // {
    //   accessorKey: "usertype",
    //   header: "Users",
    //   cell: ({ row }) => {
    //     const userTypeValues = row.getValue("usertype")?.split(","); // Split the comma-separated string
    //     const userTypeLabels = userTypeValues
    //       .map((value) => userTypeMapping[value.trim()] || "Unknown") // Map each value to its label
    //       .join(", "); // Join the labels back into a string
    //     return <div>{userTypeLabels}</div>;
    //   },
    // },
    {
      accessorKey: "usertype",
      header: "Users",
      cell: ({ row }) => {
        const userTypeValue = row.getValue("usertype");
    
        // Check if the value exists and is a non-empty string before attempting to split
        if (userTypeValue && typeof userTypeValue == "string") {
          const userTypeValues = userTypeValue.split(","); // Split the comma-separated string
          const userTypeLabels = userTypeValues
            .map((value) => userTypeMapping[value.trim()] || "Unknown") // Map each value to its label
            .join(", "); // Join the labels back into a string
          return <div>{userTypeLabels}</div>;
        }
    
        // Return a fallback if the value is invalid
        return <div>Unknown</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Sattus",
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const registration = row.original.id;

        return (
          <div className="flex flex-row">
     
     
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(e, registration);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
          
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: registrations || [],
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
  const handleRowClick = (id) => {
    setSelectedId(id);
    setIsViewExpanded(true);
  };
  // Render loading state
  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Management List
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
              Error Management News
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
  const groupedData = registrations.reduce((acc, item) => {
    if (!acc[item.pages]) {
      acc[item.pages] = [];
    }
    acc[item.pages].push(item);
    return acc;
  }, {});
  return (
    <Page>
          <div className="flex pr-4 pl-4  items-center justify-between">
        <div className="flex text-left text-xl text-gray-800 font-[400]">
          User Management List
        </div>
        <div onClick={() => navigate(`/create-user-management`)}>
            <Button variant="default" className="ml-2">
              Create Roles
            </Button>
          </div>
          </div>
        <div className=" flex w-full p-4 gap-2 relative ">
          
      <div className={`
            ${isViewExpanded ? "w-[70%]" : "w-full"} 
            transition-all duration-300 ease-in-out 
            pr-4 overflow-auto h-[calc(40rem-3rem)] 
          `}>
        
   {/* <div className="flex justify-between items-center mb-6 ">
            <div className="flex text-left text-xl text-gray-800 font-[400]">
              User Management List
            </div>
            <Button
              variant="default"
              onClick={() => navigate("/create-user-management")}
            >
              Create Roles
            </Button>
          </div> */}
          {Object.entries(groupedData).map(([pageTitle, pageData]) => (
            <GroupedTable
              key={pageTitle}
              data={pageData}
              title={`${pageTitle} Management`}
              columns={columns}
              onRowClick={handleRowClick}
            />
          ))}
        
        {/* searching and column filter  */}
        {/* <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={table.getState().globalFilter || ""}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
            }}
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
        
        </div> */}
        {/* table  */}
        {/* <div className="rounded-md border">
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
                    onClick={() => handleRowClick(row.original.id)}
                    className="cursor-pointer hover:bg-gray-100"
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
        </div> */}
        {/* row slection and pagintaion button  */}
        {/* <div className="flex items-center justify-end space-x-2 py-4">
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
        </div> */}
      </div>

      {isViewExpanded && (
          <div
            className={`
              w-[30%] 
              p-4 
              border-l 
              transition-all 
              duration-300 
              ease-in-out 
              absolute 
              right-0 
             
            
              ${
                isViewExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }
            `}
          >
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsViewExpanded(false);
                  setSelectedId(null);
                }}
              >
                ✕
              </Button>
            </div>
            <EditManagement refetch={refetch} setIsViewExpanded={setIsViewExpanded} id={selectedId} />
          </div>
        )}
      </div>
    </Page>
  );
};

export default UserManagementList;
