'use client'

// MUI Imports
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

// Third-party Imports
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { FieldError } from 'react-hook-form'

// Type Imports
import type { bannerFormDataType } from '../schemas'
import type { getDictionary } from '@/utils/getDictionary'

// Util Imports
import { useSplash } from '@/@core/hooks/useSplash'
import { translateReplacer } from '@/utils/translateReplacer'

type BannerDataType = {
  btn_types?: string[]
  btn_styles?: string[]
  sizes?: {
    label: string
    value: string
  }[]
}

const BannersButtonForm = ({
  dictionary,
  bannerFieldsData
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  bannerFieldsData?: BannerDataType
}) => {
  // Vars
  const keywordsTranslate = dictionary.keywords

  const bannerTranslate = dictionary.content_management.banners

  const inputTranslate = dictionary.input

  // Hooks

  const splash = useSplash()

  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext<bannerFormDataType>()

  const buttonRows: bannerFormDataType['buttons'] = useWatch({ name: 'buttons' })

  // Functions

  const handleRemoveButton = (index: number) => {
    if (buttonRows?.length) {
      setValue(
        'buttons',
        buttonRows?.filter((_, buttonIndex) => index !== buttonIndex)
      )
    }
  }

  const handleAddButton = () => {
    if (buttonRows?.length) {
      setValue('buttons', [
        ...buttonRows,
        {
          title:
            splash?.supported_locales?.map(locale => {
              return {
                locale: locale?.value,
                value: undefined
              }
            }) ?? ([] as any),
          type: undefined as any,
          style: undefined as any,
          link: undefined as any
        }
      ])
    } else {
      setValue('buttons', [
        {
          title:
            splash?.supported_locales?.map(locale => {
              return {
                locale: locale?.value,
                value: undefined
              }
            }) ?? ([] as any),
          type: undefined as any,
          style: undefined as any,
          link: undefined as any
        }
      ])
    }
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography>{bannerTranslate?.buttons_title}</Typography>
            </Grid>
            {buttonRows?.map((_, buttonIndex) => {
              return (
                <>
                  {splash?.supported_locales?.map((title, titleIndex) => {
                    return (
                      <Grid key={titleIndex} item xs={12} md={6} lg={4}>
                        <FormControl fullWidth error={!!errors.buttons?.[buttonIndex]?.title?.[titleIndex]?.value}>
                          <Controller
                            name={`buttons.${buttonIndex}.title.${titleIndex}.value`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => {
                              return (
                                <TextField
                                  label={`${bannerTranslate.button_title} ( ${title?.label} )`}
                                  InputLabelProps={{
                                    shrink: !!(
                                      field.value || errors?.buttons?.[buttonIndex]?.title?.[titleIndex]?.value
                                    )
                                  }}
                                  fullWidth
                                  {...field}
                                  {...(errors?.buttons?.[buttonIndex]?.title?.[titleIndex]?.value && {
                                    error: true,
                                    helperText: errors?.buttons?.[buttonIndex]?.title?.[titleIndex]?.value?.message
                                  })}
                                />
                              )
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )
                  })}
                  <Grid key={buttonIndex} item xs={12} md={6} lg={4}>
                    <FormControl fullWidth error={!!errors.buttons?.[buttonIndex]?.type}>
                      <InputLabel>{bannerTranslate.button_type}</InputLabel>
                      <Controller
                        name={`buttons.${buttonIndex}.type`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => {
                          return (
                            <Select {...field} value={field?.value ?? ''} fullWidth label={bannerTranslate.button_type}>
                              {bannerFieldsData?.btn_types?.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          )
                        }}
                      />
                      {errors.buttons?.[buttonIndex]?.type && (
                        <FormHelperText error>
                          {(errors?.buttons?.[buttonIndex]?.type as FieldError)?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid key={buttonIndex} item xs={12} md={6} lg={4}>
                    <FormControl fullWidth error={!!errors.buttons?.[buttonIndex]?.style}>
                      <InputLabel>{bannerTranslate.button_style}</InputLabel>
                      <Controller
                        name={`buttons.${buttonIndex}.style`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => {
                          return (
                            <Select
                              {...field}
                              fullWidth
                              value={field?.value ?? ''}
                              label={bannerTranslate.button_style}
                            >
                              {bannerFieldsData?.btn_styles?.map((style, index) => (
                                <MenuItem key={index} value={style}>
                                  {style}
                                </MenuItem>
                              ))}
                            </Select>
                          )
                        }}
                      />
                      {errors.buttons?.[buttonIndex]?.style && (
                        <FormHelperText error>
                          {(errors?.buttons?.[buttonIndex]?.style as FieldError)?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid key={buttonIndex} item xs={12} md={6} lg={4}>
                    <FormControl fullWidth error={!!errors.buttons?.[buttonIndex]?.link}>
                      <Controller
                        name={`buttons.${buttonIndex}.link`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => {
                          return (
                            <TextField
                              {...field}
                              fullWidth
                              type='text'
                              InputLabelProps={{
                                shrink: !!(field.value || errors.buttons?.[buttonIndex]?.link)
                              }}
                              placeholder={translateReplacer(inputTranslate.placeholder, keywordsTranslate.link)}
                              label={keywordsTranslate.link}
                              {...(errors.buttons?.[buttonIndex]?.link && {
                                error: true,
                                helperText: errors.buttons?.[buttonIndex]?.link?.message
                              })}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid display={'flex'} justifyContent={'flex-end'} item xs={12} md={6} lg={4}>
                    <Button
                      variant='contained'
                      color='error'
                      className='md:!w-[50%] !w-full !h-[56px]'
                      onClick={() => handleRemoveButton(buttonIndex)}
                      disabled={buttonRows.length === 1}
                    >
                      <i className='ri-delete-bin-7-line' />
                    </Button>
                  </Grid>
                </>
              )
            })}
            <Grid item xs={12}>
              <Button variant='outlined' fullWidth onClick={handleAddButton}>
                {keywordsTranslate.add} {keywordsTranslate.button}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default BannersButtonForm
