# Raffle Where Users ↔ Gurufin Season 2 Alignment Plan

**Version:** 1.0  
**Date:** 2026-03-28  
**Status:** Draft for Review

---

## Executive Summary

This document outlines how the `raffle-where-users` project should integrate with Gurufin Testnet Season 2 rules and flow. The plan covers UI/UX changes, rule adaptations, GX stablecoin boost system integration, and a recommended feature roadmap.

### Key Findings

**Current State of raffle-where-users:**
- Basic Next.js application with raffle listing
- Active raffles and finished raffles sections
- Mock data for raffles (prizes: $10, $20, $50)
- Ticket cost: 25 points (aligns with Season 2)
- User points: 500 (mock balance)
- No backend integration with Gurufin API
- No GX stablecoin boost system

**Gurufin Season 2 Requirements:**
- 5-step user journey: Earn → Mine → Swap → Point Earn → Redeem
- Raffle-only phase (Day 1-60) with 60 pt/day cap
- Ticket cost: 25 points
- GX stablecoin boost: 25% bonus on designated tokens
- Portal integration via Gurufin API
- Weekly LP points tier system (Phase 2+)

---

## 1. Integration with Season 2 Rules and Flow

### 1.1 User Journey Alignment

The raffle-where-users app should serve as the **Phase 5 (Redeem)** component of the Season 2 flow:

```
Season 2 Flow → Raffle Where Users Role
────────────────────────────────────────
1. Earn (Guru Wallet) → External (not in scope)
2. Mine (Mining Game) → External (not in scope)
3. Swap (Guruswap) → External (not in scope)
4. Point Earn (Gurufin Backend) → External (not in scope)
5. Redeem (portal.gurufin.com) → ✅ Raffle Where Users
```

**Integration Points:**
- **Phase 5 (Redeem)**: Users connect their wallet to portal.gurufin.com
- **Raffle participation**: Users spend accumulated points to buy tickets
- **Prize distribution**: USDC rewards distributed via smart contract

### 1.2 Data Flow Architecture

```
User Wallet → Gurufin Backend (Point API) → Raffle Where Users → Smart Contract
```

**Required API Integration:**
1. `GET /api/v1/points/balance` - Fetch user's point balance
2. `GET /api/v1/catalog/items` - Fetch available raffles
3. `POST /api/v1/redemptions` - Submit raffle entry
4. `GET /api/v1/purchases/{purchase_id}` - Check entry status

### 1.3 Season 2 Phase Alignment

| Season 2 Phase | Duration | Raffle Where Users Role |
|----------------|----------|-------------------------|
| Phase 1 (Raffle-First) | Day 1-60 | Primary redemption mechanism |
| Phase 2 (Raffle + Voucher) | Day 61-90 | Raffle entries + Voucher purchases |
| Phase 3 (Hybrid) | Day 91-120 | Optimized raffle/voucher split |
| Phase 4 (Full Scale) | Day 121+ | Full-scale operations |

**Current Focus:** Day 1-60 (Raffle-Only Phase)

---

## 2. UI/UX Changes Required

### 2.1 Header/Navigation Updates

**Current:** Basic header with logo

**Required Changes:**
- Add **Point Balance Display** (top-right corner)
  - Real-time balance from Gurufin API
  - Format: "125 pts"
  - Click to show balance breakdown (FX points, LP points)
- Add **Wallet Connection Status**
  - Show connected wallet address (truncated)
  - "Connect Wallet" button if not connected
- Add **Season 2 Badge**
  - Visual indicator showing "Season 2 - Phase 1"
  - Link to Season 2 guide docs

### 2.2 Raffle Card Updates

**Current Raffle Card Fields:**
- Name, Description, Prize, Tickets Sold, Total Tickets, End Time
- Buy Button (25 pts)

**Required Additions:**
- **GX Boost Indicator** (if applicable)
  - Display "25% Bonus" badge for boosted token raffles
  - Example: "25% Bonus on KRGX"
- **Participation Rate**
  - Show % sold: "50/100 tickets (50%)"
- **Time Progress Bar**
  - Visual countdown progress
  - Hours/minutes/seconds remaining
- **Eligibility Check**
  - Disable button if:
    - Points insufficient
    - Daily cap reached (60 pts/day)
    - Wallet age < 14 days (if enforced)
- **Win Probability Display**
  - Show odds: "1 in 2 tickets" or "50% chance"

**Example Enhanced Raffle Card:**
```
┌─────────────────────────────────────────────┐
│ $50 Prize Raffle              [25% Bonus]  │
│ ─────────────────────────────────────────── │
│ Win a $50 USDC prize!                      │
│                                             │
│ [████████░░] 50/100 tickets (50%)          │
│                                             │
│ Ends in: 2d 14h 32m                        │
│                                             │
│ Your Tickets: 2 | Win Chance: 2%           │
│                                             │
│ [Buy 1 Ticket - 25 pts]  [Your Balance: 125]│
└─────────────────────────────────────────────┘
```

### 2.3 Point Balance Section

**New Section: User Dashboard**

```
┌─────────────────────────────────────────────┐
│ 👤 Wallet: 0xabc...1234                    │
│ ─────────────────────────────────────────── │
│ Total Points: 125 pts                      │
│                                             │
│ ┌─────────────┬─────────────┬─────────────┐│
│ │ FX Points   │ LP Points   │ Carryover   ││
│ │ 80 pts      │ 45 pts      │ 1,230 pts   ││
│ └─────────────┴─────────────┴─────────────┘│
│                                             │
│ Daily Cap: 60/60 pts (Day 1-60)            │
│ Weekly Cap: 20/20 pts (LP only)            │
│                                             │
│ [View Point History] [Learn More →]        │
└─────────────────────────────────────────────┘
```

**Balance Breakdown:**
- **FX Points**: Points from FX swap + burn (capped at 60/day)
- **LP Points**: Points from CryptoSwap LP (tiered weekly)
- **Carryover**: Unlimited accumulated points from previous days

### 2.4 Raffle Entry Flow

**Current:** Single "Buy" button

**Required Multi-Step Flow:**
1. **Selection Screen**
   - User selects number of tickets (1-10)
   - Show total cost: "X tickets × 25 pts = Y pts"
   - Display win probability for each quantity
   - Show remaining balance after purchase

2. **Confirmation Modal**
   - Summary: Raffle name, tickets, cost, odds
   - Terms acknowledgment checkbox
   - "Confirm Entry" button

3. **Success State**
   - Ticket numbers generated
   - Entry confirmation with ID
   - "View My Tickets" button
   - Share result option

### 2.5 My Tickets Section

**Current:** Table showing ticket numbers

**Enhanced Requirements:**
- **Live Status Indicators**
  - Active: "Watching..." with countdown
  - Finished: "Check Result" button
  - Won: "Claim Prize" button (green highlight)
  - Lost: Grayed out
- **Ticket Details**
  - Raffle name
  - Ticket number (click to copy)
  - Entry timestamp
  - Prize pool size
- **Win History**
  - Separate tab for won raffles
  - Show prize amount, claim status
- **Filter Options**
  - All / Active / Finished / Won / Lost

### 2.6 Notification System

**Required Notifications:**

| Trigger | Type | Message |
|---------|------|---------|
| Raffle ends in 1 hour | Warning | "Your raffle ends in 1 hour!" |
| Raffle ends | Info | "Raffle ended. Check results!" |
| Entry successful | Success | "✓ Entry confirmed. Ticket #12345" |
| Entry failed | Error | "✗ Insufficient points" |
| Won prize | Success + Priority | "🎉 You won $50! Claim now" |
| Daily cap reached | Warning | "Daily 60 pt cap reached for today" |

**Notification Behavior:**
- Toast notifications (3-5 second auto-dismiss)
- Persistent notification for won prizes
- Email notification option (future)

### 2.7 Mobile Responsiveness

**Critical Adjustments:**
- Stack raffle cards vertically on mobile
- Simplify point balance display (show only total)
- Bottom navigation for mobile
- Touch-friendly button sizes (min 44px)
- Collapse detailed info behind "More" buttons

---

## 3. Rule Adaptations for Raffle System

### 3.1 Season 2 Raffle Rules

| Rule | Season 2 Spec | Implementation |
|------|---------------|----------------|
| **Ticket Cost** | 25 pts/ticket | ✅ Already implemented |
| **Daily Point Cap** | 60 pts/day (Day 1-60) | Enforce in backend API |
| **Point Carryover** | Unlimited accumulation | ✅ Already in design |
| **Prize Type** | USDC (stablecoin) | Smart contract distribution |
| **Win Determination** | VRF random selection | Off-chain mock for Phase 1 |
| **Eligibility** | Active wallet (14+ days) | Check wallet creation date |
| **Participation Limit** | Based on point balance | floor(balance / 25) |

### 3.2 Daily Cap Enforcement

**Implementation Logic:**

```
Daily Cap Calculation (Day 1-60):
─────────────────────────────────
1. User enters raffle
2. Backend checks:
   a. Current point balance ≥ ticket cost
   b. Today's entries × 25 pts ≤ 60 pts
3. If cap reached:
   - Show warning: "Daily cap reached"
   - Disable buy button
   - Allow next day at 00:00 UTC
4. If within limit:
   - Deduct points
   - Create entry record
   - Generate ticket number
```

**Cap Tracking:**
- Store daily entry count per wallet in database
- Reset at 00:00 UTC each day
- Display remaining cap: "30/60 pts remaining today"

### 3.3 Point Balance Validation

**Pre-Entry Checks:**
```
1. Fetch real-time balance from Gurufin API
2. Validate: balance ≥ (tickets × 25)
3. Check daily cap: entries_today × 25 ≤ 60
4. Check wallet age: created_at ≥ 14 days ago (optional)
5. All checks pass → Allow entry
```

**Edge Cases:**
- **Insufficient points**: Show error with suggested action
- **Daily cap reached**: Show message with reset time
- **Wallet not connected**: Prompt to connect wallet
- **Invalid wallet**: Show error message

### 3.4 Raffle Ticket Generation

**Mock Implementation (Phase 1):**
```typescript
interface Ticket {
  raffleId: number;
  ticketNumber: number; // 5-digit random
  entryTime: Date;
  status: 'active' | 'won' | 'lost';
}

// Generate random ticket number (00000-99999)
function generateTicketNumber(): number {
  return Math.floor(Math.random() * 100000);
}
```

**VRF Integration (Production):**
- Use Chainlink VRF or similar oracle
- Store commitment in smart contract
- Reveal after raffle ends
- Ensure provably fair selection

### 3.5 Win Determination Logic

**Current Mock Implementation:**
```typescript
function checkWin(raffle: Raffle, tickets: Ticket[]): boolean {
  if (raffle.status !== 'finished') return false;
  
  // Mock: 30% win rate for demo
  const won = Math.random() < 0.3;
  
  if (won) {
    // Assign winning ticket
    const winningTicket = tickets[0];
    winningTicket.status = 'won';
  }
  
  return won;
}
```

**Production VRF Flow:**
1. Raffle ends
2. Smart contract triggers VRF request
3. VRF provides random number
4. Contract determines winner: `winner = random % totalTickets`
5. Prize distributed to winner's wallet
6. Result published to raffle-where-users

### 3.6 Prize Distribution

**USDC Distribution:**
- Smart contract holds prize pool
- Winner selection triggers transfer
- Direct wallet-to-wallet transfer
- No intermediate custody

**Claim Process:**
1. User sees "Won $X" notification
2. Click "Claim Prize" button
3. Smart contract executes transfer
4. Transaction confirmed
5. Prize appears in user wallet

---

## 4. GX Stablecoin Boost System Integration

### 4.1 Boost System Overview

**Season 2 Boost Rule:**
- **Daily Boost Token**: One designated GX stablecoin earns 25% bonus
- **Boost Mechanism**: When users burn boost token for points, they receive 1.25× points
- **UI Indicator**: Show "25% Bonus" badge next to boosted token

### 4.2 Integration Points

**Current Gap:**
- Raffle Where Users doesn't currently handle token selection
- No boost token logic implemented

**Required Integration:**

#### 4.2.1 Point Shop Modal (New)

Before raffle entry, users must convert points via:

```
┌─────────────────────────────────────────────┐
│ 💎 Convert to Points                       │
│ ─────────────────────────────────────────── │
│ Select GX Stablecoin to burn:              │
│                                             │
│ [🔵 KRGX] 1 token = 1 point                │
│ [🟢 JPGX] 1 token = 1 point + 25% BONUS ←  │
│ [🟡 EUGX] 1 token = 1 point                │
│ [🟣 PHGX] 1 token = 1 point                │
│ [🟠 IDGX] 1 token = 1 point                │
│                                             │
│ Selected: JPGX (25% Bonus)                 │
│ Amount to burn: [______] tokens            │
│ Points to earn: [______] pts               │
│                                             │
│ [Cancel] [Convert & Earn]                  │
└─────────────────────────────────────────────┘
```

#### 4.2.2 Boost Token Selection Logic

```typescript
interface TokenOption {
  symbol: string; // KRGX, JPGX, etc.
  name: string;
  isBoostToken: boolean;
  bonusMultiplier: number; // 1.0 or 1.25
  currentPrice: number; // USD value
}

// Daily boost token (rotates weekly or daily)
const BOOST_TOKEN = 'JPGX'; // Example

function getTokenOptions(): TokenOption[] {
  return [
    { symbol: 'KRGX', name: 'Korean GX', isBoostToken: false, bonusMultiplier: 1.0, currentPrice: 1.0 },
    { symbol: 'JPGX', name: 'Japanese GX', isBoostToken: true, bonusMultiplier: 1.25, currentPrice: 1.0 },
    { symbol: 'EUGX', name: 'Euro GX', isBoostToken: false, bonusMultiplier: 1.0, currentPrice: 1.0 },
    { symbol: 'PHGX', name: 'Philippine GX', isBoostToken: false, bonusMultiplier: 1.0, currentPrice: 1.0 },
    { symbol: 'IDGX', name: 'Indonesian GX', isBoostToken: false, bonusMultiplier: 1.0, currentPrice: 1.0 },
  ];
}
```

#### 4.2.3 FX Swap Requirement

**Prerequisite:** Users must swap USGX → Boost Token before burning

```
Flow:
1. User has USGX from mining
2. Navigate to Guruswap (external link)
3. Swap USGX → JPGX (boost token)
4. Return to raffle-where-users
5. Burn JPGX in Point Shop
6. Receive 1.25× points
```

### 4.3 UI Components for Boost

**Boost Badge Component:**
```tsx
function BoostBadge({ token }: { token: TokenOption }) {
  if (!token.isBoostToken) return null;
  
  return (
    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
      25% BONUS
    </span>
  );
}
```

**Boost Indicator in Token List:**
```tsx
{tokens.map(token => (
  <div key={token.symbol} className="flex justify-between items-center">
    <div>
      <span className="font-semibold">{token.name}</span>
      {token.isBoostToken && (
        <BoostBadge token={token} />
      )}
    </div>
    <span>{token.isBoostToken ? '1.25 pts' : '1 pt'} per token</span>
  </div>
))}
```

### 4.4 Boost Rotation Logic

**Season 2 Boost Strategy:**
- Boost token rotates weekly (Monday UTC)
- Announced on portal.gurufin.com
- Display current boost token prominently

**Implementation:**
```typescript
function getWeeklyBoostToken(): string {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const tokens = ['KRGX', 'JPGX', 'EUGX', 'PHGX', 'IDGX'];
  return tokens[weekNumber % tokens.length];
}
```

### 4.5 User Guidance

**Educational Messaging:**
```
💡 Boost Tip: Burn JPGX this week for 25% more points!
   1. Swap USGX → JPGX on Guruswap
   2. Burn JPGX in Point Shop
   3. Earn 1.25 points per token
   [Go to Guruswap →]
```

**Boost Reminder Notifications:**
- Weekly notification about current boost token
- "JPGX is boosted this week! Don't miss out"
- Link to FX swap guide

---

## 5. Recommended Project Structure

### 5.1 Current Structure

```
raffle-where-users/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── package.json
├── tsconfig.json
└── ...
```

### 5.2 Recommended Structure

```
raffle-where-users/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes (proxy to Gurufin)
│   │   │   ├── points/
│   │   │   │   ├── route.ts     # GET /api/v1/points/balance
│   │   │   ├── catalog/
│   │   │   │   ├── route.ts     # GET /api/v1/catalog/items
│   │   │   └── redemptions/
│   │   │       └── route.ts     # POST /api/v1/redemptions
│   │   ├── components/          # Reusable UI components
│   │   │   ├── raffle/
│   │   │   │   ├── RaffleCard.tsx
│   │   │   │   ├── RaffleList.tsx
│   │   │   │   └── RaffleModal.tsx
│   │   │   ├── points/
│   │   │   │   ├── PointBalance.tsx
│   │   │   │   ├── PointBreakdown.tsx
│   │   │   │   └── PointHistory.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── TicketList.tsx
│   │   │   │   ├── TicketCard.tsx
│   │   │   │   └── TicketStatus.tsx
│   │   │   ├── boost/
│   │   │   │   ├── BoostBadge.tsx
│   │   │   │   ├── TokenSelector.tsx
│   │   │   │   └── BoostInfo.tsx
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationToast.tsx
│   │   │   │   └── NotificationProvider.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── WalletConnect.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── usePoints.ts
│   │   │   ├── useRaffles.ts
│   │   │   ├── useTickets.ts
│   │   │   └── useWallet.ts
│   │   ├── lib/                 # Utility functions
│   │   │   ├── gurufin-api.ts   # API client
│   │   │   ├── validators.ts    # Input validation
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── types/               # TypeScript types
│   │   │   ├── raffle.ts
│   │   │   ├── points.ts
│   │   │   ├── tickets.ts
│   │   │   └── api.ts
│   │   ├── contexts/            # React contexts
│   │   │   ├── WalletContext.tsx
│   │   │   ├── PointsContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── services/                # Backend services
│   │   ├── pointService.ts
│   │   ├── raffleService.ts
│   │   └── ticketService.ts
│   └── store/                   # State management
│       ├── pointsStore.ts
│       ├── rafflesStore.ts
│       └── ticketsStore.ts
├── public/
├── tests/                       # Test files
├── .env.local                   # Environment variables
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

### 5.3 Key Dependencies

**Required npm packages:**
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "ethers": "^6.0.0",          // Wallet connection
    "viem": "^2.0.0",             // Alternative wallet lib
    "wagmi": "^2.0.0",            // React hooks for wallet
    "react-hot-toast": "^2.4.0",  // Notifications
    "date-fns": "^3.0.0",         // Date formatting
    "clsx": "^2.0.0",             // Class name utility
    "tailwind-merge": "^2.0.0"    // Tailwind utility
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "typescript": "^5",
    "eslint": "^8",
    "prettier": "^3.0.0"
  }
}
```

### 5.4 Environment Variables

```env
# Gurufin API
NEXT_PUBLIC_GURUFIN_API_URL=https://api.gurufin.com
NEXT_PUBLIC_GURUFIN_API_KEY=your_api_key

# Raffle Smart Contract
NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1

# Boost Token Config
NEXT_PUBLIC_BOOST_TOKEN=JPGX
NEXT_PUBLIC_BOUS_MULTIPLIER=1.25

# Environment
NEXT_PUBLIC_ENV=production
```

---

## 6. Feature Roadmap

### 6.1 Phase 1: Core Integration (Week 1-2)

**Priority: Critical**

**Goals:**
- Connect to Gurufin API
- Implement basic raffle functionality
- Wallet integration

**Deliverables:**
1. ✅ Wallet connection (wagmi + ethers)
2. ✅ Point balance display (real-time from API)
3. ✅ Raffle listing (from Gurufin catalog API)
4. ✅ Raffle entry (POST /api/v1/redemptions)
5. ✅ Ticket management (view, filter, search)
6. ✅ Basic notification system

**Success Metrics:**
- Users can connect wallet and see balance
- Users can view active raffles
- Users can enter raffles with points
- Users can view their tickets

**Milestones:**
- Day 3: Wallet connection + point balance
- Day 7: Raffle listing + entry flow
- Day 10: Ticket management
- Day 14: Notification system + polish

### 6.2 Phase 2: UX Enhancements (Week 3-4)

**Priority: High**

**Goals:**
- Improve user experience
- Add detailed analytics
- Mobile optimization

**Deliverables:**
1. Enhanced raffle cards (progress bars, win probability)
2. Point breakdown (FX vs LP points)
3. Detailed ticket history with filters
4. Mobile-responsive design
5. Advanced filtering (by status, date, prize)
6. Export ticket history (CSV)

**Success Metrics:**
- User satisfaction score > 4/5
- Mobile usage > 40% of total
- Ticket view completion rate > 80%

**Milestones:**
- Week 3: Enhanced raffle cards, point breakdown
- Week 4: Mobile optimization, filtering

### 6.3 Phase 3: Boost System (Week 5-6)

**Priority: High**

**Goals:**
- Implement GX stablecoin boost system
- Token selection UI
- Educational content

**Deliverables:**
1. Token selector with boost indicator
2. Point Shop modal (burn tokens for points)
3. FX swap guidance (link to Guruswap)
4. Boost rotation logic (weekly token changes)
5. Boost educational tooltips
6. Weekly boost notification

**Success Metrics:**
- Boost token adoption > 30% of users
- Clear understanding of boost mechanics (>80% quiz pass)
- FX swap click-through rate > 20%

**Milestones:**
- Week 5: Token selector, Point Shop modal
- Week 6: Boost rotation, educational content

### 6.4 Phase 4: Advanced Features (Week 7-8)

**Priority: Medium**

**Goals:**
- Add advanced analytics
- Social features
- Performance optimization

**Deliverables:**
1. Win probability calculator
2. Raffle analytics dashboard
3. Social sharing (share wins)
4. Leaderboard (top winners this week)
5. Email notifications (optional)
6. Performance optimization (lazy loading, caching)

**Success Metrics:**
- Page load time < 2s
- Social shares > 5% of wins
- User retention > 60% Day 7

**Milestones:**
- Week 7: Analytics, social features
- Week 8: Optimization, testing

### 6.5 Phase 5: Production Ready (Week 9-10)

**Priority: Critical**

**Goals:**
- Security audit
- Load testing
- Production deployment

**Deliverables:**
1. Security audit (smart contract + frontend)
2. Load testing (10K concurrent users)
3. Error monitoring (Sentry integration)
4. Analytics dashboard (Google Analytics)
5. Production deployment (Vercel)
6. Documentation (user guide, API docs)

**Success Metrics:**
- 99.9% uptime
- Zero critical security issues
- <1% error rate
- Successful load test at 10K users

**Milestones:**
- Week 9: Security audit, load testing
- Week 10: Production deployment, monitoring

---

## 7. API Integration Specifications

### 7.1 Point Balance API

**Endpoint:** `GET /api/v1/points/balance`

**Implementation:**
```typescript
interface PointsBalanceResponse {
  success: boolean;
  data: {
    wallet_address: string;
    points_balance: number;
    last_settled_at: string;
    recent_ledger: LedgerEntry[];
    recent_purchases: Purchase[];
  };
}

async function getPointsBalance(walletAddress: string): Promise<PointsBalanceResponse> {
  const response = await fetch(
    `${NEXT_PUBLIC_GURUFIN_API_URL}/api/v1/points/balance?wallet_address=${walletAddress}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GURUFIN_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );
  return response.json();
}
```

### 7.2 Raffle Catalog API

**Endpoint:** `GET /api/v1/catalog/items`

**Implementation:**
```typescript
interface RaffleItem {
  item_id: string;
  item_type: 'RAFFLE' | 'VOUCHER';
  title: string;
  country: string;
  points_price: number;
  stock_total: number;
  stock_available: number;
  status: string;
  drop_starts_at: string;
  drop_ends_at: string;
}

async function getRaffleCatalog(): Promise<RaffleItem[]> {
  const response = await fetch(
    `${NEXT_PUBLIC_GURUFIN_API_URL}/api/v1/catalog/items?item_type=RAFFLE&status=ACTIVE`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GURUFIN_API_KEY}`,
      }
    }
  );
  const data = await response.json();
  return data.data.items;
}
```

### 7.3 Raffle Entry API

**Endpoint:** `POST /api/v1/redemptions`

**Implementation:**
```typescript
interface RedemptionRequest {
  wallet_address: string;
  item_type: 'RAFFLE';
  item_id: string;
  quantity: number;
}

interface RedemptionResponse {
  success: boolean;
  data: {
    redemption_id: string;
    purchase_id: string;
    points_spent: number;
    points_balance_after: number;
    status: string;
  };
}

async function enterRaffle(request: RedemptionRequest): Promise<RedemptionResponse> {
  const response = await fetch(
    `${NEXT_PUBLIC_GURUFIN_API_URL}/api/v1/redemptions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GURUFIN_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': generateIdempotencyKey(),
      },
      body: JSON.stringify(request)
    }
  );
  return response.json();
}
```

---

## 8. Risk Assessment & Mitigation

### 8.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gurufin API downtime | High | Medium | Implement caching, fallback to mock data |
| Smart contract exploit | Critical | Low | Security audit before launch |
| Wallet connection failure | Medium | Medium | Multiple wallet providers, clear error messages |
| API rate limiting | Medium | High | Implement request queuing, exponential backoff |
| Database connection issues | High | Low | Connection pooling, health checks |

### 8.2 User Experience Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Confusing point mechanics | High | Medium | Clear UI explanations, tooltips |
| Daily cap frustration | Medium | High | Prominent cap display, reset time notification |
| Win rate perception | Medium | Medium | Transparent win probability, fair distribution |
| Mobile usability issues | High | Medium | Extensive mobile testing, responsive design |

### 8.3 Operational Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Budget overrun | High | Medium | Strict daily cap enforcement, monitoring |
| Participation drop-off | Medium | High | Engaging UI, regular promotions |
| CS ticket overload | Medium | Medium | Clear FAQ, automated responses |
| Boost token confusion | Low | Medium | Educational content, clear indicators |

---

## 9. Success Metrics & KPIs

### 9.1 Primary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users (DAU) | >5,000 | Unique wallet addresses |
| Raffle Participation Rate | >10% | Entries / DAU |
| User Retention (Day 7) | >40% | Returning users |
| User Retention (Day 30) | >25% | Returning users |
| Average Points per User | <200 pt | Balance / active users |
| Point Conversion Rate | >50% | Earned → Spent |

### 9.2 Secondary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | <2s | Core Web Vitals |
| API Error Rate | <1% | Failed requests / total |
| Mobile Usage | >40% | Mobile / total traffic |
| Boost Token Adoption | >30% | Users using boost token |
| Win Notification Click-through | >60% | Users clicking "Claim" |

### 9.3 Monitoring Dashboard

**Required Metrics Dashboard:**
- Real-time raffle entries
- Point balance distribution
- Daily active users
- API response times
- Error rates
- Boost token usage
- Win rate distribution

---

## 10. Next Steps

### Immediate Actions (Week 1)

1. **Setup Development Environment**
   - Initialize project structure
   - Install dependencies
   - Configure environment variables

2. **Wallet Integration**
   - Implement wagmi + ethers
   - Test wallet connection
   - Add wallet address display

3. **API Integration**
   - Connect to Gurufin API endpoints
   - Implement point balance fetching
   - Test with real wallet addresses

4. **Basic Raffle UI**
   - Fetch raffle list from API
   - Display raffle cards
   - Implement buy button

### Short-term Goals (Week 2-4)

1. Complete ticket management system
2. Implement notification system
3. Add mobile responsiveness
4. Write unit tests
5. Deploy to staging environment

### Medium-term Goals (Week 5-8)

1. Implement boost system
2. Add advanced analytics
3. Security audit
4. Load testing
5. Production deployment

### Long-term Goals (Week 9+)

1. Continuous optimization
2. Feature expansion (voucher integration)
3. Community feedback integration
4. Season 3 preparation

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **GXN** | Gurufin native token |
| **USGX** | USD-pegged GX stablecoin |
| **KRGX/JPGX/EUGX/PHGX/IDGX** | Regional GX stablecoins (Korean, Japanese, Euro, Philippine, Indonesian) |
| **FX Swap** | Swapping USGX to regional GX stablecoins |
| **CryptoSwap** | GXN <> tUSDC/tUSDT trading pair |
| **LP** | Liquidity Provider position |
| **Point** | Digital currency for raffle/voucher redemption |
| **VRF** | Verifiable Random Function (for fair raffle selection) |
| **Raffle-First Phase** | Day 1-60, raffle-only redemption |
| **Boost Token** | Designated GX stablecoin with 25% point bonus |

---

## Appendix B: References

1. [Gurufin Season 2 Complete Guide](/GURUFIN_SEASON2_COMPLETE_GUIDE.md)
2. [Season 2 Flow Overview](/1-시즌-2-전체-흐름.md)
3. [Mining Mechanism](/3-마이닝-메커니즘.md)
4. [Point Economy](/5-포인트-경제.md)
5. [Portal Integration](/6-포털-통합.md)
6. [Point API Specification](/9-포인트-API-스펙.md)
7. [Season 2 Budget Approval Plan](/GURUFIN_SEASON2_BUDGET_APPROVAL_PLAN.md)

---

**Document Owner:** Geonu (fbtopg)  
**Last Updated:** 2026-03-28  
**Next Review:** 2026-04-04
