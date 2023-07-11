import { ColumnDef } from "@tanstack/react-table";
import TData, { Dispatch, ReactNode, SetStateAction } from "react";

export type BadRequest = {
    code: "bad_request";
    message: string;
  };

export interface GeneProps {
    pk: number;
    name: string;
    curie: string;
    variant: string;
    chp_preffered_curies: string;
    checked: false;
}

export interface DatasetProps {
    pk: number;
    title: string;
    zenodo_id: string;
    doi: string;
    description: string;
    checked: false;
}

export interface StudyProps {
    pk: number;
    name: string;
    status: string;
    description: string;
    timestamp: string;
    tasks: TaskProps[];
    checked: false;
}

export interface StudyRequestProps {
    name: string;
    description: string;
    tasks: number[];
}

export type StudyResponse = 
    | (Omit<Response, "json"> & {
        status: 201;
        json: () => StudyProps | PromiseLike<StudyProps>;
    })
    | (Omit<Response, "json"> & {
        status: 400;
        json: () => BadRequest | PromiseLike<BadRequest>;
    })

export interface TaskProps {
    pk: number;
    algorithm_instance: number;
    dataset: string;
    timestamp: string;
    max_study_edge_weight: number;
    min_study_edge_weight: number;
    avg_study_edge_weight: number;
    std_study_edge_weight: number;
    name: string;
    study: number;
    status: string;
    checked: false;
}

export interface AlgorithmProps {
    pk: number;
    name: string;
    description: string;
    edge_weight: number;
    directed: boolean;
    checked: false;
}

export interface SideNavItemProps {
	width: 'full' | 'inline' | 'mobile';
	size: 'default' | 'small' | 'large';
	children?: ReactNode;
    text: string;
    icon?: ReactNode;
    data: any;
    columns: any;
    searchValue: string;
    setCytoscapeRequest: React.Dispatch<SetStateAction<CytoscapeRequestProps>>
    cachedResults: number[];
}

export interface SideNavButtonItemProps {
    text: string;
    icon?: ReactNode;
    data: any;
    columns: any;
    searchValue: string;
  }

export interface SideNavProps {
	items: SideNavButtonItemProps[];
    setCytoscapeRequest: React.Dispatch<SetStateAction<CytoscapeRequestProps>>
    cachedResults: number[];
}

export interface CytoscapeRequestProps {
    gene_ids: number[];
    task_ids: number[];
    algorithm_ids: number[];
    dataset_ids: number[];
    cached_results: number[];
}

export interface CytoscapeResponseProps {
    elements: any[];
    result_ids: number[];
}