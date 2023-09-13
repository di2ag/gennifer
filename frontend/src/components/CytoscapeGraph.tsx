'use client'

import {useState, memo, useMemo, useRef, useCallback, useEffect} from 'react';
import cytoscape, { Stylesheet, ElementDefinition } from 'cytoscape';
import popper from 'cytoscape-popper';
import klay from 'cytoscape-klay';
import dagre from 'cytoscape-dagre';
import avsdf from 'cytoscape-avsdf';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import navigator from 'cytoscape-navigator';
import { layoutList, initCytoscapeInstance, styleList, layout } from '@/lib/graphFunctions'
import CytoscapeComponent from "react-cytoscapejs";

import { FC } from 'react';
import { CytoscapeRequestProps } from '@/const';
import { createRoot } from 'react-dom/client';
import Button from './ui/Button';
import { EdgeHoverCard, GeneHoverCard } from '@/components/HoverCard';

// initialize 3rd party layouts
cytoscape.use(klay);
cytoscape.use(avsdf);
cytoscape.use(dagre);
cytoscape.use(navigator);
cytoscape.use(popper);

interface CytoscapeGraphProps {
    elements: ElementDefinition[];
    result_ids: number[];
    windowHeight: number;
    windowWidth: number;
    active: boolean;
    cytoRequest: CytoscapeRequestProps;
}

function getDefaultStylesheet() {
    return styleList;
  }

  const ReactButton = () => {
    return <Button type="button">React Button</Button>;
  };
  
  const createContentFromComponent = (component: any) => {
    const dummyDomEle = document.createElement('div');
    const root = createRoot(dummyDomEle!);
    root.render(component)
    document.body.appendChild(dummyDomEle);
    return dummyDomEle;
  };

const CytoscapeGraph: FC<CytoscapeGraphProps> = ({ elements, windowHeight, windowWidth, active, cytoRequest }) => {
    const cyRef = useRef<cytoscape.Core | undefined>();
    const cyPopperRef = useRef<any>(null);
    const scalingFactor = 1;

    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) { 
          return;
      }
      console.log('New elements...')
      elements.forEach((element) => {
      // Check if element is a gene and if it is should be displayed based on the selected filters.
      if (element.data.hasOwnProperty('curie') && cytoRequest.gene_ids.includes(parseInt(element.data.id!.toString()))) {
        cy.$id(element.data.id!).style('display', 'element');
      } else {
        cy.$id(element.data.id!).style('display', 'none');
      }
      // Check if element is an edge
      if (element.data.hasOwnProperty('weight')) {
        // Scale Weight
        element.data.weight *= scalingFactor;
        // See if edge should be hidden
        if (cytoRequest.gene_ids.includes(parseInt(element.data.target.toString())) && cytoRequest.gene_ids.includes(parseInt(element.data.source.toString()))) {
          cy.$id(element.data.id!).style('display', 'element');
        } else {
          cy.$id(element.data.id!).style('display', 'none');
        }
        }
        });
        console.log(elements)
        const newLayout = cy.layout(layout);
        newLayout.run();
        cy.center()
      }, [elements, cytoRequest]);
    
    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) {
        return;
      }
      cy.on('mouseover', 'node', function(event) {
        var node = event.target;
      cyPopperRef.current =  node.popper({
        content: createContentFromComponent(
        <GeneHoverCard
        name={node.data()['name']}
        curie={node.data()['curie']}
        chp_preffered_curie={node.data()['chp_preffered_curie']}
        />
           ),
        popper: {
          placement: 'right',
          removeOnDestroy: true,
        },
      });
    });

    cy.on('mouseout', 'node', () => {
      if (cyPopperRef) {
        cyPopperRef.current.destroy();
      }
      });
    cy.on('mouseover', 'edge', function(event) {
      var edge = event.target;
    cyPopperRef.current =  edge.popper({
      content: createContentFromComponent(
      <EdgeHoverCard
      weight={edge.data()['weight']}
      algorithm={edge.data()['algorithm']}
      dataset={edge.data()['dataset']}
      annotations={edge.data()['annotations']}
      />
         ),
      popper: {
        placement: 'right',
        removeOnDestroy: true,
      },
    });
  });

  cy.on('mouseout', 'edge', () => {
    if (cyPopperRef) {
      cyPopperRef.current.destroy();
    }
    });
    }, []);

    return (
        <div className='h-min-screen w-full items-center justify-center'>
            <CytoscapeComponent
                elements={elements}
                // @ts-expect-error
                stylesheet={styleList}
                style={{
                    width: windowWidth,
                    height: windowHeight,
                    // border: "1px solid black"
                  }}
                layout={layout}
                cy={(cy) => (cyRef.current = cy)}
                />
        </div>

      );
}

export default CytoscapeGraph;