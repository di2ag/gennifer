'use client'

import * as React from "react"
import { cva } from 'class-variance-authority';
import Button from '@/ui/Button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { FilterTable } from './ui/FilterTable';
import { SideNavItemProps } from '@/const';


const SideNavItemVariants = cva(
	'flex items-center gap-x-4 px-4 py-3 hover:bg-slate-100 text-slate-900 my-1',
	{
		variants: {
			width: {
				full: 'w-full',
				// inline: 'inline-flex [&_div:first-child]:rounded-full',
				inline: 'max-w-fit rounded-full',
				mobile: 'inline-flex justify-center xl:justify-start ',
			},
			size: {
				default: '',
				small: 'py-2 [&_div:last-child]:text-sm my-0',
				large: '',
			},
		},
		defaultVariants: {
			width: 'inline',
			size: 'default',
		},
	},
);

const SideNavItem = ({ children, width, size, text, data, columns, searchValue, setCytoscapeRequest, cachedResults }: SideNavItemProps) => {
    const [rowSelection, setRowSelection] = React.useState({})
    
    const handleSaveClick = () => {
        const selected = Object.entries(rowSelection).map(([key, value]) => data[key].pk)
        let key:string = ''
        if (text.toLowerCase() === 'genes') {
            key = 'gene_ids'
        } else if (text.toLowerCase() === 'studies') {
            key = 'task_ids'
        } else if (text.toLowerCase() === 'algorithms') {
            key = 'algorithm_ids'
        } else if (text.toLowerCase() === 'datasets') {
            key = 'dataset_ids'
        }
        setCytoscapeRequest((prevRequest) => ({
            ...prevRequest,
            [key]: selected,
            cached_results: cachedResults,
        }));
    }

    return (
	<Sheet>
    <SheetTrigger asChild>
        <Button 
        className={SideNavItemVariants({ width, size })}
        variant={"ghost"}>
            {children}
        </Button>
    </SheetTrigger>
    <SheetContent position="left" size="content" >
        <SheetHeader>
        <SheetTitle>Select {text}:</SheetTitle>
        <SheetDescription>
            Select all that you wish to view.
        </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
        <FilterTable
        columns={columns} 
        data={data} 
        searchPlaceholderText={`Search ${text}...`}
        searchValue={searchValue}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        />
        </div>
        <SheetFooter>
            <SheetClose asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveClick}
                    type="submit"
                    >
                    Save changes
                </Button>
            </SheetClose>
        </SheetFooter>
    </SheetContent>
    </Sheet>
    );
}

export default SideNavItem;