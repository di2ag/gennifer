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
import { formatDate, getGenniferUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
    description: string;
    tasks: number[];
    status: string;
    timestamp: string;
}

function PerformRedirect(url: string) {
  const router = useRouter()
  router.push(url)
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
    cell: ({ row }) => {
      const dataset = row.original
      return (
        <span>{dataset.description.length > 200 ? dataset.description.substring(0, 200) + '...' : dataset.description}</span>
      )
    }
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
    
    const handleDeleteDataset = async (datasetId: string) => {
    //   await PerformDelete(datasetId, getGenniferUrl() + 'datasets/', 'datasets');
    }
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
            <DropdownMenuItem onClick={() => handleDeleteDataset(dataset.pk)}>Delete dataset</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open("https://zenodo.org/record/" + dataset.zenodo_id)}>View on Zonodo</DropdownMenuItem>
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
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "tasks",
      header: "# Tasks",
      cell: ({ row }) => {
        const study = row.original
        return (
          <span>{study.tasks.length}</span>
        )
      }
    },
    {
        accessorKey: "task_status",
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
        accessorKey: "timestamp",
        header: "Created on",
        cell: ({ row }) => {
          const study = row.original
          return (
            <span>{formatDate(study.timestamp)}</span>
          )
        }
        
    },
    {
      id: "actions",
      cell: ({ row }) => {

        function Cell ({ study }: { study: Study }) {
          const { data: session } = useSession()
          const router = useRouter()
          
          const handleDeleteStudy = async (studyId: number) => {
            await fetch(getGenniferUrl() + 'studies/' + studyId, {
              headers: {
                  "Authorization": "Bearer " + session?.user.access_token,
              },
              method: "DELETE",
            });
    
            revalidate('studies');
          }

          const handleDownloadStudy = async (studyId: number) => {
            await fetch(getGenniferUrl() + 'download_study/' + studyId, {
                headers: {
                    "Authorization": "Bearer " + session?.user.access_token,
                },
                method: "GET",
              })
              .then((response) => response.blob())
              .then((blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href=url;
                link.setAttribute('download', `study-${studyId}.json`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link)
              }));
          }

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
                <DropdownMenuItem onClick={() => router.push('/studies/' + study.pk)}>Edit study</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadStudy(study.pk)}>Download study</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteStudy(study.pk)}>Delete study</DropdownMenuItem>

            </DropdownMenuContent>
            </DropdownMenu>
            )
        }

      const study = row.original
  
      return (
          <Cell study={study}/>
        )
      },
    }
  ]