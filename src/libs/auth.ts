// Next Imports
import { cookies } from 'next/headers'

// Utils Imports
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

import apiClient from '@/utils/service'

export const authOptions = () => {
  return {
    providers: [
      Credentials({
        id: 'login',
        name: 'Credentials',
        credentials: {
          email: { label: 'email', type: 'text' },
          password: { label: 'password', type: 'password' }
        },
        async authorize(credentials) {
          const { email, password } = credentials as { email: string; password: string }

          const payload = { email, password }

          try {
            const res = await apiClient.post(`${process.env.API_URL}/auth/login`, payload)

            const data = res.data

            if (data) {
              return { ...data }
            }
          } catch (error: any) {
            throw new Error(error?.message)
          }
        }
      }),

      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
      })
    ],

    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60
    },

    pages: {
      signIn: '/login'
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token = { ...user }
        }

        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user = {
            id: token.id as number,
            firstName: token.firstName as string,
            lastName: token.lastName as string,
            email: token.email as string,
            role: token.role as string,
            status: token.status as string,
            createdAt: token.createdAt as string
          }
          session.accessToken = token.token as string
        }

        return session
      }
    },

    cookies: {
      sessionToken: {
        name: 'auth-token',
        options: {
          httpOnly: false,
          path: '/'
        }
      }
    },

    secret: process.env.NEXTAUTH_SECRET
  } satisfies NextAuthOptions
}
