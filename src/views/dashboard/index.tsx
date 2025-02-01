'use client'
import React from 'react'

import { Card, CardContent, CardHeader, Grid, lighten, useTheme } from '@mui/material'

import { type ApexOptions } from 'apexcharts'

import HorizontalWithBorder from '@/components/card-statistics/HorizontalWithBorder'

import { type getDictionary } from '@/utils/getDictionary'
import OptionMenu from '@/@core/components/option-menu'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import { ClicksChart, ProductsMergeStatusChart, RecentClicks } from './components'

const deliveryExceptionsChartSeries = [13, 25, 22, 40]

const Dashboard = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const { dashboard_page, keywords } = dictionary

  const theme = useTheme()

  const options: ApexOptions = {
    labels: ['Incorrect address', 'Weather conditions', 'Federal Holidays', 'Damage during transit'],
    stroke: {
      width: 0
    },
    colors: [
      'var(--mui-palette-success-main)',
      lighten(theme.palette.success.main, 0.2),
      lighten(theme.palette.success.main, 0.4),
      lighten(theme.palette.success.main, 0.6)
    ],
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
              label: 'AVG. Exceptions',
              color: 'var(--mui-palette-text-secondary)',
              formatter() {
                return '30%'
              }
            }
          }
        }
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid xs={12} md={6} item container spacing={6}>
        <Grid item xs={12} lg={6}>
          <HorizontalWithBorder
            title={dashboard_page.top_product}
            color='primary'
            avatarIcon='ri-box-3-line'
            value={keywords.product}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <HorizontalWithBorder
            title={dashboard_page.top_category}
            color='success'
            avatarIcon='ri-folders-line'
            value={keywords.category}
          />
        </Grid>
        <ClicksChart />
        <ProductsMergeStatusChart />
      </Grid>
      <Grid xs={12} md={6} item>
        <RecentClicks />
      </Grid>
    </Grid>
  )
}

export default Dashboard
