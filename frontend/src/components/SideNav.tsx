'use client'

import SideNavItem from "@/components/SideNavItem";
import { SideNavProps } from "@/const";
import { Separator } from "@/ui/separator";
import { FC } from 'react';

const SideNav: FC<SideNavProps> = ({ 
	items,
	setCytoscapeRequest,
	cachedResults,
 }) => {

  return (
    <header className="fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 border-r border-slate-300 dark:border-slate-700 shadow-sm">
	<div className="flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center pt-7 pb-3">
        <span className="text-md text-slate-800 dark:text-slate-100">Filters</span>
      </div>
      <div className="pb-2">
        <Separator className="border-slate-100"/>
      </div>
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
							<div className="hidden xl:inline-flex flex-none text-md font-semibold ">
								{text}
							</div>
						</SideNavItem>
					</div>
				))}
			</div>
	</header>
  )
}

export default SideNav;