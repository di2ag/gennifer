import CytoscapeDashboard from "@/components/CytoscapeDashboard";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
    title: 'GenNIFER | Analysis',
    description: 'Analysis Portal for GenNIFER.'
}

const page = async () => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()
  return (
    <div className="w-full mx-0 mt-0">
        <CytoscapeDashboard />
    </div>
  )
}

export default page;