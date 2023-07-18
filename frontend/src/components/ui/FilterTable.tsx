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

import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import page from "@/app/studies/[studyId]/page"
 
interface FilterTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholderText: string
  searchValue: string
  // sorting: SortingState
  // setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  // columnFilters: ColumnFiltersState
  // setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  rowSelection: any
  setRowSelection: React.Dispatch<React.SetStateAction<any>>
  pageCount?: number
}
 
export function FilterTable<TData, TValue>({
  columns,
  data,
  searchPlaceholderText,
  searchValue,
  // sorting,
  // setSorting,
  // columnFilters,
  // setColumnFilters,
  rowSelection,
  setRowSelection,
  pageCount,
}: FilterTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  //const [rowSelection, setRowSelection] = React.useState({})
  //console.log(rowSelection)
  console.log(pageCount)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
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