'use client'
import React from 'react'

import { Card, CardContent, CardHeader, Grid, useTheme } from '@mui/material'

import { type ApexOptions } from 'apexcharts'

import HorizontalWithBorder from '@/components/card-statistics/HorizontalWithBorder'

import { type getDictionary } from '@/utils/getDictionary'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import { ClicksChart, ProductsMergeStatusChart, RecentClicks } from './components'

const series = [
  {
    name: 'Shipment',
    type: 'column',
    data: [38, 45, 33, 38, 32, 48, 45, 40, 42, 37]
  },
  {
    name: 'Delivery',
    type: 'line',
    data: [23, 28, 23, 32, 25, 42, 32, 32, 26, 24]
  }
]

const Dashboard = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const { dashboard_page, keywords } = dictionary

  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    markers: {
      size: 5,
      colors: '#fff',
      strokeColors: 'var(--mui-palette-primary-main)',
      hover: {
        size: 6
      },
      radius: 4
    },
    stroke: {
      curve: 'smooth',
      width: [0, 3],
      lineCap: 'round'
    },
    legend: {
      show: true,
      position: 'bottom',
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      height: 40,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      fontSize: '15px',
      fontFamily: 'Open Sans',
      fontWeight: 400,
      labels: {
        colors: 'var(--mui-palette-text-primary)'
      },
      offsetY: 10
    },
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)'
    },
    colors: ['var(--mui-palette-warning-main)', 'var(--mui-palette-primary-main)'],
    fill: {
      opacity: [1, 1]
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      tickAmount: 10,
      categories: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan'],
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
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
      <Grid xs={12} item>
        <Card>
          <CardHeader title='Shipment Statistics' subheader='Total number of deliveries 23.8k' />
          <CardContent>
            <AppReactApexCharts
              id='shipment-statistics'
              type='line'
              height={313}
              width='100%'
              series={series}
              options={options}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
