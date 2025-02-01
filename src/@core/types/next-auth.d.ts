import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      firstName: string
      lastName: string
      email: string
      role: string
      status: string
      createdAt: string
    }
    accessToken?: string
  }
  interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
    createdAt: string
  }
}
