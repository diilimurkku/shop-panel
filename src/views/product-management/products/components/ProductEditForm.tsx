'use client'
import React, { useEffect } from 'react'

import { Card, CardContent, FormLabel, Grid, LinearProgress, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'

import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import { type getDictionary } from '@/utils/getDictionary'
import TextField from '@/@core/components/textField'
import { translateReplacer } from '@/utils/translateReplacer'
import DropZone from '@/@core/components/dropzone/DropZone'
import { useFetch } from '@/utils/clientRequest'

const ProductEditForm = ({
  dictionary,
  id
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  id?: number
}) => {
  const keywordsTranslate = dictionary?.keywords

  const inputTranslate = dictionary?.input

  const productTranslate = dictionary?.product_management.products

  const schema = z.object({})

  const { data: singleProductData, isLoading: isLoadingSingleProductData } = useFetch().useQuery(
    'get',
    '/product-interface/{productInterface}',
    {
      params: {
        path: {
          productInterface: id ?? 0
        }
      }
    },
    {
      enabled: !!id
    }
  )

  const singleProduct = singleProductData?.data

  useEffect(() => {
    if (singleProduct) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProduct])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {}
  })

  if (id && isLoadingSingleProductData) {
    return <LinearProgress />
  }

  return (
    <Grid container spacing={6}>
      <Grid xs={12} item>
        <form
          noValidate
          autoComplete='off'

          // onSubmit={handleSubmit(onSubmit)}
        >
          <Grid spacing={6} container>
            <Grid item xs={12}>
              <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
                <div>
                  <Typography variant='h4' className='mbe-1'>
                    {productTranslate.edit_product_title}
                  </Typography>
                </div>
                <div className='flex flex-wrap max-sm:flex-col gap-4'>
                  <LoadingButton
                    variant='contained'
                    type='submit'

                    // loading={isAddingCategory || isEditingCategory}
                  >
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
                      {/* <Controller
                        name='title'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            autoFocus
                            type='text'
                            placeholder={translateReplacer(inputTranslate.placeholder, keywordsTranslate.title)}
                            label={keywordsTranslate.title}
                            onChange={event => {
                              field.onChange(event.target.value)
                              setValue('seo_title', event.target.value)
                            }}
                            {...(errors.title && { error: true, helperText: errors.title.message })}
                          />
                        )}
                      /> */}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4} display={'flex'} flexDirection={'column'} rowGap={5}>
              <Card>
                <CardContent>
                  <Grid container spacing={5} className=''>
                    {/* <Grid item xs={12} display={'flex'} flexDirection={'column'} rowGap={2}>
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
                              id ? (singleCategory?.image?.mime_type as ImageMimeType | VideoMimeType) : undefined
                            }
                            setFiles={(images: any) => field.onChange(images[0])}
                            type='image'
                            error={!!errors.image}
                          />
                        )}
                      />

                      {errors.image && <FormHelperText error>{errors.image?.message}</FormHelperText>}
                    </Grid> */}
                  </Grid>
                </CardContent>
              </Card>
              {/* <Card>
                <CardContent>
                  <Grid display={'flex'} flexDirection={'column'} rowGap={4}>
                    <Typography>{keywordsTranslate.seo}</Typography>
                    <Grid container spacing={5}>
                      {id && (
                        <Grid item xs={12}>
                          <Controller
                            name='slug'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                placeholder={translateReplacer(inputTranslate.placeholder, keywordsTranslate.slug)}
                                label={keywordsTranslate.slug}
                                {...(errors.slug && { error: true, helperText: errors.slug.message })}
                              />
                            )}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Controller
                          name='seo_title'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='text'
                              placeholder={translateReplacer(inputTranslate.placeholder, keywordsTranslate.title)}
                              label={keywordsTranslate.title}
                              {...(errors?.seo_title && { error: true, helperText: errors?.seo_title?.message })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='seo_description'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              rows={3}
                              type='text'
                              placeholder={translateReplacer(inputTranslate.placeholder, keywordsTranslate.description)}
                              label={keywordsTranslate.description}
                              {...(errors?.seo_description && {
                                error: true,
                                helperText: errors?.seo_description?.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <Controller
                            name='seo_keywords'
                            control={control}
                            render={({ field }) => {
                              return (
                                <AutoComplete
                                  {...field}
                                  {...(errors.seo_keywords && { error: true, helperText: errors.seo_keywords.message })}
                                  open={false}
                                  freeSolo={true}
                                  value={field.value ? formatStringToArray(field.value) : []}
                                  onChange={(_, data) => field.onChange(formatArrayToString(data as string[]))}
                                  ref={keywordsRef}
                                  options={[]}
                                  label={`${keywordsTranslate.keywords}`}
                                  placeholder={translateReplacer(
                                    inputTranslate.placeholder,
                                    keywordsTranslate.keywords
                                  )}
                                  multiple
                                  renderTags={(value: any, getTagProps) => {
                                    return value?.map((option: string, index: number) => {
                                      const { key, ...tagProps } = getTagProps({ index })

                                      return <Chip variant='outlined' label={option} key={key} {...tagProps} />
                                    })
                                  }}
                                />
                              )
                            }}
                          />
                          {errors.seo_keywords && <FormHelperText error>{errors.seo_keywords?.message}</FormHelperText>}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card> */}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}

export default ProductEditForm
