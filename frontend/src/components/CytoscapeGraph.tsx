'use client'

import {useState, memo, useMemo, useRef, useCallback, useEffect} from 'react';
import cytoscape, { Stylesheet, ElementDefinition } from 'cytoscape';
import klay from 'cytoscape-klay';
import dagre from 'cytoscape-dagre';
import avsdf from 'cytoscape-avsdf';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import navigator from 'cytoscape-navigator';
import { layoutList, initCytoscapeInstance, styleList, layout } from '@/lib/graphFunctions'
import CytoscapeComponent from "react-cytoscapejs";

import { FC } from 'react';

// initialize 3rd party layouts
cytoscape.use(klay);
cytoscape.use(avsdf);
cytoscape.use(dagre);
cytoscape.use(navigator);

interface CytoscapeGraphProps {
    elements: ElementDefinition[];
    result_ids: number[];
    windowHeight: number;
    windowWidth: number;
    active: boolean
}

function getDefaultStylesheet() {
    return styleList;
  }

const CytoscapeGraph: FC<CytoscapeGraphProps> = ({ elements, windowHeight, windowWidth, active }) => {
    const cyRef = useRef<cytoscape.Core | undefined>();
    useEffect(() => {
        console.log('New elements...')
        const cy = cyRef.current;
        if (!cy) { 
            return;
        }
        const newLayout = cy.layout(layout);
        newLayout.run();
        cy.center()
      }, [elements]);
    
    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) {
        return;
      }
      cy.on('mouseover', 'node', function(event) {
        var node = event.target;
        // console.log('mouseover', node.id())
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