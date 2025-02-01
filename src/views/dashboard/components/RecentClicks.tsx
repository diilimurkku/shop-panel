import React from 'react'

import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

import OptionMenu from '@/@core/components/option-menu'
import { useGetDictionary } from '@/utils/useGetDictionary'

type DataType = {
  name: string
  category: string
  date: string
}

// Vars
const data: DataType[] = [
  { name: 'Jordan Stevenson', category: 'Business Intelligence', date: new Date().toDateString() },
  { name: 'Bentlee Emblin', category: 'Digital Marketing', date: new Date().toDateString() },
  { name: 'Benedetto Rossiter', category: 'UI/UX Design', date: new Date().toDateString() },
  { name: 'Beverlie Krabbe', category: 'Vue', date: new Date().toDateString() }
]

const RecentClicks = () => {
  const dictionary = useGetDictionary()

  const dashboardTranslate = dictionary?.dashboard_page

  const keywordsTranslate = dictionary?.keywords

  return (
    <Card className='bs-full'>
      <CardHeader title={dashboardTranslate?.recent_clicks} />
      <Divider />
      <div className='flex justify-between plb-4 pli-5'>
        <Typography variant='overline'>{keywordsTranslate?.product_name}</Typography>
        <Typography variant='overline'>{keywordsTranslate?.date}</Typography>
      </div>
      <Divider />
      <CardContent className='flex flex-col gap-4'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <div className='flex justify-between items-center is-full gap-4'>
              <div className='flex flex-col gap-1'>
                <Typography className='font-medium' color='text.primary'>
                  {item.name}
                </Typography>
                <Typography>{item.category}</Typography>
              </div>
              <Typography color='text.primary'>{item.date}</Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentClicks
