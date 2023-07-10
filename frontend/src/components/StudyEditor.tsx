import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import LargeHeading from "./ui/LargeHeading";
import Paragraph from "./ui/Paragraph";
import { DataTable } from "@/ui/DataTable";
import { taskColumns } from "@/app/studies/columns";
import { Separator } from "@/components/ui/separator"
import { AlgorithmProps, DatasetProps, StudyProps, TaskProps } from "@/const";
import { getGenniferUrl } from "@/lib/utils";

interface StudyEditorProps {
    study: StudyProps;
    algorithms: AlgorithmProps[];
    datasets: DatasetProps[];
}

const StudyEditor = async ({ study, algorithms, datasets }: StudyEditorProps ) => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()
  console.log(study);
  console.log(study.tasks);

  return (
    <div className='container flex flex-col gap-6'>
      <LargeHeading>{study.name}</LargeHeading>
      <div className='text-center md:text-left mt-4 -mb-4 space-y-1'>
        <Paragraph className="text-center md:text-left">{study.description}</Paragraph>
      </div>
      <DataTable
      columns={taskColumns} 
      data={study.tasks} 
      doButtonText="Add Task" 
      searchPlaceholderText="Filter tasks..."
      searchValue="name"
      studyId={study.pk}
      algorithms={algorithms}
      datasets={datasets}/>
    </div>
  )
}

export default StudyEditor;