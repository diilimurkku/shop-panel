// MUI Imports
import { Grid } from '@mui/material'

// Type Imports
import type { Locale } from '@/configs/i18n'

// Utils Imports
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import BannersListTable from '@/views/content-management/banners/list/BannersListTable'

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang)

  return (
    <Grid item xs={12}>
      <BannersListTable dictionary={dictionary} />
    </Grid>
  )
}

export default Page
