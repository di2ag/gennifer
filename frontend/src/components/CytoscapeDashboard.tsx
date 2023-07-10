import { cookies } from 'next/headers'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import SideNav from '@/components/SideNav';
import { datasetFilterColumns, geneFilterColumns, algorithmFilterColumns, studyFilterColumns } from '@/app/analyze/columns';
import { BiDna } from "react-icons/bi";
import { FiDatabase } from "react-icons/fi";
import {BsCodeSquare} from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";
import { SideNavButtonItemProps } from '@/const';
import LargeHeading from './ui/LargeHeading';
import Paragraph from './ui/Paragraph';
import CytoscapeClient from '@/components/CytoscapeClient';

interface CytoscapeDashboardProps {
  analysisId: string;
}

function getGenniferUrl() {
    const url = process.env.GENNIFER_BASE_URL
    if (!url || url.length === 0) {
        throw new Error("Missing GenNIFER URL.");
    }
    return url;
  }

const CytoscapeDashboard = async ({ analysisId }: CytoscapeDashboardProps) => {
  const user = await getServerSession(authOptions)
  if (!user) return notFound()

    // Fetch genes from API
    const genes = await fetch(getGenniferUrl() + 'genes/', { 
      next: { 
        revalidate: 1000,
        tags: ['genes'],
      },
      headers: {
      Authorization: 'Bearer ' + user.user.access_token, 
    }})
    .then((resp) => resp.json());
    
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

    // Fetch Algorithms from API
    const algorithms = await fetch(getGenniferUrl() + 'algorithms/', { 
      next: { 
        revalidate: 1000,
        tags: ['studies'],
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
  
  console.log(analysisId);

  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] justify-center gap-4 overflow-hidden">
        <CytoscapeClient
        items={items}
        />
        {/* <aside className='container flex h-[calc(100vh_-_2rem)] w-20'>
        <SideNav
        items={items} />
        </aside>
        <div className="">
          <p className="text-2xl text-gray-400 dark:text-gray-500">This is some text</p>
        </div> */}
      </div>
  )
}

export default CytoscapeDashboard;