'use client'

import { useState } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import {CiFilter } from "react-icons/ci";
import { BiDna } from "react-icons/bi";
import { FiDatabase } from "react-icons/fi";
import {BsCodeSquare} from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";

import LeftSideNavCategory from "../navigation/left-side-nav-category";
import { GeneProps, DatasetProps, InferenceStudyProps, AlgorithmProps } from "@/const";


export default function CytoscapeWindow(props: { 
    genes: GeneProps[],
    datasets: DatasetProps[],
    studies: InferenceStudyProps[],
    algorithms: AlgorithmProps[],
}) {

    const [genes, setGenes] = useState(props.genes);
    const [datasets, setDatasets] = useState(props.datasets);
    const [studies, setStudies] = useState(props.studies);
    const [algorithms, setAlgorithms] = useState(props.algorithms);
    const [collapsed, setCollapsed] = useState(true);

    const [genesFilter, setGenesFilter] = useState("");
    const [algorithmsFilter, setAlgorithmsFilter] = useState("");
    const [datasetsFilter, setDatasetsFilter] = useState("");
    const [studiesFilter, setStudiesFilter] = useState("");
  

    const handleCheckboxChange = (item: GeneProps | DatasetProps | InferenceStudyProps | AlgorithmProps, type: string) => {
        console.log(item.pk);
      };

    const toggleSidebarHandler = () => {
    setCollapsed(!collapsed);
    };

    const filterGenes = (genes: GeneProps[], filter: string) => {
        if (!filter) {
          return genes;
        }
    
        return genes.filter((gene) =>
          gene.name.toLowerCase().includes(filter.toLowerCase())
        );
      };

      const filterDatasets = (genes: DatasetProps[], filter: string) => {
        if (!filter) {
          return datasets;
        }
    
        return datasets.filter((dataset) =>
          dataset.title.toLowerCase().includes(filter.toLowerCase())
        );
      };

      const filterAlgorithms = (genes: AlgorithmProps[], filter: string) => {
        if (!filter) {
          return algorithms;
        }
    
        return algorithms.filter((algo) =>
          algo.name.toLowerCase().includes(filter.toLowerCase())
        );
      };

      const filterStudies = (genes: InferenceStudyProps[], filter: string) => {
        if (!filter) {
          return studies;
        }
    
        return studies.filter((study) =>
          study.name.toLowerCase().includes(filter.toLowerCase())
        );
      };

    return (
        <div className="flex">
            <button className="btn" onClick={toggleSidebarHandler}>
                {collapsed ? <MdOutlineKeyboardArrowRight /> : <MdOutlineKeyboardArrowLeft />}
            </button>
        <aside className="#fff h-screen" data-collapse={collapsed}>
            <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-90">
            <span className="sidebar__icon">
                    <CiFilter />
                  </span>
                <p className="sidebar__logo-name">Filter Results</p>
            </div>
            {/* Genes */}
            <LeftSideNavCategory 
                items={genes} 
                filterItems={filterGenes} 
                itemsFilter={genesFilter} 
                setItemsFilter={setGenesFilter} 
                categoryName={'Genes'} 
                type={'gene'}
                icon={<BiDna />} 
                />
            {/* Algorithms */}
            <LeftSideNavCategory 
                items={algorithms} 
                filterItems={filterAlgorithms} 
                itemsFilter={algorithmsFilter} 
                setItemsFilter={setAlgorithmsFilter} 
                categoryName={'Algorithms'} 
                type={'algorithm'}
                icon={<BsCodeSquare />}
                />
            {/* Datasets */}
            <LeftSideNavCategory 
                items={datasets} 
                filterItems={filterDatasets} 
                itemsFilter={datasetsFilter} 
                setItemsFilter={setDatasetsFilter} 
                categoryName={'Datasets'} 
                type={'dataset'} 
                icon={<FiDatabase/>}
            />
            {/* Studies */}
            <LeftSideNavCategory 
                items={studies} 
                filterItems={filterStudies} 
                itemsFilter={studiesFilter} 
                setItemsFilter={setStudiesFilter} 
                categoryName={'Studies'} 
                type={'study'}
                icon={<HiTemplate />} 
            />
        </aside>
        </div>
  );
};