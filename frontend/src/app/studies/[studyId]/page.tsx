
import StudyEditor from "@/components/StudyEditor";
import { authOptions } from "@/lib/auth";
import { AuthWrapper } from "@/lib/authClientWrapper";
import { getGenniferUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";


export const metadata: Metadata = {
    title: 'GenNIFER | Analysis',
    description: 'Edit Your GenNIFER Study.'
}

interface pageProps {
  params: {
    studyId: number;
  }
}

const page = async ({ params }: pageProps) => {
    const user = await getServerSession(authOptions)
    const study = await fetch(getGenniferUrl() + 'studies/' + params.studyId, {
        headers: { Authorization: `Bearer ${user?.user.access_token}` },
        next: { 
          revalidate: 1000,
          tags: ['study'+ params.studyId],
         },
    })
    .then((resp) => resp.json());
    const algorithms = await fetch(getGenniferUrl() + 'algorithms/', {
      headers: { Authorization: `Bearer ${user?.user.access_token}` },
  })
  .then((resp) => resp.json());

  const datasets = await fetch(getGenniferUrl() + 'datasets/', {
    headers: { Authorization: `Bearer ${user?.user.access_token}` },
  })
  .then((resp) => resp.json());

  const tasks = await Promise.all(study.tasks.map( async (task: number) => {
    const taskData = await fetch(getGenniferUrl() + 'tasks/' + task, {
      headers: { Authorization: `Bearer ${user?.user.access_token}` },
      })
      .then((resp) => resp.json())
      return taskData
    }));
  study.tasks = tasks

  return (
     <div className='max-w-7xl mx-auto mt-16'>
        <StudyEditor
          study={study}
          algorithms={algorithms}
          datasets={datasets} />
    </div>
  )
}

export default page;