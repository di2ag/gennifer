// import CytoscapeDashboard from "@/components/CytoscapeDashboard";
// import { authOptions } from "@/lib/auth";
// import type { Metadata } from "next";
// import { getServerSession } from "next-auth";


// export const metadata: Metadata = {
//     title: 'GenNIFER | Analysis',
//     description: 'Analysis Portal for GenNIFER.'
// }

// interface pageProps {
//   params: {
//     analysisId: string;
//   }
// }


// const page = async ({ params }: pageProps) => {
//     const user = await getServerSession(authOptions)
//     //console.log(user)
//     // Get the analysis session or create a new one
//     const analysisSession = await fetch(getGenniferUrl() + 'analyses/' + params.analysisId, {
//         headers: { Authorization: `Bearer ${user?.user.access}` },
//     } )
//     .then((resp) => resp.json());

//     // if (analysisSession?.detail === "Not found.") {
//     //     // Create a new analysis session
//     //     const analysisSession = await fetch(getGenniferUrl() + 'analyses/', {
//     //         method: 'POST',
//     //         headers: { Authorization: `Bearer ${user?.user.access}` },
//     //         body: JSON.stringify({
//     //             "id": params.analysisId,
//     //             "name": "Analysis " + params.analysisId,
//     //             "user": user?.user.id,
//     //         })
//     //     } )
//     //     .then((resp) => resp.json());
//     //     console.log(analysisSession)
//     // }

//   return (
//     <div className="max-w-7xl mx-0 mt-0">
//         <CytoscapeDashboard 
//         analysisId={params.analysisId}/>
//     </div>
//   )
// }

// export default page;