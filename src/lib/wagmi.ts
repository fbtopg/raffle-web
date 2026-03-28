import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai, arbitrum, arbitrumSepolia, base, baseSepolia } from 'wagmi/chains'
import { rainbowkit } from 'wagmi/connectors'

export const config = createConfig({
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
  connectors: [rainbowkit()],
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

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
