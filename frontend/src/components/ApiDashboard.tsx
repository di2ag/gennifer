import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import LargeHeading from "./ui/LargeHeading";
import Paragraph from "./ui/Paragraph";
// import DatasetsTable from "@/components/ui/tables/DatasetsTable";
import StudiesTable from "./ui/tables/StudiesTable";
import { DataTable } from "@/ui/DataTable";
import { datasetColumns, studyColumns } from "@/app/dashboard/columns";
import { Separator } from "@/components/ui/separator"



interface ApiDashboardProps {
  
}

function getGenniferUrl() {
  const url = process.env.GENNIFER_BASE_URL
  if (!url || url.length === 0) {
      throw new Error("Missing GenNIFER URL.");
  }
  return url;
}

const ApiDashboard = async () => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()
  
  // Fetch datasets from API
  const datasets = await fetch(getGenniferUrl() + 'datasets/', { 
    next: { 
      revalidate: 1000,
      tags: ['datasets'],
     },
    headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
  }})
  .then((resp) => resp.json());

  // Fetch Studies from API
  const studies = await fetch(getGenniferUrl() + 'studies/', { 
    next: { 
      revalidate: 1000,
      tags: ['studies'],
     },
    headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
  }})
  .then((resp) => resp.json());

  return (
    <div className='container flex flex-col gap-6'>
      <LargeHeading>Welcome, {user.user.username}</LargeHeading>
      <div className='text-center md:text-left mt-4 -mb-4 space-y-1'>
        <Paragraph className="text-center md:text-left">This is your dashboard where you can organize all your studies, datasets, and experiments. For analysis, please click on the analysis tab above.</Paragraph>
      </div>
      <Separator className="border-slate-100"/>
      <div>
      <Paragraph className="text-center md:text-left mt-4 -mb-4 font-semibold">Your Datasets:</Paragraph>
      <DataTable
      columns={datasetColumns} 
      data={datasets} 
      doButtonText="Add Dataset" 
      searchPlaceholderText="Filter datasets..."
      searchValue="title"/>
      </div>
      <div>
      <Paragraph className="text-center md:text-left mt-4 -mb-4 font-semibold">Your Studies:</Paragraph>
      <DataTable 
        columns={studyColumns}
        data={studies} 
        doButtonText="Create Study" 
        searchPlaceholderText="Filter studies..."
        searchValue="name"/>
      </div>
    </div>
  )
}

export default ApiDashboard;