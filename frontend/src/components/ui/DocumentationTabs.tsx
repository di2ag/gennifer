'use client'

import { TabsContent, TabsTrigger, Tabs, TabsList } from '@/ui/Tabs';
import { FC } from 'react';
import Code from '@/ui/Code';
import { python, curl } from '@/helpers/documentation-code';
import SimpleBar from 'simplebar-react';


const DocumentationTabs: FC = ({  }) => {
  return (
  <Tabs defaultValue='python' className='max-w-2xl w-full'>
    <TabsList>
        <TabsTrigger value='python'>Python</TabsTrigger>
        <TabsTrigger value='curl'>Curl</TabsTrigger>
    </TabsList>
    <TabsContent value='python'>
        <SimpleBar>
            <Code animated language='python' code={python} show/>
        </SimpleBar>
    </TabsContent>
    <TabsContent value='curl'>
        <SimpleBar>
            <Code animated language='bash' code={curl} show/>
        </SimpleBar>
    </TabsContent>
  </Tabs>
  )
}

export default DocumentationTabs;