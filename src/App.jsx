import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from "recharts";

const sentimentData = [
  { month: "Jan '25", michigan: 73.2, conference: 104.1 },
  { month: "Feb '25", michigan: 71.7, conference: 100.1 },
  { month: "Mar '25", michigan: 68.5, conference: 93.9 },
  { month: "Apr '25", michigan: 52.2, conference: 85.7 },
  { month: "May '25", michigan: 50.8, conference: 80.6 },
  { month: "Jun '25", michigan: 53.4, conference: 82.3 },
  { month: "Jul '25", michigan: 56.1, conference: 86.0 },
  { month: "Aug '25", michigan: 55.7, conference: 84.1 },
  { month: "Sep '25", michigan: 54.2, conference: 83.5 },
  { month: "Oct '25", michigan: 53.8, conference: 82.9 },
  { month: "Nov '25", michigan: 53.1, conference: 81.5 },
  { month: "Dec '25", michigan: 52.9, conference: 79.8 },
  { month: "Jan '26", michigan: 56.4, conference: 89.0 },
  { month: "Feb '26", michigan: 56.6, conference: 91.0 },
  { month: "Mar '26", michigan: 53.3, conference: 91.8 },
  { month: "Apr '26", michigan: 49.8, conference: 93.8 },
  { month: "May '26", michigan: 44.8, conference: 93.1 },
];

const ceSpendingData = [
  { quarter: "Q1 '25", growth: 1.5, color: "#10b981" },
  { quarter: "Q2 '25", growth: 0.8, color: "#f59e0b" },
  { quarter: "Q3 '25", growth: -1.1, color: "#ef4444" },
  { quarter: "Q4 '25", growth: -2.2, color: "#ef4444" },
  { quarter: "Q1 '26", growth: 0.2, color: "#6b7280" },
  { quarter: "Q2 '26\u2020", growth: -1.0, color: "#dc2626" },
];

const categoryImpactData = [
  { category: "Smartphones", priceIncrease: 26, purchaseDecline: 37 },
  { category: "Laptops/Tablets", priceIncrease: 45, purchaseDecline: 68 },
  { category: "TVs", priceIncrease: 31, purchaseDecline: 42 },
  { category: "Game Consoles", priceIncrease: 69, purchaseDecline: 55 },
  { category: "Smart Home", priceIncrease: 18, purchaseDecline: 28 },
  { category: "Audio/Wearables", priceIncrease: 22, purchaseDecline: 31 },
];

const expectationsData = [
  { month: "Jan '25", expectations: 86.4, present: 120.6 },
  { month: "Mar '25", expectations: 74.0, present: 110.2 },
  { month: "May '25", expectations: 64.5, present: 100.8 },
  { month: "Jul '25", expectations: 70.2, present: 105.3 },
  { month: "Sep '25", expectations: 66.0, present: 102.8 },
  { month: "Nov '25", expectations: 64.1, present: 100.0 },
  { month: "Jan '26", expectations: 72.0, present: 120.0 },
  { month: "Mar '26", expectations: 70.9, present: 123.3 },
  { month: "Apr '26", expectations: 73.4, present: 124.4 },
  { month: "May '26", expectations: 74.4, present: 121.2 },
];

const inflationExpData = [
  { month: "Jan '25", yearAhead: 3.3, longRun: 3.2 },
  { month: "Mar '25", yearAhead: 3.9, longRun: 3.2 },
  { month: "Apr '25", yearAhead: 6.5, longRun: 3.3 },
  { month: "Jun '25", yearAhead: 5.2, longRun: 3.3 },
  { month: "Aug '25", yearAhead: 4.9, longRun: 3.3 },
  { month: "Oct '25", yearAhead: 4.2, longRun: 3.3 },
  { month: "Dec '25", yearAhead: 3.8, longRun: 3.3 },
  { month: "Feb '26", yearAhead: 3.4, longRun: 3.3 },
  { month: "Mar '26", yearAhead: 3.8, longRun: 3.2 },
  { month: "Apr '26", yearAhead: 4.7, longRun: 3.5 },
  { month: "May '26", yearAhead: 4.8, longRun: 3.9 },
];

const timelineEvents = [
  { date: "Jan 2025", event: "Stable start \u2014 46% of consumers optimistic, low unemployment, steady inflation", type: "positive" },
  { date: "Apr 2, 2025", event: '"Liberation Day" \u2014 sweeping 25% tariffs. Net sentiment drops 32% in May. Pull-forward CE buying.', type: "negative" },
  { date: "H2 2025", event: "CE sales decline 2.2% YoY. Best Buy cuts guidance to $41.1\u201341.9B. 50% delay electronics purchases.", type: "negative" },
  { date: "Jan\u2013Feb 2026", event: "False dawn: Michigan edges to 56.6. Gains confined to stockholders. Circana forecasts just 0.2% CE growth.", type: "neutral" },
  { date: "Feb 28, 2026", event: "US military conflict with Iran begins. Strait of Hormuz closes Mar 4. Oil surges past $120/barrel.", type: "negative" },
  { date: "Mar 2026", event: "Michigan plunges 6% to 53.3. Year-ahead inflation expectations jump to 3.8%. Gas approaches $4/gallon.", type: "negative" },
  { date: "Apr 8, 2026", event: "Temporary two-week ceasefire. Michigan prelim hits 47.6 (98% surveyed pre-ceasefire); revised to 49.8.", type: "neutral" },
  { date: "Apr 2026", event: "CPI hits 3.8% annual \u2014 highest in 3 years. Electronics prices rise 0.6% m/m. Inflation expectations surge to 4.7%.", type: "negative" },
  { date: "May 22, 2026", event: "Michigan FINAL crashes to 44.8 \u2014 all-time record low, far below prelim 48.2. Current conditions 45.8, expectations 44.1. 57% spontaneously cite high prices eroding finances.", type: "negative" },
  { date: "May 26, 2026", event: "Conference Board dips to 93.1 \u2014 first decline in four months as Middle East inflation impacts intensify. Two-thirds of consumers cutting back on spending; most bought fewer items and delayed expensive purchases. Big-ticket plans shifting from \"yes\" to \"no.\" Expectations below 80 for 16th month.", type: "negative" },
  { date: "Jun 8, 2026", event: "Michigan at all-time floor of 44.8. Long-run inflation expectations at 3.9% (7-month high). Supply disruptions in Hormuz unresolved. No recovery in sight until energy prices fall.", type: "negative" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(15, 15, 20, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
        <p style={{ color: "#94a3b8", margin: 0, marginBottom: 6, fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => p.value != null && (
          <p key={i} style={{ color: p.color, margin: "3px 0", fontSize: 12 }}>
            {p.name}: <span style={{ fontWeight: 700 }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ value, label, delta, deltaLabel, color = "#e2e8f0" }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 170 }}>
    <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: "'Space Mono', monospace", letterSpacing: "-1px" }}>{value}</div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    {delta && <div style={{ fontSize: 11, color: delta.startsWith("+") ? "#10b981" : "#ef4444", marginTop: 8, fontWeight: 600 }}>{delta} <span style={{ color: "#475569", fontWeight: 400 }}>{deltaLabel}</span></div>}
  </div>
);

const PhaseLabel = ({ phase, color }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: `${color}18`, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{phase}</span>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sentiment", label: "Sentiment" },
    { id: "divergence", label: "Divergence" },
    { id: "inflation", label: "Inflation" },
    { id: "spending", label: "CE Sales" },
    { id: "categories", label: "Categories" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", boxShadow: "0 0 12px #dc262680" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626", textTransform: "uppercase", letterSpacing: "1.5px" }}>Case Study &middot; Updated 6/8/2026</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>US Consumer Electronics Sentiment</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>Jan 2025 &mdash; Jun 2026 &middot; Tariffs + Iran war: consumer sentiment hits all-time record low as dual-shock crisis deepens</p>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === tab.id ? "#e2e8f0" : "#64748b" }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "overview" && (<div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard value="44.8" label="Michigan (May '26 final)" delta="-39%" deltaLabel="vs Jan 2025 \u00b7 All-time record low" color="#dc2626" />
          <StatCard value="93.1" label="Conf Board (May '26)" delta="-11%" deltaLabel="vs Jan 2025 \u00b7 first dip in 4 months" color="#f59e0b" />
          <StatCard value="4.8%" label="Inflation expect. (1yr)" delta="+1.4pp" deltaLabel="vs Feb '26 pre-war" color="#ef4444" />
          <StatCard value="57%" label="Cite high prices" delta="+7pp" deltaLabel="vs April \u00b7 cost of living #1 concern" color="#ea580c" />
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(153,27,27,0.12), rgba(220,38,38,0.06))", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ fontSize: 22, marginTop: 2 }}>{"\u26A0"}</div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 6px" }}>Record Low: 44.8 \u2014 Lowest in 74 Years of Tracking</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              The May final Michigan reading of 44.8 crashed far below the preliminary 48.2, missing every Bloomberg estimate. This is the lowest since tracking began in 1952 \u2014 below the June 2022 pandemic-inflation trough, below the 2008 financial crisis, below Watergate-era stagflation. All components are in record territory: current conditions 45.8, expectations 44.1. The decline was driven by Republicans and Independents reaching their lowest readings of the current administration, while 57% spontaneously cite high prices eroding their finances. Lower-income consumers and those without college degrees posted the steepest declines, as these groups are most sensitive to gas and essentials costs. Long-run inflation expectations climbed to 3.9%, signaling consumers now expect price pressures to persist well beyond the current crisis.
            </p>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.04))", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 14, padding: "24px 28px", marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#f59e0b" }}>The Story in Seven Phases</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { phase: "Cautious Optimism", period: "Jan\u2013Feb '25", color: "#10b981", desc: "46% optimistic. Electronics spending intentions muted but stable." },
              { phase: "Tariff Shock", period: "Apr\u2013May '25", color: "#ef4444", desc: '"Liberation Day" tariffs. Net sentiment fell 32%. Pull-forward CE buying in Mar\u2013Apr.' },
              { phase: "Bifurcated Trough", period: "Jun\u2013Aug '25", color: "#f59e0b", desc: "Brief July rebound collapsed with August tariff wave. Income divide deepens." },
              { phase: "Holiday Erosion", period: "Sep\u2013Dec '25", color: "#ef4444", desc: "H2 CE sales fell 2.2%. Best Buy cut guidance. 50% delayed electronics purchases." },
              { phase: "False Dawn", period: "Jan\u2013Feb '26", color: "#6b7280", desc: "Michigan edged to 56.6. Gains confined to stockholders. Circana forecast just 0.2% CE growth." },
              { phase: "Iran War Shock", period: "Mar\u2013Apr '26", color: "#dc2626", desc: "Strait of Hormuz closed. Oil past $120/bbl. Michigan crashed to 49.8. CPI hit 3.8% (3-yr high). Inflation expectations surged." },
              { phase: "Record Collapse", period: "May '26\u2013Now", color: "#991b1b", desc: "Michigan final 44.8 \u2014 all-time low. 57% cite cost-of-living. Long-run inflation expectations jump to 3.9%. Two-thirds of consumers cutting back. Big-ticket purchase plans collapsing. No recovery until Hormuz supply disruptions resolve and energy prices fall." },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ minWidth: 130, paddingTop: 2 }}><PhaseLabel phase={p.phase} color={p.color} /></div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{p.period}</span>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 20px 8px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 16px", color: "#94a3b8" }}>Michigan Consumer Sentiment &middot; Jan 2025\u2013May 2026</h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs><linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} /><stop offset="100%" stopColor="#dc2626" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} interval={1} />
              <YAxis domain={[40, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: "Previous record (Jun 2022)", fill: "#ef444450", fontSize: 9, position: "insideTopRight" }} />
              <Area type="monotone" dataKey="michigan" stroke="#dc2626" strokeWidth={2.5} fill="url(#sentGrad)" name="Michigan Index" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>)}

      {activeTab === "sentiment" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Dual Confidence Indices: Historic Divergence</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>Michigan (prices/gas focus) at all-time low 44.8 while Conference Board (jobs focus) holds above 90 \u2014 a 48-point gap, the widest ever recorded</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} interval={1} />
              <YAxis yAxisId="left" domain={[40, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Michigan", angle: -90, position: "insideLeft", fill: "#dc262680", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[70, 110]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Conf. Board", angle: 90, position: "insideRight", fill: "#3b82f680", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Line yAxisId="left" type="monotone" dataKey="michigan" stroke="#dc2626" strokeWidth={2.5} name="Michigan Sentiment" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
              <Line yAxisId="right" type="monotone" dataKey="conference" stroke="#3b82f6" strokeWidth={2.5} name="Conference Board" dot={{ r: 3, fill: "#3b82f6", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "All-Time Record Low", value: "44.8", detail: "May '26 final \u2014 revised sharply from prelim 48.2, missing every Bloomberg estimate. Lower than June 2022, the 2008 crisis, and 1970s stagflation.", color: "#dc2626" },
            { title: "48-Point Gap", value: "48pt", detail: "Michigan 44.8 vs Conference Board 93.1 \u2014 the widest divergence in history. Michigan tracks gas/prices; CB tracks jobs. Americans feel fine at work but crushed at the pump.", color: "#f59e0b" },
            { title: "Partisan Collapse", value: "R+I", detail: "Republicans and Independents hit their lowest readings of the current administration. Democrats' sentiment was little changed. Lower-income and non-college consumers posted the steepest declines \u2014 most sensitive to gas and essentials.", color: "#8b5cf6" },
            { title: "2/3 Cutting Back", value: "67%", detail: "Conference Board special survey: two-thirds of consumers cutting spending due to rising prices. Most delaying expensive purchases and buying fewer items.", color: "#ea580c" },
          ].map((c, i) => (
            <div key={i} style={{ flex: "1 1 200px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.title}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, fontFamily: "'Space Mono', monospace", margin: "4px 0" }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{c.detail}</div>
            </div>
          ))}
        </div>
      </div>)}

      {activeTab === "divergence" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Present vs. Expectations: Conference Board Sub-Indices</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>Expectations below 80 for 16 consecutive months \u2014 recession signal persists despite resilient present conditions</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expectationsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis domain={[55, 130]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <ReferenceLine y={80} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: "80 = Recession Signal", fill: "#ef444480", fontSize: 9, position: "insideTopRight" }} />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2.5} name="Present Situation" dot={{ r: 3, fill: "#10b981", stroke: "#0a0a0f", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expectations" stroke="#ef4444" strokeWidth={2.5} name="Expectations Index" dot={{ r: 3, fill: "#ef4444", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", margin: "0 0 8px" }}>16 Months Below 80</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>The CB Expectations Index has been below the 80 recession-signal threshold since February 2025. At 74.4, it ticked up in May but remains firmly in the danger zone. The Michigan Expectations component is far worse at 44.1 \u2014 a record low. In 1990, 2001, and 2007, similar persistent gaps preceded recessions.</p>
          </div>
          <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>Labor Buffer Weakening</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>Present Situation fell 3.2 points to 121.2 in May \u2014 first meaningful crack. "Hard to get" job responses at a 5-year high. Goldman Sachs projects unemployment rising to 4.6% by year-end. The CB headline held above 90, but the labor shield is thinning.</p>
          </div>
          <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(234,88,12,0.06), rgba(234,88,12,0.02))", border: "1px solid rgba(234,88,12,0.12)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", margin: "0 0 8px" }}>CE in the Crosshairs</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>Big-ticket purchase plans are collapsing. CB reports plans shifting from "yes" to "no." Consumers are economizing on hobby items, games/toys, and clothing. Spending remains "cheap thrills and necessary services" \u2014 electronics are the most deferrable major category.</p>
          </div>
        </div>
      </div>)}

      {activeTab === "inflation" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Consumer Inflation Expectations (Michigan)</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>Two spikes (tariffs Apr '25, Iran war Apr '26) \u2014 but now long-run expectations are climbing too, signaling de-anchoring</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={inflationExpData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis domain={[2.5, 7]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Line type="monotone" dataKey="yearAhead" stroke="#dc2626" strokeWidth={2.5} name="Year-Ahead" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="longRun" stroke="#f59e0b" strokeWidth={2.5} name="Long-Run (5-10yr)" dot={{ r: 3, fill: "#f59e0b", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 8px" }}>Long-Run De-Anchoring</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>The most alarming development: long-run (5\u201310yr) expectations jumped to 3.9% in May from 3.5% in April. This signals consumers no longer believe price pressures are temporary. Pre-pandemic range was below 2.8%. The Fed watches this metric obsessively \u2014 once expectations de-anchor, they become self-fulfilling.</p>
          </div>
          <div style={{ flex: "1 1 280px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", margin: "0 0 8px" }}>CE Triple Squeeze Intensifies</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>Electronics face compounding cost pressures: (1) tariffs on Chinese imports, (2) energy/freight costs from the Iran war, (3) memory chip and materials shortages (AI buildout, Gulf disruptions to aluminum/tungsten). April CPI showed electronics up 0.6% m/m. Trade-down to entry-price and premium tiers is hollowing out the mid-market.</p>
          </div>
        </div>
      </div>)}

      {activeTab === "spending" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Consumer Electronics Sales Growth (YoY %)</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>\u2020Q2 '26 = estimate based on sentiment/CPI trajectory &middot; Source: Circana POS, CTA, analyst estimates</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ceSpendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="quarter" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
              <Bar dataKey="growth" name="YoY Growth %" radius={[6, 6, 0, 0]} barSize={52}>
                {ceSpendingData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(153,27,27,0.06), rgba(153,27,27,0.02))", border: "1px solid rgba(153,27,27,0.12)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", margin: "0 0 8px" }}>The Spending Collapse Signal</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>Conference Board May special survey: two-thirds of consumers cutting back on spending. Most bought fewer items and delayed expensive purchases. Consumers economizing on hobby items, games/toys, clothing. Big-ticket purchase plans shifting from "yes" to "no." This is the clearest demand-destruction signal for CE since the pandemic.</p>
          </div>
          <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(107,114,128,0.06), rgba(107,114,128,0.02))", border: "1px solid rgba(107,114,128,0.12)", borderRadius: 14, padding: "20px 24px" }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>2026 Outlook: Circana's 0.2% Now Optimistic</h4>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>January's 0.2% growth forecast assumed stable energy prices and fading tariff drag. Neither materialized. The Iran war added an unforeseen energy shock, memory chip shortages are worsening, and the income bifurcation has cracked \u2014 even high-income consumers are retrenching. Consumer trade-down to entry-price tiers is hollowing the mid-market where margins live.</p>
          </div>
        </div>
      </div>)}

      {activeTab === "categories" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Tariff-Driven Price Increases vs Projected Purchase Decline</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>CTA/Trade Partnership Worldwide &middot; Iran war energy/supply costs compound these tariff-only figures</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryImpactData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Bar dataKey="priceIncrease" name="Avg Price Increase %" fill="#f59e0b" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={14} />
              <Bar dataKey="purchaseDecline" name="Proj. Purchase Decline %" fill="#ef4444" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: "#94a3b8" }}>Updated Category Dynamics (June 2026)</h4>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { cat: "Smartphones", insight: "53% of CE revenue. Tariff price increases compounded by NAND/DRAM shortages from AI demand. Lower-income consumers and non-college grads \u2014 historically the largest smartphone buyer cohort \u2014 posted the steepest May sentiment declines.", color: "#3b82f6" },
              { cat: "Laptops & Tablets", insight: "Most exposed category (68% projected purchase decline). Win10 EOL driving some demand. But chip shortages, helium supply constraints, and energy costs are pushing prices higher. Mid-market hollowing out as consumers trade down or up.", color: "#8b5cf6" },
              { cat: "Game Consoles", insight: "Steepest tariff price increase (69%). Aluminum shortages from Gulf disruptions add pressure. CB May survey shows consumers economizing on games/toys specifically. Secondhand market surging.", color: "#ef4444" },
              { cat: "Smart Home & Wearables", insight: "Relatively resilient with lower tariff exposure. Smart glasses remain an innovation pocket. But the CB \"cheap thrills\" spending mode means even lower-ticket CE purchases face scrutiny when 57% of consumers cite cost-of-living pressure.", color: "#10b981" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 3, minHeight: 40, borderRadius: 2, background: item.color, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.cat}</div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.5 }}>{item.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>)}

      {activeTab === "timeline" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 20px" }}>Key Events &middot; Jan 2025\u2013Jun 2026</h3>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
            {timelineEvents.map((evt, i) => {
              const dc = evt.type === "positive" ? "#10b981" : evt.type === "negative" ? "#ef4444" : "#f59e0b";
              return (
                <div key={i} style={{ position: "relative", marginBottom: 16, paddingLeft: 20 }}>
                  <div style={{ position: "absolute", left: -21, top: 5, width: 12, height: 12, borderRadius: "50%", background: dc, border: "3px solid #0a0a0f", boxShadow: `0 0 8px ${dc}60` }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: dc, textTransform: "uppercase", letterSpacing: "0.5px" }}>{evt.date}</div>
                  <p style={{ fontSize: 13, color: "#cbd5e1", margin: "4px 0 0", lineHeight: 1.5 }}>{evt.event}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Data Sources</div>
          <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
            University of Michigan Surveys of Consumers (May final: 44.8, 5/22/26) &middot;
            Conference Board CCI (May: 93.1, 5/26/26) &middot;
            BLS Consumer Price Index (Apr CPI: 3.8% YoY, 5/12/26) &middot;
            Circana Future of Technology (Jan '26) &middot; CTA Industry Forecast (Jan '26) &middot;
            McKinsey ConsumerWise &middot; OpenBrand 2026 CE Price Forecasts (Apr '26) &middot;
            Fortune, Al Jazeera, Axios, Advisor Perspectives &middot;
            Wikipedia: Economic impact of the 2026 Iran war &middot;
            Next Michigan prelim: Jun 12 &middot; Next CB: Jun 30
          </p>
        </div>
      </div>)}

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 10, color: "#334155", textAlign: "center" }}>
        Analysis compiled June 8, 2026 &middot; Data from multiple industry sources &middot; Next data: Michigan prelim Jun 12, Conference Board Jun 30
      </div>
    </div>
  );
}
