import type { Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import Dashboard from '@/views/dashboard'

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang)

  return <Dashboard dictionary={dictionary} />
}

export default Page
