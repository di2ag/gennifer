"use client"
 
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { DatasetForm } from "../AddDatasetForm"
import { StudyForm } from "../AddStudyForm"
import { Dataset } from "@/app/dashboard/columns"
import { AlgorithmProps, DatasetProps } from "@/const"
import { TaskForm } from "../AddTaskForm"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import RunStudyButton from "../RunStudyButton"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  doButtonText: string
  searchPlaceholderText: string
  searchValue: string
  studyId?: number
  algorithms?: AlgorithmProps[]
  datasets?: DatasetProps[]
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
  doButtonText,
  searchPlaceholderText,
  searchValue,
  studyId,
  algorithms,
  datasets,
}: DataTableProps<TData, TValue>) {
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
 
  return (
    <div>
        <div className="flex items-center py-4">
        <Input
          placeholder={searchPlaceholderText}
          value={(table.getColumn(searchValue)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchValue)?.setFilterValue(event.target.value)
          }
          className="max-w-prose"
        />
        </div>
        <div className="rounded-md border dark:border-slate-400">
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
                    )
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <div className="flex items-center justify-between">
        {
          doButtonText === 'Add Dataset' && 
          <div className="flex items-center justify-start space-x-2 py-4">
            {DatasetForm()}
          </div>
        }
        {
        doButtonText === 'Create Study' && 
          <div className="flex items-center justify-start space-x-2 py-4">
            {StudyForm()}
          </div>
        }
        {
        doButtonText === 'Add Task' && 
          <div className="flex items-center justify-start space-x-2 py-4">
            {
            TaskForm({studyId: studyId!, algorithms: algorithms!, datasets: datasets!})
            }
            <RunStudyButton studyId={studyId!}/>
          </div>
        }          
        <div className="flex items-center justify-end space-x-2 py-4">
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
  )
}