'use client'

// React Imports
import { useMemo, useRef, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Card, Chip, Typography } from '@mui/material'

// Third-party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { toast } from 'react-toastify'
import qs from 'qs'
import { useQueryClient } from '@tanstack/react-query'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { ModalHandle, ThemeColor, WithActions } from '@/@core/types'
import type { components } from '@/@core/api/v1'

// Components Imports
import CustomIconButton from '@/@core/components/mui/IconButton'
import Table from '@/@core/components/table/Table'
import DeleteModal from '@/@core/components/modals/DeleteModal'
import ToggleModal from '@/@core/components/modals/ToggleModal'

// Utils Imports
import { useFetch } from '@/utils/clientRequest'
import { useQueryParams } from '@/@core/hooks/useQueryParams'
import { menuUrls } from '@/@menu/utils/menuUrls'
import { translateReplacer } from '@/utils/translateReplacer'

const columnHelper = createColumnHelper<WithActions<components['schemas']['SliderResource']>>()

type selectedItemType = {
  id: number | undefined
  status: 'deleting' | 'toggling'
}

const BannersListTable = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Vars

  const router = useRouter()

  const [selectedItem, setSelectedItem] = useState<selectedItemType>()

  const deleteModalRef = useRef<ModalHandle>(null)

  const toggleModalRef = useRef<ModalHandle>(null)

  const { queryParams, setQueryParams } = useQueryParams()

  const queryClient = useQueryClient()

  const { data, isFetching: isLoadingBannersList } = useFetch().useQuery('get', '/banner', {
    params: {
      query: queryParams
    }
  })

  const { mutateAsync: deleteBanner, isPending: isDeletingBanner } = useFetch().useMutation(
    'delete',
    '/banner/{banner}'
  )

  const { mutateAsync: toggleBanner, isPending: isTogglingBanner } = useFetch().useMutation(
    'post',
    '/banner/toggle/{banner}'
  )

  const keywordsTranslate = dictionary.keywords

  const modalTranslate = dictionary.modal

  const columns = useMemo<ColumnDef<WithActions<components['schemas']['SliderResource']>, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: keywordsTranslate.title,
        cell: ({ row }) => {
          return (
            <Typography className='font-medium' color='text.primary'>
              {row.original.title}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('published', {
        header: keywordsTranslate.status,
        cell: ({ row }) => (
          <Chip
            label={row.original.published?.label}
            variant='tonal'
            color={row.original.published?.color as ThemeColor}
            size='small'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: keywordsTranslate.actions,
        cell: ({ row }) => {
          return (
            <div className='flex items-center'>
              <CustomIconButton
                size='small'
                title={keywordsTranslate.edit}
                href={menuUrls.content_management.banner.edit.replace(':id', row.original.id.toString())}
              >
                <i className='ri-edit-box-line text-[22px] text-textSecondary' />
              </CustomIconButton>
              <CustomIconButton
                size='small'
                title={keywordsTranslate.delete}
                onClick={() => {
                  setSelectedItem({ id: row.original.id ?? 0, status: 'deleting' })
                  deleteModalRef.current?.open()
                }}
              >
                <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
              </CustomIconButton>
              <CustomIconButton
                size='small'
                title={keywordsTranslate.toggle}
                onClick={() => {
                  setSelectedItem({ id: row.original.id, status: 'toggling' })
                  toggleModalRef.current?.open()
                }}
              >
                <i className='ri-switch-line text-[22px] text-textSecondary' />
              </CustomIconButton>
            </div>
          )
        }
      })
    ],
    [data]
  )

  // Actions

  const handleDeleteBanner = async () => {
    await deleteBanner({
      params: {
        path: {
          banner: selectedItem?.id ?? 0
        }
      }
    })
      .then(res => {
        toast.success(res.message)

        deleteModalRef.current?.close()

        if (data?.data?.length === 1) {
          setQueryParams(queryParams => ({ ...queryParams, page: (queryParams?.page ?? 0) - 1 }))
          router.push(`?${qs.stringify({ ...queryParams, page: (queryParams?.page ?? 0) - 1 })}`)
        }
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/banner',
            {
              params: {
                query: queryParams
              }
            }
          ]
        })
      })
  }

  const handleToggleBanner = async () => {
    await toggleBanner({
      params: {
        path: {
          banner: selectedItem?.id ?? 0
        }
      }
    })
      .then(res => {
        toast.success(res.message)

        toggleModalRef.current?.close()

        if (data?.data?.length === 1) {
          setQueryParams(queryParams => ({ ...queryParams, page: (queryParams?.page ?? 0) - 1 }))
          router.push(`?${qs.stringify({ ...queryParams, page: (queryParams?.page ?? 0) - 1 })}`)
        }
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/banner',
            {
              params: {
                query: queryParams
              }
            }
          ]
        })
      })
  }

  return (
    <Card>
      <Table
        columns={columns}
        data={data}
        debouncedInputPlaceholder={`${keywordsTranslate.search} ${keywordsTranslate.banner}`}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        pagination={{
          pageIndex: (queryParams?.page ?? 1) - 1,
          pageSize: queryParams?.page_limit
        }}
        listTitle={keywordsTranslate.banners}
        addUrl={menuUrls.content_management.banner.add}
        isLoading={isLoadingBannersList}
      />
      <DeleteModal
        ref={deleteModalRef}
        title={`${keywordsTranslate.delete} ${keywordsTranslate.banner}`}
        handleConfirm={handleDeleteBanner}
        isLoadingConfirmation={isDeletingBanner}
      >
        {translateReplacer(modalTranslate.delete, `${keywordsTranslate.banner}`)}
      </DeleteModal>
      <ToggleModal
        ref={toggleModalRef}
        title={`${keywordsTranslate.toggle} ${keywordsTranslate.banner}`}
        handleConfirm={handleToggleBanner}
        isLoadingConfirmation={isTogglingBanner}
      >
        {translateReplacer(modalTranslate.toggle, keywordsTranslate.banner)}
      </ToggleModal>
    </Card>
  )
}

export default BannersListTable
