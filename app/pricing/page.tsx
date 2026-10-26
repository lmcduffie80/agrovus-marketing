'use client';
import { useState } from 'react';

// ─── Plan Data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 499,
    annualPrice: 399,
    impl: 5000,
    desc: 'For small distributors and manufacturers getting started with a modern ERP.',
    features: ['Inventory & Warehousing', 'Procurement & Purchasing', '5 users included', 'Email support (48hr SLA)'],
    featured: false,
    cta: 'Start Free Trial',
    includedUsers: 5,
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 1199,
    annualPrice: 959,
    impl: 12000,
    desc: 'Full ERP suite for growing operations with sales, finance, and reporting needs.',
    features: ['All Starter modules', 'Sales & CRM', 'Finance & Accounting', 'Banking & Reconciliation', 'Analytics & Reports', '15 users included', 'Professional support (8hr SLA)'],
    featured: true,
    cta: 'Start Free Trial',
    includedUsers: 15,
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 2499,
    annualPrice: 1999,
    impl: 20000,
    desc: 'For multi-location enterprises and complex process manufacturing operations.',
    features: ['All Growth modules', 'Material Requirements Planning', 'Multi-entity & multi-warehouse', 'Formulation Manuals', 'Multi-entity finance & banking', 'Unlimited users included', 'Enterprise support (2hr SLA)'],
    featured: false,
    cta: 'Contact Sales',
    includedUsers: null,
  },
];

const MODULES = [
  { id: 'dfii',         name: 'Material Requirements (DFII)',       price: 299, desc: 'BOM-based material requirements calculation' },
  { id: 'toll',         name: 'Formulation Manuals',                price: 199, desc: 'Version-controlled formulation documentation' },
  { id: 'consolidation',name: 'Multi-Entity Finance',                price: 249, desc: 'Finance & banking modules across entities' },
];

const SEAT_PACKS = [
  { id: 'seats_5',   label: '+5 users',       price: 99  },
  { id: 'seats_10',  label: '+10 users',       price: 179 },
  { id: 'seats_unl', label: 'Unlimited users', price: 299 },
];

const SUPPORT_TIERS = [
  { id: 'standard',     name: 'Standard',     price: 0,   desc: 'Email + chat · 48hr SLA' },
  { id: 'professional', name: 'Professional', price: 199, desc: 'Phone + chat · 8hr SLA' },
  { id: 'enterprise',   name: 'Enterprise',   price: 499, desc: 'Dedicated CSM · 2hr SLA' },
];

const ENTERPRISE_PARTS = [
  { part: 'Platform fee',          price: '$36,000 / year',            covers: 'All modules, unlimited locations, API, SSO, audit log, sandbox' },
  { part: 'Users 51–150',          price: '$50 / user / month',        covers: 'Rate applies to every user once the count lands in this band' },
  { part: 'Users 151–300',         price: '$45 / user / month',        covers: 'Volume rate for mid-size Enterprise deployments' },
  { part: 'Users 301+',            price: '$40 / user / month',        covers: 'Lowest per-user rate for large user counts' },
  { part: 'Scoping',               price: '$50,000 one-time',          covers: 'AI-assisted discovery (4–6 weeks): process maps, requirements, prototype, and fixed-scope proposal' },
  { part: 'Implementation',        price: '$25,000–$150,000 one-time', covers: 'Data migration, integrations, training, go-live support — quoted from the scoping session' },
  { part: 'Dedicated environment', price: '+$18,000 / year',           covers: 'Optional separate database and hosting for isolation' },
  { part: 'Custom integration',    price: '$250,000–$600,000',         covers: 'Optional SAP, EDI, carriers, scales, or client systems — priced by scope' },
];

const ENTERPRISE_TERMS = [
  '1-year minimum; 5% off for a 3-year term, with a 5% per year renewal price cap',
  'Billed annually in advance, or quarterly at a 3% premium',
  '99.9% monthly uptime SLA with service credits for misses',
  'Named account contact; 1-hour response for system-down issues; quarterly business reviews',
  'You own your data and can export anytime; full export within 30 days of termination',
  'Annual user true-up; added users billed from the date added',
];

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function PricingPage() {
  const [annual, setAnnual]             = useState(false);
  const [loading, setLoading]           = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [selectedModules, setModules]   = useState<string[]>([]);
  const [selectedSeat, setSeat]         = useState<string | null>(null);
  const [selectedSupport, setSupport]   = useState<string>('standard');
  const [selectedPlan, setPlan]         = useState<string | null>(null);

  function toggleModule(id: string) {
    setModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  }

  function calcAddOns(planId: string) {
    const modTotal = selectedModules.reduce((sum, id) => {
      if (planId === 'scale' && id === 'consolidation') return sum;
      return sum + (MODULES.find(m => m.id === id)?.price || 0);
    }, 0);
    const seatTotal = (planId === 'scale' || !selectedSeat)
      ? 0 : (SEAT_PACKS.find(s => s.id === selectedSeat)?.price || 0);
    const suppTotal = SUPPORT_TIERS.find(s => s.id === selectedSupport)?.price || 0;
    return modTotal + seatTotal + suppTotal;
  }

  async function handleCheckout(planId: string) {
    if (planId === 'scale') {
      window.location.assign('/contact?topic=scale');
      return;
    }
    setLoading(planId);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billing: annual ? 'annual' : 'monthly',
          addOns: {
            modules: selectedModules,
            seatPack: selectedSeat,
            support: selectedSupport,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.assign(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(null);
    }
  }

  return (
    <>
      <style>{`
        .pricing-wrap{--g:#00C695;--gm:#00A67D;--gl:#E6FAF5;--t:#0F1C18;--t2:#4A6359;--t3:#8AA89E;--bg:#F8FAF9;--bg2:#fff;--bd:#E4EBE8;--bd2:#D0DDD8;--fh:var(--font-jakarta),'Plus Jakarta Sans',sans-serif;--fb:'Inter',sans-serif;--sh:0 1px 3px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.04);--shm:0 4px 16px rgba(0,0,0,.08),0 16px 40px rgba(0,0,0,.06)}
        .pricing-wrap *,.pricing-wrap *::before,.pricing-wrap *::after{box-sizing:border-box}
        .pricing-wrap{max-width:1080px;margin:0 auto;padding:64px 24px 96px;font-family:var(--fb);font-size:15px;line-height:1.6;color:var(--t)}
        .hdr{text-align:center;margin-bottom:48px}
        .slbl{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:10px}
        .stit{font-family:var(--fh);font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.03em;color:var(--t);margin-bottom:10px}
        .ssub{font-size:15px;color:var(--t2);max-width:480px;margin:0 auto 28px;line-height:1.6}
        .toggle-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:48px}
        .toggle-label{font-size:14px;font-weight:500;color:var(--t2)}
        .toggle-label.active{color:var(--t);font-weight:600}
        .toggle{width:48px;height:26px;background:var(--bd2);border-radius:100px;border:none;cursor:pointer;position:relative;transition:.2s;flex-shrink:0}
        .toggle.on{background:var(--g)}
        .toggle-thumb{position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
        .toggle.on .toggle-thumb{left:25px}
        .annual-badge{background:#FFF8E6;border:1px solid #FFE0A0;color:#8A6400;font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px}
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:56px}
        .pcard{background:var(--bg2);border:1.5px solid var(--bd);border-radius:16px;padding:28px 24px;position:relative;transition:.2s;cursor:pointer;display:flex;flex-direction:column}
        .pcard:hover{transform:translateY(-2px);box-shadow:var(--shm)}
        .pcard.sel{border-color:var(--g);box-shadow:0 0 0 1px var(--g),var(--shm)}
        .pcard.ft{border-color:var(--g);box-shadow:0 0 0 1px var(--g),var(--shm);transform:scale(1.02)}
        .pcard.ft:hover{transform:scale(1.02) translateY(-2px)}
        .ftbdg{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--g);color:#fff;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 14px;border-radius:100px;white-space:nowrap}
        .pname{font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:12px}
        .price-row{display:flex;align-items:baseline;gap:3px;margin-bottom:4px}
        .pamount{font-family:var(--fh);font-size:38px;font-weight:800;color:var(--t);letter-spacing:-.04em;line-height:1}
        .pper{font-size:13px;color:var(--t3)}
        .poriginal{font-size:12px;color:var(--t3);text-decoration:line-through;margin-left:4px}
        .impl-fee{font-size:12px;color:var(--t2);background:var(--gl);border:1px solid #B3ECD9;border-radius:6px;padding:5px 9px;margin:8px 0 0;display:inline-flex;align-items:center;gap:5px}
        .impl-fee strong{color:var(--gm);font-weight:600}
        .pdesc{font-size:13px;color:var(--t2);line-height:1.5;padding:12px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);margin:14px 0 18px}
        .feats{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:22px;flex:1}
        .feats li{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--t2)}
        .feats li::before{content:'✓';color:var(--g);font-weight:700;font-size:12px;flex-shrink:0;margin-top:1px}
        .addon-total{font-size:12px;color:var(--gm);font-weight:600;margin-bottom:12px;min-height:18px}
        .btn{width:100%;padding:12px;border-radius:9px;font-family:var(--fb);font-size:14px;font-weight:600;cursor:pointer;border:none;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-def{background:var(--bg);color:var(--t);border:1.5px solid var(--bd2)}
        .btn-def:hover:not(:disabled){border-color:var(--g);color:var(--g)}
        .btn-ft{background:var(--g);color:#fff}
        .btn-ft:hover:not(:disabled){background:var(--gm)}
        .btn:disabled{opacity:.6;cursor:not-allowed}
        .spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        .spinner-dark{border-color:rgba(0,0,0,.12);border-top-color:var(--t)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .addons-wrap{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:36px;margin-bottom:40px;box-shadow:var(--sh)}
        .addons-title{font-family:var(--fh);font-size:20px;font-weight:800;color:var(--t);letter-spacing:-.02em;margin-bottom:6px}
        .addons-sub{font-size:14px;color:var(--t2);margin-bottom:28px}
        .addon-section{margin-bottom:28px}
        .addon-section-title{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bd)}
        .addon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
        .addon-card{background:var(--bg);border:1.5px solid var(--bd);border-radius:10px;padding:14px;cursor:pointer;transition:.15s;display:flex;align-items:flex-start;gap:10px}
        .addon-card:hover{border-color:var(--bd2)}
        .addon-card.sel{border-color:var(--g);background:var(--gl)}
        .addon-check{width:18px;height:18px;border:1.5px solid var(--bd2);border-radius:4px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:11px;transition:.15s}
        .addon-card.sel .addon-check{background:var(--g);border-color:var(--g);color:#fff}
        .addon-name{font-size:13px;font-weight:600;color:var(--t);margin-bottom:2px}
        .addon-desc{font-size:11px;color:var(--t3);line-height:1.4}
        .addon-price{font-size:12px;font-weight:600;color:var(--gm);margin-top:4px}
        .seat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .seat-card{background:var(--bg);border:1.5px solid var(--bd);border-radius:10px;padding:14px 16px;cursor:pointer;transition:.15s;text-align:center}
        .seat-card:hover{border-color:var(--bd2)}
        .seat-card.sel{border-color:var(--g);background:var(--gl)}
        .seat-label{font-size:13px;font-weight:600;color:var(--t);margin-bottom:4px}
        .seat-price{font-size:12px;font-weight:600;color:var(--gm)}
        .support-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .support-card{background:var(--bg);border:1.5px solid var(--bd);border-radius:10px;padding:14px 16px;cursor:pointer;transition:.15s}
        .support-card:hover{border-color:var(--bd2)}
        .support-card.sel{border-color:var(--g);background:var(--gl)}
        .support-name{font-size:13px;font-weight:600;color:var(--t);margin-bottom:3px}
        .support-desc{font-size:11px;color:var(--t3);margin-bottom:4px}
        .support-price{font-size:12px;font-weight:600;color:var(--gm)}
        .summary{background:var(--t);border-radius:16px;padding:28px 32px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-bottom:20px}
        .summary-left{display:flex;flex-direction:column;gap:6px}
        .summary-plan{font-size:13px;color:#7A9A90}
        .summary-total{font-family:var(--fh);font-size:32px;font-weight:800;color:#fff;letter-spacing:-.03em;line-height:1}
        .summary-breakdown{font-size:12px;color:#7A9A90;margin-top:2px}
        .summary-right{display:flex;flex-direction:column;gap:8px;min-width:200px}
        .summary-btn{background:var(--g);color:#fff;font-family:var(--fb);font-size:15px;font-weight:600;padding:14px 28px;border-radius:10px;border:none;cursor:pointer;transition:.2s;text-align:center;width:100%}
        .summary-btn:hover:not(:disabled){background:var(--gm)}
        .summary-btn:disabled{opacity:.6;cursor:not-allowed}
        .summary-note{font-size:11px;color:#5A7A70;text-align:center}
        .p-error{background:#FFF0F0;border:1px solid #FFB3B3;color:#C0392B;font-size:13px;padding:12px 16px;border-radius:8px;margin-top:16px;text-align:center}
        .trial-note{text-align:center;font-size:13px;color:var(--t3);margin-top:16px}
        .offer-block{margin-top:64px;padding-top:48px;border-top:1px solid var(--bd)}
        .offer-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
        .offer-card{background:var(--bg2);border:1.5px solid var(--bd);border-radius:16px;padding:28px 24px}
        .offer-card h3{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.02em;margin:0 0 8px;color:var(--t)}
        .offer-card p{font-size:14px;color:var(--t2);line-height:1.55;margin:0 0 16px}
        .offer-list{list-style:none;display:flex;flex-direction:column;gap:8px;margin:0 0 22px;padding:0}
        .offer-list li{font-size:13px;color:var(--t2);display:flex;gap:8px;align-items:flex-start}
        .offer-list li::before{content:'✓';color:var(--g);font-weight:700;flex-shrink:0}
        .offer-link{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;background:var(--bg);color:var(--t);border:1.5px solid var(--bd2);transition:.2s}
        .offer-link:hover{border-color:var(--g);color:var(--g)}
        .offer-link.primary{background:var(--g);color:#fff;border-color:var(--g)}
        .offer-link.primary:hover{background:var(--gm);color:#fff}
        .ent-jump{display:inline-block;margin:-12px 0 0;font-size:13px;font-weight:600;color:var(--gm);text-decoration:none}
        .ent-jump:hover{text-decoration:underline}
        .ent{scroll-margin-top:88px;background:var(--bg2);border:1.5px solid var(--bd);border-radius:16px;padding:32px;margin-top:28px;box-shadow:var(--sh)}
        .ent-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:24px}
        .ent h3{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.02em;margin:0 0 8px;color:var(--t)}
        .ent-intro{font-size:14px;color:var(--t2);line-height:1.55;max-width:620px;margin:0}
        .ent-table-wrap{overflow-x:auto;border:1px solid var(--bd);border-radius:12px;margin-bottom:10px}
        .ent-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left}
        .ent-table th{background:var(--bg);font-weight:600;padding:10px 14px;border-bottom:1px solid var(--bd);color:var(--t)}
        .ent-table td{padding:10px 14px;border-bottom:1px solid var(--bd);color:var(--t2);vertical-align:top}
        .ent-table tr:last-child td{border-bottom:none}
        .ent-table td.ent-part{font-weight:600;color:var(--t);white-space:nowrap}
        .ent-table td.ent-price{color:var(--gm);font-weight:600;white-space:nowrap}
        .ent-example{font-size:12px;color:var(--t3);margin:0 0 28px}
        .ent-terms{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;margin:0;padding:0}
        .ent-terms li{font-size:13px;color:var(--t2);line-height:1.5;display:flex;gap:8px;align-items:flex-start}
        .ent-terms li::before{content:'✓';color:var(--g);font-weight:700;flex-shrink:0}
        @media(max-width:720px){
          .ent{padding:24px 18px}
          .ent-terms{grid-template-columns:1fr}
          .offer-grid{grid-template-columns:1fr}
          .pgrid{grid-template-columns:1fr;max-width:380px;margin-left:auto;margin-right:auto}
          .pcard.ft{transform:none}
          .seat-grid,.support-grid{grid-template-columns:1fr 1fr}
          .summary{flex-direction:column}
          .summary-right{width:100%}
        }
      `}</style>

      <div className="pricing-wrap">
        {/* HEADER */}
        <div className="hdr">
          <div className="slbl">Pricing</div>
          <div className="stit">Build your Agrovus plan</div>
          <p className="ssub">Start with a base plan, then add the modules and features your operation actually needs.</p>
          <a className="ent-jump" href="#enterprise">Need 50+ users or multiple sites? See Enterprise pricing ↓</a>
        </div>

        {/* ANNUAL TOGGLE */}
        <div className="toggle-row">
          <span className={`toggle-label ${!annual ? 'active' : ''}`}>Monthly</span>
          <button className={`toggle ${annual ? 'on' : ''}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-thumb" />
          </button>
          <span className={`toggle-label ${annual ? 'active' : ''}`}>Annual</span>
          {annual && <span className="annual-badge">Save 20%</span>}
        </div>

        {/* PLAN CARDS */}
        <div className="pgrid">
          {PLANS.map((plan) => {
            const price     = annual ? plan.annualPrice : plan.monthlyPrice;
            const addOnAmt  = calcAddOns(plan.id);
            const isLoading = loading === plan.id;
            return (
              <div
                key={plan.id}
                className={`pcard ${plan.featured ? 'ft' : ''} ${selectedPlan === plan.id ? 'sel' : ''}`}
                onClick={() => setPlan(plan.id)}
              >
                {plan.featured && <div className="ftbdg">Most Popular</div>}
                <div className="pname">{plan.name}</div>
                <div className="price-row">
                  <span className="pamount">{fmt(price)}</span>
                  <span className="pper">/mo</span>
                  {annual && <span className="poriginal">{fmt(plan.monthlyPrice)}</span>}
                </div>
                <div className="impl-fee">+ <strong>{fmt(plan.impl)}</strong> one-time impl fee</div>
                <div className="pdesc">{plan.desc}</div>
                <ul className="feats">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                {addOnAmt > 0 && (
                  <div className="addon-total">+ {fmt(addOnAmt)}/mo in add-ons selected</div>
                )}
                <button
                  className={`btn ${plan.featured ? 'btn-ft' : 'btn-def'}`}
                  onClick={(e) => { e.stopPropagation(); handleCheckout(plan.id); }}
                  disabled={loading !== null}
                >
                  {isLoading
                    ? <><span className={`spinner ${!plan.featured ? 'spinner-dark' : ''}`} />Redirecting...</>
                    : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* ADD-ONS CONFIGURATOR */}
        <div className="addons-wrap">
          <div className="addons-title">Customize your plan</div>
          <div className="addons-sub">Add modules, seats, and support to any base plan. Selections apply to whichever plan you choose at checkout.</div>

          <div className="addon-section">
            <div className="addon-section-title">Module Add-Ons — billed monthly</div>
            <div className="addon-grid">
              {MODULES.map(m => (
                <div key={m.id} className={`addon-card ${selectedModules.includes(m.id) ? 'sel' : ''}`} onClick={() => toggleModule(m.id)}>
                  <div className="addon-check">{selectedModules.includes(m.id) ? '✓' : ''}</div>
                  <div>
                    <div className="addon-name">{m.name}</div>
                    <div className="addon-desc">{m.desc}</div>
                    <div className="addon-price">+{fmt(m.price)}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="addon-section">
            <div className="addon-section-title">Additional User Seats — billed monthly</div>
            <div className="seat-grid">
              {SEAT_PACKS.map(s => (
                <div key={s.id} className={`seat-card ${selectedSeat === s.id ? 'sel' : ''}`} onClick={() => setSeat(selectedSeat === s.id ? null : s.id)}>
                  <div className="seat-label">{s.label}</div>
                  <div className="seat-price">+{fmt(s.price)}/mo</div>
                </div>
              ))}
            </div>
          </div>

          <div className="addon-section" style={{ marginBottom: 0 }}>
            <div className="addon-section-title">Support Tier</div>
            <div className="support-grid">
              {SUPPORT_TIERS.map(s => (
                <div key={s.id} className={`support-card ${selectedSupport === s.id ? 'sel' : ''}`} onClick={() => setSupport(s.id)}>
                  <div className="support-name">{s.name}</div>
                  <div className="support-desc">{s.desc}</div>
                  <div className="support-price">{s.price === 0 ? 'Included' : `+${fmt(s.price)}/mo`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        {selectedPlan && (() => {
          const plan    = PLANS.find(p => p.id === selectedPlan)!;
          const base    = annual ? plan.annualPrice : plan.monthlyPrice;
          const addOns  = calcAddOns(selectedPlan);
          const total   = base + addOns;
          return (
            <div className="summary">
              <div className="summary-left">
                <div className="summary-plan">{plan.name} plan · {annual ? 'Annual' : 'Monthly'} billing</div>
                <div className="summary-total">{fmt(total)}<span style={{ fontSize: '16px', fontWeight: 400, color: '#7A9A90' }}>/mo</span></div>
                <div className="summary-breakdown">
                  {fmt(base)}/mo base{addOns > 0 && ` + ${fmt(addOns)}/mo add-ons`}{` + ${fmt(plan.impl)} one-time impl fee`}
                </div>
              </div>
              <div className="summary-right">
                <button className="summary-btn" onClick={() => handleCheckout(selectedPlan)} disabled={loading !== null}>
                  {loading === selectedPlan ? 'Redirecting to Stripe...' : `Start Free Trial — ${plan.name}`}
                </button>
                <div className="summary-note">14-day free trial · No credit card required</div>
              </div>
            </div>
          );
        })()}

        {error && <div className="p-error">⚠️ {error} — please try again or contact support@agrovus.com</div>}
        <p className="trial-note">Starter and Growth include a 14-day free trial · Cancel anytime · Annual plans billed at the discounted rate</p>

        {/* Enterprise + Custom (sales-led) */}
        <div className="offer-block">
          <div className="hdr" style={{ marginBottom: 0 }}>
            <div className="slbl">Beyond self-serve</div>
            <div className="stit">Enterprise &amp; Custom ERP</div>
            <p className="ssub">Annual contracts and custom builds for larger operations — priced from our go-to-market offerings, sold with a sales call.</p>
          </div>
          <section id="enterprise" className="ent">
            <div className="ent-head">
              <div>
                <h3>Enterprise</h3>
                <p className="ent-intro">
                  Annual contracts for multi-site operations. Qualify when you have more than 50 users, need more
                  than three integrations, need an uptime guarantee, or run several companies or sites.
                  Platform fee + volume user rates + implementation.
                </p>
              </div>
              <a className="offer-link primary" href="/contact?topic=enterprise">Contact Sales</a>
            </div>

            <div className="ent-table-wrap">
              <table className="ent-table">
                <thead>
                  <tr><th>Part</th><th>Price (USD)</th><th>What it covers</th></tr>
                </thead>
                <tbody>
                  {ENTERPRISE_PARTS.map(row => (
                    <tr key={row.part}>
                      <td className="ent-part">{row.part}</td>
                      <td className="ent-price">{row.price}</td>
                      <td>{row.covers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ent-example">
              Example: 200 users ≈ $144,000 / year plus implementation. 500 users ≈ $276,000 / year plus implementation.
            </p>

            <div className="addon-section-title">Contract terms</div>
            <ul className="ent-terms">
              {ENTERPRISE_TERMS.map(t => <li key={t}>{t}</li>)}
            </ul>
          </section>

          <div className="offer-grid" style={{ gridTemplateColumns: '1fr', marginTop: 20 }}>
            <div className="offer-card">
              <h3>Custom ERP</h3>
              <p>AI-assisted scoping, then a fixed-scope phased build — own the system outright or license the Agrovus core.</p>
              <ul className="offer-list">
                <li>Scoping engagement: $50,000 (4–6 weeks)</li>
                <li>Module extension: $25,000–$75,000</li>
                <li>Department system: $100,000–$250,000</li>
                <li>Company-wide ERP: $300,000–$750,000</li>
              </ul>
              <a className="offer-link" href="/custom">Custom services →</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
