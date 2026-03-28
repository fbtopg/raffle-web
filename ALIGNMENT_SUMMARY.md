# Raffle Where Users ↔ Gurufin Season 2 Alignment - Quick Summary

**Created:** 2026-03-28  
**Status:** Ready for Review  
**Full Document:** [ALIGNMENT_PLAN.md](./ALIGNMENT_PLAN.md)

---

## 🎯 Executive Summary

This document outlines how `raffle-where-users` should integrate with Gurufin Testnet Season 2, covering UI/UX changes, rule adaptations, GX stablecoin boost system, and a 10-week feature roadmap.

---

## 📊 Current State vs Required State

### Current State
- ✅ Basic Next.js raffle listing
- ✅ Active/Finished raffles sections
- ✅ Ticket cost: 25 points (aligns with Season 2)
- ✅ Mock data for raffles
- ❌ No Gurufin API integration
- ❌ No wallet connection
- ❌ No GX boost system
- ❌ No point balance display

### Required State
- ✅ Wallet connection (wagmi + ethers)
- ✅ Real-time point balance from Gurufin API
- ✅ Enhanced raffle cards with stats
- ✅ Ticket management system
- ✅ GX stablecoin boost integration
- ✅ Notification system
- ✅ Mobile responsiveness
- ✅ Daily cap enforcement (60 pts/day)

---

## 🔑 Key Integration Points

### 1. User Journey (Phase 5: Redeem)
```
Earn → Mine → Swap → Point Earn → Redeem (Raffle Where Users)
```

### 2. Required API Endpoints
- `GET /api/v1/points/balance` - Fetch user balance
- `GET /api/v1/catalog/items` - Fetch available raffles
- `POST /api/v1/redemptions` - Submit raffle entry
- `GET /api/v1/purchases/{id}` - Check entry status

### 3. Season 2 Rules
- **Ticket Cost:** 25 pts (already implemented)
- **Daily Cap:** 60 pts/day (Day 1-60)
- **Point Carryover:** Unlimited
- **Prize:** USDC via smart contract
- **Win Method:** VRF random selection
- **Eligibility:** Active wallet (14+ days)

---

## 🎨 UI/UX Changes Required

### Priority 1 (Week 1-2)
1. **Wallet Connection**
   - Add wallet address display (truncated)
   - "Connect Wallet" button

2. **Point Balance Display**
   - Real-time balance in header
   - Format: "125 pts"
   - Click to show breakdown (FX/LP points)

3. **Enhanced Raffle Cards**
   - Progress bar (tickets sold %)
   - Win probability display
   - Time countdown
   - Eligibility check on button

4. **My Tickets Section**
   - Live status indicators
   - Filter options (All/Active/Finished/Won/Lost)
   - Win history tab

### Priority 2 (Week 3-4)
5. **Notification System**
   - Toast notifications (3-5s auto-dismiss)
   - Persistent for won prizes
   - Types: Success, Error, Warning, Info

6. **Point Balance Breakdown**
   - FX Points (from FX swap)
   - LP Points (from CryptoSwap)
   - Carryover (accumulated)

7. **Mobile Responsiveness**
   - Stack raffle cards vertically
   - Bottom navigation
   - Touch-friendly buttons (min 44px)

### Priority 3 (Week 5-6)
8. **GX Boost System**
   - Token selector with 25% bonus badge
   - Point Shop modal (burn tokens)
   - FX swap guidance (link to Guruswap)
   - Weekly boost rotation

9. **Advanced Analytics**
   - Win probability calculator
   - Raffle analytics dashboard
   - Social sharing (share wins)

---

## 🔄 GX Stablecoin Boost Integration

### Boost Mechanism
- **Daily Boost Token:** One designated GX earns 25% bonus
- **Current Week:** JPGX (Japanese GX) - Example
- **Rotation:** Weekly (Monday UTC)

### User Flow
1. User has USGX from mining
2. Navigate to Guruswap (external link)
3. Swap USGX → JPGX (boost token)
4. Return to raffle-where-users
5. Burn JPGX in Point Shop
6. Receive 1.25× points

### UI Components
- **BoostBadge:** Yellow badge showing "25% BONUS"
- **TokenSelector:** 5 GX tokens with boost indicator
- **PointShopModal:** Burn tokens for points interface
- **BoostInfo:** Educational tooltips

---

## 📅 10-Week Feature Roadmap

### Phase 1: Core Integration (Week 1-2)
**Priority: Critical**
- ✅ Wallet connection
- ✅ Point balance display
- ✅ Raffle listing
- ✅ Raffle entry
- ✅ Ticket management
- ✅ Basic notifications

**Milestone:** Day 14 - All core features working

### Phase 2: UX Enhancements (Week 3-4)
**Priority: High**
- Enhanced raffle cards
- Point breakdown
- Mobile optimization
- Advanced filtering
- Export ticket history

**Milestone:** Week 4 - Mobile responsive, polished UX

### Phase 3: Boost System (Week 5-6)
**Priority: High**
- Token selector
- Point Shop modal
- FX swap guidance
- Boost rotation logic
- Educational content

**Milestone:** Week 6 - Boost system live

### Phase 4: Advanced Features (Week 7-8)
**Priority: Medium**
- Win probability calculator
- Analytics dashboard
- Social sharing
- Leaderboard
- Performance optimization

**Milestone:** Week 8 - Feature complete

### Phase 5: Production Ready (Week 9-10)
**Priority: Critical**
- Security audit
- Load testing (10K users)
- Error monitoring
- Analytics dashboard
- Production deployment

**Milestone:** Week 10 - Production ready

---

## 📈 Success Metrics

### Primary KPIs
| Metric | Target |
|--------|--------|
| Daily Active Users (DAU) | >5,000 |
| Raffle Participation Rate | >10% |
| User Retention (Day 7) | >40% |
| User Retention (Day 30) | >25% |
| Average Points per User | <200 pt |
| Point Conversion Rate | >50% |

### Secondary KPIs
| Metric | Target |
|--------|--------|
| Page Load Time | <2s |
| API Error Rate | <1% |
| Mobile Usage | >40% |
| Boost Token Adoption | >30% |
| Win Notification Click-through | >60% |

---

## 🚀 Immediate Next Steps

### Week 1 Tasks
1. Setup development environment
2. Install dependencies (wagmi, ethers, react-hot-toast)
3. Implement wallet connection
4. Connect to Gurufin API
5. Display point balance
6. Fetch raffle list from API

### Week 2 Tasks
1. Implement raffle entry flow
2. Build ticket management system
3. Add basic notifications
4. Write unit tests
5. Deploy to staging

### Week 3-4 Tasks
1. Enhanced raffle cards
2. Mobile optimization
3. Advanced filtering
4. Polish UI/UX

---

## 📁 Project Structure (Recommended)

```
raffle-where-users/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities
│   │   ├── types/               # TypeScript types
│   │   └── contexts/            # React contexts
│   └── services/                # Backend services
├── public/
├── tests/
├── .env.local
└── package.json
```

---

## 🔗 References

- [Full Alignment Plan](./ALIGNMENT_PLAN.md)
- [Gurufin Season 2 Complete Guide](/GURUFIN_SEASON2_COMPLETE_GUIDE.md)
- [Season 2 Flow Overview](/1-시즌-2-전체-흐름.md)
- [Point API Specification](/9-포인트-API-스펙.md)
- [Season 2 Budget Approval Plan](/GURUFIN_SEASON2_BUDGET_APPROVAL_PLAN.md)

---

**Questions?** Contact: Geonu (fbtopg)  
**Document Owner:** Geonu  
**Last Updated:** 2026-03-28
