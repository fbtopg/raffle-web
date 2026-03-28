'use client'

import { useState, useEffect, useCallback } from 'react'
import { Ticket } from '@/lib/types'
import { GURUFIN_API_URL, AUTO_REFRESH_INTERVAL_TICKETS } from '@/lib/constants'

export function useTickets(walletAddress: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    if (!walletAddress) {
      setTickets([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${GURUFIN_API_URL}/api/v1/tickets?wallet=${walletAddress}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }

      const data = await response.json()
      setTickets(data.tickets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress) {
      fetchTickets()

      const interval = setInterval(fetchTickets, AUTO_REFRESH_INTERVAL_TICKETS)
      return () => clearInterval(interval)
    }
  }, [walletAddress, fetchTickets])

  const getUserTickets = (raffleId?: number) => {
    if (raffleId) {
      return tickets.filter((t) => t.raffleId === raffleId)
    }
    return tickets
  }

  const getActiveTickets = () => {
    return tickets.filter((t) => t.status === 'active')
  }

  const getWonTickets = () => {
    return tickets.filter((t) => t.status === 'won')
  }

  return {
    tickets,
    userTickets: getUserTickets(),
    activeTickets: getActiveTickets(),
    wonTickets: getWonTickets(),
    isLoading,
    error,
    refetch: fetchTickets,
    getUserTickets,
  }
}
