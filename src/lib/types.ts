// Raffle System Types

export interface Raffle {
  id: number
  name: string
  description: string
  prize: number
  ticketsSold: number
  totalTickets: number
  endTime: Date
  status: 'active' | 'finished'
}

export interface RaffleEntry {
  raffleId: number
  tickets: number
  wallet: string
}

export interface Ticket {
  id: number
  raffleId: number
  ticketNumber: number
  entryTime: Date
  status: 'active' | 'won' | 'lost'
  wonAmount?: number
}

export interface PointBalance {
  balance: number
  dailyCap: number
  dailyUsed: number
  lastUpdated: Date
}

export interface PointTransaction {
  id: number
  type: 'earn' | 'burn' | 'redeem'
  amount: number
  timestamp: Date
  description: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: Date
}
