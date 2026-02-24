"use client";
import { useState, useMemo } from "react";
import { IndianRupee, Calculator, TrendingUp, PiggyBank, CreditCard, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink, Phone, FileText, Wallet } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const TABS = ["EMI Calculator", "Loan Options", "Income Tracker", "Savings Tips"];

const LOANS = [
    {
        name: "Kisan Credit Card (KCC)", icon: "💳", rate: 4, maxAmt: 300000, tenure: "1 year (revolving)",
        provider: "All Nationalized Banks", color: "from-green-600 to-emerald-600",
        desc: "Subsidized short-term credit for crop cultivation, harvest & allied activities.",
        eligibility: "Any farmer with land records (Khasra/Khatauni)",
        docs: ["Aadhaar", "Land records (Khasra)", "Photo", "Bank passbook"],
        applyUrl: "https://agricoop.gov.in", helpline: "1800-180-1551",
    },
    {
        name: "Agriculture Term Loan", icon: "🏦", rate: 8.5, maxAmt: 2500000, tenure: "3–7 years",
        provider: "SBI, PNB, Bank of Baroda", color: "from-blue-600 to-indigo-600",
        desc: "Medium-to-long term loan for farm equipment, land development, or expansion.",
        eligibility: "Farmers with 2+ years banking history",
        docs: ["Aadhaar", "PAN Card", "Land records", "Income proof", "Bank statement (6 months)"],
        applyUrl: "https://sbi.co.in", helpline: "1800-11-2211",
    },
    {
        name: "PM Mudra Loan – Kishor", icon: "💼", rate: 10, maxAmt: 500000, tenure: "3–5 years",
        provider: "Microfinance Institutions, Banks", color: "from-purple-600 to-violet-600",
        desc: "For small farm businesses, allied activities, and agri-enterprises.",
        eligibility: "Small & marginal farmers, self-employed",
        docs: ["Aadhaar", "Business proof", "Bank statement", "GST (if applicable)"],
        applyUrl: "https://mudra.org.in", helpline: "1800-180-1111",
    },
    {
        name: "NABARD Rural Credit", icon: "🌾", rate: 6.5, maxAmt: 5000000, tenure: "5–10 years",
        provider: "NABARD / Regional Rural Banks", color: "from-amber-600 to-yellow-600",
        desc: "Long-term credit for watershed, irrigation, warehousing & farm infrastructure.",
        eligibility: "Farmer groups, cooperatives, FPOs",
        docs: ["Aadhaar", "Land records", "Group registration", "3-year income proof"],
        applyUrl: "https://nabard.org", helpline: "022-26530012",
    },
];

const SAVINGS_TIPS = [
    { icon: "🏦", tip: "Open Jan Dhan account to receive PM-KISAN & other subsidies directly", saving: "₹500–2,000/month", priority: "High" },
    { icon: "👥", tip: "Join a Farmer Producer Organization (FPO) — reduce input costs by 20–30%", saving: "₹8,000–15,000/yr", priority: "High" },
    { icon: "🌱", tip: "Apply for PM-KISAN to get ₹6,000/year direct into your account", saving: "₹6,000/yr", priority: "High" },
    { icon: "🛡️", tip: "Take PMFBY crop insurance before cut-off — protects entire season's investment", saving: "Risk cover", priority: "High" },
    { icon: "🧪", tip: "Get free Soil Health Card — saves 10–15% on fertilizer costs", saving: "₹3,000–5,000/yr", priority: "Medium" },
    { icon: "🛒", tip: "Buy seeds & fertilizers from cooperative society instead of retail", saving: "₹2,000–4,000/season", priority: "Medium" },
    { icon: "☀️", tip: "Apply for PM-KUSUM solar pump — 90% subsidy, eliminates diesel cost", saving: "₹10,000–20,000/yr", priority: "Medium" },
    { icon: "📦", tip: "Use e-NAM to sell directly — avoids middlemen & higher mandi commission", saving: "₹5,000–15,000/yr", priority: "Low" },
    { icon: "🌿", tip: "Switch to organic via PKVY scheme — ₹50,000/ha support & premium prices", saving: "₹50,000+/crop cycle", priority: "Low" },
];

const PRIORITY_COLORS: Record<string, string> = {
    High: "text-red-400 bg-red-900/20 border-red-800/30",
    Medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800/30",
    Low: "text-green-400 bg-green-900/20 border-green-800/30",
};

function formatInr(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

export default function FinancePage() {
    const [tab, setTab] = useState("EMI Calculator");
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(3);
    const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
    const [income, setIncome] = useState([
        { id: "1", source: "Wheat Sale", amount: 45000, month: "Feb", category: "Crops" },
        { id: "2", source: "Mustard Sale", amount: 28000, month: "Jan", category: "Crops" },
        { id: "3", source: "PM-KISAN", amount: 2000, month: "Dec", category: "Subsidy" },
        { id: "4", source: "Milk Sale", amount: 4500, month: "Feb", category: "Livestock" },
    ]);
    const [expense, setExpense] = useState([
        { id: "1", source: "Fertilizer", amount: 8000, month: "Jan", category: "Input" },
        { id: "2", source: "Seed Purchase", amount: 5000, month: "Nov", category: "Input" },
        { id: "3", source: "Labour", amount: 12000, month: "Feb", category: "Labour" },
    ]);
    const [newInc, setNewInc] = useState({ source: "", amount: "", category: "Crops" });
    const [newExp, setNewExp] = useState({ source: "", amount: "", category: "Input" });

    // EMI
    const emi = useMemo(() => {
        const r = rate / 1200;
        const n = years * 12;
        if (r === 0) return principal / n;
        return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }, [principal, rate, years]);
    const totalPay = emi * years * 12;
    const totalInterest = totalPay - principal;

    const totalIncome = income.reduce((s, x) => s + x.amount, 0);
    const totalExpense = expense.reduce((s, x) => s + x.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const addIncome = () => {
        if (!newInc.source || !newInc.amount) return;
        setIncome(p => [...p, { id: Date.now().toString(), source: newInc.source, amount: parseInt(newInc.amount), month: new Date().toLocaleString("en", { month: "short" }), category: newInc.category }]);
        setNewInc({ source: "", amount: "", category: "Crops" });
    };
    const addExpense = () => {
        if (!newExp.source || !newExp.amount) return;
        setExpense(p => [...p, { id: Date.now().toString(), source: newExp.source, amount: parseInt(newExp.amount), month: new Date().toLocaleString("en", { month: "short" }), category: newExp.category }]);
        setNewExp({ source: "", amount: "", category: "Input" });
    };

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-950/40">
                    <Wallet size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Rural Finance</h1>
                    <p className="text-green-400 font-black uppercase tracking-[0.4em] text-sm">EMI · Loans · Income · Savings</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Total Income", value: formatInr(totalIncome), icon: "📈", color: "text-green-400" },
                        { label: "Total Expense", value: formatInr(totalExpense), icon: "📉", color: "text-red-400" },
                        { label: "Net Profit", value: formatInr(netProfit), icon: netProfit >= 0 ? "✅" : "⚠️", color: netProfit >= 0 ? "text-green-400" : "text-red-400" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
                            <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="w-full max-w-5xl">
                <div className="flex gap-2 flex-wrap mb-8">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition border ${tab === t ? "bg-green-700/40 border-green-600 text-green-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {t === "EMI Calculator" && <Calculator size={14} className="inline mr-2" />}
                            {t === "Loan Options" && <CreditCard size={14} className="inline mr-2" />}
                            {t === "Income Tracker" && <TrendingUp size={14} className="inline mr-2" />}
                            {t === "Savings Tips" && <PiggyBank size={14} className="inline mr-2" />}
                            {t}
                        </button>
                    ))}
                </div>

                {/* ===== EMI Calculator ===== */}
                {tab === "EMI Calculator" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card p-7 space-y-6 border-green-900/20">
                            <h3 className="text-white font-black text-lg">Loan EMI Calculator</h3>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-green-700 font-bold">Loan Amount</span>
                                        <span className="text-green-300 font-black">{formatInr(principal)}</span>
                                    </div>
                                    <input type="range" min="10000" max="5000000" step="10000" value={principal}
                                        onChange={e => setPrincipal(+e.target.value)}
                                        className="w-full accent-green-500 cursor-pointer" />
                                    <div className="flex justify-between text-green-900 text-xs mt-1">
                                        <span>₹10K</span><span>₹50L</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-green-700 font-bold">Interest Rate</span>
                                        <span className="text-green-300 font-black">{rate}% p.a.</span>
                                    </div>
                                    <input type="range" min="1" max="20" step="0.5" value={rate}
                                        onChange={e => setRate(+e.target.value)}
                                        className="w-full accent-green-500 cursor-pointer" />
                                    <div className="flex justify-between text-green-900 text-xs mt-1">
                                        <span>1%</span><span>20%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-green-700 font-bold">Tenure</span>
                                        <span className="text-green-300 font-black">{years} years ({years * 12} months)</span>
                                    </div>
                                    <input type="range" min="1" max="15" step="1" value={years}
                                        onChange={e => setYears(+e.target.value)}
                                        className="w-full accent-green-500 cursor-pointer" />
                                    <div className="flex justify-between text-green-900 text-xs mt-1">
                                        <span>1yr</span><span>15yr</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="glass-card p-7 bg-green-900/10 border-green-700/30 text-center">
                                <p className="text-green-700 text-sm font-bold uppercase tracking-widest mb-2">Monthly EMI</p>
                                <p className="text-white font-black text-4xl">{formatInr(Math.round(emi))}</p>
                                <p className="text-green-700 text-xs mt-1">per month for {years} years</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-5 text-center">
                                    <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Principal</p>
                                    <p className="text-blue-300 font-black text-lg">{formatInr(principal)}</p>
                                </div>
                                <div className="glass-card p-5 text-center">
                                    <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Total Interest</p>
                                    <p className="text-red-400 font-black text-lg">{formatInr(Math.round(totalInterest))}</p>
                                </div>
                                <div className="glass-card p-5 text-center col-span-2">
                                    <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Total Amount Payable</p>
                                    <p className="text-white font-black text-xl">{formatInr(Math.round(totalPay))}</p>
                                </div>
                            </div>
                            <div className="glass-card p-4 bg-yellow-900/10 border-yellow-900/20">
                                <p className="text-yellow-400 font-bold text-xs mb-1">💡 Tip for farmers</p>
                                <p className="text-yellow-200 text-xs">KCC interest rate is only 4% (after Govt subvention). Compare this EMI at 4% vs {rate}%. You save {formatInr(Math.round((emi - ((principal * (4 / 1200) * Math.pow(1 + 4 / 1200, years * 12)) / (Math.pow(1 + 4 / 1200, years * 12) - 1))) * years * 12))} in interest!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== Loan Options ===== */}
                {tab === "Loan Options" && (
                    <div className="space-y-4">
                        <p className="text-green-600 text-sm">Compare agricultural loans — click any to see full details</p>
                        {LOANS.map(loan => (
                            <div key={loan.name} className={`glass-card border transition-all ${expandedLoan === loan.name ? "border-green-700/40" : "border-transparent hover:border-green-900/30"}`}>
                                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpandedLoan(expandedLoan === loan.name ? null : loan.name)}>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center text-2xl flex-shrink-0`}>{loan.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-white font-black">{loan.name}</h3>
                                            {expandedLoan === loan.name ? <ChevronUp size={18} className="text-green-700" /> : <ChevronDown size={18} className="text-green-700" />}
                                        </div>
                                        <p className="text-green-600 text-sm">{loan.desc}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-green-400 font-black text-sm">🏦 {loan.rate}% p.a.</span>
                                            <span className="text-blue-400 font-bold text-sm">Max: {formatInr(loan.maxAmt)}</span>
                                            <span className="text-purple-400 text-sm">{loan.tenure}</span>
                                        </div>
                                    </div>
                                </div>
                                {expandedLoan === loan.name && (
                                    <div className="border-t border-green-900/30 p-5 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">Provider</p>
                                                <p className="text-green-300 text-sm">{loan.provider}</p>
                                            </div>
                                            <div>
                                                <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">Eligibility</p>
                                                <p className="text-green-300 text-sm">{loan.eligibility}</p>
                                            </div>
                                            <div>
                                                <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">Documents</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {loan.docs.map(d => (
                                                        <span key={d} className="text-yellow-300 text-xs bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-800/30">{d}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">EMI at {loan.rate}%, 3 years</p>
                                                <p className="text-white font-black text-xl">{formatInr(Math.round((100000 * (loan.rate / 1200) * Math.pow(1 + loan.rate / 1200, 36)) / (Math.pow(1 + loan.rate / 1200, 36) - 1)))}<span className="text-green-700 font-normal text-sm">/mo per ₹1L</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={loan.applyUrl} target="_blank" rel="noreferrer" className="btn-primary px-5 py-3 flex items-center gap-2 text-sm rounded-xl">
                                                Apply <ExternalLink size={13} />
                                            </a>
                                            <a href={`tel:${loan.helpline}`} className="btn-secondary px-5 py-3 flex items-center gap-2 text-sm rounded-xl">
                                                <Phone size={13} /> {loan.helpline}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== Income Tracker ===== */}
                {tab === "Income Tracker" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income */}
                        <div className="space-y-4">
                            <div className="glass-card p-5 border-green-900/20">
                                <h3 className="text-green-400 font-black mb-4 flex items-center gap-2"><TrendingUp size={16} /> Income ({formatInr(totalIncome)})</h3>
                                <div className="space-y-2 mb-4">
                                    {income.map(x => (
                                        <div key={x.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-900/10 border border-green-900/20">
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-bold">{x.source}</p>
                                                <p className="text-green-700 text-xs">{x.category} · {x.month}</p>
                                            </div>
                                            <p className="text-green-400 font-black">{formatInr(x.amount)}</p>
                                            <button onClick={() => setIncome(p => p.filter(i => i.id !== x.id))} className="text-red-500 hover:text-red-400 transition p-1">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-[1fr_100px_auto] gap-2">
                                    <input className="input-field text-sm" placeholder="Source (e.g. Wheat sale)" value={newInc.source} onChange={e => setNewInc(p => ({ ...p, source: e.target.value }))} />
                                    <input type="number" className="input-field text-sm" placeholder="Amount" value={newInc.amount} onChange={e => setNewInc(p => ({ ...p, amount: e.target.value }))} />
                                    <button onClick={addIncome} className="btn-primary px-3 py-2 rounded-xl"><Plus size={14} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Expense */}
                        <div className="space-y-4">
                            <div className="glass-card p-5 border-red-900/20">
                                <h3 className="text-red-400 font-black mb-4 flex items-center gap-2"><IndianRupee size={16} /> Expenses ({formatInr(totalExpense)})</h3>
                                <div className="space-y-2 mb-4">
                                    {expense.map(x => (
                                        <div key={x.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-900/10 border border-red-900/20">
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-bold">{x.source}</p>
                                                <p className="text-red-700 text-xs">{x.category} · {x.month}</p>
                                            </div>
                                            <p className="text-red-400 font-black">{formatInr(x.amount)}</p>
                                            <button onClick={() => setExpense(p => p.filter(i => i.id !== x.id))} className="text-red-500 hover:text-red-400 transition p-1">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-[1fr_100px_auto] gap-2">
                                    <input className="input-field text-sm" placeholder="Expense (e.g. Fertilizer)" value={newExp.source} onChange={e => setNewExp(p => ({ ...p, source: e.target.value }))} />
                                    <input type="number" className="input-field text-sm" placeholder="Amount" value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))} />
                                    <button onClick={addExpense} className="btn-primary px-3 py-2 rounded-xl bg-red-700 hover:bg-red-600"><Plus size={14} /></button>
                                </div>
                            </div>
                        </div>

                        {/* P&L summary */}
                        <div className="lg:col-span-2 glass-card p-6 border-yellow-900/20 bg-yellow-900/5">
                            <h3 className="text-yellow-400 font-black mb-4">Profit & Loss Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Gross Income</p>
                                    <p className="text-green-400 font-black text-2xl">{formatInr(totalIncome)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-red-700 text-xs font-bold uppercase tracking-widest mb-1">Total Expenses</p>
                                    <p className="text-red-400 font-black text-2xl">{formatInr(totalExpense)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-yellow-700 text-xs font-bold uppercase tracking-widest mb-1">Net Profit / Loss</p>
                                    <p className={`font-black text-2xl ${netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{formatInr(netProfit)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== Savings Tips ===== */}
                {tab === "Savings Tips" && (
                    <div className="space-y-4">
                        <div className="glass-card p-4 bg-green-900/10 border-green-800/20 flex items-center gap-3">
                            <PiggyBank size={20} className="text-green-400 flex-shrink-0" />
                            <p className="text-green-300 text-sm"><strong>Potential additional income/savings:</strong> ₹50,000–1,00,000+ per year by following all these tips.</p>
                        </div>
                        {SAVINGS_TIPS.map((tip, i) => (
                            <div key={i} className="glass-card p-5 flex items-start gap-4 hover:border-green-800/30 transition border border-transparent">
                                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-bold mb-1">{tip.tip}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-green-400 text-xs font-black bg-green-900/20 px-2 py-0.5 rounded-full border border-green-800/30">
                                            💰 {tip.saving}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[tip.priority]}`}>
                                            {tip.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
