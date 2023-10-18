import cytoscape from 'cytoscape';

export const layoutList = {
  klay: {
    name: 'klay', spacingFactor: 1.3, klay:{direction: 'RIGHT', edgeSpacingFactor: .1}, 
    ready: (ev)=>{ 
      if(ev.target?.options?.eles?.length < 10) { 
        ev.cy.zoom({level:1.5}); 
        ev.cy.center(); 
      }
    }
  },
  breadthfirst: {
    name: 'breadthfirst', spacingFactor: 1.1, avoidOverlap: true, directed: true
  },
  dagre: {
    name: 'dagre', spacingFactor: 1.1
  },
  circle: {
    name: 'circle'
  },
  concentric: {
    name: 'concentric'
  },
}

export const styleList = [
  {
    "selector": "node",
    "style": {
      "content": "data(name)",
      "shape": "round-rectangle",
      "text-valign": "center",
      "text-halign": "center",
      "width": "206px",
      "height": "data(height)",
      "padding": "8px",
      "color": "#000",
      "backgroundColor": "#fff",
      "border-color": "#000",
      "border-width": "2px",
      "text-wrap": "wrap",
      "text-max-width": "190px",
      "font-weight": "bold",
    }
  },
  {
    "selector": "node:selected",
    "style": {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      "text-outline-color": "#77828C",
    }
  },
  {
    "selector": "edge",
    "style": {
      "width": "data(weight)",
      "line-color": "#CED0D0",
      "curve-style": "bezier"
    }
  },
  {
    "selector": "edge:selected",
    "style": {
      "line-color": "#AAD8FF",
    }
  },
  {
    "selector": "edge[?directed]",
    "style": {
      "target-arrow-color": "#CED0D0",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier"
    }
  }
]

export const layout = {
    name: "dagre",
    fit: true,
    directed: true,
    padding: 50,
    spacingFactor: 1.25,
    animate: false,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false,
  };


export const initCytoscapeInstance = (dataObj) => {
  let cy = cytoscape({
    container: dataObj.graphRef.current,
    elements: dataObj.graph,
    layout: dataObj.layout,
    style: [
      {
        selector: 'node',
        style: {
          "backgroundColor": "#4a56a6",
          "width": 30,
          "height": 30,
          "label": "data(name)",
          "overlay-padding": "6px",
          "z-index": "10",
          "text-outline-color": "#4a56a6",
          "text-outline-width": "2px",
          "color": "white",
          "fontSize": 20
        }
      },
      {
        selector: "node:selected",
        style: {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#77828C",
          "width": 50,
          "height": 50,
          "text-outline-color": "#77828C",
          "text-outline-width": 8
        }
      },
      {
        selector: "edge",
        style: {
          "width": "data(weight)",
          "line-color": "#AAD8FF",
          "target-arrow-color": "#6774cb",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier"
        }
      },
      {
        selector: "edge[directed=true]",
        style: {
          "target-arrow-color": "#6774cb",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier"
        }
      },
      {
        selector: 'edge.highlight',
        style: {
          'line-color': '#000',
          'opacity': '1.0'
        }
      },
      {
        selector: '.hover-highlight',
        style: {
          'line-color': '#606368'
        }
      },
      {
        selector: '.hide',
        style: {
          'opacity': '0.3'
        }
      },
      {
        selector: '.excluded',
        style: {
          'background-color': 'red'
        }
      },
    ],
    data: {
      result: 0
    }
  });

  cy.unbind('vclick');
  cy.bind('vclick', 'node', (ev, formattedResults)=>dataObj.handleNodeClick(ev, formattedResults, dataObj.graph));
  cy.bind('vclick', 'edge', (ev)=>console.log(ev.target.data()));

  // when background is clicked, remove highlight and hide classes from all elements
  cy.bind('click', (ev) => {
    if(ev.target === cy) {
      handleDeselectAllNodes(
        ev.cy, 
        dataObj.selectedNodes, 
        dataObj.excludedNodes, 
        dataObj.clearSelectedPaths, 
        {highlightClass: dataObj.highlightClass, hideClass: dataObj.hideClass, excludedClass: dataObj.excludedClass}
      );
    }
  });

  // Set bounds of zoom
  cy.maxZoom(2.5);
  cy.minZoom(.25);


  if(dataObj.cyNav !== null) {
    dataObj.cyNav.destroy();
  }

  var defaults = {
    container: `#${dataObj.graphNavigatorContainerId}`, // string | false | undefined. Supported strings: an element id selector (like "#someId"), or a className selector (like ".someClassName"). Otherwise an element will be created by the library.
    viewLiveFramerate: 0, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
    thumbnailEventFramerate: 30, // max thumbnail's updates per second triggered by graph updates
    thumbnailLiveFramerate: false, // max thumbnail's updates per second. Set false to disable
    dblClickDelay: 200, // milliseconds
    removeCustomContainer: false, // destroy the container specified by user on plugin destroy
    rerenderDelay: 100, // ms to throttle rerender updates to the panzoom for performance
  };

  // let nav = cy.navigator( defaults ); // init navigator instance

  return {
    cy: cy,
    //nav: nav
  };
}