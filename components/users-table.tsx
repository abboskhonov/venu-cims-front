"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  updateUser,
  createUser,
  type UpdateUserPayload,
} from "@/lib/api/admin";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  is_active: z.boolean(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  surname: z.string().min(1),
  password: z.string().min(6),
  role: z.string().default("user"),
  is_active: z.boolean(),
});

export function UsersTable({
  data: initialData,
}: {
  data: z.infer<typeof userSchema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterValue, setFilterValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<z.infer<typeof userSchema> | null>(null);
  const [isAddMode, setIsAddMode] = React.useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, user }: { userId: number; user: UpdateUserPayload }) => 
      updateUser(user, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      toast.success("User updated successfully");
      setIsOpen(false);
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    },
  });

  const createMutation = useMutation({
    mutationFn: (user: z.infer<typeof createUserSchema>) => 
      createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      toast.success("User created successfully");
      setIsOpen(false);
      setIsAddMode(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    },
  });

  const filteredData = React.useMemo(() => {
    return data.filter((user) =>
      user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [data, filterValue]);

  const columns: ColumnDef<z.infer<typeof userSchema>>[] = [
    {
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-sm">
          {row.original.name} {row.original.surname}
        </span>
      ),
    },
    
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a 
          href={`mailto:${row.getValue("email")}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.is_active ? "default" : "secondary"}
          className="text-xs"
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => {
              setEditingUser(row.original);
              setIsAddMode(false);
              setIsOpen(true);
            }}>
              <Edit size={14} className="mr-2" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                if (confirm(`Delete ${row.original.name}? This action cannot be undone.`)) {
                  deleteMutation.mutate(row.original.id);
                }
              }}
            >
              <Trash size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const surname = formData.get("surname") as string;
    const password = formData.get("password") as string;

    if (!name?.trim() || !email?.trim() || !surname?.trim()){
      toast.error("All fields are required");
      return;
    }

    if (isAddMode && !password?.trim()) {
      toast.error("Password is required");
      return;
    }

    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (isAddMode) {
      createMutation.mutate({
        name: name.trim(),
        email: email.trim(),
        surname: surname.trim(),
        password: password.trim(),
        role: "user",
        is_active: true,
      });
    } else if (editingUser) {
      const updatePayload: UpdateUserPayload = {
        name: name.trim(),
        email: email.trim(),
        surname: surname.trim(),
        is_active: editingUser.is_active,
      };

      if (password?.trim()) {
        updatePayload.password = password.trim();
      }

      updateMutation.mutate({
        userId: editingUser.id,
        user: updatePayload,
      });
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddMode(true);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingUser(null);
    setIsAddMode(false);
  };

  const isLoading = updateMutation.isPending || createMutation.isPending;

  return (
    <div className="w-full space-y-4 p-6">
      <Toaster richColors position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-sm text-muted-foreground">
            {data?.length || 0} total users
          </p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus size={16} />
          Add User
        </Button>
      </div>

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 px-4 text-xs font-semibold">
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
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
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
                  className="text-center py-8"
                >
                  <p className="text-sm text-muted-foreground">
                    No users found.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>



      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isAddMode ? "Add User" : "Edit User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                defaultValue={editingUser?.name || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="text-xs font-medium">
                Surname {isAddMode && "*"}
              </Label>
              <Input
                id="surname"
                name="surname"
                placeholder="Enter surname"
                defaultValue={editingUser?.surname || ""}   // <-- ADD THIS
                required={isAddMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                defaultValue={editingUser?.email || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium">
                Password {!isAddMode && "(optional to change)"}
                {isAddMode && "*"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isAddMode ? "At least 6 characters" : "Leave empty to keep current password"}
                required={isAddMode}
                minLength={6}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-1 h-3 w-3" />
                    {isAddMode ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  isAddMode ? "Create" : "Save"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}