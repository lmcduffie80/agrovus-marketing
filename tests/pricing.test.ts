// Pure-function unit tests for pricing logic (no DOM/React required)
import { describe, it, expect } from 'vitest';

// ─── Replicate the pure logic from pricing/page.tsx ──────────────────────────

const PLANS = [
  { id: 'starter',  monthlyPrice: 499,  annualPrice: 399,  impl: 999,  featured: false },
  { id: 'growth',   monthlyPrice: 1199, annualPrice: 959,  impl: 1999, featured: true  },
  { id: 'scale',    monthlyPrice: 2499, annualPrice: 1999, impl: 4999, featured: false },
];

const MODULES = [
  { id: 'dfii',          price: 299 },
  { id: 'toll',          price: 199 },
  { id: 'consolidation', price: 249 },
];

const SEAT_PACKS = [
  { id: 'seats_5',   price: 99  },
  { id: 'seats_10',  price: 179 },
  { id: 'seats_unl', price: 299 },
];

const SUPPORT_TIERS = [
  { id: 'standard',     price: 0   },
  { id: 'professional', price: 199 },
  { id: 'enterprise',   price: 499 },
];

function calcAddOns(
  planId: string,
  selectedModules: string[],
  selectedSeat: string | null,
  selectedSupport: string,
) {
  const modTotal = selectedModules.reduce((sum, id) => {
    if (planId === 'scale' && id === 'consolidation') return sum;
    return sum + (MODULES.find(m => m.id === id)?.price ?? 0);
  }, 0);
  const seatTotal = (planId === 'scale' || !selectedSeat)
    ? 0 : (SEAT_PACKS.find(s => s.id === selectedSeat)?.price ?? 0);
  const suppTotal = SUPPORT_TIERS.find(s => s.id === selectedSupport)?.price ?? 0;
  return modTotal + seatTotal + suppTotal;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Plan data', () => {
  it('has exactly 3 plans', () => {
    expect(PLANS).toHaveLength(3);
  });

  it('Growth is the featured plan', () => {
    const featured = PLANS.filter(p => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe('growth');
  });

  it('annual prices are lower than monthly', () => {
    PLANS.forEach(p => expect(p.annualPrice).toBeLessThan(p.monthlyPrice));
  });

  it('Freight Intelligence is NOT in module list', () => {
    const ids = MODULES.map(m => m.id);
    expect(ids).not.toContain('freight');
  });

  it('API Access is NOT in module list (unimplemented — removed from sale)', () => {
    const ids = MODULES.map(m => m.id);
    expect(ids).not.toContain('api');
  });

  it('has exactly 3 modules', () => {
    expect(MODULES).toHaveLength(3);
  });
});

describe('calcAddOns', () => {
  it('returns 0 with no selections and standard support', () => {
    expect(calcAddOns('starter', [], null, 'standard')).toBe(0);
  });

  it('adds module price correctly', () => {
    expect(calcAddOns('starter', ['dfii'], null, 'standard')).toBe(299);
  });

  it('adds multiple modules', () => {
    expect(calcAddOns('starter', ['dfii', 'toll'], null, 'standard')).toBe(299 + 199);
  });

  it('adds seat pack', () => {
    expect(calcAddOns('starter', [], 'seats_5', 'standard')).toBe(99);
  });

  it('skips seat pack for scale plan (unlimited included)', () => {
    expect(calcAddOns('scale', [], 'seats_10', 'standard')).toBe(0);
  });

  it('skips consolidation for scale plan (already included)', () => {
    expect(calcAddOns('scale', ['consolidation'], null, 'standard')).toBe(0);
  });

  it('adds professional support tier', () => {
    expect(calcAddOns('starter', [], null, 'professional')).toBe(199);
  });

  it('adds enterprise support tier', () => {
    expect(calcAddOns('starter', [], null, 'enterprise')).toBe(499);
  });

  it('computes combined total correctly', () => {
    // dfii 299 + toll 199 + seats_5 99 + professional 199 = 796
    expect(calcAddOns('starter', ['dfii', 'toll'], 'seats_5', 'professional')).toBe(796);
  });
});

describe('Annual pricing', () => {
  it('Growth annual saves exactly 20% vs monthly (rounded)', () => {
    const plan = PLANS.find(p => p.id === 'growth')!;
    const saving = Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100);
    expect(saving).toBe(20);
  });
});
