'use client'

import React, { useEffect, useState } from "react";
import { Core, ElementsDefinition } from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import CytoFilterNav from "../navigation/left-cyto-filter";

interface CytoscapeGraphProps {
  elements: ElementsDefinition; // Adjust the type of elements as per your requirement
}

interface CytoscapeGraphState {
  width: number;
  height: number;
  elements: ElementsDefinition; // Adjust the type of elements as per your requirement
}

const layout = {
    name: "random",
    fit: true,
    // circle: true,
    directed: true,
    padding: 50,
    // spacingFactor: 1.5,
    animate: false,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false
  };
  const stylesheet = [
    {
      "selector": "node",
      "style": {
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
      "selector": "node:selected",
      "style": {
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
      "selector": "edge",
      "style": {
        "width": "data(weight)",
        "line-color": "#AAD8FF",
      }
    },
    {
      "selector": "edge[directed='true']",
      "style": {
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ]


const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({ elements }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [cy, setCy] = useState<Core | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    console.log(width, height);
  }, [width, height]);

  const setUpListeners = () => {
    cy.on("click", "node", (event: any) => {
      console.log(event.target);
    });
  };

  useEffect(() => {
    setElements(elements);
    setUpListeners();
  }, [elements]);

  const setElements = (elements: ElementsDefinition) => {
    setState((prevState) => ({
      ...prevState,
      elements,
    }));
  };

  const [state, setState] = useState<CytoscapeGraphState>({
    width: 0,
    height: 0,
    elements: [],
  });

  return (
    <div>
        {cy && (
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(state.elements)}
        style={{ width: state.width, height: state.height }}
        cy={(cy) => {
          setCy(cy);
        }}
        stylesheet={stylesheet} // Replace with your stylesheet
        layout={layout} // Replace with your layout
      />
        )}
    </div>
  );
};


