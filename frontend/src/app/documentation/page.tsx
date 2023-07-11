import DocumentationTabs from '@/components/ui/DocumentationTabs';
import LargeHeading from '@/components/ui/LargeHeading';
import Paragraph from '@/components/ui/Paragraph';
import { Metadata } from 'next';
import { FC } from 'react';

import 'simplebar/dist/simplebar.min.css'

export const metadata: Metadata = {
    title: 'GenNIFER | Documentation',
    description: 'Documentation for GenNIFER of the project.'
}

const page: FC = () => {
  return <div className='container max-w-7xl mx-auto mt-12'>
    <div className='flex flex-col items-center gap-6'>
        <LargeHeading>Querying the API</LargeHeading>
        <Paragraph>/query</Paragraph>
        <DocumentationTabs />
    </div>
  </div>
}

export default page;