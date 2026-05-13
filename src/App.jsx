import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from "recharts";

const sentimentData = [
  { month: "Jan '25", michigan: 73.2, conference: 104.1, phase: "optimism" },
  { month: "Feb '25", michigan: 71.7, conference: 100.1, phase: "optimism" },
  { month: "Mar '25", michigan: 68.5, conference: 93.9, phase: "decline" },
  { month: "Apr '25", michigan: 52.2, conference: 85.7, phase: "shock" },
  { month: "May '25", michigan: 50.8, conference: 80.6, phase: "shock" },
  { month: "Jun '25", michigan: 53.4, conference: 82.3, phase: "trough" },
  { month: "Jul '25", michigan: 56.1, conference: 86.0, phase: "trough" },
  { month: "Aug '25", michigan: 55.7, conference: 84.1, phase: "trough" },
  { month: "Sep '25", michigan: 54.2, conference: 83.5, phase: "trough" },
  { month: "Oct '25", michigan: 53.8, conference: 82.9, phase: "trough" },
  { month: "Nov '25", michigan: 53.1, conference: 81.5, phase: "erosion" },
  { month: "Dec '25", michigan: 52.9, conference: 79.8, phase: "erosion" },
  { month: "Jan '26", michigan: 56.4, conference: 89.0, phase: "stabilize" },
  { month: "Feb '26", michigan: 56.6, conference: 91.0, phase: "stabilize" },
  { month: "Mar '26", michigan: 53.3, conference: 91.8, phase: "reversal" },
  { month: "Apr '26", michigan: 49.8, conference: 92.8, phase: "crisis" },
  { month: "May '26*", michigan: 48.2, conference: null, phase: "crisis" },
];

const ceSpendingData = [
  { quarter: "Q1 '25", growth: 1.5, color: "#10b981" },
  { quarter: "Q2 '25", growth: 0.8, color: "#f59e0b" },
  { quarter: "Q3 '25", growth: -1.1, color: "#ef4444" },
  { quarter: "Q4 '25", growth: -2.2, color: "#ef4444" },
  { quarter: "Q1 '26*", growth: 0.2, color: "#6b7280" },
  { quarter: "Q2 '26*", growth: -0.5, color: "#ef4444" },
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
  { month: "Apr '26", expectations: 72.2, present: 123.8 },
];

const inflationExpData = [
  { month: "Jan '25", yearAhead: 3.3, longRun: 3.2 },
  { month: "Feb '25", yearAhead: 3.5, longRun: 3.2 },
  { month: "Mar '25", yearAhead: 3.9, longRun: 3.2 },
  { month: "Apr '25", yearAhead: 6.5, longRun: 3.3 },
  { month: "May '25", yearAhead: 5.8, longRun: 3.3 },
  { month: "Jun '25", yearAhead: 5.2, longRun: 3.3 },
  { month: "Jul '25", yearAhead: 4.8, longRun: 3.2 },
  { month: "Aug '25", yearAhead: 4.9, longRun: 3.3 },
  { month: "Sep '25", yearAhead: 4.4, longRun: 3.2 },
  { month: "Oct '25", yearAhead: 4.2, longRun: 3.3 },
  { month: "Nov '25", yearAhead: 4.0, longRun: 3.5 },
  { month: "Dec '25", yearAhead: 3.8, longRun: 3.3 },
  { month: "Jan '26", yearAhead: 4.0, longRun: 3.3 },
  { month: "Feb '26", yearAhead: 3.4, longRun: 3.3 },
  { month: "Mar '26", yearAhead: 3.8, longRun: 3.2 },
  { month: "Apr '26", yearAhead: 4.7, longRun: 3.5 },
  { month: "May '26*", yearAhead: 4.5, longRun: 3.4 },
];

const timelineEvents = [
  { date: "Jan 2025", event: "Stable start — 46% of consumers optimistic, low unemployment, steady inflation", type: "positive" },
  { date: "Apr 2, 2025", event: '"Liberation Day" — sweeping 25% tariffs on imports from China, Canada, Mexico. Net sentiment drops 32% in May.', type: "negative" },
  { date: "H1 2025", event: "CE sales grow 1.5% driven by tariff pull-forward buying in March–April. Best Buy FY26 guidance held initially.", type: "neutral" },
  { date: "Aug 2025", event: "New tariffs on ~70 countries. Sentiment reverses July rebound. Year-ahead inflation expectations hit 4.9%.", type: "negative" },
  { date: "H2 2025", event: "CE sales decline 2.2% YoY. Best Buy cuts guidance to $41.1–41.9B. 50% of consumers delay electronics purchases.", type: "negative" },
  { date: "Jan–Feb 2026", event: "False dawn: Michigan edges to 56.6 but gains are confined to stockholders. Circana forecasts just 0.2% CE growth.", type: "neutral" },
  { date: "Feb 28, 2026", event: "US military conflict with Iran begins. Strait of Hormuz closes Mar 4. Oil surges past $120/barrel.", type: "negative" },
  { date: "Mar 2026", event: "Michigan plunges 6% to 53.3. Year-ahead inflation expectations jump to 3.8%. Gas approaches $4/gallon.", type: "negative" },
  { date: "Apr 8, 2026", event: "Temporary two-week ceasefire. Michigan prelim hits record low 47.6 (98% surveyed pre-ceasefire); revised to 49.8 final.", type: "negative" },
  { date: "Apr 2026", event: "CPI hits 3.8% annual — highest in 3 years. Year-ahead inflation expectations surge to 4.7%. Electronics prices rise 0.6% m/m.", type: "negative" },
  { date: "May 8, 2026", event: "Michigan prelim: 48.2. Current conditions fell 9%. ~33% cite gas prices, ~30% cite tariffs. Buying conditions for durables deteriorate further.", type: "negative" },
  { date: "May 12, 2026", event: "April CPI released: 3.8% annual. Gas at $4.50/gallon nationally. Memory chip shortages from AI buildout pushing electronics prices higher.", type: "negative" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(15, 15, 20, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "12px 16px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
      }}>
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
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "18px 20px",
    flex: 1,
    minWidth: 170,
  }}>
    <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: "'Space Mono', monospace", letterSpacing: "-1px" }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {label}
    </div>
    {delta && (
      <div style={{
        fontSize: 11,
        color: delta.startsWith("+") ? "#10b981" : "#ef4444",
        marginTop: 8,
        fontWeight: 600,
      }}>
        {delta} <span style={{ color: "#475569", fontWeight: 400 }}>{deltaLabel}</span>
      </div>
    )}
  </div>
);

const PhaseLabel = ({ phase, color }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 100,
    fontSize: 10,
    fontWeight: 600,
    background: `${color}18`,
    color: color,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}>
    {phase}
  </span>
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
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0a0a0f",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: "32px 24px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 12px #ef444480" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              Case Study &middot; Updated 5/11/2026
            </span>
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2,
            background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            US Consumer Electronics Sentiment
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
            Jan 2025 &mdash; May 2026 &middot; Tariffs + Iran war: a dual-shock confidence crisis pushes consumer sentiment to historic lows
          </p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
              background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === tab.id ? "#e2e8f0" : "#64748b",
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <StatCard value="48.2" label="Michigan (May '26 prelim)" delta="-34%" deltaLabel="vs Jan 2025 · Record low" color="#ef4444" />
              <StatCard value="$4.50" label="Gas price (5/12/26)" delta="+40%" deltaLabel="vs Jan 2026" color="#ea580c" />
              <StatCard value="3.8%" label="April CPI (annual)" delta="+1.5pp" deltaLabel="vs Jan · 3-year high" color="#ef4444" />
              <StatCard value="4.5%" label="Inflation expectations" delta="+1.1pp" deltaLabel="vs Feb '26 low" color="#f59e0b" />
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(220,38,38,0.1), rgba(234,88,12,0.06))",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 14, padding: "20px 24px", marginBottom: 20,
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <div style={{ fontSize: 22, marginTop: 2 }}>{"\u26A0"}</div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 6px" }}>
                  Dual Shock: Tariffs + Iran War = Historic Lows
                </h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Consumer sentiment has reached its lowest level since the University of Michigan began tracking in 1952. The May preliminary reading of 48.2 reflects compounding pressures: ongoing tariffs and supply chain disruptions from the Iran war, which closed the Strait of Hormuz in early March and pushed crude oil past $120/barrel. Gas prices hit $4.50/gallon in mid-May. Year-ahead inflation expectations surged from 3.4% (Feb) to 4.5% (May).
                </p>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.04))",
              border: "1px solid rgba(239,68,68,0.12)",
              borderRadius: 14, padding: "24px 28px", marginBottom: 28,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#f59e0b" }}>
                The Story in Seven Phases
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { phase: "Cautious Optimism", period: "Jan–Feb '25", color: "#10b981", desc: "46% optimistic. Electronics spending intentions muted but stable." },
                  { phase: "Tariff Shock", period: "Apr–May '25", color: "#ef4444", desc: '"Liberation Day" tariffs. Net sentiment fell 32%. Pull-forward CE buying in March–April.' },
                  { phase: "Bifurcated Trough", period: "Jun–Aug '25", color: "#f59e0b", desc: "Brief July rebound collapsed with August tariff wave. High-income sustained spending; lower-income pulled back sharply." },
                  { phase: "Holiday Erosion", period: "Sep–Dec '25", color: "#ef4444", desc: "H2 CE sales fell 2.2%. Best Buy cut guidance. 50% delayed electronics purchases. Michigan hit 52.9." },
                  { phase: "False Dawn", period: "Jan–Feb '26", color: "#6b7280", desc: "Michigan edged to 56.6. Gains confined to stockholders; non-equity households stagnated." },
                  { phase: "Iran War Shock", period: "Mar–Apr '26", color: "#dc2626", desc: "Strait of Hormuz closed. Oil past $120/bbl. Michigan crashed to record low 49.8. CPI hit 3.8% (3-year high)." },
                  { phase: "Crisis Floor", period: "May '26–Now", color: "#991b1b", desc: "Michigan at 48.2 — all-time low. Current conditions fell 9%. Gas at $4.50. Electronics prices rising 3%+ annually." },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 130, paddingTop: 2 }}>
                      <PhaseLabel phase={p.phase} color={p.color} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{p.period}</span>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 20px 8px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 16px", color: "#94a3b8" }}>
                Michigan Consumer Sentiment Index · Jan 2025–May 2026
              </h3>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis domain={[44, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={50} stroke="rgba(239,68,68,0.35)" strokeDasharray="4 4" label={{ value: "Previous all-time low (Jun 2022)", fill: "#ef444460", fontSize: 9, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="michigan" stroke="#ef4444" strokeWidth={2.5} fill="url(#sentGrad)" name="Michigan Index" dot={{ r: 3, fill: "#ef4444", stroke: "#0a0a0f", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "sentiment" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Dual Confidence Indices</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>
                Michigan (household finances/inflation focus) vs Conference Board (labor market focus) · Historic divergence: Michigan at record lows while CB holds steady
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis yAxisId="left" domain={[44, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Michigan", angle: -90, position: "insideLeft", offset: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[70, 110]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Conf. Board", angle: 90, position: "insideRight", offset: -10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Line yAxisId="left" type="monotone" dataKey="michigan" stroke="#ef4444" strokeWidth={2.5} name="Michigan Sentiment" dot={{ r: 3, fill: "#ef4444", stroke: "#0a0a0f", strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="conference" stroke="#3b82f6" strokeWidth={2.5} name="Conference Board" dot={{ r: 3, fill: "#3b82f6", stroke: "#0a0a0f", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { title: "All-Time Low", value: "48.2", detail: "May '26 preliminary Michigan reading is the lowest since the survey began in 1952. Below the June 2022 pandemic-inflation trough of 50.2." },
                { title: "Unprecedented Gap", value: "45pt", detail: "Michigan at 48.2, Conference Board at 92.8. The widest divergence ever reflects their different focuses: Michigan tracks prices/inflation; CB tracks jobs." },
                { title: "Bipartisan Collapse", value: "All", detail: "April's plunge was \"a rare moment of bipartisan agreement\" — declines across all political affiliations, income levels, regions." },
                { title: "Ceasefire Effect", value: "+2.2", detail: "April prelim 47.6 revised to 49.8 final after April 8 ceasefire. But May relapsed to 48.2 as gas stayed high and supply disruptions continued." },
              ].map((card, i) => (
                <div key={i} style={{ flex: "1 1 200px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.title}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Space Mono', monospace", margin: "4px 0" }}>{card.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{card.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "divergence" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Present vs. Expectations: The Widening Gap</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>
                Conference Board sub-indices · Expectations below 80 for 15 straight months (recession signal threshold)
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expectationsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis domain={[55, 130]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <ReferenceLine y={80} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: "80 = Recession Signal", fill: "#ef444480", fontSize: 9, position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2.5} name="Present Situation" dot={{ r: 3, fill: "#10b981", stroke: "#0a0a0f", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="expectations" stroke="#ef4444" strokeWidth={2.5} name="Expectations Index" dot={{ r: 3, fill: "#ef4444", stroke: "#0a0a0f", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", margin: "0 0 8px" }}>The Expectations Trap</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Expectations Index at 72.2 — below the 80 recession threshold for 15 consecutive months. In 1990, 2001, and 2007, similar gaps preceded recessions. The Michigan Expectations sub-index reinforces the gloom.
                </p>
              </div>
              <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>The Labor Market Buffer (Eroding)</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Present Situation at 123.8 — still elevated because jobs remain available. But "hard to get" responses hit a 5-year high of 21.5% in March. Goldman Sachs projects unemployment to rise to 5.2%.
                </p>
              </div>
              <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(234,88,12,0.06), rgba(234,88,12,0.02))", border: "1px solid rgba(234,88,12,0.12)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", margin: "0 0 8px" }}>Why It's Toxic for CE</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  "OK today, terrified of tomorrow" consumers defer big-ticket purchases. Buying conditions for durables are at crisis levels. Consumer spending trends remain "cheap thrills and necessities only."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inflation" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Consumer Inflation Expectations (Michigan)</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>
                Year-ahead and long-run expectations · Two distinct spikes: Apr '25 (tariffs) and Apr '26 (Iran war)
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={inflationExpData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis domain={[2.5, 7]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Line type="monotone" dataKey="yearAhead" stroke="#ef4444" strokeWidth={2.5} name="Year-Ahead" dot={{ r: 3, fill: "#ef4444", stroke: "#0a0a0f", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="longRun" stroke="#f59e0b" strokeWidth={2.5} name="Long-Run (5-10yr)" dot={{ r: 3, fill: "#f59e0b", stroke: "#0a0a0f", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 280px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", margin: "0 0 8px" }}>The Double Spike Pattern</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Two distinct inflation expectation spikes: April 2025 (tariff shock, 6.5%) and April 2026 (Iran war, 4.7%). Both driven by different causes but reinforcing the same consumer psychology of vulnerability.
                </p>
              </div>
              <div style={{ flex: "1 1 280px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", margin: "0 0 8px" }}>CE-Specific Price Pressures</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Electronics face a triple cost squeeze: (1) tariffs on Chinese imports, (2) energy/shipping cost passthrough from the Iran war, and (3) memory chip shortages from the AI buildout.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "spending" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Consumer Electronics Sales Growth (YoY %)</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>
                *Q1 &amp; Q2 '26 = Circana forecast/estimates · Source: Circana POS data
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ceSpendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="quarter" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                  <Bar dataKey="growth" name="YoY Growth %" radius={[6, 6, 0, 0]} barSize={52}>
                    {ceSpendingData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(220,38,38,0.06), rgba(220,38,38,0.02))", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 8px" }}>The Triple Squeeze on CE</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  <strong style={{ color: "#e2e8f0" }}>Tariffs:</strong> Still the base layer. 25% on Chinese imports. CTA estimates $123B in lost consumer purchasing power.
                  <br/><strong style={{ color: "#e2e8f0" }}>Energy:</strong> Iran war pushed gas to $4.50/gallon. Freight, distribution, and manufacturing costs surging. Diesel hits shipping costs everywhere.
                  <br/><strong style={{ color: "#e2e8f0" }}>Supply chain:</strong> Memory chip shortages (AI buildout), tungsten prices up 50%+, aluminum up 8% from Gulf disruptions.
                </p>
              </div>
              <div style={{ flex: "1 1 280px", background: "linear-gradient(135deg, rgba(107,114,128,0.06), rgba(107,114,128,0.02))", border: "1px solid rgba(107,114,128,0.12)", borderRadius: 14, padding: "20px 24px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>2026 Outlook: Darkening</h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Circana's Jan forecast of 0.2% growth now looks optimistic given the Iran war's compounding effect. Average CE prices climbing ~3% on top of tariff inflation. The income bifurcation continues: wealthy consumers still buying; mass market postponing purchases.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Tariff-Driven Price Increases vs Projected Purchase Decline</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>Source: CTA/Trade Partnership Worldwide · Note: Iran war energy/supply costs compound these tariff figures</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryImpactData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                  <YAxis type="category" dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Bar dataKey="priceIncrease" name="Avg Price Increase %" fill="#f59e0b" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="purchaseDecline" name="Projected Purchase Decline %" fill="#ef4444" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: "#94a3b8" }}>Updated Category Dynamics (May 2026)</h4>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { cat: "Smartphones", color: "#3b82f6", insight: "53% of CE revenue. Tariff price increases of ~26% compounded by memory chip shortages from AI demand. BNPL financing sustaining some demand. But March data shows a slowdown in flagship upgrades." },
                  { cat: "Laptops & Tablets", color: "#8b5cf6", insight: "Most exposed (68% purchase decline projected). Win10 EOL still driving replacement demand. But computers/electronics prices climbing from chip scarcity and tariffs. Consumers trading down to Chromebooks." },
                  { cat: "Game Consoles", color: "#ec4899", insight: "69% price increase projected. Secondhand/resale booming. Aluminum shortages from Gulf state disruptions could add further pressure on console manufacturing and supplies." },
                  { cat: "Smart Home & Wearables", color: "#06b6d4", insight: "Relatively resilient with lower tariff exposure. Smart glasses remain an innovation bright spot. But consumer spending firmly in \"cheap thrills and necessities\" mode — discretionary stalling." },
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
          </div>
        )}

        {activeTab === "timeline" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 20px" }}>Key Events · Jan 2025–May 2026</h3>
              <div style={{ position: "relative", paddingLeft: 24 }}>
                <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
                {timelineEvents.map((evt, i) => {
                  const dotColor = evt.type === "positive" ? "#10b981" : evt.type === "negative" ? "#ef4444" : "#f59e0b";
                  return (
                    <div key={i} style={{ position: "relative", marginBottom: 18, paddingLeft: 20 }}>
                      <div style={{ position: "absolute", left: -21, top: 5, width: 12, height: 12, borderRadius: "50%", background: dotColor, border: "3px solid #0a0a0f", boxShadow: `0 0 8px ${dotColor}40` }} />
                      <div style={{ fontSize: 11, fontWeight: 700, color: dotColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>{evt.date}</div>
                      <p style={{ fontSize: 13, color: "#cbd5e1", margin: "4px 0 0", lineHeight: 1.5 }}>{evt.event}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Data Sources</div>
              <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                University of Michigan Surveys of Consumers (May '26 prelim: 48.2, 5/8/26; Apr final: 49.8, 4/24/26) · Conference Board CCI (Apr '26: 92.8, 4/28/26) · BLS Consumer Price Index (Apr '26 CPI: 3.8%, 5/12/26) · Circana Future of Technology (Jan '26) · CTA Industry Forecast (Jan '26) · McKinsey ConsumerWise · Deloitte Consumer Products Outlook · CTA/Trade Partnership Worldwide Tariff Impact · Wikipedia: Economic impact of the 2026 Iran war · Fortune, Al Jazeera, Axios, Advisor Perspectives (May 2026)
              </p>
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 10, color: "#334155", textAlign: "center" }}>
          Analysis compiled May 11, 2026 · Data from multiple industry sources · *Preliminary or forecast figures
        </div>
      </div>
    </div>
  );
}
