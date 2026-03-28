'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai, arbitrum, arbitrumSepolia, base, baseSepolia } from 'wagmi/chains'
import { http } from 'wagmi'
import { RainbowKitProvider, darkTheme, lightTheme, defaultColors } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
})

const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    polygon,
    polygonMumbai,
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={isDarkMode ? darkTheme({
            accentColor: '#6760f5',
            accentColorBackground: '#1b1a33',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
            textColor: isDarkMode ? '#ffffff' : '#000000',
            secondaryTextColor: isDarkMode ? '#a1a1aa' : '#52525b',
            actionColor: '#6760f5',
            disconnectedBannerColor: '#1b1a33',
            colors: {
              connectButton: '#6760f5',
              connectButtonInner: '#ffffff',
            },
          }) : lightTheme({
            accentColor: '#6760f5',
            accentColorBackground: '#edeaf8',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
            textColor: isDarkMode ? '#ffffff' : '#000000',
            secondaryTextColor: isDarkMode ? '#a1a1aa' : '#52525b',
            actionColor: '#6760f5',
            disconnectedBannerColor: '#edeaf8',
            colors: {
              connectButton: '#6760f5',
              connectButtonInner: '#ffffff',
            },
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
