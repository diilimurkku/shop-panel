'use client'

import React from 'react'

import { LinearProgress } from '@mui/material'

import { useFetch } from '@/utils/clientRequest'

const SplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useFetch().useQuery('get', '/splash-admin', {
    params: {
      query: {
        admin_version: '1.0.0',
        browser: 'other'
      }
    }
  })

  if (isLoading) return <LinearProgress />

  return <>{children}</>
}

export default SplashProvider
