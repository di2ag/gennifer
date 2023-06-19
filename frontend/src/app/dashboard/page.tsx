import ApiDashboard from "@/components/ApiDashboard";

import type { Metadata } from "next";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
    title: 'GenNIFER | Dashboard',
    description: 'Dashboard for GenNIFER of the project.'
}



const page = async () => {
  return (
    <div className='max-w-7xl mx-auto mt-16'>
        <ApiDashboard />
    </div>
  )
}

export default page;