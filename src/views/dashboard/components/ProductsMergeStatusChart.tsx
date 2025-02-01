import React from 'react'

import { Card, CardContent, CardHeader, Grid, lighten, useTheme } from '@mui/material'

import { type ApexOptions } from 'apexcharts'

import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import { useGetDictionary } from '@/utils/useGetDictionary'

const mergeProductsStatusSeries = [13, 25]

const ProductsMergeStatusChart = () => {
  const theme = useTheme()

  const dictionary = useGetDictionary()

  const dashboardTranslate = dictionary?.dashboard_page

  const keywordsTranslate = dictionary?.keywords

  const options: ApexOptions = {
    labels: [dashboardTranslate?.merged ?? '', dashboardTranslate?.unmerged ?? ''],
    stroke: {
      width: 0
    },
    colors: ['var(--mui-palette-info-main)', lighten(theme.palette.info.main, 0.5)],
    dataLabels: {
      enabled: false,
      formatter(val: string) {
        return `${Number.parseInt(val)}%`
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      },
      fontSize: '13px',
      fontWeight: 400,
      labels: {
        colors: 'var(--mui-palette-text-primary)',
        useSeriesColors: false
      }
    },
    grid: {
      padding: {
        top: 15
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            value: {
              fontSize: '24px',
              color: 'var(--mui-palette-text-primary)',
              fontWeight: 500,
              offsetY: -20
            },
            name: { offsetY: 20 },
            total: {
              show: true,
              fontSize: '0.9375rem',
              fontWeight: 400,
              label: dashboardTranslate?.total_products,
              color: 'var(--mui-palette-text-secondary)'
            }
          }
        }
      }
    }
  }

  return (
    <Grid item xs={12} lg={6}>
      <Card>
        <CardHeader title={keywordsTranslate?.products} />
        <CardContent>
          <AppReactApexCharts
            type='donut'
            height={441}
            width='100%'
            series={mergeProductsStatusSeries}
            options={options}
          />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default ProductsMergeStatusChart
