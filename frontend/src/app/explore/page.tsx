import CytoscapeDashboard from "@/components/CytoscapeDashboard";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';


export const metadata: Metadata = {
    title: 'GenNIFER | Analysis',
    description: 'Analysis Portal for GenNIFER.'
}

const generateNewAnalysisId = () => {
  const analysisId =  uuidv4();
  return analysisId;
}

function getGenniferUrl() {
  const url = process.env.GENNIFER_BASE_URL
  if (!url || url.length === 0) {
      throw new Error("Missing GenNIFER URL.");
  }
  return url;
}

const page = async () => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()
  // const analysisId = generateNewAnalysisId();
  //   //console.log(user)
  //   // Get the analysis session or create a new one
  //   const analysisSession = await fetch(getGenniferUrl() + 'analyses/' + analysisId, { 
  //     next: { 
  //       revalidate: 1000,
  //     },
  //     headers: {
  //     Authorization: 'Bearer ' + user.user.access_token, 
  //   }})
  //   .then((resp) => resp.json());
  return (
    <div className="w-full mx-0 mt-0">
        <CytoscapeDashboard />
    </div>
  )
}

export default page;

// import CytoscapeWindow from "@/components/cytoscape/window";

// const page = async () => {
//     // Fetch genes from API
//     const genes = await fetch('http://localhost/gennifer/api/genes', { next: { revalidate: 10 }})
//     .then((resp) => resp.json());
    
//     // Fetch datasets from API
//     const datasets = await fetch('http://localhost/gennifer/api/datasets', { next: { revalidate: 10 }})
//     .then((resp) => resp.json());

//     // Fetch Studies from API
//     const studies = await fetch('http://localhost/gennifer/api/inference_studies', { next: { revalidate: 10 }})
//     .then((resp) => resp.json());

//     // Fetch Algorithms from API
//     const algorithms = await fetch('http://localhost/gennifer/api/algorithms', { next: { revalidate: 10 }}, )
//     .then((resp) => resp.json());

//     return (
//             <main className="layout">
//                 <CytoscapeWindow genes={genes} datasets={datasets} studies={studies} algorithms={algorithms}  />
//             </main>
//     )
    
// }

// export default page