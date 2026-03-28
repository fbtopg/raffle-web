'use client'

import { useState, useEffect, useCallback } from 'react'
import { PointBalance } from '@/lib/types'
import { GURUFIN_API_URL, AUTO_REFRESH_INTERVAL_POINTS } from '@/lib/constants'

export function usePoints(walletAddress: string | null): PointBalance & {
  isLoading: boolean
  error: string | null
  refreshBalance: () => Promise<void>
} {
  const [state, setState] = useState<PointBalance>({
    balance: 0,
    dailyCap: 60,
    dailyUsed: 0,
    lastUpdated: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPoints = useCallback(async () => {
    if (!walletAddress) {
      setState({
        balance: 0,
        dailyCap: 60,
        dailyUsed: 0,
        lastUpdated: new Date(),
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${GURUFIN_API_URL}/api/v1/points/balance?wallet=${walletAddress}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch points')
      }

      const data = await response.json()

      setState({
        balance: data.points,
        dailyCap: data.dailyCap,
        dailyUsed: data.dailyUsed,
        lastUpdated: new Date(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress) {
      fetchPoints()

      const interval = setInterval(fetchPoints, AUTO_REFRESH_INTERVAL_POINTS)
      return () => clearInterval(interval)
    }
  }, [walletAddress, fetchPoints])

  return {
    ...state,
    isLoading,
    error,
    refreshBalance: fetchPoints,
  }
}
