# Raffle System UI/UX Alignment — Season 2 → raffle-where-users

## Executive Summary

This document provides **clear UI/UX alignment instructions** for the `raffle-where-users` project based on the **Gurufin Season 2 raffle system specifications**. The focus is on **component structure**, **state management patterns**, and **user flow consistency** to ensure the raffle platform correctly implements Season 2 rules.

**Source of Truth:** `/home/geonu/workspace/projects/season2-gitbook/` (1-시즌-2-전체-흐름.md, 5-포인트-경제.md, 4-전환-모달.md)

---

## 1. Season 2 Raffle System Overview

### 1.1 User Journey (Raffle-Only Phase)

```
Day 1-60: Raffle-Only Phase
────────────────────────────

1. Earn (Guru Wallet)
   └─ Daily check-in → 15 GXN

2. Mine (Guruswap)
   └─ Buy axe (1.5 GXN) → Play game → Get gems (Miss/Silver/Gold/Diamond)

3. Swap (Guruswap)
   └─ Redeem gems → Sell for USGX → FX swap USGX → Other GX stablecoins

4. Convert Points (Point Shop)
   └─ Burn GX stablecoin → 1 token = 1 point
      └─ Boost token option: 1 token = 1.25 points (25% bonus)

5. Redeem (Raffle Where Users)
   └─ Points → Tickets (25 pts = 1 ticket) → Enter raffle → Win USDC
```

### 1.2 Key Season 2 Rules

| Rule | Specification | Implementation Priority |
|------|---------------|------------------------|
| **Ticket Cost** | 25 points per ticket | ✅ Already implemented |
| **Daily Point Cap** | 60 points/day (Day 1-60) | 🔴 Critical |
| **Point Carryover** | Unlimited accumulation (no expiry) | ✅ Already in design |
| **Boost Token** | 25% bonus on designated GX stablecoin | 🟡 High |
| **Prize Type** | USDC stablecoin | 🔴 Critical |
| **Win Determination** | VRF random selection (production) | 🟡 High |
| **Eligibility** | Active wallet (14+ days) | 🟢 Optional |

---

## 2. Component Structure

### 2.1 Recommended Component Tree

```
src/app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Wallet connection + brand
│   │   ├── WalletConnect.tsx       # Connect wallet button
│   │   └── PointBalance.tsx        # Real-time point display (top-right)
│   │
│   ├── raffle/
│   │   ├── RaffleList.tsx          # Main raffle grid
│   │   ├── RaffleCard.tsx          # Individual raffle card
│   │   ├── RaffleModal.tsx         # Entry modal with validation
│   │   ├── RaffleFilter.tsx        # Filter by status (active/finished)
│   │   └── RaffleProgress.tsx      # Progress bar + time remaining
│   │
│   ├── tickets/
│   │   ├── TicketList.tsx          # User's tickets
│   │   ├── TicketCard.tsx          # Individual ticket with status
│   │   ├── TicketStatusBadge.tsx   # Active/Won/Lost indicator
│   │   └── CheckResultButton.tsx   # "Check Result" for finished raffles
│   │
│   ├── points/
│   │   ├── PointBreakdown.tsx      # FX vs LP points display
│   │   ├── DailyCapIndicator.tsx   # "30/60 pts remaining today"
│   │   └── PointHistory.tsx        # Transaction history
│   │
│   ├── boost/
│   │   ├── BoostBadge.tsx          # "25% BONUS" badge
│   │   ├── TokenSelector.tsx       # Select GX stablecoin to burn
│   │   ├── BoostInfo.tsx           # Educational tooltip
│   │   └── PointShopModal.tsx      # Burn tokens → earn points modal
│   │
│   ├── notifications/
│   │   ├── NotificationToast.tsx   # Single toast notification
│   │   ├── NotificationProvider.tsx # Context provider
│   │   └── NotificationList.tsx    # Notification history
│   │
│   └── common/
│       ├── LoadingSpinner.tsx      # Loading state
│       ├── ErrorBoundary.tsx       # Error handling
│       ├── Button.tsx              # Reusable button
│       └── Modal.tsx               # Generic modal wrapper
│
├── hooks/
│   ├── useWallet.ts                # Wallet connection state
│   ├── usePoints.ts                # Point balance + daily cap
│   ├── useRaffles.ts               # Raffle catalog + filtering
│   ├── useTickets.ts               # User tickets + status
│   ├── useBoost.ts                 # Boost token logic
│   └── useNotifications.ts         # Toast notifications
│
├── contexts/
│   ├── WalletContext.tsx           # Wallet state provider
│   ├── PointsContext.tsx           # Points state provider
│   └── NotificationContext.tsx     # Notifications provider
│
├── lib/
│   ├── constants.ts                # Constants (TICKET_COST, DAILY_CAP, etc.)
│   ├── validators.ts               # Input validation
│   ├── utils.ts                    # Helper functions
│   └── gurufin-api.ts              # API client for Gurufin
│
└── types/
    ├── raffle.ts                   # Raffle, Ticket interfaces
    ├── points.ts                   # Point, PointTransaction types
    ├── tickets.ts                  # Ticket, TicketStatus types
    └── api.ts                      # API response types
```

### 2.2 Component Specifications

#### RaffleCard.tsx

**Purpose:** Display individual raffle with key information

**Props:**
```typescript
interface RaffleCardProps {
  id: number;
  name: string;
  description: string;
  prize: number;
  ticketsSold: number;
  totalTickets: number;
  endTime: Date;
  status: 'active' | 'finished';
  userTickets: number;
  onEnter: (raffleId: number) => void;
  onCheckResult: (raffleId: number) => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🎰 $10 Prize Raffle                     │
│ ─────────────────────────────────────── │
│ Win a $10 prize! Buy your tickets now. │
│                                         │
│ Progress: ███████░░░ 50/100 tickets     │
│ Ends in: 2d 14h 32m                     │
│                                         │
│ Your tickets: 2                         │
│ [Buy Tickets] [Check Result]            │
└─────────────────────────────────────────┘
```

**Behavior:**
- Show "Check Result" button only for `status === 'finished'`
- Show "Buy Tickets" button only for `status === 'active'`
- Progress bar: `ticketsSold / totalTickets`
- Countdown timer updates every second
- Click "Buy Tickets" → opens `RaffleModal`

#### RaffleModal.tsx

**Purpose:** Entry modal with validation and point deduction

**Props:**
```typescript
interface RaffleModalProps {
  raffleId: number;
  ticketCost: number; // 25 pts
  userPoints: number;
  dailyCapRemaining: number;
  onClose: () => void;
  onSuccess: (tickets: Ticket[]) => void;
  onError: (error: string) => void;
}
```

**Validation Flow:**
```
1. User enters number of tickets
2. Calculate cost: tickets × 25
3. Validate:
   a. Cost ≤ userPoints
   b. Cost ≤ dailyCapRemaining
   c. Wallet is connected
4. If validation fails → show error toast
5. If validation passes → deduct points, create tickets
6. Show success toast with ticket numbers
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ 🎟️ Buy Tickets for: $10 Prize Raffle   │
│ ─────────────────────────────────────── │
│                                         │
│ Tickets per entry: 25 points            │
│ Your balance: 500 points                │
│ Daily cap remaining: 60/60 pts          │
│                                         │
│ Number of tickets: [___]                │
│ Total cost: [___] points                │
│                                         │
│ [Cancel] [Confirm Purchase]             │
└─────────────────────────────────────────┘
```

#### PointBalance.tsx

**Purpose:** Display real-time point balance with daily cap

**Props:**
```typescript
interface PointBalanceProps {
  balance: number;
  dailyCap: number;
  dailyUsed: number;
  lastUpdated: Date;
}
```

**Display:**
```
┌──────────────────────────────────────┐
│ 💎 Points: 500                        │
│ Daily cap: 30/60 remaining today     │
│ Reset at: 00:00 UTC (2h 15m left)    │
└──────────────────────────────────────┘
```

**Behavior:**
- Fetch balance from Gurufin API every 30 seconds
- Update daily cap indicator in real-time
- Show countdown to next day reset

#### TicketCard.tsx

**Purpose:** Display individual ticket with status

**Props:**
```typescript
interface TicketCardProps {
  raffleId: number;
  raffleName: string;
  ticketNumber: number;
  prize: number;
  entryTime: Date;
  status: 'active' | 'won' | 'lost';
  wonAmount?: number;
}
```

**Status Indicators:**
- **Active:** Gray badge, "Waiting for results"
- **Won:** Green badge, "Won $X", "Claim Prize" button
- **Lost:** Red badge, "Better luck next time"

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ 🎰 $10 Prize Raffle                     │
│ ─────────────────────────────────────── │
│ Ticket #12345                           │
│ Entry time: 2024-03-28 14:30 UTC        │
│ Status: [Won $10]                       │
│ [Claim Prize]                           │
└─────────────────────────────────────────┘
```

---

## 3. State Management Patterns

### 3.1 Global State Architecture

```
┌─────────────────────────────────────────────────────┐
│              App Root (layout.tsx)                  │
│  ┌───────────────────────────────────────────────┐ │
│  │  WalletProvider (WalletContext)               │ │
│  │  - isConnected: boolean                       │ │
│  │  - address: string | null                     │ │
│  │  - connect(): void                            │ │
│  │  - disconnect(): void                         │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │  PointsProvider (PointsContext)               │ │
│  │  - balance: number                            │ │
│  │  - dailyCap: number                           │ │
│  │  - dailyUsed: number                          │ │
│  │  - refreshBalance(): void                     │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │  NotificationProvider (NotificationContext)   │ │
│  │  - notifications: Notification[]              │ │
│  │  - showNotification(type, message): void      │ │
│  │  - dismissNotification(id): void              │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 3.2 Custom Hooks

#### useWallet.ts

```typescript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
}

export function useWallet(): WalletState {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
  });

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      const checkConnection = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setState({
            isConnected: true,
            address: accounts[0].address,
            provider,
            signer: await provider.getSigner(),
          });
        }
      };

      checkConnection();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setState(prev => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
          }));
        } else {
          setState(prev => ({
            ...prev,
            isConnected: false,
            address: null,
          }));
        }
      });
    }
  }, []);

  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      setState({
        isConnected: true,
        address: accounts[0].address,
        provider,
        signer: await provider.getSigner(),
      });
    }
  };

  const disconnect = () => {
    setState({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
    });
  };

  return { ...state, connect, disconnect };
}
```

#### usePoints.ts

```typescript
import { useState, useEffect, useCallback } from 'react';

interface PointsState {
  balance: number;
  dailyCap: number;
  dailyUsed: number;
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

export function usePoints(walletAddress: string | null): PointsState {
  const [state, setState] = useState<PointsState>({
    balance: 0,
    dailyCap: 60,
    dailyUsed: 0,
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
  });

  const fetchPoints = useCallback(async () => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `https://api.gurufin.com/api/v1/points/balance?wallet=${walletAddress}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch points');
      }

      const data = await response.json();
      
      setState({
        balance: data.points,
        dailyCap: data.dailyCap,
        dailyUsed: data.dailyUsed,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchPoints();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchPoints, 30000);
      return () => clearInterval(interval);
    }
  }, [walletAddress, fetchPoints]);

  return state;
}
```

#### useRaffles.ts

```typescript
import { useState, useEffect, useCallback } from 'react';

export interface Raffle {
  id: number;
  name: string;
  description: string;
  prize: number;
  ticketsSold: number;
  totalTickets: number;
  endTime: Date;
  status: 'active' | 'finished';
}

export function useRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRaffles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://api.gurufin.com/api/v1/catalog/raffles'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch raffles');
      }

      const data = await response.json();
      setRaffles(data.raffles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRaffles();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchRaffles, 60000);
    return () => clearInterval(interval);
  }, [fetchRaffles]);

  const getActiveRaffles = () => {
    return raffles.filter(r => r.status === 'active');
  };

  const getFinishedRaffles = () => {
    return raffles.filter(r => r.status === 'finished');
  };

  const getRaffleById = (id: number) => {
    return raffles.find(r => r.id === id);
  };

  return {
    raffles,
    activeRaffles: getActiveRaffles(),
    finishedRaffles: getFinishedRaffles(),
    isLoading,
    error,
    refetch: fetchRaffles,
    getRaffleById,
  };
}
```

#### useTickets.ts

```typescript
import { useState, useEffect, useCallback } from 'react';

export interface Ticket {
  id: number;
  raffleId: number;
  ticketNumber: number;
  entryTime: Date;
  status: 'active' | 'won' | 'lost';
  wonAmount?: number;
}

export function useTickets(walletAddress: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.gurufin.com/api/v1/tickets?wallet=${walletAddress}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchTickets();
    }
  }, [walletAddress, fetchTickets]);

  const getUserTickets = (raffleId?: number) => {
    if (raffleId) {
      return tickets.filter(t => t.raffleId === raffleId);
    }
    return tickets;
  };

  const getActiveTickets = () => {
    return tickets.filter(t => t.status === 'active');
  };

  const getWonTickets = () => {
    return tickets.filter(t => t.status === 'won');
  };

  return {
    tickets,
    userTickets: getUserTickets(),
    activeTickets: getActiveTickets(),
    wonTickets: getWonTickets(),
    isLoading,
    error,
    refetch: fetchTickets,
    getUserTickets,
  };
}
```

#### useNotifications.ts

```typescript
import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setNotifications(prev => [
      ...prev,
      { id, type, message, timestamp: new Date() },
    ]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message: string) => {
    showNotification('success', message);
  }, [showNotification]);

  const error = useCallback((message: string) => {
    showNotification('error', message);
  }, [showNotification]);

  const warning = useCallback((message: string) => {
    showNotification('warning', message);
  }, [showNotification]);

  const info = useCallback((message: string) => {
    showNotification('info', message);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    dismissNotification,
    success,
    error,
    warning,
    info,
  };
}
```

---

## 4. User Flow Consistency

### 4.1 Raffle Entry Flow

```
Step 1: User views raffle list
  └─ Shows all active raffles with progress bars

Step 2: User clicks "Buy Tickets"
  └─ Opens RaffleModal

Step 3: User enters number of tickets
  └─ Validates: tickets × 25 ≤ balance
  └─ Validates: tickets × 25 ≤ dailyCapRemaining

Step 4: User confirms purchase
  └─ Calls POST /api/v1/redemptions
  └─ Deducts points
  └─ Generates ticket numbers
  └─ Creates ticket records

Step 5: Success
  └─ Shows success toast with ticket numbers
  └─ Updates ticket list
  └─ Closes modal

Error Cases:
  ├─ Insufficient points → Error toast: "Insufficient points"
  ├─ Daily cap reached → Warning toast: "Daily cap reached"
  └─ Wallet not connected → Error toast: "Connect wallet first"
```

### 4.2 Result Checking Flow

```
Step 1: Raffle finishes
  └─ Status changes from 'active' to 'finished'
  └─ VRF determines winner (production) or mock (Phase 1)

Step 2: User clicks "Check Result"
  └─ Opens modal with results

Step 3: Show result
  ├─ If won → Green badge, "Won $X", "Claim Prize" button
  └─ If lost → Red badge, "Better luck next time"

Step 4: User claims prize (if won)
  └─ Calls smart contract to claim USDC
  └─ Transaction confirmed
  └─ Shows success toast
```

### 4.3 Point Conversion Flow (Boost System)

```
Step 1: User has USGX from mining
  └─ Navigate to Point Shop

Step 2: User selects GX stablecoin to burn
  ├─ JPGX → 25% bonus (1 token = 1.25 points)
  └─ Other tokens → 1:1 (1 token = 1 point)

Step 3: User enters amount to burn
  └─ Calculates points to earn

Step 4: User confirms conversion
  └─ Burns tokens in smart contract
  └─ Points credited to balance
  └─ Shows success toast

Prerequisites:
  └─ User must swap USGX → Boost token on Guruswap first
  └─ Link to Guruswap provided in UI
```

---

## 5. Season 2 Rules Implementation

### 5.1 Daily Cap Enforcement

**Backend Logic:**
```typescript
// In POST /api/v1/redemptions
function validateRaffleEntry(walletAddress: string, tickets: number) {
  const ticketCost = 25;
  const totalCost = tickets * ticketCost;
  
  // Check point balance
  const balance = getPointBalance(walletAddress);
  if (balance < totalCost) {
    throw new Error('Insufficient points');
  }
  
  // Check daily cap
  const dailyUsed = getDailyUsed(walletAddress);
  const dailyCap = 60;
  
  if (dailyUsed + totalCost > dailyCap) {
    throw new Error('Daily cap reached');
  }
  
  // Check wallet age (optional)
  const walletAge = getWalletAge(walletAddress);
  if (walletAge < 14 * 24 * 60 * 60 * 1000) {
    throw new Error('Wallet must be at least 14 days old');
  }
  
  return { valid: true };
}
```

**UI Display:**
```
┌──────────────────────────────────────┐
│ 💎 Points: 500                        │
│ Daily cap: 30/60 remaining today     │
│ Reset at: 00:00 UTC (2h 15m left)    │
└──────────────────────────────────────┘
```

### 5.2 Point Carryover

**Rule:** Points accumulate indefinitely (no expiry)

**Implementation:**
```typescript
// No expiry logic needed
// Just display total balance
const totalBalance = getPointBalance(walletAddress);
// Shows: "500 points" (includes all carryover)
```

### 5.3 Boost Token Logic

**Weekly Rotation:**
```typescript
function getWeeklyBoostToken(): string {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const tokens = ['KRGX', 'JPGX', 'EUGX', 'PHGX', 'IDGX'];
  return tokens[weekNumber % tokens.length];
}

// Example: Week 12 → JPGX
```

**UI Display:**
```
┌─────────────────────────────────────────┐
│ 💎 Convert to Points                    │
│ ────────────────────────────────────── │
│                                         │
│ Select GX Stablecoin:                   │
│                                         │
│ [KRGX] 1 token = 1 point                │
│ [JPGX] 1 token = 1.25 points + 25% BONUS│
│ [EUGX] 1 token = 1 point                │
│ [PHGX] 1 token = 1 point                │
│ [IDGX] 1 token = 1 point                │
│                                         │
│ Selected: JPGX (25% Bonus)              │
│ Amount: [___] tokens                    │
│ Points: [___] pts                       │
│                                         │
│ [Cancel] [Convert & Earn]               │
└─────────────────────────────────────────┘
```

---

## 6. API Integration Specifications

### 6.1 Point Balance API

**Endpoint:** `GET /api/v1/points/balance`

**Query Parameters:**
- `wallet`: Wallet address (required)

**Response:**
```json
{
  "points": 500,
  "dailyCap": 60,
  "dailyUsed": 30,
  "lastUpdated": "2024-03-28T14:30:00Z"
}
```

### 6.2 Raffle Catalog API

**Endpoint:** `GET /api/v1/catalog/raffles`

**Response:**
```json
{
  "raffles": [
    {
      "id": 1,
      "name": "$10 Prize Raffle",
      "description": "Win a $10 prize!",
      "prize": 10,
      "ticketsSold": 50,
      "totalTickets": 100,
      "endTime": "2024-04-01T00:00:00Z",
      "status": "active"
    }
  ]
}
```

### 6.3 Raffle Entry API

**Endpoint:** `POST /api/v1/redemptions`

**Request Body:**
```json
{
  "wallet": "0x...",
  "raffleId": 1,
  "tickets": 2
}
```

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": 12345,
      "ticketNumber": 12345,
      "entryTime": "2024-03-28T14:30:00Z",
      "status": "active"
    }
  ],
  "pointsDeducted": 50,
  "remainingBalance": 450
}
```

### 6.4 User Tickets API

**Endpoint:** `GET /api/v1/tickets`

**Query Parameters:**
- `wallet`: Wallet address (required)
- `raffleId`: Optional filter

**Response:**
```json
{
  "tickets": [
    {
      "id": 12345,
      "raffleId": 1,
      "ticketNumber": 12345,
      "entryTime": "2024-03-28T14:30:00Z",
      "status": "active"
    }
  ]
}
```

---

## 7. Risk Assessment & Mitigation

### 7.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | Medium | Implement caching, exponential backoff |
| Wallet connection failures | High | Graceful fallback, clear error messages |
| VRF delays | High | Mock VRF for Phase 1, show loading state |
| Point balance sync | Medium | Auto-refresh every 30s, show last updated time |
| Daily cap race condition | High | Enforce on backend, not just frontend |

### 7.2 User Experience Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusing point mechanics | High | Clear tooltips, educational content |
| Lost tickets | Medium | Ticket history with export (CSV) |
| Unexpected daily cap | Medium | Clear indicator: "30/60 remaining" |
| Boost token confusion | Medium | Prominent "25% BONUS" badges |

### 7.3 Operational Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Budget overrun | High | Daily cap enforcement, budget pacing |
| Fraudulent entries | Medium | Wallet age check, rate limiting |
| VRF manipulation | Low | Use proven VRF oracle (Chainlink) |
| Smart contract bugs | High | Audit before production, bug bounty |

---

## 8. Success Metrics & KPIs

### 8.1 User Engagement

- **Daily active users (DAU):** Target > 3% of total users
- **Raffle participation rate:** Target > 50% of DAU
- **Average tickets per user:** Target 3-5 tickets
- **Point utilization rate:** Target > 80% of daily cap used

### 8.2 System Performance

- **API response time:** < 500ms (p95)
- **Page load time:** < 2s (p95)
- **Wallet connection success rate:** > 95%
- **Error rate:** < 1%

### 8.3 User Satisfaction

- **CSAT score:** > 4/5
- **NPS score:** > 50
- **Support tickets per 1K users:** < 5

---

## 9. Implementation Checklist

### Phase 1: Core Integration (Week 1-2)

- [ ] Set up component structure (Section 2.1)
- [ ] Implement `useWallet` hook (Section 3.2)
- [ ] Implement `usePoints` hook (Section 3.2)
- [ ] Implement `useRaffles` hook (Section 3.2)
- [ ] Implement `useTickets` hook (Section 3.2)
- [ ] Implement `useNotifications` hook (Section 3.2)
- [ ] Create `Header` component with wallet connection
- [ ] Create `PointBalance` component with daily cap display
- [ ] Create `RaffleCard` component
- [ ] Create `RaffleModal` component with validation
- [ ] Create `TicketList` component
- [ ] Integrate with Gurufin API (Section 6)
- [ ] Add error handling and loading states
- [ ] Test all user flows (Section 4)

### Phase 2: UX Enhancements (Week 3-4)

- [ ] Implement `RaffleProgress` component
- [ ] Implement `TicketStatusBadge` component
- [ ] Add mobile responsiveness
- [ ] Implement advanced filtering
- [ ] Add CSV export for ticket history
- [ ] Optimize performance (lazy loading, memoization)
- [ ] Conduct user testing

### Phase 3: Boost System (Week 5-6)

- [ ] Implement `BoostBadge` component
- [ ] Implement `TokenSelector` component
- [ ] Implement `PointShopModal` component
- [ ] Integrate boost token rotation logic
- [ ] Add educational tooltips
- [ ] Implement FX swap guidance (link to Guruswap)
- [ ] Test boost mechanics

### Phase 4: Production Ready (Week 7-8)

- [ ] Smart contract integration (VRF)
- [ ] Prize claiming flow
- [ ] Security audit
- [ ] Performance optimization
- [ ] Monitoring and analytics
- [ ] Documentation
- [ ] Deployment to production

---

## 10. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **GXN** | Guru Finance native token |
| **USGX** | USD-pegged GX stablecoin |
| **KRGX** | Korean GX stablecoin |
| **JPGX** | Japanese GX stablecoin |
| **Boost Token** | Designated GX stablecoin with 25% bonus |
| **Raffle-Only Phase** | Day 1-60, points only used for raffles |
| **Daily Cap** | 60 points per user per day (Day 1-60) |
| **VRF** | Verifiable Random Function (Chainlink VRF) |

### B. Environment Variables

```env
# Gurufin API
NEXT_PUBLIC_GURUFIN_API_URL=https://api.gurufin.com
NEXT_PUBLIC_GURUFIN_API_KEY=your_api_key

# Raffle Smart Contract
NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1

# Boost Token Config
NEXT_PUBLIC_BOOST_TOKEN=JPGX
NEXT_PUBLIC_BOOST_MULTIPLIER=1.25

# Environment
NEXT_PUBLIC_ENV=production
```

### C. Constants

```typescript
// lib/constants.ts
export const TICKET_COST = 25; // points per ticket
export const DAILY_CAP = 60; // points per day (Day 1-60)
export const MAX_DAILY_TICKETS = Math.floor(DAILY_CAP / TICKET_COST); // 2 tickets
export const BOOST_MULTIPLIER = 1.25; // 25% bonus
export const AUTO_REFRESH_INTERVAL_POINTS = 30000; // 30 seconds
export const AUTO_REFRESH_INTERVAL_RAFFLES = 60000; // 60 seconds
```

### D. TypeScript Types

```typescript
// types/raffle.ts
export interface Raffle {
  id: number;
  name: string;
  description: string;
  prize: number;
  ticketsSold: number;
  totalTickets: number;
  endTime: Date;
  status: 'active' | 'finished';
}

export interface RaffleEntry {
  raffleId: number;
  tickets: number;
  wallet: string;
}

// types/tickets.ts
export interface Ticket {
  id: number;
  raffleId: number;
  ticketNumber: number;
  entryTime: Date;
  status: 'active' | 'won' | 'lost';
  wonAmount?: number;
}

// types/points.ts
export interface PointBalance {
  balance: number;
  dailyCap: number;
  dailyUsed: number;
  lastUpdated: Date;
}

export interface PointTransaction {
  id: number;
  type: 'earn' | 'burn' | 'redeem';
  amount: number;
  timestamp: Date;
  description: string;
}

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 11. References

- **Season 2 Overall Flow:** `/home/geonu/workspace/projects/season2-gitbook/1-시즌-2-전체-흐름.md`
- **Point Economy:** `/home/geonu/workspace/projects/season2-gitbook/5-포인트-경제.md`
- **Conversion Modal:** `/home/geonu/workspace/projects/season2-gitbook/4-전환-모달.md`
- **Alignment Plan:** `/home/geonu/workspace/projects/raffle-where-users/ALIGNMENT_PLAN.md`

---

## 12. Maintenance Notes

**Document Version:** 1.0  
**Last Updated:** 2024-03-28  
**Maintained By:** Frontend Team  

**Change Log:**
- v1.0 (2024-03-28): Initial alignment document based on Season 2 specifications

**Review Cycle:**
- Weekly review during Phase 1-2
- Bi-weekly review during Phase 3-4
- Monthly review after production launch

---

*This document serves as the single source of truth for raffle system UI/UX alignment between Season 2 specifications and the raffle-where-users implementation.*
