'use client'

import { FC } from 'react';
import { GridColumnHeaderParams, type GridColDef, DataGrid } from '@mui/x-data-grid'
import { useTheme } from 'next-themes';
import { ThemeProvider, createTheme } from '@mui/material';

const columnsDraft: GridColDef[] = [
    {
        field: 'col1',
        headerName: 'Name',
        width: 250,
        renderHeader(params) {
            return (
                <strong className='font-semibold'>{params.colDef.headerName}</strong>
            )
        },
    },
    {field: 'col2', headerName: 'Zenodo ID', width: 150},
    {field: 'col3', headerName: 'Algorithm Instance ID', width: 400},
]

const columns = columnsDraft.map((col) => {
    if(col.field === 'col1') {
        return col
    }
    return {
        ...col,
        renderHeader(params: GridColumnHeaderParams<any,any,any>) {
            return (
                <strong className='font-semibold'>{params.colDef.headerName}</strong>
            )
        },
    }
});

type Row = {
    pk: string;
    name: string;
    dataset: string;
    algorithm_instance: string;
    doi: string
}

interface TableProps {
    rows: Row[];
}

const StudiesTable: FC<TableProps> = ({ rows }) => {
    const { theme: applicationTheme } = useTheme()

    const theme = createTheme({
        palette: {
            mode: applicationTheme === 'light' ? 'light' : 'dark',
        }
    })

    const new_rows = rows.map((row) => ({
        id: 'study-' + row.pk,
        col1: row.name,
        col2: row.dataset,
        col3: row.algorithm_instance,
    }))

    console.log(new_rows)

  return (
    <ThemeProvider theme={theme}>
        <DataGrid style={{
            backgroundColor: applicationTheme === 'light' ? 'white' : '#152238',
            fontSize: '.8rem',
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 5,
                }
            }
        }}
        columns={columns}
        rows={new_rows} />
    </ThemeProvider>
  )
}

export default StudiesTable;