'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

// third-party Imports
import type { FieldError, SubmitHandler } from 'react-hook-form'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { ImageMimeType, VideoMimeType } from '@/@core/types'
import type { bannerFormDataType } from '../schemas'

// Util Imports
import { useFetch } from '@/utils/clientRequest'
import { useStatuses } from '@/@core/hooks/useStatuses'
import { translateReplacer } from '@/utils/translateReplacer'
import { setFormErrors } from '@/utils/setFormErrors'
import { menuUrls } from '@/@menu/utils/menuUrls'
import { bannerSchema } from '../schemas'
import { useSplash } from '@/@core/hooks/useSplash'

// Component Imports
import DropZone from '@/@core/components/dropzone/DropZone'
import BannersButtonForm from './BannersButtonForm'

const BannersForm = ({ dictionary, id }: { dictionary: Awaited<ReturnType<typeof getDictionary>>; id?: number }) => {
  const keywordsTranslate = dictionary?.keywords

  const inputTranslate = dictionary?.input

  // Schema

  const schema = bannerSchema(dictionary)

  // Hooks

  const splash = useSplash()

  const statuses = useStatuses()

  const router = useRouter()

  const { data: singleBannerData, isFetching: isLoadingSingleBanner } = useFetch().useQuery(
    'get',
    '/banner/{banner}',
    {
      params: {
        path: {
          banner: id ?? 0
        }
      }
    },
    {
      enabled: !!id
    }
  )

  const singleBanner = singleBannerData?.data

  const { data: bannerData } = useFetch().useQuery('get', '/banner/data')

  const bannerFieldsData = bannerData?.data

  useEffect(() => {
    if (singleBanner) {
      setValue('title', singleBanner?.title ?? '')
      setValue('description', singleBanner?.description ?? '')
      setValue('published', singleBanner?.published?.value ? 1 : 0)
      setValue('size', singleBanner?.size ?? '')
      setValue('background_color', singleBanner?.background_color ?? '')
      setValue('buttons', singleBanner.buttons ?? ([] as any))
      setValue('image', singleBanner?.image?.original_url ?? '')
      setValue('pattern', singleBanner?.pattern?.original_url ?? '')
    } else {
      reset()
    }
  }, [singleBanner])

  const { mutateAsync: addBanner, isPending: isAddingBanner } = useFetch().useMutation('post', '/banner')

  const { mutateAsync: editBanner, isPending: isEditingBanner } = useFetch().useMutation('put', '/banner/{banner}')

  const method = useForm<bannerFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      buttons: [
        {
          title: splash?.supported_locales?.map(locale => {
            return {
              locale: locale?.value,
              value: undefined
            }
          }),
          type: undefined,
          style: undefined,
          link: undefined
        }
      ],
      published: 1
    }
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    control,
    reset
  } = method

  // Functions

  const onSubmit: SubmitHandler<bannerFormDataType> = async (data: bannerFormDataType) => {
    const formData = new FormData()

    formData.append('title', data?.title)
    formData.append('published', data?.published.toString())
    formData.append('description', data?.description ?? '')
    formData.append('size', data?.size)
    formData.append('background_color', data?.background_color ?? '')
    formData.append('buttons', JSON.stringify(data?.buttons ?? []))

    if (data.image && data.image instanceof File) {
      formData.append('image', data.image)
    }

    if (data.pattern && data.pattern instanceof File) {
      formData.append('pattern', data.pattern)
    }

    if (!id) {
      await addBanner({
        body: formData as any
      })
        .then(res => {
          toast.success(res.message)
          router.push(menuUrls.content_management.banner.list)
        })
        .catch(e => {
          setFormErrors(e, setError)
        })
    } else {
      editBanner({
        body: formData as any,
        params: {
          path: {
            banner: id
          }
        }
      })
        .then(res => {
          toast.success(res.message)
          router.push(menuUrls.content_management.banner.list)
        })
        .catch(e => {
          setFormErrors(e, setError)
        })
    }
  }

  if (id && isLoadingSingleBanner) {
    return <LinearProgress />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={24}>
        <FormProvider {...method}>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
                  <div>
                    <Typography variant='h4' className='mbe-1'>
                      {id
                        ? `${keywordsTranslate.edit} ${keywordsTranslate.banner}`
                        : `${keywordsTranslate.add} ${keywordsTranslate?.banner}`}
                    </Typography>
                  </div>
                  <div className='flex flex-wrap max-sm:flex-col gap-4'>
                    <LoadingButton variant='contained' type='submit' loading={isAddingBanner || isEditingBanner}>
                      {keywordsTranslate.save}
                    </LoadingButton>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Grid container spacing={5}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name='title'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => {
                            return (
                              <TextField
                                {...field}
                                fullWidth
                                autoFocus
                                type='text'
                                label={keywordsTranslate.title}
                                InputLabelProps={{
                                  shrink: !!(field.value || errors.title)
                                }}
                                {...(errors.title && { error: true, helperText: errors.title.message })}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.published}>
                          <InputLabel>{keywordsTranslate.status}</InputLabel>
                          <Controller
                            name='published'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => {
                              return (
                                <Select {...field} fullWidth label={keywordsTranslate.status}>
                                  {statuses?.map(type => (
                                    <MenuItem key={type.value} value={+type.value}>
                                      {type.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )
                            }}
                          />
                          {errors.published && <FormHelperText error>{errors.published?.message}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Controller
                          name='description'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => {
                            return (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                placeholder={translateReplacer(
                                  inputTranslate.placeholder,
                                  keywordsTranslate.description
                                )}
                                label={keywordsTranslate.description}
                                inputProps={{
                                  className: '!pb-[50px]'
                                }}
                                InputLabelProps={{
                                  shrink: !!(field.value || errors.title)
                                }}
                                {...(errors.description && { error: true, helperText: errors.description.message })}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.size}>
                          <InputLabel>{keywordsTranslate.size}</InputLabel>
                          <Controller
                            name='size'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => {
                              return (
                                <Select {...field} value={field?.value ?? ''} fullWidth label={keywordsTranslate.size}>
                                  {bannerFieldsData?.sizes?.map((size, index) => (
                                    <MenuItem key={index} value={size?.value}>
                                      {size?.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )
                            }}
                          />
                          {errors.size && (
                            <FormHelperText error>{(errors?.size as FieldError)?.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name='background_color'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => {
                            return (
                              <Box>
                                <TextField
                                  {...field}
                                  fullWidth
                                  type='text'
                                  label={keywordsTranslate.background_color}
                                  variant='outlined'
                                  error={!!errors.background_color}
                                  helperText={errors.background_color ? errors.background_color.message : ''}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position='start'>
                                        <IconButton
                                          onClick={() => document.getElementById('color-picker')?.click()}
                                          sx={{ padding: 0 }}
                                        >
                                          <i className='ri-palette-line'></i>
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <input
                                          id='color-picker'
                                          type='color'
                                          value={field.value || ''}
                                          onChange={e => field.onChange(e.target.value)}
                                          className='!bg-none'
                                          style={{
                                            background: 'none',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            WebkitAppearance: 'none', // For Webkit-based browsers (Chrome, Safari)
                                            MozAppearance: 'none' // For Firefox
                                          }}
                                        />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Box>
                            )
                          }}
                        />
                      </Grid>
                      <BannersButtonForm dictionary={dictionary} bannerFieldsData={bannerFieldsData} />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4} spacing={5}>
                <Card>
                  <CardContent>
                    <Grid container spacing={5}>
                      <Grid item xs={12} display={'flex'} flexDirection={'column'} rowGap={2}>
                        <FormLabel>{keywordsTranslate.image}</FormLabel>
                        <Controller
                          name='image'
                          control={control}
                          render={({ field }) => (
                            <DropZone
                              files={
                                field.value
                                  ? typeof field.value === 'string'
                                    ? [field.value]
                                    : [field.value as File]
                                  : []
                              }
                              mimeType={
                                id ? (singleBanner?.image?.mime_type as ImageMimeType | VideoMimeType) : undefined
                              }
                              setFiles={(images: any) => field.onChange(images[0])}
                              type='image'
                              error={!!errors.image}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} display={'flex'} flexDirection={'column'} rowGap={2}>
                        <FormLabel>{keywordsTranslate.pattern}</FormLabel>
                        <Controller
                          name='pattern'
                          control={control}
                          render={({ field }) => (
                            <DropZone
                              files={
                                field.value
                                  ? typeof field.value === 'string'
                                    ? [field.value]
                                    : [field.value as File]
                                  : []
                              }
                              mimeType={
                                id ? (singleBanner?.pattern?.mime_type as ImageMimeType | VideoMimeType) : undefined
                              }
                              setFiles={(patterns: any) => field.onChange(patterns[0])}
                              type='image'
                              error={!!errors.pattern}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Grid>
    </Grid>
  )
}

export default BannersForm
