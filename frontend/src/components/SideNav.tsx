'use client'

import SideNavItem from "@/components/SideNavItem";
import { SideNavProps } from "@/const";
import { Separator } from "@/ui/separator";
import { FC } from 'react';
import { Slider } from "./ui/slider";

const SideNav: FC<SideNavProps> = ({ 
	items,
	setCytoscapeRequest,
	cachedResults,
 }) => {

  return (
    <header className="fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 border-r border-slate-300 dark:border-slate-700 shadow-sm">
	<div className="flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center pt-7 pb-3">
        <span className="text-md text-slate-800 dark:text-slate-400">Filters</span>
      </div>
      <div className="pb-2">
        <Separator className="border-slate-100"/>
      </div>
	  <div className="pb-3">
				{items.map(({ text, icon, data, columns, searchValue }, i) => (
					<div
						key={`header-${i}`}
						// value={`item-${i + 1}`}
						className="rounded-lg focus:outline-none overflow-hidden"
					>
						<SideNavItem 
						width="inline" 
						size="default"
						text={text}
						data={data} 
						columns={columns} 
						searchValue={searchValue}
						setCytoscapeRequest={setCytoscapeRequest}
						cachedResults={cachedResults}>
							{icon}
							<div className="hidden xl:inline-flex flex-none text-md">
								{text}
							</div>
						</SideNavItem>
					</div>
				))}
			</div>
	  <div className="pb-2">
        <Separator className="border-slate-100"/>
      </div>
	  <div className="flex flex-col mr-5 ml-5 items-center text-center pt-5">
        <span className="text-sm text-slate-800 dark:text-slate-400 pb-5">Edge Weight Threshold</span>
		<Slider
			defaultValue={[0]}
			max={100}
			min={0}
			step={1}
			/>
      </div>
	</div>
	</header>
  )
}

export default SideNav;