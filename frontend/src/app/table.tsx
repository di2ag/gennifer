import * as React from "react";

export interface Algorithm {
    name: string;
    description: string;
    edge_weight_type: string;
}

interface TableRowProps {
    key: string;
    algo: Algorithm;
    
}

interface AlgorithmTableProps {
    algos: Algorithm[];
}

const AlgorithmRow = ({ algo }: TableRowProps) => {
    return (
        <tr>
            <td>{algo.name}</td>
            <td>{algo.description}</td>
            <td>{algo.edge_weight_type}</td>
        </tr>
        )
}

export const AlgorithmTable = ({algos}: AlgorithmTableProps) => {
    let rows: React.ReactElement<TableRowProps>[] = [];
        
    algos.forEach((algo: Algorithm) => {
        rows.push(
            <AlgorithmRow algo={algo} key={algo.name} />
        )
    })

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Edge Weight Semantic</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}