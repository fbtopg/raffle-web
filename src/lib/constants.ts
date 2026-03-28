// Raffle System Constants

export const TICKET_COST = 25 // points per ticket
export const DAILY_CAP = 60 // points per day (Day 1-60)
export const MAX_DAILY_TICKETS = Math.floor(DAILY_CAP / TICKET_COST) // 2 tickets
export const BOOST_MULTIPLIER = 1.25 // 25% bonus
export const AUTO_REFRESH_INTERVAL_POINTS = 30000 // 30 seconds
export const AUTO_REFRESH_INTERVAL_RAFFLES = 60000 // 60 seconds
export const AUTO_REFRESH_INTERVAL_TICKETS = 30000 // 30 seconds

export const GURUFIN_API_URL = process.env.NEXT_PUBLIC_GURUFIN_API_URL || 'https://api.gurufin.com'

export const BOOST_TOKENS = ['KRGX', 'JPGX', 'EUGX', 'PHGX', 'IDGX'] as const

export type BoostToken = (typeof BOOST_TOKENS)[number]
