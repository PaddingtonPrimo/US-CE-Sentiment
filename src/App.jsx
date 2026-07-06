import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from "recharts";

// ============================================================
// US CONSUMER ELECTRONICS SENTIMENT & META OUTLOOK — v2.2
// Jan 2025 – Jul 2026 actuals · 2027 scenario outlook
// Data refreshed July 6, 2026. Post-audit build: reviewed by
// three independent audits (data accuracy, executive formatting,
// source consolidation) prior to publish.
// All externally sourced claims are hyperlinked inline via
// numbered chips that match the numbered Sources tab.
// FORECAST-tagged content is projection, not observed data.
// ============================================================

// ---------- SOURCE REGISTRY (numbered; rendered in Sources tab) ----------
const SRC = {
  umich: { label: "UMich Surveys of Consumers", url: "https://www.sca.isr.umich.edu/" },
  fredUMC: { label: "FRED: UMCSENT (Michigan sentiment index)", url: "https://fred.stlouisfed.org/series/UMCSENT" },
  fredMICH: { label: "FRED: MICH (Michigan year-ahead inflation expectations)", url: "https://fred.stlouisfed.org/series/MICH" },
  umichJun26: { label: "Advisor Perspectives — Michigan June 2026 final", url: "https://www.advisorperspectives.com/dshort/updates/2026/06/26/consumer-sentiment-rises-on-cheaper-gas-but-inflation-worries-persist" },
  umichMay26: { label: "Advisor Perspectives — Michigan May 2026 record low", url: "https://www.advisorperspectives.com/dshort/updates/2026/05/22/consumer-sentiment-sinks-to-record-low-as-cost-of-living-concerns-intensify" },
  umichApr26: { label: "Advisor Perspectives — Michigan April 2026", url: "https://www.advisorperspectives.com/dshort/updates/2026/04/10/consumer-sentiment-plunges-to-lowest-level-on-record" },
  umichFeb26: { label: "Advisor Perspectives — Michigan February 2026", url: "https://www.advisorperspectives.com/dshort/updates/2026/02/20/consumer-sentiment-was-stagnate-in-february" },
  umichJan26: { label: "Advisor Perspectives — Michigan January 2026 (six-month peak)", url: "https://www.advisorperspectives.com/dshort/updates/2026/02/06/consumer-sentiments-marginal-gains-six-month-peak-still-feels-like-a-valley" },
  umichDec25: { label: "Advisor Perspectives — Michigan December 2025", url: "https://www.advisorperspectives.com/dshort/updates/2025/12/19/consumer-sentiment-down-nearly-30-from-a-year-ago" },
  umichNov25: { label: "CNBC — Sentiment nears lowest level ever (Nov 2025)", url: "https://www.cnbc.com/2025/11/07/consumer-sentiment-shutdown.html" },
  umichSep25: { label: "Advisor Perspectives — Michigan September 2025 final", url: "https://www.advisorperspectives.com/dshort/updates/2025/09/26/consumer-sentiment-university-michigan-september-2025-final-report" },
  indexboxJun: { label: "IndexBox — Michigan June 2026 final at 49.5", url: "https://www.indexbox.io/blog/us-consumer-sentiment-rises-in-june-2026-on-lower-gas-prices-but-remains-near-historic-lows/" },
  qzJun: { label: "Quartz — Sentiment rebounds from record lows", url: "https://qz.com/university-michigan-consumer-sentiment-june-2026-062626" },
  cbTopic: { label: "The Conference Board — Consumer Confidence", url: "https://www.conference-board.org/topics/consumer-confidence/" },
  cbJun26: { label: "Advisor Perspectives — Conference Board June 2026", url: "https://www.advisorperspectives.com/dshort/updates/2026/06/30/consumer-confidence-conference-board-june-2026" },
  cbJun26PR: { label: "PR Newswire — Conference Board: Confidence Inched Up in June 2026", url: "https://www.prnewswire.com/news-releases/us-consumer-confidence-inched-up-in-june-302814510.html" },
  cbApr26PR: { label: "PR Newswire — Conference Board: Confidence Edged Up Again in April 2026", url: "https://www.prnewswire.com/news-releases/us-consumer-confidence-edged-up-again-in-april-302755679.html" },
  cbMar26: { label: "ABA Banking Journal — Conference Board March 2026", url: "https://bankingjournal.aba.com/2026/03/consumer-confidence-rose-in-march/" },
  cbDec25PR: { label: "PR Newswire — Conference Board: Confidence Fell Again in December 2025", url: "https://www.prnewswire.com/news-releases/us-consumer-confidence-fell-again-in-december-302648784.html" },
  cbNov25: { label: "PBS — Confidence slips after shutdown (Nov 2025)", url: "https://www.pbs.org/newshour/economy/consumer-confidence-slips-as-americans-grow-wary-of-high-costs-and-labor-market" },
  cbSep25: { label: "CNBC — Conference Board September 2025", url: "https://www.cnbc.com/2025/09/30/consumer-confidence-is-lower-than-expected-as-wall-street-braces-for-shutdown-data-blackout.html" },
  cbJul25: { label: "The National Desk — Conference Board July 2025", url: "https://thenationaldesk.com/news/americas-news-now/consumer-confidence-stabilized-but-tariff-concerns-still-weigh-on-americans-the-conference-board-consumer-confidence-index-july-2025-inflation-job-market-economy" },
  cbMay25: { label: "Marketplace — Conference Board May 2025: biggest monthly gain in 4 years", url: "https://www.marketplace.org/story/2025/05/27/consumer-confidence-has-highest-monthly-increase-in-four-years" },
  cbJan25: { label: "The Conference Board — CCI January 2025 release", url: "https://www.conference-board.org/topics/consumer-confidence/press/CCI-Jan-2025" },
  cpiMay26: { label: "BLS — CPI Summary, May 2026 (archived release)", url: "https://www.bls.gov/news.release/archives/cpi_06102026.htm" },
  cpiCnbc: { label: "CNBC — May 2026 inflation breakdown", url: "https://www.cnbc.com/2026/06/10/heres-the-inflation-breakdown-for-may-2026-in-one-chart.html" },
  aaa: { label: "AAA — National average gas prices (live page; value as of 7/5/26)", url: "https://gasprices.aaa.com/" },
  eiaSteo: { label: "EIA — Short-Term Energy Outlook, June 2026 (archived)", url: "https://www.eia.gov/outlooks/steo/archives/jun26.pdf" },
  eiaTie: { label: "EIA — Lower oil prices in 2026–27 on stock builds", url: "https://www.eia.gov/todayinenergy/detail.php?id=67164" },
  fortuneOil: { label: "Fortune — Oil price, July 6 2026", url: "https://fortune.com/article/price-of-oil-07-06-2026/" },
  wikiHormuz: { label: "Wikipedia — 2026 Strait of Hormuz crisis", url: "https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis" },
  rlQ1: { label: "VR.org — Reality Labs Q1 2026 earnings analysis (secondary)", url: "https://vr.org/articles/meta-reality-labs-q1-2026-earnings-vr-smart-glasses-pivot" },
  rlQ1Cnbc: { label: "CNBC — Reality Labs lost over $4B in Q1 2026", url: "https://www.cnbc.com/2026/04/29/metas-reality-labs-lost-over-4-billion-in-first-quarter.html" },
  rlQ4Cnbc: { label: "CNBC — Reality Labs $6.02B Q4 2025 loss", url: "https://www.cnbc.com/2026/01/28/metas-reality-labs-posts-6point02-billion-loss-in-fourth-quarter.html" },
  metaPricing: { label: "Meta — Update on Meta Quest Pricing (Apr 2026)", url: "https://www.meta.com/blog/update-meta-quest-pricing/" },
  forbesQuest: { label: "Forbes — Quest 3 hit with $100 price increase", url: "https://www.forbes.com/sites/andrewwilliams/2026/04/17/meta-quest-3-hit-with-100-price-increase/" },
  pcgamerQuest: { label: "PC Gamer — Quest price rise & memory costs", url: "https://www.pcgamer.com/hardware/vr-hardware/meta-is-raising-the-price-of-the-quest-3-and-quest-3s-due-to-memory-price-rises-made-worse-by-meta/" },
  elCnbc: { label: "CNBC — EssilorLuxottica tripled Meta AI glasses sales in 2025", url: "https://www.cnbc.com/2026/02/11/ray-ban-maker-essilorluxottica-triples-sales-of-meta-ai-glasses.html" },
  uploadvr7m: { label: "UploadVR — 7M smart glasses sold in 2025", url: "https://www.uploadvr.com/meta-essilorluxottica-sold-7-million-smart-glasses-in-2025/" },
  bbergCapacity: { label: "Bloomberg — Ray-Ban Meta output may double (Jan 2026)", url: "https://www.bloomberg.com/news/articles/2026-01-13/meta-said-to-discuss-doubling-ray-ban-glasses-output-after-surge-in-demand" },
  idcGlasses: { label: "IDC — Smart Glasses Surge: XR market rewriting its rules", url: "https://www.idc.com/resource-center/blog/smart-glasses-surge-the-xr-market-is-rewriting-its-own-rules/" },
  idcGlassesFc: { label: "Next Reality — IDC smart glasses forecasts 2026–2030 (IDC via Next Reality)", url: "https://virtual.reality.news/news/smart-glasses-market-2026-growth-competitors-and-idc-forecasts/" },
  counterpoint: { label: "Counterpoint — Smart glasses +110% YoY in H1 2025; Meta >70% share", url: "https://counterpointresearch.com/en/insights/post-insight-research-briefs-blogs-global-smart-glasses-shipments-soared-110-yoy-in-h1-2025-with-meta-capturing-over-70-share" },
  idcXR: { label: "IDC — Global XR shipments rebound on glasses-first momentum", url: "https://my.idc.com/getdoc.jsp?containerId=prUS54033425" },
  sqmagVR: { label: "SQ Magazine — VR statistics 2026 (aggregator; estimates uncorroborated)", url: "https://sqmagazine.co.uk/virtual-reality-statistics/" },
  samsungGlasses: { label: "Android Headlines — These are the Samsung Galaxy Glasses (May 2026)", url: "https://www.androidheadlines.com/samsung-galaxy-glasses" },
  samsungUnpacked: { label: "Gadget Hacks — Galaxy Glasses launch July 2026", url: "https://samsung.gadgethacks.com/news/samsung-galaxy-glasses-launch-july-2026-features-privacy-and-tradeoffs/" },
  tomsSamsung: { label: "Tom's Guide — Samsung confirms Android XR glasses in 2026", url: "https://www.tomsguide.com/computing/smart-glasses/samsung-just-confirmed-its-android-xr-smart-glasses-will-launch-this-year-heres-how-they-can-beat-ray-ban-meta" },
  roadtovr27: { label: "Road to VR — Samsung display glasses possibly 2027", url: "https://roadtovr.com/samsung-display-smart-glasses-release-2027/" },
  idevice: { label: "iDevice — Smart glasses release schedule (Apple ~2027)", url: "https://idevice.com/smart-glasses-release-schedule-samsung-meta-snap-google-apple" },
  bbyQ1: { label: "CNBC — Best Buy Q1 FY27 earnings (May 2026)", url: "https://www.cnbc.com/2026/05/28/best-buy-bby-q1-2027-earnings.html" },
  bbyCorp: { label: "Best Buy — Q1 FY27 results", url: "https://corporate.bestbuy.com/2026/best-buy-reports-q1-fy27-results/" },
  ctaJan26: { label: "CTA — US consumer tech revenue to hit $565B in 2026", url: "https://www.prnewswire.com/news-releases/cta-despite-tariffs-and-economic-headwinds-us-consumer-tech-revenue-to-hit-565-billion-in-2026-302652218.html" },
  ctaTariff: { label: "CTA — Tariff impact snapshot (with Trade Partnership Worldwide)", url: "https://www.cta.tech/research/consumer-technology-industry-forecast-2025-2026-tariff-impact-snapshot/" },
  ctaVariety: { label: "Variety — CTA/TPW revised tariff price estimates (Jan 2025)", url: "https://variety.com/2025/digital/news/trump-tariffs-raise-prices-smartphones-game-consoles-cta-1236388958/" },
  circanaJan26: { label: "Circana — US CE hardware forecast $112B for 2026", url: "https://www.circana.com/post/us-consumer-technology-sales-forecast-to-reach-112-billion-in-2026-reports-circana" },
  circanaRetail: { label: "Chain Store Age — Circana: retail closed 2025 +2% dollars, flat units", url: "https://chainstoreage.com/circana-retail-closed-2025-2-dollar-growth-flat-unit-demand" },
  gamefileNov: { label: "Game File — November 2025 console sales drop (Circana)", url: "https://www.gamefile.news/p/november-2025-console-sales-drop-black-ops-7" },
  gamedevDec: { label: "GameDev Reports — Circana Dec 2025 + FY2025 gaming", url: "https://gamedevreports.substack.com/p/circana-the-us-gaming-market-in-december25" },
  trendforce: { label: "TrendForce — Memory price surge persists into 1Q26", url: "https://www.trendforce.com/presscenter/news/20251211-12831.html" },
  tomsDram: { label: "Tom's Hardware — DRAM/NAND contract prices climb again in Q2 2026", url: "https://www.tomshardware.com/pc-components/dram/dram-and-nand-contract-prices-to-climb-again-in-q2" },
  idcMemory: { label: "IDC — Global memory shortage crisis & 2026 device impact", url: "https://www.idc.com/resource-center/blog/global-memory-shortage-crisis-market-analysis-and-the-potential-impact-on-the-smartphone-and-pc-markets-in-2026/" },
  memRoundup: { label: "SoftwareSeni — Memory-market analyst roundup (TrendForce, Gartner, Counterpoint)", url: "https://www.softwareseni.com/dram-prices-in-2026-have-doubled-and-the-numbers-are-getting-worse/" },
  openbrand: { label: "OpenBrand — 2026 price forecasts for durables", url: "https://openbrand.com/newsroom/blog/2026-price-forecasts-for-durables" },
};
const SRC_KEYS = Object.keys(SRC);
const srcNum = (id) => SRC_KEYS.indexOf(id) + 1;

// ---------- DATA (verified against sources; see Sources tab) ----------
// Michigan finals per UMich/FRED and monthly Advisor Perspectives coverage.
// Conference Board values reflect latest published revisions (e.g., Dec '25
// revised up to 94.2; Jan '26 initially 84.5, revised to 89.0; May '26
// revised down to 90.6).
// NOTE v2: H2 2025 values in the prior published dashboard were interpolated
// placeholders; this version replaces them with final released figures.
const sentimentData = [
  { month: "Jan '25", michigan: 71.7, conference: 104.1 },
  { month: "Feb '25", michigan: 64.7, conference: 98.3 },
  { month: "Mar '25", michigan: 57.0, conference: 92.9 },
  { month: "Apr '25", michigan: 52.2, conference: 86.0 },
  { month: "May '25", michigan: 52.2, conference: 98.0 },
  { month: "Jun '25", michigan: 60.7, conference: 95.2 },
  { month: "Jul '25", michigan: 61.7, conference: 97.2 },
  { month: "Aug '25", michigan: 58.2, conference: 97.8 },
  { month: "Sep '25", michigan: 55.1, conference: 94.2 },
  { month: "Oct '25", michigan: 53.6, conference: 95.5 },
  { month: "Nov '25", michigan: 51.0, conference: 92.9 },
  { month: "Dec '25", michigan: 52.9, conference: 94.2 },
  { month: "Jan '26", michigan: 56.4, conference: 89.0 },
  { month: "Feb '26", michigan: 56.6, conference: 91.2 },
  { month: "Mar '26", michigan: 53.3, conference: 92.2 },
  { month: "Apr '26", michigan: 49.8, conference: 92.8 },
  { month: "May '26", michigan: 44.8, conference: 90.6 },
  { month: "Jun '26", michigan: 49.5, conference: 91.2 },
];

// Michigan inflation expectations — restricted to the verified 2026 window.
// (The Apr–May 2025 tariff-shock peak of 6.5–6.6% year-ahead is annotated in text.)
const inflationExpData = [
  { month: "Feb '26", yearAhead: 3.4, longRun: 3.3 },
  { month: "Mar '26", yearAhead: 3.8, longRun: 3.2 },
  { month: "Apr '26", yearAhead: 4.7, longRun: 3.5 },
  { month: "May '26", yearAhead: 4.8, longRun: 3.9 },
  { month: "Jun '26", yearAhead: 4.6, longRun: 3.3 },
];

// Directional internal estimates (2020 Companies analysis) anchored to
// Circana POS context, CTA forecasts, and Best Buy earnings. NOT an
// official Circana series. Color rule: green >1%, amber 0–1%, red <0%.
const ceSpendingData = [
  { quarter: "Q1 '25", growth: 1.5, color: "#10b981" },
  { quarter: "Q2 '25", growth: 0.8, color: "#f59e0b" },
  { quarter: "Q3 '25", growth: -1.1, color: "#ef4444" },
  { quarter: "Q4 '25", growth: -2.2, color: "#ef4444" },
  { quarter: "Q1 '26", growth: 0.2, color: "#f59e0b" },
  { quarter: "Q2 '26", growth: -1.0, color: "#ef4444" },
];

// CTA / Trade Partnership Worldwide revised (Jan 2025) tariff-only modeled
// price increases. FORECAST — modeled impacts, not observed outcomes.
const categoryImpactData = [
  { category: "Game Consoles", priceIncrease: 69 },
  { category: "Laptops/Tablets", priceIncrease: 34 },
  { category: "Monitors", priceIncrease: 32 },
  { category: "Smartphones", priceIncrease: 31 },
  { category: "Wearables/Smart Glasses", priceIncrease: 22 },
];

// Meta / EssilorLuxottica AI glasses — units sold (actual) vs capacity (target).
const glassesUnitsData = [
  { label: "'23+'24 (sold)", value: 2, color: "#64748b", kind: "Actual" },
  { label: "2025 (sold)", value: 7, color: "#10b981", kind: "Actual" },
  { label: "2026 capacity target", value: 20, color: "#3b82f6", kind: "Target" },
  { label: "Potential if demand holds", value: 30, color: "#8b5cf6", kind: "Target" },
];

// Quest price changes effective April 19, 2026 (Meta blog).
const questPriceData = [
  { sku: "Quest 3S 128GB", before: 299.99, after: 349.99 },
  { sku: "Quest 3S 256GB", before: 399.99, after: 449.99 },
  { sku: "Quest 3 512GB", before: 499.99, after: 599.99 },
];

// FORECAST — 2020 Companies internal scenario paths for Michigan sentiment.
// Illustrative trajectories only; not a source-published forecast.
const scenarioData = [
  { month: "Jun '26", base: 49.5, bull: 49.5, bear: 49.5 },
  { month: "Sep '26", base: 51, bull: 54, bear: 46 },
  { month: "Dec '26", base: 53, bull: 58, bear: 43 },
  { month: "Mar '27", base: 55, bull: 62, bear: 42 },
  { month: "Jun '27", base: 57, bull: 65, bear: 41 },
  { month: "Sep '27", base: 59, bull: 68, bear: 43 },
  { month: "Dec '27", base: 61, bull: 70, bear: 45 },
];

const timelineEvents = [
  { date: "Jan 2025", event: "Baseline: Michigan 71.7, Conference Board 104.1. Consumers cautious but stable.", type: "positive", src: ["cbJan25", "fredUMC"] },
  { date: "Apr 2, 2025", event: "“Liberation Day” tariffs announced. Michigan bottoms at 52.2 in April; year-ahead inflation expectations spike to 6.5% (peaking at 6.6% in May) — the highest since the early 1980s.", type: "negative", src: ["fredUMC", "fredMICH"] },
  { date: "May 2025", event: "US–China truce lowers mutual tariffs. Conference Board posts its biggest monthly gain in four years (86.0 → 98.0); Michigan rebounds to 60.7 by June.", type: "positive", src: ["cbMay25", "fredUMC"] },
  { date: "Oct 1–Nov 12, 2025", event: "Federal government shutdown. Michigan slides to 51.0 in November — then just off its record low; Conference Board falls to 92.9.", type: "negative", src: ["umichNov25", "cbNov25"] },
  { date: "Nov–Dec 2025", event: "Weak CE holiday: November gaming hardware $695M, −27% YoY — worst November since 2005. December dollars +6% but units −8% as console prices rise 18%.", type: "negative", src: ["gamefileNov", "gamedevDec"] },
  { date: "Jan 2026", event: "CES forecasts: CTA sees $565B US consumer tech (+3.7%); Circana sees $112B CE hardware (+0.2%). Bloomberg reports Meta/EssilorLuxottica discussing doubling Ray-Ban output.", type: "neutral", src: ["ctaJan26", "circanaJan26", "bbergCapacity"] },
  { date: "Feb 11, 2026", event: "EssilorLuxottica reports Meta AI glasses sales more than tripled in 2025 — over 7M units sold.", type: "positive", src: ["elCnbc", "uploadvr7m"] },
  { date: "Feb 28, 2026", event: "US–Iran conflict begins; Strait of Hormuz closes March 4. Oil surges past $120/barrel.", type: "negative", src: ["wikiHormuz"] },
  { date: "Mar–Apr 2026", event: "Michigan falls to 53.3, then 49.8. Year-ahead inflation expectations jump to 4.7%; gas surges toward $4.30/gallon.", type: "negative", src: ["umichApr26", "aaa"] },
  { date: "Apr 19, 2026", event: "Meta raises Quest prices $50–100 (Quest 3S from $299.99 to $349.99; Quest 3 512GB to $599.99), citing surging memory-chip costs.", type: "negative", src: ["metaPricing", "forbesQuest"] },
  { date: "May 22, 2026", event: "Michigan FINAL crashes to 44.8 — lowest reading on record, far below the 48.2 preliminary. Long-run inflation expectations hit 3.9%.", type: "negative", src: ["umichMay26"] },
  { date: "May 28, 2026", event: "Best Buy beats: Q1 FY27 comparable sales +2%, led by gaming, computing, mobile; FY guidance reiterated at $41.2–42.1B. Spending proves more resilient than sentiment.", type: "positive", src: ["bbyQ1", "bbyCorp"] },
  { date: "Jun 10–11, 2026", event: "May CPI: +4.2% YoY, +0.5% m/m; energy drove over 60% of the monthly increase.", type: "negative", src: ["cpiMay26", "cpiCnbc"] },
  { date: "Jun 26, 2026", event: "Michigan rebounds to 49.5 (+10.5%) as gas prices ease — first improvement in four months. Long-run inflation expectations fall back to 3.3% from 3.9%.", type: "neutral", src: ["umichJun26"] },
  { date: "Jun 30, 2026", event: "Conference Board inches up to 91.2, but jobs “hard to get” hits 22.5% — highest since January 2021. Expectations Index below 80 for a 17th month.", type: "neutral", src: ["cbJun26", "cbJun26PR"] },
  { date: "Jul 6, 2026", event: "Brent near $72 as OPEC+ plans August output hikes and escorted-corridor flows recover; AAA national average gas $3.80, down ~50¢ from the early-June level near $4.30.", type: "positive", src: ["fortuneOil", "aaa"] },
];

// ---------- UI PRIMITIVES ----------
const A = ({ s, children }) => (
  <a href={SRC[s].url} target="_blank" rel="noopener noreferrer" title={SRC[s].label}
    style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa66" }}>{children}</a>
);

// Numbered chips are STABLE: each number maps to the same entry in the
// numbered Sources tab throughout the readout.
const CiteChips = ({ ids }) => (
  <span style={{ marginLeft: 6, whiteSpace: "nowrap" }}>
    {ids.map((id) => (
      <a key={id} href={SRC[id].url} target="_blank" rel="noopener noreferrer" title={SRC[id].label}
        style={{ fontSize: 9, color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 4, padding: "0px 4px", marginRight: 3, textDecoration: "none", fontFamily: "'Space Mono', monospace" }}>
        {srcNum(id)}
      </a>
    ))}
  </span>
);

const ForecastBadge = ({ text = "FORECAST" }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.35)", textTransform: "uppercase", letterSpacing: "0.8px", verticalAlign: "middle" }}>{text}</span>
);

const BottomLine = ({ children }) => (
  <div style={{ borderLeft: "3px solid #f59e0b", background: "rgba(245,158,11,0.06)", borderRadius: "0 10px 10px 0", padding: "10px 16px", marginBottom: 20 }}>
    <span style={{ fontSize: 12.5, color: "#e2e8f0", lineHeight: 1.5 }}><strong style={{ color: "#f59e0b" }}>Bottom line:</strong> {children}</span>
  </div>
);

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

const StatCard = ({ value, label, delta, deltaLabel, color = "#e2e8f0", srcIds }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 170 }}>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Space Mono', monospace", letterSpacing: "-1px" }}>{value}</div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}{srcIds && <CiteChips ids={srcIds} />}</div>
    {(delta || deltaLabel) && <div style={{ fontSize: 11, color: delta && delta.startsWith("+") ? "#10b981" : delta ? "#ef4444" : "#64748b", marginTop: 8, fontWeight: 600 }}>{delta} <span style={{ color: "#475569", fontWeight: 400 }}>{deltaLabel}</span></div>}
  </div>
);

const PhaseLabel = ({ phase, color }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: `${color}18`, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{phase}</span>
);

const Card = ({ title, color = "#94a3b8", children, forecast }) => (
  <div style={{ flex: "1 1 280px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
    <h4 style={{ fontSize: 13, fontWeight: 700, color, margin: "0 0 8px" }}>{title} {forecast && <ForecastBadge />}</h4>
    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{children}</p>
  </div>
);

const ChartBox = ({ title, subtitle, children, forecast }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 24px 12px", marginBottom: 20 }}>
    <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{title} {forecast && <ForecastBadge />}</h3>
    <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>{subtitle}</p>
    {children}
  </div>
);

// ---------- MAIN ----------
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sentiment", label: "Sentiment" },
    { id: "inflation", label: "Inflation & Costs" },
    { id: "cemarket", label: "CE Market" },
    { id: "glasses", label: "Smart Glasses" },
    { id: "quest", label: "Quest & VR" },
    { id: "outlook", label: "2027 Outlook" },
    { id: "timeline", label: "Timeline" },
    { id: "sources", label: "Sources" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", width: "100%", boxSizing: "border-box", padding: "clamp(16px, 4vw, 32px) clamp(12px, 3vw, 28px)" }}>
      <style>{`html, body, #root { margin: 0 !important; padding: 0 !important; background: #0a0a0f !important; } * { box-sizing: border-box; }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 12px #f59e0b80" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "1.5px" }}>Client Readout v2.2 &middot; Data refreshed 7/6/2026</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>US CE Sentiment &amp; Meta Outlook</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>Jan 2025 &mdash; Jul 2026 actuals, with scenario outlook through 2027 &middot; Sentiment is stabilizing off May's record low as the energy shock unwinds &mdash; but cost-of-living pressure, memory-chip inflation, and a softening labor market define the road ahead for Meta Smart Glasses and Quest.</p>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "8px 13px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === tab.id ? "#e2e8f0" : "#64748b" }}>{tab.label}</button>
        ))}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (<div>
        <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(220,38,38,0.05))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", margin: "0 0 8px" }}>Executive Read: Off the Floor, Not Out of the Woods</h4>
          <p style={{ fontSize: 12.5, color: "#cbd5e1", margin: "0 0 10px", lineHeight: 1.6 }}>
            May's 44.8 was the lowest Michigan sentiment reading on record; June's rebound to 49.5 is still the second-lowest ever and, per UMich, nearly 20% below a year ago<CiteChips ids={["umichJun26", "indexboxJun"]} />. The relief driver is narrow &mdash; cheaper gas as escorted Hormuz-corridor flows recover and OPEC+ raises output<CiteChips ids={["fortuneOil", "eiaSteo"]} />. Three risks now matter more than the war headline:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
            {[
              <>1. <strong>Memory-chip inflation is repricing all of CE</strong> &mdash; including Quest, up $50&ndash;100 in April<CiteChips ids={["trendforce", "metaPricing"]} />.</>,
              <>2. <strong>The labor buffer is thinning</strong> &mdash; jobs &ldquo;hard to get&rdquo; at 22.5%, the highest since January 2021<CiteChips ids={["cbJun26PR"]} />.</>,
              <>3. <strong>Cost-of-living psychology persists</strong> &mdash; over half of consumers spontaneously cite high prices, a third straight month<CiteChips ids={["umichJun26"]} />.</>,
            ].map((b, i) => <p key={i} style={{ fontSize: 12.5, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>{b}</p>)}
          </div>
          <p style={{ fontSize: 12.5, color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#10b981" }}>Critically for Meta:</strong> spending is holding up better than sentiment (Best Buy comparable sales +2%, led by gaming, computing, mobile<CiteChips ids={["bbyQ1"]} />), and AI glasses are the fastest-growing bright spot in US consumer tech<CiteChips ids={["elCnbc", "idcGlasses"]} />.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <StatCard value="49.5" label="Michigan (Jun '26 final)" delta="+10.5%" deltaLabel="vs May record low 44.8" color="#f59e0b" srcIds={["umichJun26"]} />
          <StatCard value="91.2" label="Conference Board (Jun '26)" delta="+0.6" deltaLabel="pts m/m; jobs 'hard to get' 22.5%" color="#3b82f6" srcIds={["cbJun26PR"]} />
          <StatCard value="4.2%" label="CPI YoY (May '26)" delta="+0.4pp" deltaLabel="vs April; energy-driven" color="#ef4444" srcIds={["cpiMay26"]} />
          <StatCard value="$3.80" label="Gas, AAA natl avg (7/5)" delta="-12%" deltaLabel="vs early-June level near $4.30" color="#10b981" srcIds={["aaa"]} />
        </div>
        <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>The two indices use different scales and baselines &mdash; Michigan weights prices and household finances; the Conference Board weights jobs and business conditions. See the Sentiment tab.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard value="7M+" label="AI glasses sold 2025 (EL/Meta)" delta="+250%" deltaLabel="vs 2M in 2023–24 combined" color="#10b981" srcIds={["uploadvr7m", "elCnbc"]} />
          <StatCard value="69.2%" label="Meta smart-glasses share (Q1 '26, IDC via Next Reality)" color="#8b5cf6" srcIds={["idcGlassesFc"]} />
          <StatCard value="$402M" label="Reality Labs revenue (Q1 '26)" delta="-2%" deltaLabel="YoY; AI-glasses growth offset slower Quest" color="#94a3b8" srcIds={["rlQ1Cnbc", "rlQ1"]} />
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.04))", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 14, padding: "24px 28px", marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#f59e0b" }}>The Story in Eight Phases</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { phase: "Cautious Optimism", period: "Jan–Feb '25", color: "#10b981", desc: "Michigan 64.7–71.7; Conference Board near 100. Pre-tariff baseline.", src: ["fredUMC", "cbJan25"] },
              { phase: "Tariff Shock", period: "Mar–May '25", color: "#ef4444", desc: '"Liberation Day" (Apr 2). Michigan bottoms at 52.2; year-ahead inflation expectations spike to 6.5–6.6%.', src: ["fredUMC", "fredMICH"] },
              { phase: "Trade-Truce Rebound", period: "Jun–Aug '25", color: "#10b981", desc: "US–China de-escalation. Michigan recovers to 61.7; Conference Board jumps to the upper 90s — biggest monthly gain in 4 years (May).", src: ["cbMay25", "fredUMC"] },
              { phase: "Autumn Slide & Shutdown", period: "Sep–Dec '25", color: "#ef4444", desc: "Oct 1–Nov 12 government shutdown; Michigan hits 51.0 in Nov. Worst November for gaming hardware since 2005.", src: ["umichNov25", "cbNov25", "gamefileNov"] },
              { phase: "Partial Thaw", period: "Jan–Feb '26", color: "#6b7280", desc: "Michigan edges to 56.6 — a six-month peak that still sat in the 3rd percentile of series history.", src: ["umichJan26", "umichFeb26"] },
              { phase: "Iran War Shock", period: "Mar–Apr '26", color: "#dc2626", desc: "Hormuz closes Mar 4; oil >$120. Michigan 53.3 → 49.8; gas surges toward $4.30.", src: ["wikiHormuz", "umichApr26"] },
              { phase: "Record Collapse", period: "May '26", color: "#991b1b", desc: "Michigan final 44.8 — lowest on record. Long-run inflation expectations jump to 3.9%.", src: ["umichMay26"] },
              { phase: "Fragile Stabilization", period: "Jun '26–Now", color: "#f59e0b", desc: "Gas relief lifts Michigan to 49.5; long-run expectations fall back to 3.3%. Labor softening replaces energy as the top forward risk.", src: ["umichJun26", "cbJun26PR"] },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ minWidth: 150, paddingTop: 2 }}><PhaseLabel phase={p.phase} color={p.color} /></div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{p.period}</span>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.5 }}>{p.desc}<CiteChips ids={p.src} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChartBox title="Michigan Consumer Sentiment &middot; Jan 2025–Jun 2026" subtitle={<>Final monthly readings per UMich / FRED (<A s="fredUMC">UMCSENT</A>). Monthly values verified against the month-by-month releases listed in Sources. Prior published H2 '25 values were interpolated; this series reflects released finals.</>}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs><linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} /><stop offset="100%" stopColor="#dc2626" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} interval="preserveStartEnd" minTickGap={24} />
              <YAxis domain={[40, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: "Prev. trough (Jun 2022 ~50)", fill: "#ef4444b3", fontSize: 9, position: "insideTopRight" }} />
              <Area type="monotone" dataKey="michigan" stroke="#dc2626" strokeWidth={2.5} fill="url(#sentGrad)" name="Michigan Index" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>)}

      {/* ================= SENTIMENT ================= */}
      {activeTab === "sentiment" && (<div>
        <BottomLine>Consumers feel worse than they spend — the record gap between price-driven fear and job-backed spending power is the field opportunity.</BottomLine>
        <ChartBox title="Dual Confidence Indices: The Prices-vs-Jobs Divergence" subtitle={<>Michigan (prices/household-finance focus) vs Conference Board (jobs/business focus). Index-point gap peaked at ~46 in May (44.8 vs revised 90.6), narrowing to ~42 in June. Axes are scaled independently (equal 40-pt spans) — read each line against its own axis, not the vertical distance between them. Sources: <A s="umichJun26">UMich</A>, <A s="cbJun26">Conference Board</A>.</>}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} interval="preserveStartEnd" minTickGap={24} />
              <YAxis yAxisId="left" domain={[40, 80]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Michigan", angle: -90, position: "insideLeft", fill: "#dc262680", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[70, 110]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Conf. Board", angle: 90, position: "insideRight", fill: "#3b82f680", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Line yAxisId="left" type="monotone" dataKey="michigan" stroke="#dc2626" strokeWidth={2.5} name="Michigan Sentiment" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
              <Line yAxisId="right" type="monotone" dataKey="conference" stroke="#3b82f6" strokeWidth={2.5} name="Conference Board" dot={{ r: 3, fill: "#3b82f6", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="Record Low, Then a Bounce" color="#dc2626">May's 44.8 final was the lowest Michigan reading on record, crashing below the 48.2 preliminary<CiteChips ids={["umichMay26"]} />. June's 49.5 (+10.5%) ended a three-month slide but is the second-lowest reading in series history and ~18% below June 2025's 60.7<CiteChips ids={["umichJun26", "indexboxJun"]} />. Survey director Joanne Hsu: increases were seen "across income, wealth, and political affiliation," but sentiment remains 13% below February's pre-war level<CiteChips ids={["umichJun26"]} />.</Card>
          <Card title="Why the Two Surveys Disagree" color="#f59e0b">Michigan weights household finances and prices; the Conference Board weights jobs and business conditions. The Conference Board held in the low 90s through the entire war shock while Michigan collapsed — Americans have felt secure at work but crushed at the register. That buffer is now thinning: consumers saying jobs are "hard to get" hit 22.5% in June, the highest since January 2021<CiteChips ids={["cbJun26PR"]} />.</Card>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card title="17 Months Below the Recession Line" color="#ef4444">The Conference Board Expectations Index (74.4 in June) has been below 80 — the level that historically signals recession within a year — since February 2025<CiteChips ids={["cbJun26PR"]} />. The Present Situation Index fell 3.0 points to 116.4 in June even as the headline rose, meaning the "now" is deteriorating while the outlook stabilizes at a depressed level<CiteChips ids={["cbJun26"]} />.</Card>
          <Card title="What It Means for CE Demand" color="#ea580c">Sentiment this depressed historically suppresses big-ticket, deferrable purchases first — CE is the canonical category. But the sentiment-to-spending link is imperfect: Best Buy's Q1 FY27 comparable sales rose 2% with gaming, computing, and mobile leading, and May month-to-date comps ran up high-single-digits<CiteChips ids={["bbyQ1", "bbyCorp"]} />. Read: consumers are selective and value-driven, not absent. Demo-led, "worth-it" positioning wins in this environment.</Card>
        </div>
      </div>)}

      {/* ================= INFLATION & COSTS ================= */}
      {activeTab === "inflation" && (<div>
        <BottomLine>The energy shock is fading; the memory-chip shock is arriving. CE prices stay elevated into 2027 even as headline CPI cools.</BottomLine>
        <ChartBox title="Michigan Inflation Expectations &middot; Feb–Jun 2026" subtitle={<>Verified 2026 window shown. For reference, the 2025 tariff shock briefly drove year-ahead expectations to 6.5–6.6% in April–May 2025 — the highest since the early 1980s (<A s="fredMICH">FRED: MICH</A>). Source: <A s="umichJun26">UMich via Advisor Perspectives</A>.</>}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={inflationExpData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis domain={[2.5, 5.5]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Line type="monotone" dataKey="yearAhead" stroke="#dc2626" strokeWidth={2.5} name="Year-Ahead" dot={{ r: 3, fill: "#dc2626", stroke: "#0a0a0f", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="longRun" stroke="#f59e0b" strokeWidth={2.5} name="Long-Run (5-10yr)" dot={{ r: 3, fill: "#f59e0b", stroke: "#0a0a0f", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="De-Anchoring Scare — Walked Back" color="#10b981">May's jump in long-run (5–10yr) expectations to 3.9% raised de-anchoring alarms. June reversed it: long-run expectations fell back to 3.3%, and Hsu reported five-year business-condition expectations surged 16% as long-term war worries eased<CiteChips ids={["umichJun26"]} />. This materially lowers the probability of a worst-case Fed-tightening path — a key input to our 2027 scenarios. Year-ahead expectations remain elevated at 4.6% vs 3.4% pre-war<CiteChips ids={["umichJun26"]} />.</Card>
          <Card title="CPI: Energy Still Driving" color="#ef4444">May CPI rose 4.2% YoY and 0.5% m/m, with energy accounting for over 60% of the monthly increase; electricity is up ~6% YoY<CiteChips ids={["cpiMay26", "cpiCnbc"]} />. With Brent back near $72 and AAA gas at $3.80<CiteChips ids={["fortuneOil", "aaa"]} />, headline CPI should decelerate into Q3 <ForecastBadge text="ANALYST VIEW" /> — but core goods, including electronics, face a second inflation wave from components.</Card>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card title="The Memory Supercycle Is the New Tariff" color="#ea580c">AI datacenter demand has diverted DRAM/NAND supply from consumer devices. Samsung and SK Hynix raised server-DRAM contract prices ~60–70% in Q1 2026, and conventional DRAM contract prices rose a further ~58–63% in Q2 (TrendForce)<CiteChips ids={["trendforce", "tomsDram"]} />. Memory is now ~35% of a PC's bill of materials (vs 15–18% historically), and major PC makers have raised prices 15–20%<CiteChips ids={["memRoundup", "idcMemory"]} />. Analyst outlooks (Gartner: DRAM +~130% YoY in 2026, elevated through 2027; Counterpoint: earliest inflection Q4 2027) see no meaningful relief before late 2027 <ForecastBadge /><CiteChips ids={["memRoundup"]} />. This directly drove Meta's April Quest repricing<CiteChips ids={["metaPricing", "pcgamerQuest"]} />.</Card>
          <Card title="CE Triple Squeeze — Updated" color="#8b5cf6">Electronics costs are being pushed by (1) tariffs<CiteChips ids={["ctaTariff"]} />, (2) war-elevated energy/freight (fading)<CiteChips ids={["eiaSteo"]} />, and (3) memory/component inflation (worsening into H2 2026)<CiteChips ids={["idcMemory"]} />. OpenBrand's read holds: consumers are adjusting, not disappearing — trading down at entry tiers while premium holds, hollowing the mid-market<CiteChips ids={["openbrand"]} />.</Card>
        </div>
      </div>)}

      {/* ================= CE MARKET ================= */}
      {activeTab === "cemarket" && (<div>
        <BottomLine>2026 CE "growth" is price, not demand — units are flat-to-down everywhere. Value messaging and selective-upgrade motions win.</BottomLine>
        <ChartBox title="US CE Sales Growth (YoY %) — Directional Estimates" forecast subtitle={<>2020 Companies internal estimates (entire series) anchored to Circana POS context, CTA forecasts, and retailer earnings — not an official Circana series. Q1–Q2 '26 are projections. Anchors: <A s="circanaJan26">Circana</A>, <A s="ctaJan26">CTA</A>, <A s="bbyQ1">Best Buy</A>.</>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ceSpendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="quarter" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
              <Bar dataKey="growth" name="YoY Growth % (est.)" radius={[6, 6, 0, 0]} barSize={52}>
                {ceSpendingData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="2026 Forecasts vs Reality" color="#94a3b8">At CES, CTA forecast $565B US consumer tech revenue (+3.7%), hardware +3.4%, units just +0.7%<CiteChips ids={["ctaJan26"]} />; Circana forecast $112B CE hardware, +0.2%<CiteChips ids={["circanaJan26"]} />. Both preceded the Iran war and the memory-price spiral — we view the unit forecasts as optimistic and expect revenue "growth," where it appears, to be substantially price-driven rather than demand-driven <ForecastBadge text="ANALYST VIEW" />.</Card>
          <Card title="Holiday 2025: The Warning Shot" color="#ef4444">November gaming-hardware spend fell 27% YoY to $695M — the worst November since 2005; December dollars rose 6% only because console prices ran +18% while units fell 8%<CiteChips ids={["gamefileNov", "gamedevDec"]} />. Circana's full-year retail read: +2% dollars on flat units — growth is price, not demand<CiteChips ids={["circanaRetail"]} />.</Card>
        </div>
        <ChartBox title="Modeled Tariff-Driven Price Increases by Category" forecast subtitle={<>CTA / Trade Partnership Worldwide revised estimates (Jan 2025) — tariff-only modeling, pre-war; excludes energy and memory-cost effects. Modeled impacts, not observed outcomes. Wearables/Smart Glasses reflects CTA/TPW's earlier (Oct 2024) scenario vintage, shown for category context — the lowest modeled tariff exposure among major CE categories. Sources: <A s="ctaTariff">CTA snapshot</A>, <A s="ctaVariety">Variety coverage</A>.</>}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryImpactData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="priceIncrease" name="Modeled Price Increase %" fill="#f59e0b" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card title="The Resilience Counter-Signal" color="#10b981">Best Buy Q1 FY27 (May 2026): revenue $8.94B beat, comparable sales +2%, EPS $1.28 beat; FY guidance reiterated at $41.2–42.1B with gaming, computing, and mobile leading growth<CiteChips ids={["bbyQ1", "bbyCorp"]} />. Sentiment surveys measure feelings; point-of-sale measures behavior. The gap between the two is where field execution creates value — conversion is winnable even in a fearful market.</Card>
          <Card title="Where Wallets Are Going" color="#f59e0b">Consumers are concentrating spend on low-cost indulgences, necessities, and selective upgrades with clear utility. Low-ticket innovation ($300–400 AI glasses) sits in the sweet spot; $500+ deferrable hardware (consoles, VR headsets, mid-tier laptops) faces the most price-elasticity risk as memory costs push prices up<CiteChips ids={["idcMemory", "metaPricing"]} />.</Card>
        </div>
      </div>)}

      {/* ================= SMART GLASSES ================= */}
      {activeTab === "glasses" && (<div>
        <BottomLine>The one CE category growing through the sentiment trough. Defend share and floor presence ahead of Samsung's Q3 entry.</BottomLine>
        <ChartBox title="Meta / EssilorLuxottica AI Glasses — Units Sold vs Capacity Targets (M)" forecast subtitle={<>Solid bars = reported sales. Faded bars = production-capacity targets under discussion — NOT sales forecasts. Sources: <A s="uploadvr7m">UploadVR</A>, <A s="elCnbc">CNBC</A>, <A s="bbergCapacity">Bloomberg</A>.</>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={glassesUnitsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="M" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Units (M)" radius={[6, 6, 0, 0]} barSize={56}>
                {glassesUnitsData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={e.kind === "Target" ? 0.35 : 0.85} stroke={e.kind === "Target" ? e.color : "none"} strokeDasharray={e.kind === "Target" ? "4 3" : "0"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 8px" }}>■ Solid: reported sales &middot; ▨ Faded/dashed: capacity target (not a sales forecast)</p>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="The Breakout Category" color="#10b981">EssilorLuxottica sold 7M+ Meta AI glasses in 2025 — more than tripling YoY and more than 3x everything sold in 2023–24 combined<CiteChips ids={["uploadvr7m", "elCnbc"]} />. Smart-glasses shipments grew 110% YoY in H1 2025 with Meta capturing over 70% share (Counterpoint)<CiteChips ids={["counterpoint"]} />, and Meta held 69.2% category share in Q1 2026 (IDC via Next Reality)<CiteChips ids={["idcGlassesFc"]} />. Meta CFO Susan Li cited "continued strong growth in AI glasses sales" even as Quest slowed in Q1<CiteChips ids={["rlQ1Cnbc", "rlQ1"]} />.</Card>
          <Card title="Portfolio & Price Ladder" color="#3b82f6">The lineup now spans an accessible entry point (Meta AI glasses from $299<CiteChips ids={["rlQ1"]} />), core Ray-Ban Meta Gen 2, and the display-equipped Ray-Ban Display at $799 (introduced Sept 2025)<CiteChips ids={["elCnbc"]} />.</Card>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="Category Forecast Through 2027" color="#8b5cf6" forecast>IDC projects display-less smart glasses at ~13.6M units in 2026, with category revenue of $5.1B in 2026 rising to $6.4B in 2027; average selling prices (~$376 in 2026) compress toward ~$229 by 2030 as competition intensifies<CiteChips ids={["idcGlassesFc"]} />. IDC also expects display-equipped AR glasses to surpass VR/MR headsets in unit volume by 2027<CiteChips ids={["idcGlassesFc"]} />. Meta/EssilorLuxottica have discussed capacity of 20M units/year by end-2026, potentially 30M if demand holds<CiteChips ids={["bbergCapacity"]} />.</Card>
          <Card title="Competitive Wave: 2026–27" color="#ef4444" forecast>Samsung's Galaxy Glasses (Android XR, display-less, rumored $379–499) are expected at the July 22, 2026 Unpacked with Q3 retail; a display model is reported for 2027<CiteChips ids={["samsungUnpacked", "samsungGlasses", "roadtovr27"]} />. Google's Android XR partners include Warby Parker and Gentle Monster; Xreal's Project Aura is due before end-2026; Apple glasses are widely reported for ~2027<CiteChips ids={["tomsSamsung", "idevice"]} />. Implication: Meta's window as the default choice narrows within 12 months — but competitive launches will also expand category awareness and retail floor space.</Card>
        </div>
      </div>)}

      {/* ================= QUEST & VR ================= */}
      {activeTab === "quest" && (<div>
        <BottomLine>A premium, deferrable product freshly priced up into the weakest sentiment market on record — sell platform value and cost-per-hour, not hardware specs.</BottomLine>
        <ChartBox title="Quest Repricing — Effective April 19, 2026 (USD)" subtitle={<>Meta raised Quest 3/3S prices $50–100, citing sharply higher memory-component costs. Sources: <A s="metaPricing">Meta blog</A>, <A s="forbesQuest">Forbes</A>, <A s="pcgamerQuest">PC Gamer</A>.</>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={questPriceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="sku" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} unit="$" domain={[0, 650]} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Bar dataKey="before" name="Before 4/19/26" fill="#64748b" fillOpacity={0.85} radius={[6, 6, 0, 0]} barSize={28} />
              <Bar dataKey="after" name="After 4/19/26" fill="#ea580c" fillOpacity={0.85} radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="Demand: Soft and Softening" color="#ef4444">Quest shipped ~1.7M units in the first three quarters of 2025, down 16% YoY<CiteChips ids={["pcgamerQuest"]} />; one third-party aggregator estimate puts full-year 2025 declines as deep as ~42%, though estimates vary by methodology<CiteChips ids={["sqmagVR"]} />. Reality Labs Q1 2026 revenue fell 2% YoY to $402M on slower Quest sales, partially offset by glasses growth<CiteChips ids={["rlQ1Cnbc", "rlQ1"]} />. The April price increases land on the most price-elastic segment of CE — holiday console data showed exactly how consumers respond (+18% price, −8% units)<CiteChips ids={["gamedevDec"]} />.</Card>
          <Card title="Meta's Strategic Reallocation" color="#8b5cf6">Reality Labs posted a $4.03B operating loss in Q1 2026 (FY2025: ~$19.2B)<CiteChips ids={["rlQ1Cnbc", "rlQ4Cnbc"]} />, and CFO Susan Li guided 2026 losses "on par" with 2025 while VR-specific investment will "decrease significantly" as spend shifts toward wearables<CiteChips ids={["rlQ1"]} />. Read: Quest remains a supported platform, but Meta's own capital allocation says the near-term growth engine is glasses — which is where program momentum and incremental retail energy will come from.</Card>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card title="The Engagement Paradox" color="#10b981">Per third-party trackers, Quest reached an all-time high in active users during 2025, with 100+ titles surpassing $1M gross revenue<CiteChips ids={["sqmagVR"]} />. Hardware sell-through is weak; platform health is not. IDC still projects an XR headset rebound as glasses-first momentum lifts the broader market<CiteChips ids={["idcXR"]} /> <ForecastBadge />. Positioning: sell the library and social platform (installed-base value), not spec-sheet novelty.</Card>
        </div>
      </div>)}

      {/* ================= 2027 OUTLOOK ================= */}
      {activeTab === "outlook" && (<div>
        <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
            EVERYTHING ON THIS TAB IS FORECAST. Scenario paths and sentiment trajectories are 2020 Companies internal analysis (July 2026), anchored to cited external forecasts (EIA, TrendForce/Gartner/Counterpoint, IDC, CTA). Scenario percentages are our estimated probability of each scenario occurring (they sum to 100%). These are planning tools, not predictions of record.
          </p>
        </div>
        <ChartBox title="Michigan Sentiment — Illustrative Scenario Paths to Dec 2027" forecast subtitle={<>Internal illustrative trajectories from June's 49.5 actual. The percentage next to each scenario (~25% / ~50% / ~25%) is our internal estimate of the probability that scenario plays out — judgment-based likelihood weights that sum to 100%, not model outputs or source-published odds. Anchors: EIA sees Hormuz flows resuming Q3 '26, normal traffic by early '27, Brent averaging ~$79 in 2027 (<A s="eiaSteo">STEO</A>); memory analysts see no price relief before late 2027 (<A s="memRoundup">roundup</A>).</>}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={scenarioData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis domain={[35, 75]} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <ReferenceLine y={44.8} stroke="rgba(220,38,38,0.35)" strokeDasharray="4 4" label={{ value: "May '26 record low 44.8", fill: "#dc2626b3", fontSize: 9, position: "insideBottomRight" }} />
              <Line type="monotone" dataKey="bull" stroke="#10b981" strokeWidth={2} strokeDasharray="6 4" name="Bull: Early Resolution (~25%)" dot={{ r: 2, fill: "#10b981" }} />
              <Line type="monotone" dataKey="base" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="6 4" name="Base: Slow Normalization (~50%)" dot={{ r: 2, fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="bear" stroke="#dc2626" strokeWidth={2} strokeDasharray="6 4" name="Bear: Re-escalation / Recession (~25%)" dot={{ r: 2, fill: "#dc2626" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Card title="Base — Slow Normalization (~50%)" color="#3b82f6" forecast>Follows the EIA path: Hormuz shipments resume in Q3 2026, traffic normalizes by early 2027, Brent averages ~$79 in 2027<CiteChips ids={["eiaSteo", "eiaTie"]} />. Memory prices stay elevated through 2027 with no meaningful relief before late in the year<CiteChips ids={["memRoundup"]} />. CPI decelerates toward ~3% by late 2027; sentiment grinds to the high-50s/low-60s. CE: 2026 finishes below the CTA/Circana January forecasts; H2 2027 returns to modest real growth. Meta: glasses track IDC's $6.4B 2027 category revenue<CiteChips ids={["idcGlassesFc"]} />; Quest units decline again in 2026, stabilizing in 2027 at a lower baseline.</Card>
          <Card title="Bull — Early Resolution (~25%)" color="#10b981" forecast>Formal ceasefire and full unescorted transit ahead of the EIA timeline; OPEC+ output hikes<CiteChips ids={["fortuneOil"]} /> push Brent toward pre-conflict forecast levels ($50s–60s)<CiteChips ids={["eiaTie"]} />. Gas under $3.20 by mid-2027; sentiment recovers to the mid-60s–70. CE demand releases pent-up replacement cycles; holiday 2026 surprises to the upside. Meta: capacity path toward 20M+ glasses gets absorbed<CiteChips ids={["bbergCapacity"]} />; Samsung/Google entries expand the category faster than they take share; Quest benefits from the discretionary thaw.</Card>
          <Card title="Bear — Re-escalation / Recession (~25%)" color="#dc2626" forecast>Corridor attacks resume; Brent back above $100; CPI re-accelerates past 5%. The 17-month sub-80 Conference Board Expectations streak<CiteChips ids={["cbJun26PR"]} /> resolves into recession; "hard to get" jobs (22.5% and rising)<CiteChips ids={["cbJun26PR"]} /> becomes layoffs. Michigan revisits the low 40s. CE contracts mid-single digits into 2027; the mid-market hollows further<CiteChips ids={["openbrand"]} />. Meta: glasses growth halves but stays positive (low-ticket + gifting resilience); Quest declines steepen; sustained Reality Labs losses would pressure discretionary XR marketing spend industry-wide<CiteChips ids={["rlQ1Cnbc"]} />.</Card>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card title="Signals to Watch (Trigger List)" color="#f59e0b">Monthly: Michigan prelim/final (next: Jul 17<CiteChips ids={["umichJun26"]} />), Conference Board CCI (last Tuesday), CPI (~12th), AAA gas trend<CiteChips ids={["aaa"]} />. Quarterly: Meta earnings (Reality Labs revenue-mix commentary), Best Buy comps (next: Aug 2026)<CiteChips ids={["bbyQ1"]} />, EssilorLuxottica wearables updates, IDC XR trackers, TrendForce memory pricing<CiteChips ids={["trendforce"]} />. Event-driven: Hormuz transit status<CiteChips ids={["wikiHormuz"]} />, Samsung Unpacked July 22<CiteChips ids={["samsungUnpacked"]} />, holiday-season pricing announcements.</Card>
          <Card title="Planning Posture for the Meta Program" color="#10b981" forecast>Budget glasses as the growth line in all three scenarios — the category grows even in the bear case, making it the safest volume commitment. Treat Quest as a margin/attach business with unit risk skewed down; hedge with demo-led conversion and accessory attach. Time contests and incentive pushes to energy-price relief windows, which have demonstrably moved sentiment within weeks<CiteChips ids={["umichJun26"]} />. Revisit scenario weights after the July 17 Michigan prelim and Meta's Q2 earnings.</Card>
        </div>
      </div>)}

      {/* ================= TIMELINE ================= */}
      {activeTab === "timeline" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Key Events &middot; Jan 2025–Jul 2026 <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>(numbered chips link to sources)</span></h3>
            <div style={{ display: "flex", gap:12, fontSize: 10, color: "#64748b" }}>
              {[["#10b981", "Positive"], ["#ef4444", "Negative"], ["#94a3b8", "Neutral"]].map(([c, t]) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
            {timelineEvents.map((evt, i) => {
              const dc = evt.type === "positive" ? "#10b981" : evt.type === "negative" ? "#ef4444" : "#94a3b8";
              return (
                <div key={i} style={{ position: "relative", marginBottom: 16, paddingLeft: 20 }}>
                  <div style={{ position: "absolute", left: -21, top: 5, width: 12, height: 12, borderRadius: "50%", background: dc, border: "3px solid #0a0a0f", boxShadow: `0 0 8px ${dc}60` }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: dc, textTransform: "uppercase", letterSpacing: "0.5px" }}>{evt.date}</div>
                  <p style={{ fontSize: 13, color: "#cbd5e1", margin: "4px 0 0", lineHeight: 1.5 }}>{evt.event}<CiteChips ids={evt.src} /></p>
                </div>
              );
            })}
          </div>
        </div>
      </div>)}

      {/* ================= SOURCES ================= */}
      {activeTab === "sources" && (<div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>Source Registry</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 18px" }}>Numbered entries match the numbered citation chips used throughout the readout. Accessed July 6, 2026. Some entries back individual monthly datapoints in the sentiment series rather than a specific text claim (the audit trail for the v2 data correction).</p>
          {[
            { group: "Consumer Sentiment — University of Michigan", ids: ["umich", "fredUMC", "fredMICH", "umichJun26", "umichMay26", "umichApr26", "umichFeb26", "umichJan26", "umichDec25", "umichNov25", "umichSep25", "indexboxJun", "qzJun"] },
            { group: "Consumer Confidence — The Conference Board", ids: ["cbTopic", "cbJun26", "cbJun26PR", "cbApr26PR", "cbMar26", "cbDec25PR", "cbNov25", "cbSep25", "cbJul25", "cbMay25", "cbJan25"] },
            { group: "Inflation, Energy & Macro", ids: ["cpiMay26", "cpiCnbc", "aaa", "eiaSteo", "eiaTie", "fortuneOil", "wikiHormuz"] },
            { group: "Meta — Reality Labs, Smart Glasses & Quest", ids: ["rlQ1", "rlQ1Cnbc", "rlQ4Cnbc", "metaPricing", "forbesQuest", "pcgamerQuest", "elCnbc", "uploadvr7m", "bbergCapacity"] },
            { group: "XR / Smart Glasses Market Research", ids: ["idcGlasses", "idcGlassesFc", "counterpoint", "idcXR", "sqmagVR"] },
            { group: "Competitive Landscape", ids: ["samsungGlasses", "samsungUnpacked", "tomsSamsung", "roadtovr27", "idevice"] },
            { group: "CE Industry, Retail & Components", ids: ["bbyQ1", "bbyCorp", "ctaJan26", "ctaTariff", "ctaVariety", "circanaJan26", "circanaRetail", "gamefileNov", "gamedevDec", "trendforce", "tomsDram", "idcMemory", "memRoundup", "openbrand"] },
          ].map((g, gi) => (
            <div key={gi} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{g.group}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {g.ids.map(id => (
                  <a key={id} href={SRC[id].url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", lineHeight: 1.5 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#475569" }}>[{srcNum(id)}]</span> {SRC[id].label} <span style={{ color: "#475569", fontSize: 10 }}>&middot; {SRC[id].url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", margin: "0 0 8px" }}>Data Quality & Methodology Notes</h4>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
            (1) v2 correction: H2 2025 Michigan and Conference Board values in the prior published dashboard were interpolated placeholders; this version replaces them with final released figures, which also restores two omitted events (the May 2025 trade-truce rebound and the Oct–Nov 2025 government shutdown). (2) Conference Board values reflect latest published revisions: Dec '25 revised up to 94.2 (from 89.1); Jan '26 initially 84.5, revised to 89.0; May '26 revised down to 90.6; Oct/Nov '25 revised up. (3) The quarterly CE sales chart is a directional internal estimate, not an official Circana series. (4) The category price chart uses CTA/TPW's revised January 2025 tariff-only model; earlier-vintage purchase-decline projections were removed in audit as untraceable. (5) Quest shipment estimates vary by methodology (sell-in vs sell-through); the ~42% full-year figure is a third-party aggregator estimate. (6) Secondary sources are labeled "via" where an intermediary reports another firm's data. (7) All 2027 content is forecast and labeled as such; scenario probabilities are internal judgment. (8) Sentiment measures feelings, not behavior — Best Buy's Q1 FY27 beat is the standing reminder that point-of-sale can diverge from surveys. (9) This build was reviewed by three independent audits (data accuracy, executive formatting, source consolidation) prior to publish; all HIGH- and MEDIUM-severity findings were remediated.
          </p>
        </div>
      </div>)}

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 11, color: "#64748b", textAlign: "center" }}>
        Compiled July 6, 2026 &middot; 2020 Companies GTM Strategy &amp; Enablement &middot; Next data: CPI ~Jul 14 &middot; Michigan prelim Jul 17 &middot; Samsung Unpacked Jul 22 &middot; Conference Board Jul 28 &middot; Meta Q2 earnings late Jul
      </div>
      </div>
    </div>
  );
}
