'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export interface WalletState {
  isConnected: boolean
  address: string | null
}

export function useWallet(): WalletState {
  const { isConnected, address } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    isConnected,
    address: address || null,
  }
}
