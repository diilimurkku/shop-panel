// MUI Imports
import { Grid } from '@mui/material'

// Components Imports
import BannersForm from '@/views/content-management/banners/components/BannersForm'

// Type Imports
import type { Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params?.lang)

  return (
    <Grid>
      <BannersForm dictionary={dictionary} />
    </Grid>
  )
}

export default Page
