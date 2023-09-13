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
        study_ids: [],
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
        console.log(cytoRequest)
        // Fetch results from graph endpoint
        const fetchResults = async () => {
        try {
            //update()
            console.log('Fetching results...')
            const response = await fetch(getGenniferUrl() + 'graph/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.user.access_token,
                },
                body: JSON.stringify(cytoRequest),
            }).then((resp) => resp.json());
            // const data = await response.json()
            setCytoResponse((prevResponse) => {
                try {
                const mergedResults = new Set(prevResponse.result_ids)
                response.result_ids.forEach((id:number) => mergedResults.add(id))
                return ({
                ...prevResponse,
                elements: [...prevResponse.elements, ...response.elements],
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
    }, [cytoRequest, session?.user.access_token])

    useEffect(() => {
        if (cytoScreenRef.current) {
          const { clientHeight, clientWidth } = cytoScreenRef.current;
          setWidth(clientWidth);
          setHeight(clientHeight);
        //   console.log('Height:', clientHeight);
        //   console.log('Width:', clientWidth);
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
            <div className='relative min-h-screen flex-grow'>
            <div ref={cytoScreenRef} className='absolute inset-0'> 
                <CytoscapeGraph 
                    elements={cytoResponse.elements}
                    result_ids={cytoResponse.result_ids}
                    windowHeight={height}
                    windowWidth={width}
                    active={cytoResponse.elements.length > 0}
                    cytoRequest={cytoRequest}/>
            </div>
            <div className={`absolute inset-0 flex flex-col gap-6 items-center justify-center ${cytoResponse.elements.length > 0 ? 'hidden' : ''}`}>
                <LargeHeading>Select Filters to Begin</LargeHeading>
                <div className='text-center mt-4 -mb-4 space-y-1'>
                <Paragraph>To start seeing results populate, select at least two genes <span className="italic">plus</span> a study <span className="font-semibold">or</span> an algorithm and a dataset.</Paragraph>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}

export default CytoscapeClient;