import React from 'react'

import { type Locale } from '@/configs/i18n'
import ProductsListTable from '@/views/products'
import { getDictionary } from '@/utils/getDictionary'

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang)

  return <ProductsListTable dictionary={dictionary} />
}

export default Page
