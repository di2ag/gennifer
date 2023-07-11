'use client'

import { FC, useEffect, useRef, useState } from 'react';
import SideNav from '@/components/SideNav';
import { CytoscapeRequestProps, CytoscapeResponseProps, SideNavButtonItemProps } from "@/const";
import LargeHeading from './ui/LargeHeading';
import Paragraph from './ui/Paragraph';
import { getGenniferUrl } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import CytoscapeGraph from '@/components/CytoscapeGraph';


interface CytoscapeClientProps {
    items: SideNavButtonItemProps[];
}

const CytoscapeClient: FC<CytoscapeClientProps> = ({
    items
}) => {
    const { data: session, status, update } = useSession();
    const [cytoRequest, setCytoRequest] = useState<CytoscapeRequestProps>({
        gene_ids: [],
        task_ids: [],
        algorithm_ids: [],
        dataset_ids: [],
        cached_results: [],
    });
    const [ cytoResponse, setCytoResponse ] = useState<CytoscapeResponseProps>({
        elements: [],
        result_ids: [],
    })
    const cytoScreenRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        // Fetch results from graph endpoint
        console.log(cytoRequest)
        const fetchResults = async () => {
        try {
            update()
            const response = await fetch(getGenniferUrl() + 'graph/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.user.access_token,
                },
                body: JSON.stringify(cytoRequest),
            })
            const data = await response.json()
            setCytoResponse((prevResponse) => {
                try {
                const mergedResults = new Set(prevResponse.result_ids)
                data.result_ids.forEach((id:number) => mergedResults.add(id))
                return ({
                ...prevResponse,
                elements: [...prevResponse.elements, ...data.elements],
                result_ids: Array.from(mergedResults),
                })
            } catch (error) {
                console.error('Error:', error)
                return prevResponse
            }})
        } catch (error) {
            console.error('Error:', error)
        }
    }
    fetchResults()
    }, [cytoRequest])

    useEffect(() => {
        if (cytoScreenRef.current) {
          const { clientHeight, clientWidth } = cytoScreenRef.current;
          setWidth(clientWidth);
          setHeight(clientHeight);
          console.log('Height:', clientHeight);
          console.log('Width:', clientWidth);
        }
      }, [cytoScreenRef.current]);

  return (
    <div className='flex'>
        <div className='min-h-screen'>
            <SideNav 
                items={items}
                setCytoscapeRequest={setCytoRequest}
                cachedResults={cytoResponse.result_ids}
                />
        </div>
        <div className='min-h-screen ml-40 w-full flex items-center justify-center'>
            { cytoResponse.elements.length == 0 ?
                <div className='flex flex-col gap-6 items-center justify-center'>
                    <LargeHeading>Select Filters to Begin</LargeHeading>
                    <div className='text-center mt-4 -mb-4 space-y-1'>
                    <Paragraph>To start seeing results population, you should select at least two genes plus a study or an algorithm and a dataset.</Paragraph>
                    </div>
                </div>
                :
                <div ref={cytoScreenRef} className='min-h-screen flex-grow'> 
                <CytoscapeGraph 
                    elements={cytoResponse.elements}
                    result_ids={cytoResponse.result_ids}
                    windowHeight={height}
                    windowWidth={width}/>
                </div>
            }
        </div>
    </div>
    )
}

export default CytoscapeClient;