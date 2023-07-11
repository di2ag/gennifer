"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
 
import Button from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { getGenniferUrl } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { method } from "lodash"
import { revalidate } from "@/actions/revalidate"


export type Dataset = {
    pk: string;
    title: string;
    description: string;
    zenodo_id: string;
    doi: string;
}

export type Study = {
    pk: number;
    name: string;
    dataset: string;
    algorithm_instance: string;
    status: string;
}

export const datasetColumns: ColumnDef<Dataset>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "zenodo_id",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Zenodo ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "doi",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DOI
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
    const dataset = row.original

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(dataset.pk)}
            >
            Copy Dataset ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete dataset</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    )
    },
    },
]

export const studyColumns: ColumnDef<Study>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
      accessorKey: "dataset",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Dataset Zenodo ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
      accessorKey: "algorithm_instance",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Algorithm Instance
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      },
    {
      id: "actions",
      cell: ({ row }) => {
        const { data: session, status, update } = useSession();
        update();

        const handleDeleteStudy = async (studyId: number) => {
          await fetch(getGenniferUrl() + 'studies/' + studyId, {
              headers: {
                  "Authorization": "Bearer " + session?.user.access_token,
              },
              method: "DELETE",
            });
          
          revalidate('studies');
          console.log("Deleted Bitch");
        }
      const study = row.original
  
      return (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(study.pk.toString())}
              >
              Copy Study ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteStudy(study.pk)}>Delete study</DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
      )
      },
      },
  ]