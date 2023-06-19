'use client'

import { FC } from 'react';
import { GridColumnHeaderParams, type GridColDef, DataGrid } from '@mui/x-data-grid'
import { useTheme } from 'next-themes';
import { ThemeProvider, createTheme } from '@mui/material';

const columnsDraft: GridColDef[] = [
    {
        field: 'col1',
        headerName: 'Title',
        width: 250,
        renderHeader(params) {
            return (
                <strong className='font-semibold'>{params.colDef.headerName}</strong>
            )
        },
    },
    {field: 'col2', headerName: 'Description', width: 400},
    {field: 'col3', headerName: 'Zenodo ID', width: 150},
    {field: 'col4', headerName: 'DOI', width: 250},
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
    title: string;
    description: string;
    zenodo_id: string;
    doi: string;
}

interface TableProps {
    rows: Row[];
}

const DatasetsTable: FC<TableProps> = ({ rows }) => {
    const { theme: applicationTheme } = useTheme()

    const theme = createTheme({
        palette: {
            mode: applicationTheme === 'light' ? 'light' : 'dark',
        }
    })

    const new_rows = rows.map((row) => ({
        id: 'dataset-' + row.pk,
        col1: row.title,
        col2: row.description,
        col3: row.zenodo_id,
        col4: row.doi,
    }))

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

export default DatasetsTable;