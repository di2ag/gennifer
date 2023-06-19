'use client'

import React from "react";

import { GraphProps, ElementsProps, TNode, CytoscapeProps } from "@/const";

function filterElements(props: {elements: ElementsProps, filterGenes: string[]}) {
    const filteredNodes = props.elements["nodes"].filter(n => props.filterGenes.includes(n.data.name))
}

export default function CytoFilterNav({ 
    cy }: CytoscapeProps
    ) {

    const handleCheckboxChange = (geneId: string) => {
        // Turn off display of gene node
        cy.$(`#${geneId}`).display(!cy.$(`#${geneId}`).visible());
        // Turn off display of edges connected to gene node
        cy.edges().connectedNodes(`#${geneId}`).forEach(edge => edge.display(!edge.visible()));
    }

    return (
        <div className="flex flex-col w-1/4 h-full bg-gray-100">
            <h2 className="text-2xl font-bold text-center">Genes</h2>
            <div className="flex flex-col flex-grow overflow-y-auto">
                {cy.nodes().map((geneNode) => (
                    <div key={geneNode.data("name")} className="flex items-center p-2">
                        <input
                            className="mr-2"
                            type="checkbox"
                            checked={geneNode.visible()}
                            onChange={() => handleCheckboxChange(geneNode.data("id"))}
                        />
                        <label>{geneNode.data("name").replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}