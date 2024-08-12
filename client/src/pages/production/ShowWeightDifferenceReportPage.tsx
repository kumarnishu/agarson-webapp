import { Box, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import moment from 'moment'
import { GetShoeWeightDiffReports } from '../../services/ProductionServices'


export interface IShoeWeightDiffReport {
  date: string,
  dye_no: number,
  article: string,
  size: string,
  st_weight: number,
  machine: string,
  d1: number,
  d2: number,
  d3: number,
  person: string
}

export default function ShowWeightDifferenceReportPage() {
  const [reports, setReports] = useState<IShoeWeightDiffReport[]>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(31)).format("YYYY-MM-DD")
  })
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IShoeWeightDiffReport[]>, BackendError>(["reports", dates.start_date, dates.end_date], async () => GetShoeWeightDiffReports({ start_date: dates.start_date, end_date: dates.end_date }))
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const columns = useMemo<MRT_ColumnDef<IShoeWeightDiffReport>[]>(
    //column definitions...
    () => reports && [
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
        Footer: <b>Total</b>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => { return i.date.toString() }).filter(onlyUnique)
      },
      {
        accessorKey: 'dye_no',
        header: 'Dye',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.dye_no)
            return i.dye_no.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'article',
        header: 'Article',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.article)
            return i.article.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'size',
        header: 'Size',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.size)
            return i.size.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'st_weight',
        header: 'St Weight',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.st_weight)
            return i.st_weight.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'machine',
        header: 'Machine',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.machine)
            return i.machine.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'd1',
        header: 'Diff-1',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'd2',
        header: 'Diff-2',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'd3',
        header: 'Diff-3',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'perosn',
        header: 'Person',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.person)
            return i.person.toString()
          else return ""
        }).filter(onlyUnique)
      }
    ],
    [reports],
    //end
  );


  useEffect(() => {
    if (isSuccess && data) {
      setReports(data.data);
    }
  }, [isSuccess]);



  const table = useMaterialReactTable({
    columns,
    data: reports, //10,000 rows
    defaultDisplayColumn: { enableResizing: true },
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontSize: '13px',
        border: '1px solid #ddd;'
      },
    }),
    initialState: { density: 'comfortable' },
    enableGrouping: true,
    enableRowSelection: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    muiTableContainerProps: { sx: { maxHeight: '450px' } },
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
  });


  return (
    <>

      {
        isLoading && <LinearProgress />
      }


      <Stack
        spacing={2}
        padding={1}
        direction="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Show Weight Difference
        </Typography>
        <Stack direction="row" gap={2}>
          < TextField
            size="small"
            type="date"
            id="start_date"
            label="Start Date"
            fullWidth
            value={dates.start_date}
            focused
            onChange={(e) => {
              if (e.currentTarget.value) {
                setDates({
                  ...dates,
                  start_date: moment(e.target.value).format("YYYY-MM-DD")
                })
              }
            }}
          />
          < TextField
            size="small"
            type="date"
            id="end_date"
            label="End Date"
            focused
            value={dates.end_date}
            fullWidth
            onChange={(e) => {
              if (e.currentTarget.value) {
                setDates({
                  ...dates,
                  end_date: moment(e.target.value).format("YYYY-MM-DD")
                })
              }
            }}
          />
        </Stack>
      </Stack >
      <Box sx={{
        overflow: "auto",
        height: '80vh'
      }}
      >
        {/* table */}
        {!isLoading && data && <MaterialReactTable table={table} />}
      </Box>
    </>

  )

}
