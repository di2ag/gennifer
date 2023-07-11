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
  
}

function getDefaultStylesheet() {
    return styleList;
  }

const CytoscapeGraph: FC<CytoscapeGraphProps> = ({ elements, windowHeight, windowWidth }) => {
    const cyRef = useRef<cytoscape.Core | undefined>();
    //const [layout, setLayout] = useState(layout);


    return (
        <div className='h-min-screen w-full items-center justify-center'>
            <CytoscapeComponent
                elements={elements}
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

//     // console.log(elements)
//     let graphRef = useRef<HTMLDivElement>(null);
//     const [currentLayout, setCurrentLayout] = useState(layoutList.dagre);
//     const selectedNodes = useRef(new Set());
//     const excludedNodes = useRef(new Set());
//     const highlightClass = 'highlight';
//     const hideClass = 'hide';
//     const excludedClass = 'excluded';

//     const calculatedPaths = useRef(null);
//     const cyNav = useRef(null);

//     const graphId = useRef(uuidv4());
//     const graphIdString = `cy-${graphId.current}`;
//     const graphNavigatorContainerId = useRef(`cy-nav-container-${graphId.current}`);
    
//     /**
//      * Highlights the given element by adding the highlightClass and removing the hideClass.
//      * @param {object} element - The cytoscape element to be highlighted.
//      */
//     const highlightElement = (element:any) => {
//         element.addClass(highlightClass);
//         element.removeClass(hideClass);
//     }

//     /**
//      * Hides the given element by removing the highlightClass and adding the hideClass.
//      * @param {object} element - The cytoscape element to be hidden.
//      */
//     const hideElement = (element:any) => {
//         element.removeClass(highlightClass);
//         element.addClass(hideClass);
//     }

//     /**
//      * Handles a node click event and calls the onNodeClick callback function with an array of paths and formatted paths.
//      * @param {Object} ev - The event object.
//      * @param {Array} formattedPaths - An array of formatted paths.
//      * @param {Object} graph - The graph object.
//      * @returns {void}
//      */

//     const [cy, setCy] = useState(null);

//     useEffect(()=>{
//         console.log("in memo")
//         if(!graphRef.current || elements === null) return;
//         console.log("Did not return null")
//         let cytoReqDataObject = {
//           graphRef: graphRef.current, 
//           graphNavigatorContainerId: graphNavigatorContainerId.current,
//           graph: elements, 
//           layout: currentLayout, 
//           selectedNodes: selectedNodes, 
//           excludedNodes: excludedNodes,
//           //handleNodeClick: handleNodeClick, 
//           //clearSelectedPaths: clearSelectedPaths,
//           highlightClass: highlightClass, 
//           hideClass: hideClass, 
//           excludedClass: excludedClass,
//           //subjectId: subjectId.current,
//           //objectId: objectId.current,
//           cyNav: cyNav.current
//         }
//         let cyInstanceAndNav = initCytoscapeInstance(cytoReqDataObject);
//         // cyNav.current = cyInstanceAndNav.nav as any;
//         setCy(() => cyInstanceAndNav.cy as any);
//       }, [graphRef, elements, currentLayout]);
    
//     //   useEffect(() => {
//     //     return () => {
//     //       if(cy !== null)
//     //         cy.destroy();
//     //     };
//     //   });

//       console.log(cy)
//     //   console.log(graphIdString)
//     //   console.log(graphRef)
//       return (
//           <div className='min-h-screen bg-slate-900 h-550' >
//             <div id={graphIdString} ref={graphRef} className='w-full h-full'></div>
//             {/* <div 
//               id={graphNavigatorContainerId.current}
//               className='absolute bottom-2 right-2 z-100 user-select-none w-[calc(14vw + 50px)] h-[calc(16vh + 50px)] mx-auto bg-slate-100 overflow-hidden border border-r-2 shadow-md'
//               onMouseEnter={()=>{
//                 document.body.style.overflow = 'hidden';
//                 document.body.style.paddingRight = '15px';
//               }}
//               onMouseLeave={()=>{
//                 document.body.style.overflow = 'auto';
//                 document.body.style.paddingRight = '0';
//               }}
//             >
//             </div> */}
//           </div>
//       );
// }

export default CytoscapeGraph;