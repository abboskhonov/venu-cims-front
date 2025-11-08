'use client';

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Volume2,
  StickyNote,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const customerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  platform: z.string(),
  username: z.string(),
  phone_number: z.string(),
  status: z.string(),
  assistant_name: z.string().nullable(),
  notes: z.string().nullable(),
  audio_file_id: z.string().nullable(),
  audio_url: z.string().nullable(),
  created_at: z.string(),
  conversation_language: z.string().nullable(),
});

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "need_to_call", label: "Need to Call" },
  { value: "contacted", label: "Contacted" },
  { value: "project_started", label: "Project Started" },
  { value: "continuing", label: "Continuing" },
  { value: "finished", label: "Finished" },
  { value: "rejected", label: "Rejected" },
] as const;

const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "Instagram", label: "Instagram" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Facebook", label: "Facebook" },
  { value: "Telegram", label: "Telegram" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "uz", label: "Uzbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
] as const;

const getStatusLabel = (value?: string): string => {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label || "Unknown";
};

const getStatusColor = (value?: string): string => {
  const colors: Record<string, string> = {
    need_to_call: "bg-red-100 text-red-800",
    contacted: "bg-yellow-100 text-yellow-800",
    project_started: "bg-blue-100 text-blue-800",
    continuing: "bg-purple-100 text-purple-800",
    finished: "bg-green-100 text-green-800",
    rejected: "bg-gray-100 text-gray-800",
  };
  return colors[value || ""] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
};

const getLanguageShort = (code: string) => {
  const map: Record<string, string> = {
    uz: "UZ",
    en: "EN",
    ru: "RU",
  };
  return map[code] || code.toUpperCase();
};

interface FormData {
  full_name: string;
  phone_number: string;
  platform: string;
  status: string;
  assistant_name: string;
  notes: string;
}

interface DialogState {
  mode: "view-note" | "play-audio" | "add" | "edit" | null;
  customerId?: number;
  data?: Partial<FormData>;
}

export function SalesTable() {
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [platformFilter, setPlatformFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("");

  const { 
    data: salesData, 
    isLoading, 
    createCustomer, 
    isCreating, 
    updateCustomer, 
    isUpdating, 
    deleteCustomer 
  } = useSales(searchQuery, statusFilter, platformFilter, dateFilter);
  
  const data = salesData?.customers || [];

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dialog, setDialog] = React.useState<DialogState>({ mode: null });
  const [viewingNote, setViewingNote] = React.useState<string>("");
  const [playingAudioUrl, setPlayingAudioUrl] = React.useState<string>("");
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [audioFileName, setAudioFileName] = React.useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("");

  const handleViewNote = (note: string) => {
    setViewingNote(note);
    setDialog({ mode: "view-note" });
  };

  const handlePlayAudio = (audioUrl: string) => {
    setPlayingAudioUrl(audioUrl);
    setDialog({ mode: "play-audio" });
  };

  const handleAddCustomer = () => {
    setDialog({ mode: "add" });
    setSelectedLanguage("");
    setAudioFile(null);
    setAudioFileName("");
  };

  const handleEditCustomer = (customer: z.infer<typeof customerSchema>) => {
    const lang = customer.conversation_language?.trim() || "";

    setDialog({
      mode: "edit",
      customerId: customer.id,
      data: {
        full_name: customer.full_name,
        phone_number: customer.phone_number,
        platform: customer.platform,
        status: customer.status,
        assistant_name: customer.assistant_name || "",
        notes: customer.notes || "",
      },
    });
    setSelectedLanguage(lang);
    setAudioFile(null);
    setAudioFileName("");
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id, {
        onSuccess: () => {
          toast.success("Customer deleted successfully");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to delete customer");
        },
      });
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setDateFilter("");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || platformFilter !== "all" || dateFilter;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const full_name = (formData.get("full_name") as string)?.trim();
    const phone_number = (formData.get("phone_number") as string)?.trim();
    const platform = (formData.get("platform") as string)?.trim();
    const status = (formData.get("status") as string)?.trim();
    const assistant_name = (formData.get("assistant_name") as string)?.trim() || "";
    const notes = (formData.get("notes") as string)?.trim() || "";

    if (!full_name || !platform || !phone_number || !status) {
      toast.error("Full name, platform, phone number, and status are required.");
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("full_name", full_name);
    submitFormData.append("username", full_name.toLowerCase().replace(/\s+/g, "."));
    submitFormData.append("phone_number", phone_number);
    submitFormData.append("platform", platform);

    if (dialog.mode === "edit") {
      submitFormData.append("customer_status", status);
    } else {
      submitFormData.append("status", status);
    }

    submitFormData.append("assistant_name", assistant_name);
    submitFormData.append("notes", notes);
    submitFormData.append("conversation_language", selectedLanguage || "");

    if (audioFile) {
      submitFormData.append("audio", audioFile, audioFile.name);
    }

    if (dialog.mode === "edit" && dialog.customerId) {
      updateCustomer(
        { id: dialog.customerId, data: submitFormData },
        {
          onSuccess: () => {
            toast.success("Customer updated successfully");
            setDialog({ mode: null });
            setAudioFile(null);
            setAudioFileName("");
            setSelectedLanguage("");
            e.currentTarget.reset();
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update customer");
          },
        }
      );
    } else {
      createCustomer(submitFormData, {
        onSuccess: () => {
          toast.success("Customer created successfully");
          setDialog({ mode: null });
          setAudioFile(null);
          setAudioFileName("");
          setSelectedLanguage("");
          e.currentTarget.reset();
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to create customer");
        },
      });
    }
  };

  const columns: ColumnDef<z.infer<typeof customerSchema>>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.original.full_name}</span>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <a href={`tel:${row.original.phone_number}`} className="text-sm text-blue-600 hover:underline">
          {row.original.phone_number || "-"}
        </a>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.platform}
        </Badge>
      ),
    },
    {
      accessorKey: "conversation_language",
      header: "Language",
      cell: ({ row }) => {
        const lang = row.original.conversation_language;
        return lang ? (
          <Badge variant="outline" className="text-xs font-medium">
            {getLanguageShort(lang)}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`text-xs ${getStatusColor(row.original.status)}`}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.original.created_at)}</span>
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
            <DropdownMenuItem onClick={() => handleEditCustomer(row.original)}>
              <Edit size={14} className="mr-2" />
              Edit
            </DropdownMenuItem>
            {row.original.audio_url && (
              <DropdownMenuItem onClick={() => handlePlayAudio(row.original.audio_url!)}>
                <Volume2 size={14} className="mr-2" />
                Audio
              </DropdownMenuItem>
            )}
            {row.original.notes && (
              <DropdownMenuItem onClick={() => handleViewNote(row.original.notes!)}>
                <StickyNote size={14} className="mr-2" />
                Notes
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteCustomer(row.original.id)}
            >
              <Trash size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

   
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isOpen = dialog.mode !== null;

  return (
    <div className="w-full space-y-4 p-6">
      <Toaster richColors position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-sm text-muted-foreground">
            {data?.length || 0} total customers
          </p>
        </div>
        <Button onClick={handleAddCustomer} className="gap-2">
          <Plus size={16} />
          Add Customer
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Platform Filter */}
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X size={14} />
            Clear Filters
          </Button>
        )}
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                    {hasActiveFilters 
                      ? "No customers found matching your filters."
                      : "No customers yet. Add one to get started."}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex gap-2">
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

      {/* Dialog for Add/Edit/View */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && setDialog({ mode: null })}>
        <DialogContent className="max-w-md">
          {(dialog.mode === "add" || dialog.mode === "edit") && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialog.mode === "edit" ? "Edit Customer" : "Add Customer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-xs font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Enter name"
                    defaultValue={dialog.data?.full_name || ""}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-xs font-medium">
                      Phone *
                    </Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      placeholder="+1234567890"
                      defaultValue={dialog.data?.phone_number || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform" className="text-xs font-medium">
                      Platform *
                    </Label>
                    <Select name="platform" defaultValue={dialog.data?.platform || ""} required>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.filter(opt => opt.value !== "all").map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-medium">
                    Status *
                  </Label>
                  <Select name="status" defaultValue={dialog.data?.status || "need_to_call"}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.filter(opt => opt.value !== "all").map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversation_language" className="text-xs font-medium">
                    Conversation Language
                  </Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistant_name" className="text-xs font-medium">
                    Assistant Name
                  </Label>
                  <Input
                    id="assistant_name"
                    name="assistant_name"
                    placeholder="Optional"
                    defaultValue={dialog.data?.assistant_name || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Optional"
                    defaultValue={dialog.data?.notes || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio_upload" className="text-xs font-medium">
                    Audio File
                  </Label>
                  <Input
                    id="audio_upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                  />
                  {audioFileName && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      ✓ {audioFileName}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDialog({ mode: null })}
                    disabled={isCreating || isUpdating}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isCreating || isUpdating}
                    className="flex-1"
                  >
                    {(isCreating || isUpdating) ? (
                      <>
                        <Loader2 className="animate-spin mr-1 h-3 w-3" />
                        {dialog.mode === "edit" ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      dialog.mode === "edit" ? "Update" : "Add"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {dialog.mode === "view-note" && (
            <>
              <DialogHeader>
                <DialogTitle>Note</DialogTitle>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {viewingNote}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialog({ mode: null })}
                className="w-full"
              >
                Close
              </Button>
            </>
          )}

          {dialog.mode === "play-audio" && (
            <>
              <DialogHeader>
                <DialogTitle>Call Recording</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-6 bg-muted rounded-md">
                <audio
                  src={playingAudioUrl}
                  controls
                  autoPlay
                  className="w-full max-w-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialog({ mode: null })}
                className="w-full"
              >
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}