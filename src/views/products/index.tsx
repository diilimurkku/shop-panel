'use client'

// React Imports
import { useMemo, useRef, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef, ColumnHelper } from '@tanstack/react-table'
import qs from 'qs'
import { useQueryClient } from '@tanstack/react-query'

// Util Imports
import { toast } from 'react-toastify'
import { Chip } from '@mui/material'

import DeleteModal from '@/@core/components/modals/DeleteModal'
import type { getDictionary } from '@/utils/getDictionary'
import Table from '@/@core/components/table/Table'
import { useQueryParams } from '@/@core/hooks/useQueryParams'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { translateReplacer } from '@/utils/translateReplacer'
import { type DrawerHandle } from '@/@core/components/drawers/FormDrawer'
import type { WithActions, ModalHandle, ThemeColor } from '@/@core/types'
import ToggleModal from '@/@core/components/modals/ToggleModal'

// Column Definitions
const columnHelper = createColumnHelper<{ name: string; category: string }>()

const ProductsListTable = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks

  // const router = useRouter()

  // const { queryParams, setQueryParams } = useQueryParams()

  // const { data, isFetching: isLoadingUnitList } = useFetch().useQuery('get', '/unit', {
  //   params: {
  //     query: queryParams
  //   }
  // })

  // Vars
  const keywordsTranslate = dictionary.keywords

  const modalTranslate = dictionary.modal

  const columns = useMemo<ColumnDef<{ name: string; category: string }, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: keywordsTranslate.title,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('category', {
        header: keywordsTranslate.category,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.category}
              </Typography>
            </div>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // TODO SHOP_PANEL
    []
  )

  const data = [...Array(5)]?.map((_, index) => ({
    name: `name ${index}`,
    category: `category ${index}`
  }))

  return (
    <>
      <Card>
        <Table
          columns={columns}
          data={{ data }}
          debouncedInputPlaceholder={`${keywordsTranslate.search} ${keywordsTranslate.products}`}
          // queryParams={queryParams}
          // setQueryParams={setQueryParams}
          // pagination={{
          //   pageIndex: (queryParams?.page ?? 1) - 1,
          //   pageSize: queryParams?.page_limit
          // }}
          pagination={{
            pageIndex: 1,
            pageSize: 15
          }}
          listTitle={keywordsTranslate.units}
          // isLoading={isLoadingUnitList}
        />
      </Card>
    </>
  )
}

export default ProductsListTable
