'use client'

import {useState, memo, useMemo, useRef, useCallback, useEffect} from 'react';
import ReactDom from 'react-dom';
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
import { AnnotationProps, CytoscapeRequestProps } from '@/const';
import { createRoot } from 'react-dom/client';
import Button from './ui/Button';
import { EdgeHoverCard, GeneHoverCard } from '@/components/HoverCard';
import cytoscapePopper from 'cytoscape-popper';

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
    edgeWeightThreshold: number;
    evidenceNumberThreshold: number;
}

function getDefaultStylesheet() {
    return styleList;
  }

const destroyPopper = (cyPopperRef: any) => {
  let div = cyPopperRef.current.state.elements.popper
  let refDiv = cyPopperRef.current.state.elements.reference;
  
  cyPopperRef.current.destroy();

  let rm = (div:any) => {
    try {
      div.parentNode.removeChild( div );
    } catch( err ){
      // just let it fail
    }
  };

  rm(div);
  rm(refDiv);
}
  
  const createContentFromComponent = (component: any) => {
    const dummyDomEle = document.createElement('div');
    const root = createRoot(dummyDomEle!);
    root.render(component)
    document.body.appendChild(dummyDomEle);
    return dummyDomEle;
  };

const CytoscapeGraph: FC<CytoscapeGraphProps> = ({ 
  elements, 
  windowHeight, 
  windowWidth, 
  active, 
  cytoRequest, 
  edgeWeightThreshold,
  evidenceNumberThreshold }) => {
    const cyRef = useRef<cytoscape.Core | undefined>();
    const cyPopperRef = useRef<any>(null);
    const scalingFactor = 1;
    const [poppedNodes1, setPoppedNodes1] = useState<string[]>([]);
    const [poppedNodes2, setPoppedNodes2] = useState<string[]>([]);


    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) { 
          return;
      }
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
        const newLayout = cy.layout(layout);
        newLayout.run();
        cy.center()
      }, [elements, cytoRequest]);
    
    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) {
        return;
      }
      cy.nodes().forEach(n => {
        if (n.id() in poppedNodes1) {
          return
        }
        n.on('mouseover', (event) => {
          cyPopperRef.current =  event.target.popper({
          content: createContentFromComponent(
            <GeneHoverCard
            name={event.target.data()['name']}
            curie={event.target.data()['curie']}
            chp_preffered_curie={event.target.data()['chp_preferred_curie']}
            />
          ),
          popper: {
            placement: 'right',
          },
        })})
        setPoppedNodes1([...poppedNodes1, n.id()])
    });
    
    cy.nodes().forEach(n => {
      if (n.id() in poppedNodes2) {
        return
      }
      n.on('mouseout', () => {
        if (cyPopperRef) {
          destroyPopper(cyPopperRef)
        }
      setPoppedNodes2([...poppedNodes2, n.id()])
    })})
    
    cy.edges().on('mouseover', (event) => {
      var edge = event.target;
      var annotations = edge.data()['annotations'];
      var tr_annotations: AnnotationProps[] = []
      if (annotations.hasOwnProperty('translator')) {
        annotations['translator'].map((a: any) => {
          tr_annotations.push({
            'name': a.formatted_relation,
            'type': 'translator',
            'evidence': a.results
          })
        }) 
      }
    cyPopperRef.current =  edge.popper({
      content: createContentFromComponent(
      <EdgeHoverCard
      sourceName={edge.source().data()['name']}
      targetName={edge.target().data()['name']}
      directed={edge.data()['directed']}
      weight={edge.data()['weight']}
      algorithm={edge.data()['algorithm']}
      dataset={edge.data()['dataset']}
      tr_annotations={tr_annotations}
      />
         ),
      popper: {
        placement: 'right',
      },
    });
  });

  cy.edges().on('mouseout', () => {
    if (cyPopperRef) {
      destroyPopper(cyPopperRef)
    }
    });
    }, [elements]);

    useEffect(() => {
      const cy = cyRef.current;
      if (!cy) {
        return;
      }
      cy.edges().forEach((edge) => {
        if (parseFloat(edge.data()['weight']) >= edgeWeightThreshold && edge.data()['annotations']['translator'].length >= evidenceNumberThreshold) {
          edge.style('display', 'element');
          if (edge.source().style('display') === 'none') {
            edge.source().style('display', 'element');
          }
          if (edge.target().style('display') === 'none') {
            edge.source().style('display', 'element');
          }
        } else {
          edge.style('display', 'none');
        }
      })
      cy.nodes().forEach((node) => {
          let hasDisplayedOutgoers = false;
          let hasDisplayedIncomers = false;
          node.outgoers().forEach((outgoer) => {
            if (outgoer.style('display') === 'element') {
              hasDisplayedOutgoers = true;
            }
          })
          node.incomers().forEach((incomer) => {
            if (incomer.style('display') === 'element') {
              hasDisplayedIncomers = true;
            }
          if (!hasDisplayedOutgoers && !hasDisplayedIncomers) {
            console.log('here')
            node.style('display', 'none');
          }
        })
      })
    }, [edgeWeightThreshold, evidenceNumberThreshold]);

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