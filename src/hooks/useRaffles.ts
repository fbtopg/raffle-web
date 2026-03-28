'use client'

import { useState, useEffect, useCallback } from 'react'
import { Raffle } from '@/lib/types'
import { GURUFIN_API_URL, AUTO_REFRESH_INTERVAL_RAFFLES } from '@/lib/constants'

export function useRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRaffles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${GURUFIN_API_URL}/api/v1/catalog/raffles`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch raffles')
      }

      const data = await response.json()
      setRaffles(data.raffles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRaffles()

    const interval = setInterval(fetchRaffles, AUTO_REFRESH_INTERVAL_RAFFLES)
    return () => clearInterval(interval)
  }, [fetchRaffles])

  const getActiveRaffles = () => {
    return raffles.filter((r) => r.status === 'active')
  }

  const getFinishedRaffles = () => {
    return raffles.filter((r) => r.status === 'finished')
  }

  const getRaffleById = (id: number) => {
    return raffles.find((r) => r.id === id)
  }

  return {
    raffles,
    activeRaffles: getActiveRaffles(),
    finishedRaffles: getFinishedRaffles(),
    isLoading,
    error,
    refetch: fetchRaffles,
    getRaffleById,
  }
}
