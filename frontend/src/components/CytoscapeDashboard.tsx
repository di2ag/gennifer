import { cookies } from 'next/headers'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { datasetFilterColumns, geneFilterColumns, algorithmFilterColumns, studyFilterColumns } from '@/app/explore/columns';
import { BiDna } from "react-icons/bi";
import { FiDatabase } from "react-icons/fi";
import {BsCodeSquare} from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";
import { SideNavButtonItemProps } from '@/const';
import CytoscapeClient from '@/components/CytoscapeClient';
import { getGenniferUrl } from '@/lib/utils';
import { AuthWrapper } from '@/lib/authClientWrapper';


const CytoscapeDashboard = async () => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()

    // Fetch genes from API
    const genes = await fetch(getGenniferUrl() + 'genes/', { 
      next: { 
        //revalidate: 1000,
        tags: ['genes'],
      },
      headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
    }})
    .then((resp) => resp.json());
    
    // Fetch datasets from API
    const datasets = await fetch(getGenniferUrl() + 'datasets/', { 
      next: { 
        //revalidate: 1000,
        tags: ['datasets'],
      },
      headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
    }})
    .then((resp) => resp.json());
  
    // Fetch Studies from API
    const studies = await fetch(getGenniferUrl() + 'studies/', { 
      next: { 
        //revalidate: 1000,
        tags: ['studies'],
      },
      headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
    }})
    .then((resp) => resp.json());

    // Fetch Algorithms from API
    const algorithms = await fetch(getGenniferUrl() + 'algorithms/', { 
      next: { 
        //revalidate: 1000,
        tags: ['algorithms'],
      },
      headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
    }})
    .then((resp) => resp.json());

    const items: SideNavButtonItemProps[] = [
      {
          text: 'Genes',
          icon: <BiDna className="w-6 h-6" />,
          data: genes,
          columns: geneFilterColumns,
          searchValue: "name",
      },
      {
          text: 'Datasets',
          icon: <FiDatabase className="w-6 h-6" />,
          data: datasets,
          columns: datasetFilterColumns,
          searchValue: "title",
      },
      {
          text: 'Algorithms',
          icon: <BsCodeSquare className="w-6 h-6" />,
          data: algorithms,
          columns: algorithmFilterColumns,
          searchValue: "name",
      },
      {
          text: 'Studies',
          icon: <HiTemplate className="w-6 h-6" />,
          data: studies,
          columns: studyFilterColumns,
          searchValue: "name",
      },
  ];

  return (
    <AuthWrapper>
      <div className="grid">
        <CytoscapeClient
        items={items}
        />
      </div>
    </AuthWrapper>
  )
}

export default CytoscapeDashboard;
