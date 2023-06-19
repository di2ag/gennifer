import { ColumnDef } from "@tanstack/react-table";
import TData, { Dispatch, ReactNode, SetStateAction } from "react";

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

export interface InferenceStudyProps {
    pk: number;
    algorithm_instance: number;
    dataset: string;
    timestamp: string;
    max_study_edge_weight: number;
    min_study_edge_weight: number;
    avg_study_edge_weight: number;
    std_study_edge_weight: number;
    checked: false;
    name: string;
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
}