'use client'

import { FC, useState } from 'react';
import SideNav from '@/components/SideNav';
import { SideNavButtonItemProps } from "@/const";


interface CytoscapeClientProps {
    items: SideNavButtonItemProps[];
}

const CytoscapeClient: FC<CytoscapeClientProps> = ({
    items
}) => {
    const [selectGenes, setSelectGenes] = useState<any>([]);
    const [selectDatasets, setSelectDatasets] = useState<any>([]);
    const [selectStudies, setSelectStudies] = useState<any>([]);
    const [selectAlgorithms, setSelectAlgorithms] = useState<any>([]);

  return (
    <div>
        <SideNav items={items}/>
    </div>
    )

}

export default CytoscapeClient;