import { z } from 'zod'

import { type getDictionary } from '@/utils/getDictionary'

// Define a function that takes keywordsTranslate as a parameter

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/

export const schema = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => {
  const keywordsTranslate = dictionary.keywords

  const bannerTranslate = dictionary.content_management.banners

  return z.object({
    title: z.string({ required_error: `${keywordsTranslate.title} ${keywordsTranslate.isRequired}` }),
    description: z.string().optional(),
    published: z.number({ required_error: `${keywordsTranslate.status} ${keywordsTranslate.isRequired}` }),
    size: z.string({ required_error: `${keywordsTranslate.size} ${keywordsTranslate.isRequired}` }),
    buttons: z
      .array(
        z.object({
          title: z.array(
            z.object({
              locale: z.string(),
              value: z.string({ required_error: `${bannerTranslate.button_title} ${keywordsTranslate.isRequired}` })
            })
          ),
          type: z.string({ required_error: `${bannerTranslate.button_type} ${keywordsTranslate.isRequired}` }),
          style: z.string({ required_error: `${bannerTranslate.button_style} ${keywordsTranslate.isRequired}` }),
          link: z.string({ required_error: `${keywordsTranslate.link} ${keywordsTranslate.isRequired}` })
        })
      )
      .optional(),
    background_color: z
      .string({
        required_error: `${keywordsTranslate.background_color} ${keywordsTranslate.isRequired}`
      })
      .regex(hexColorRegex, `${keywordsTranslate.background_color} ${keywordsTranslate.isNotValid}`),
    image: z
      .union([
        z.string({ required_error: `${keywordsTranslate.image} ${keywordsTranslate.isRequired}` }),
        z.instanceof(File, { message: `${keywordsTranslate.type} ${keywordsTranslate.isRequired}` })
      ])
      .optional(),
    pattern: z
      .union([
        z.string({ required_error: `${keywordsTranslate.image} ${keywordsTranslate.isRequired}` }),
        z.instanceof(File, { message: `${keywordsTranslate.type} ${keywordsTranslate.isRequired}` })
      ])
      .optional()
  })
}

export type FormData = z.infer<ReturnType<typeof schema>>
