"use client";
import React, { useState } from "react";
import { BookOpen, Play, ChevronRight, CheckCircle2, Clock, Star, Award, ArrowLeft, Search } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

// ─── Lesson content (real farming info) ──────────────────────────────────────
const LESSON_CONTENT: Record<string, { title: string; titleHi: string; body: React.ReactNode }> = {
    s1: {
        title: "Why Soil Health Matters",
        titleHi: "मिट्टी की जांच क्यों जरूरी है",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">मिट्टी = आपकी असली पूंजी</p>
                <p>भारत में औसत किसान हर साल हजारों रुपए के उर्वरक खेत में डालता है — लेकिन अक्सर जरूरत से ज्यादा या गलत उर्वरक। <strong className="text-green-200">Soil Health Card</strong> (मिट्टी स्वास्थ्य कार्ड) सरकार मुफ्त देती है। इससे पता चलता है कि आपके खेत में कौन से पोषक तत्व कम/ज्यादा हैं।</p>
                <div className="glass-card p-4 bg-green-900/20 border-green-800/30 rounded-xl space-y-2">
                    <p className="text-green-400 font-black">🧪 मिट्टी में 3 मुख्य पोषक तत्व:</p>
                    <ul className="space-y-1.5">
                        <li><span className="text-yellow-400 font-bold">N (Nitrogen/नाइट्रोजन)</span> — पत्तियों की वृद्धि, हरापन। कमी से पत्ते पीले पड़ते हैं।</li>
                        <li><span className="text-orange-400 font-bold">P (Phosphorus/फॉस्फोरस)</span> — जड़ों की ताकत, फूल-फल। कमी से पत्ते बैंगनी/लाल पड़ते हैं।</li>
                        <li><span className="text-blue-400 font-bold">K (Potassium/पोटाश)</span> — रोग प्रतिरोधक, अनाज की गुणवत्ता। कमी से पत्तियों के किनारे जलते हैं।</li>
                    </ul>
                </div>
                <div className="glass-card p-4 bg-blue-900/20 border-blue-800/30 rounded-xl">
                    <p className="text-blue-300 font-black mb-2">📊 pH का मतलब:</p>
                    <ul className="space-y-1">
                        <li>• pH 6–7.5 = सबसे अच्छा (अधिकतर फसलों के लिए)</li>
                        <li>• pH &lt; 6 = अम्लीय (खट्टी) मिट्टी → चूना (lime) डालें</li>
                        <li>• pH &gt; 8 = क्षारीय (नमकीन) मिट्टी → जिप्सम डालें</li>
                    </ul>
                </div>
                <div className="glass-card p-4 bg-yellow-900/20 border-yellow-800/30 rounded-xl">
                    <p className="text-yellow-300 font-black mb-2">✅ मिट्टी जांच कैसे करें (FREE):</p>
                    <ol className="space-y-1 list-decimal list-inside">
                        <li>खेत के 8–10 अलग-अलग जगह से 15–20 cm गहरी मिट्टी लें</li>
                        <li>सब मिलाएं → 500 gram sample बनाएं</li>
                        <li>नजदीकी <strong className="text-white">KVK (कृषि विज्ञान केंद्र)</strong> या <strong className="text-white">कृषि विभाग</strong> पर जमा करें</li>
                        <li>2–4 हफ्ते में Soil Health Card मिलता है (मुफ्त)</li>
                    </ol>
                </div>
                <p className="text-green-500 text-xs">💡 हर 3 साल में एक बार मिट्टी जांच जरूर करें। इससे 20–30% उर्वरक खर्च बचता है।</p>
            </div>
        ),
    },
    s2: {
        title: "How to Read Soil Test Report",
        titleHi: "मिट्टी परीक्षण रिपोर्ट कैसे पढ़ें",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">Soil Health Card को कैसे समझें</p>
                <p>Soil Health Card पर हर पोषक तत्व की मात्रा दी होती है। नीचे दिए रंग के अनुसार जानें क्या करना है:</p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { color: "bg-red-800/40 border-red-700/40", label: "Low (कम)", action: "तुरंत उर्वरक/खाद डालें" },
                        { color: "bg-yellow-800/40 border-yellow-700/40", label: "Medium (मध्यम)", action: "सामान्य मात्रा में दें" },
                        { color: "bg-green-800/40 border-green-700/40", label: "High (पर्याप्त)", action: "इस nutrient की जरूरत नहीं" },
                    ].map(x => (
                        <div key={x.label} className={`${x.color} border rounded-xl p-3 text-center`}>
                            <p className="text-white font-black text-xs">{x.label}</p>
                            <p className="text-green-400 text-[10px] mt-1">{x.action}</p>
                        </div>
                    ))}
                </div>
                <div className="glass-card p-4 bg-green-900/20 border-green-800/30 rounded-xl">
                    <p className="text-green-400 font-black mb-2">📋 Recommended doses (per acre) for common crops:</p>
                    <table className="w-full text-xs">
                        <thead><tr className="text-green-700 border-b border-green-900"><th className="text-left py-1">Crop</th><th>N (Urea)</th><th>P (DAP)</th><th>K (MOP)</th></tr></thead>
                        <tbody className="divide-y divide-green-900/30">
                            {[
                                ["Wheat / गेहूं", "60 kg/acre", "30 kg/acre", "20 kg/acre"],
                                ["Paddy / धान", "50 kg/acre", "24 kg/acre", "16 kg/acre"],
                                ["Soybean", "8 kg/acre", "32 kg/acre", "16 kg/acre"],
                                ["Maize / मक्का", "55 kg/acre", "25 kg/acre", "17 kg/acre"],
                            ].map(([c, n, p, k]) => (
                                <tr key={c} className="text-green-300"><td className="py-1">{c}</td><td className="text-center">{n}</td><td className="text-center">{p}</td><td className="text-center">{k}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="glass-card p-4 bg-purple-900/20 border-purple-800/30 rounded-xl">
                    <p className="text-purple-300 font-black mb-2">⚠️ सबसे बड़ी गलतियाँ:</p>
                    <ul className="space-y-1">
                        <li>❌ हर साल same dose बिना जांच के — बर्बादी</li>
                        <li>❌ सारी Urea एक बार में — 40% उड़ जाती है</li>
                        <li>✅ Urea को 3 बार में दें: बुवाई + 20 दिन + 40 दिन</li>
                        <li>✅ DAP सिर्फ बुवाई के समय — जड़ों के पास</li>
                    </ul>
                </div>
            </div>
        ),
    },
    s3: {
        title: "NPK: What, Why, How Much",
        titleHi: "NPK क्या है और कितना डालें",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">उर्वरक की सही मात्रा और समय</p>
                <div className="space-y-3">
                    {[
                        { name: "Urea (46% N)", color: "from-yellow-700 to-yellow-600", facts: ["सबसे सस्ता N source", "धीमे-धीमे 2-3 किस्तों में दें", "बारिश से पहले न डालें — बह जाता है", "Neem Coated Urea बेहतर है"], },
                        { name: "DAP (18N-46P)", color: "from-blue-700 to-blue-600", facts: ["बुवाई के समय बीज के नीचे डालें", "एक बार में पूरी मात्रा", "सबसे अच्छा starter fertilizer", "SSP + Urea = DAP का सस्ता विकल्प"], },
                        { name: "MOP / Potash (60% K)", color: "from-purple-700 to-purple-600", facts: ["अनाज में चमक और स्वाद लाता है", "रोग प्रतिरोधक बढ़ाता है", "गेहूं में बुवाई के समय", "मिट्टी जांच में K हाई हो तो न डालें"], },
                    ].map(f => (
                        <div key={f.name} className={`glass-card p-4 rounded-xl bg-gradient-to-r ${f.color} bg-opacity-10`}>
                            <p className="text-white font-black mb-2">{f.name}</p>
                            <ul className="space-y-1">{f.facts.map(x => <li key={x} className="text-green-200 text-xs flex gap-2"><span className="text-green-500">•</span>{x}</li>)}</ul>
                        </div>
                    ))}
                </div>
                <div className="glass-card p-4 bg-green-900/20 border-green-800/30 rounded-xl">
                    <p className="text-green-400 font-black mb-2">💰 Cost comparison per acre (Wheat example):</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>Urea (60 kg)</span><span className="text-green-400 font-bold">≈ ₹390</span></div>
                        <div className="flex justify-between"><span>DAP (30 kg)</span><span className="text-green-400 font-bold">≈ ₹840</span></div>
                        <div className="flex justify-between"><span>MOP (20 kg)</span><span className="text-green-400 font-bold">≈ ₹360</span></div>
                        <div className="flex justify-between border-t border-green-900/30 pt-1 mt-1"><span className="font-bold text-white">Total per acre</span><span className="text-yellow-400 font-black">≈ ₹1,590</span></div>
                    </div>
                </div>
            </div>
        ),
    },
    i1: {
        title: "Major Pests of Kharif Crops",
        titleHi: "खरीफ फसलों के मुख्य कीट",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">खरीफ में सबसे ज्यादा नुकसान करने वाले कीट</p>
                {[
                    { pest: "American Bollworm (कपास इल्ली)", crops: "Cotton, Tomato, Chickpea", damage: "टिंडे में घुसकर अंदर से खाती है। 60% तक नुकसान।", control: "Bt cotton लगाएं। Pheromone trap @ 5/acre। Emamectin Benzoate 0.5% spray।", icon: "🐛" },
                    { pest: "Stem Borer (तना छेदक)", crops: "Paddy, Maize, Sugarcane", damage: "तने में घुसकर dead heart/white ear बनाता है। 20-40% नुकसान।", control: "Cartap Hydrochloride 4G @ 8 kg/acre। या Chlorpyrifos 20EC @ 1L/acre।", icon: "🦗" },
                    { pest: "Whitefly (सफेद मक्खी)", crops: "Cotton, Soybean, Chilli", damage: "पत्तियों का रस चूसती है + Yellow Mosaic Virus फैलाती है।", control: "Imidacloprid अब बंद करें (resistance)। Spiromesifen 240 SC @ 200 ml/acre।", icon: "🦟" },
                    { pest: "Aphid (माहू)", crops: "Mustard, Wheat, Vegeta.", damage: "कालोनियाँ बनाकर रस चूसती है। Honeydew से sooty mould।", control: "Dimethoate 30 EC @ 300 ml/acre। या नीम तेल 3% spray।", icon: "🐜" },
                    { pest: "Army Worm (सेना कीड़ा)", crops: "Maize, Wheat", damage: "रात में पूरी फसल चट कर देता है। नई समस्या — Fall Army Worm।", control: "Spinetoram 11.7SC @ 100 ml/acre। सुबह early spray।", icon: "🐌" },
                ].map(p => (
                    <div key={p.pest} className="glass-card p-4 rounded-xl space-y-2 hover:border-green-800/30 border border-transparent transition">
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">{p.icon}</span>
                            <div>
                                <h4 className="text-white font-black">{p.pest}</h4>
                                <p className="text-yellow-500 text-xs">फसलें: {p.crops}</p>
                            </div>
                        </div>
                        <p className="text-red-300 text-xs">⚠️ नुकसान: {p.damage}</p>
                        <p className="text-green-300 text-xs">✅ इलाज: {p.control}</p>
                    </div>
                ))}
                <div className="glass-card p-4 bg-blue-900/20 border-blue-800/30 rounded-xl text-xs">
                    <p className="text-blue-300 font-black mb-1">📞 Kisan Call Centre — कीट पहचान और सलाह</p>
                    <p className="text-white font-black text-lg">1800-180-1551</p>
                    <p className="text-blue-600">(सुबह 6 बजे से रात 10 बजे — हिंदी में)</p>
                </div>
            </div>
        ),
    },
    i3: {
        title: "Neem-Based Pesticides",
        titleHi: "नीम आधारित जैव कीटनाशक",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">घर पर बने नीम उत्पाद — सबसे सस्ता, सुरक्षित कीटनाशक</p>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { name: "नीम का काढ़ा (Neem Kadha)", steps: ["5 kg नीम की पत्तियाँ + 10L पानी उबालें", "ठंडा होने पर छान लें", "2L concentrate को 8L पानी में मिलाएं", "Spray करें — सुबह / शाम"], works: "Aphid, Mealybug, Whitefly, Mites", color: "from-green-800 to-emerald-700" },
                        { name: "नीम का तेल (Neem Oil) 3%", steps: ["30 ml नीम तेल + 1 ml liquid soap", "1 Liter पानी में मिलाएं", "अच्छे से हिलाएं — pump sprayer में डालें", "हर 7 दिन में spray करें"], works: "Fungal disease, Powdery mildew, Aphids", color: "from-lime-800 to-green-700" },
                        { name: "BNSK (Beejamruta seed treatment)", steps: ["5 kg गाय का गोबर + 5L गोमूत्र", "50g चूना + 1 Liter पानी", "रात भर रखें, सुबह बीजों में लगाएं", "30 min सुखाकर बुवाई करें"], works: "Seed-borne diseases, Root rot", color: "from-amber-800 to-yellow-700" },
                    ].map(f => (
                        <div key={f.name} className={`glass-card p-4 rounded-xl bg-gradient-to-br ${f.color} bg-opacity-10`}>
                            <p className="text-white font-black mb-3">{f.name}</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-2">बनाने का तरीका</p>
                                    <ol className="space-y-1">{f.steps.map((s, i) => <li key={i} className="text-xs text-green-200 flex gap-1"><span className="text-green-600">{i + 1}.</span>{s}</li>)}</ol>
                                </div>
                                <div className="glass-card p-3 rounded-xl bg-green-900/20 h-fit">
                                    <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-1">काम करता है</p>
                                    <p className="text-green-300 text-xs">{f.works}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-green-600 text-xs">💡 नीम के घोल का effect 7–10 दिन तक रहता है। बारिश के बाद दोबारा spray करें।</p>
            </div>
        ),
    },
    w1: {
        title: "Critical Irrigation Stages for Wheat",
        titleHi: "गेहूं में सिंचाई कब करें",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">गेहूं में सिंचाई — वैज्ञानिक तरीका</p>
                <p>गेहूं में अगर सही समय पर सिंचाई न हो — तो 25–40% yield कम हो जाती है। नीचे सबसे जरूरी stages दी हैं:</p>
                <div className="space-y-3">
                    {[
                        { stage: "1. CRI (Crown Root Initiation)", days: "बुवाई के 20–25 दिन बाद", why: "पहली जड़ें बनती हैं। इस समय पानी न मिले तो पौधा मर सकता है।", tip: "हल्की सिंचाई दें — खेत में पानी भरे नहीं", icon: "🌱", critical: true },
                        { stage: "2. Tillering (कल्लों की अवस्था)", days: "बुवाई के 40–45 दिन बाद", why: "ज्यादा कल्ले = ज्यादा बालियाँ = ज्यादा उपज", tip: "अगर इस समय पानी न मिले — 30% yield कम होती है", icon: "🌿", critical: true },
                        { stage: "3. Jointing (संधि अवस्था)", days: "65–70 दिन बाद", why: "तना बढ़ता है, नोड्स बनते हैं", tip: "मध्यम सिंचाई — रोगजनकों से बचाव के लिए", icon: "🎋", critical: false },
                        { stage: "4. Flowering (बालियाँ निकलना)", days: "90–95 दिन बाद", why: "परागण का समय — नमी जरूरी है", tip: "दोपहर में spray/irrigation न करें", icon: "🌾", critical: true },
                        { stage: "5. Grain Filling (दाना भरना)", days: "105–110 दिन बाद", why: "दाने का वजन और size तय होता है", tip: "2 सिंचाई दें। कटाई से 10 दिन पहले बंद करें।", icon: "🫘", critical: true },
                    ].map(x => (
                        <div key={x.stage} className={`glass-card p-4 rounded-xl border ${x.critical ? "border-blue-800/30 bg-blue-900/10" : "border-transparent"}`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{x.icon}</span>
                                <div>
                                    <p className="text-white font-black">{x.stage} {x.critical && <span className="text-[10px] bg-red-800/40 text-red-300 px-2 py-0.5 rounded-full ml-1">Critical ⭐</span>}</p>
                                    <p className="text-blue-400 text-xs font-bold">{x.days}</p>
                                    <p className="text-green-300 text-xs mt-1">{x.why}</p>
                                    <p className="text-yellow-400 text-xs mt-1">💡 {x.tip}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="glass-card p-3 bg-green-900/20 border-green-800/30 rounded-xl text-xs">
                    <p className="text-green-400 font-bold">💧 पानी की मात्रा: हर सिंचाई में 5–6 cm पानी। कुल 5–6 सिंचाई = 30–36 cm। Drip से 50% बचत।</p>
                </div>
            </div>
        ),
    },
    mk1: {
        title: "Understanding MSP",
        titleHi: "MSP क्या है और कैसे मिलती है",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">MSP — Minimum Support Price (न्यूनतम समर्थन मूल्य)</p>
                <p>MSP वह कीमत है जो सरकार तय करती है — अगर बाजार में दाम गिरें, तो भी सरकार इस कीमत पर आपसे फसल खरीदती है।</p>
                <div className="glass-card p-4 bg-yellow-900/20 border-yellow-800/30 rounded-xl">
                    <p className="text-yellow-300 font-black mb-3">📋 MSP 2024-25 (प्रमुख फसलें):</p>
                    <table className="w-full text-xs">
                        <thead><tr className="text-green-700 border-b border-green-900/30"><th className="text-left py-1">फसल</th><th className="text-right">MSP (₹/Quintal)</th></tr></thead>
                        <tbody className="divide-y divide-green-900/20">
                            {[["गेहूं", "₹2,275"], ["धान (Grade A)", "₹2,320"], ["सरसों", "₹5,650"], ["चना", "₹5,440"], ["मक्का", "₹2,090"], ["सोयाबीन", "₹4,892"], ["कपास (Long)", "₹7,521"], ["मूंगफली", "₹6,783"]].map(([c, p]) => (
                                <tr key={c} className="text-green-300"><td className="py-1.5">{c}</td><td className="text-right font-black text-white">{p}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="glass-card p-4 bg-green-900/20 border-green-800/30 rounded-xl">
                    <p className="text-green-400 font-black mb-2">✅ MSP पर कहाँ बेचें:</p>
                    <ul className="space-y-1.5 text-xs">
                        <li>🏛️ <strong className="text-white">FCI (Food Corporation of India)</strong> — गेहूं, धान खरीदती है</li>
                        <li>🏛️ <strong className="text-white">NAFED / NCCF</strong> — दलहन, तिलहन</li>
                        <li>🏛️ <strong className="text-white">CCI</strong> — कपास</li>
                        <li>📱 <strong className="text-white">PM-AASHA Portal</strong> — registration करें: pmaasha.gov.in</li>
                    </ul>
                </div>
                <div className="glass-card p-4 bg-red-900/10 border-red-900/20 rounded-xl text-xs">
                    <p className="text-red-300 font-bold">⚠️ जरूरी: MSP पर बेचने के लिए आपको रजिस्ट्रेशन करना होगा। अपने नजदीकी APMC/मंडी या PM-AASHA portal पर पंजीकरण करें। दस्तावेज: Aadhaar, खसरा/खाता, Bank Passbook.</p>
                </div>
            </div>
        ),
    },
    g1: {
        title: "PM-KISAN — Eligibility & Status",
        titleHi: "PM-KISAN के लिए कौन eligible है",
        body: (
            <div className="space-y-4 text-sm text-green-300 leading-relaxed">
                <p className="text-white font-bold text-base">PM-KISAN — प्रधानमंत्री किसान सम्मान निधि</p>
                <div className="glass-card p-4 bg-green-900/20 border-green-800/30 rounded-xl">
                    <p className="text-green-400 font-black mb-2">💰 क्या मिलता है:</p>
                    <p className="text-white text-2xl font-black">₹6,000/वर्ष</p>
                    <p className="text-green-600 text-xs">3 किस्तों में — ₹2,000 हर 4 महीने पर। सीधे बैंक खाते में।</p>
                </div>
                {[
                    { label: "✅ कौन eligible है", color: "bg-green-900/20 border-green-800/30", items: ["सभी भूमिधारक किसान परिवार (छोटे-बड़े सभी)", "जिनके नाम पर खेती की जमीन है", "नए किसान भी — अभी apply करें"] },
                    { label: "❌ कौन eligible नहीं है", color: "bg-red-900/10 border-red-900/20", items: ["Income Tax भरने वाले किसान", "सरकारी कर्मचारी/पेंशनधारक", "डॉक्टर, इंजीनियर, वकील (professional)", "₹10,000+/माह pension पाने वाले"] },
                ].map(x => (
                    <div key={x.label} className={`glass-card p-4 ${x.color} rounded-xl`}>
                        <p className="font-black text-white mb-2">{x.label}</p>
                        <ul className="space-y-1">{x.items.map(i => <li key={i} className="text-sm text-green-200">• {i}</li>)}</ul>
                    </div>
                ))}
                <div className="glass-card p-4 bg-blue-900/20 border-blue-800/30 rounded-xl">
                    <p className="text-blue-300 font-black mb-2">📱 Status देखें / Apply करें:</p>
                    <ul className="space-y-2 text-xs">
                        <li>🔗 Website: <span className="text-blue-400 font-bold">pmkisan.gov.in</span></li>
                        <li>📞 Helpline: <span className="text-white font-black">155261 / 011-24300606</span></li>
                        <li>📋 Documents: Aadhaar + खसरा/खाता नंबर + Bank Passbook</li>
                        <li>🏦 अगर पैसे नहीं आए → Land Seeding (भूमि सत्यापन) चेक करें</li>
                    </ul>
                </div>
            </div>
        ),
    },
};

// ─── Courses data ─────────────────────────────────────────────────────────────
interface Lesson { id: string; title: string; titleHi: string; duration: string; type: "reading" | "video" | "quiz"; }
interface Course { id: string; title: string; titleHi: string; icon: string; category: string; color: string; description: string; lessons: Lesson[]; students: string; rating: number; language: string; free: boolean; benefit: string; }

const COURSES: Course[] = [
    {
        id: "soil", title: "Soil Health Mastery", titleHi: "मिट्टी की सेहत और परीक्षण", icon: "🌱", category: "Farming Basics", color: "from-amber-700 to-yellow-600", description: "Understand soil health, NPK balance, pH testing, and how to reduce fertilizer cost by 30%.", language: "Hindi+Eng", free: true, students: "24,000+", rating: 4.8, benefit: "Reduce fertilizer cost by 30%",
        lessons: [
            { id: "s1", title: "Why Soil Health Matters", titleHi: "मिट्टी की जांच क्यों जरूरी है", duration: "8 min", type: "reading" },
            { id: "s2", title: "How to Read Soil Test Report", titleHi: "रिपोर्ट कैसे पढ़ें", duration: "12 min", type: "reading" },
            { id: "s3", title: "NPK: What, Why, How Much", titleHi: "NPK क्या है और कितना डालें", duration: "15 min", type: "reading" },
        ]
    },
    {
        id: "ipm", title: "Integrated Pest Management", titleHi: "कीट प्रबंधन — कम लागत, ज्यादा फायदा", icon: "🐛", category: "Crop Protection", color: "from-green-700 to-emerald-600", description: "Identify pests, use safe bio-pesticides, pheromone traps, and reduce chemical use by 40%.", language: "Hindi", free: true, students: "18,500+", rating: 4.9, benefit: "Reduce pesticide cost by 40%",
        lessons: [
            { id: "i1", title: "Major Pests of Kharif Crops", titleHi: "खरीफ फसलों के मुख्य कीट", duration: "14 min", type: "reading" },
            { id: "i3", title: "Neem-Based Pesticides (Bio)", titleHi: "नीम आधारित जैव कीटनाशक", duration: "10 min", type: "reading" },
        ]
    },
    {
        id: "water", title: "Water-Smart Farming", titleHi: "पानी बचाओ, उपज बढ़ाओ", icon: "💧", category: "Irrigation", color: "from-blue-700 to-cyan-600", description: "Learn critical irrigation stages for wheat, paddy, and how to save 35–50% water.", language: "Hindi+Eng", free: true, students: "31,000+", rating: 4.7, benefit: "Save 35–50% water",
        lessons: [
            { id: "w1", title: "Critical Irrigation Stages for Wheat", titleHi: "गेहूं में सिंचाई कब करें", duration: "10 min", type: "reading" },
        ]
    },
    {
        id: "market", title: "Sell Smart — Get Better Prices", titleHi: "फसल की सही कीमत कैसे पाएं", icon: "📈", category: "Marketing", color: "from-emerald-700 to-teal-600", description: "Understand MSP, e-NAM selling, FPO benefits, and how to get 15–25% higher prices.", language: "Hindi", free: true, students: "42,000+", rating: 4.9, benefit: "+15–25% selling price",
        lessons: [
            { id: "mk1", title: "Understanding MSP — Protected Price", titleHi: "MSP क्या है और कैसे मिलती है", duration: "10 min", type: "reading" },
        ]
    },
    {
        id: "govt", title: "Government Schemes Decoded", titleHi: "सरकारी योजनाओं का फायदा", icon: "📋", category: "Schemes", color: "from-purple-700 to-violet-600", description: "Step-by-step guides for PM-KISAN, PMFBY, KCC, PM-KUSUM, and 10+ schemes.", language: "Hindi", free: true, students: "55,000+", rating: 5.0, benefit: "Claim ₹50,000+ in benefits",
        lessons: [
            { id: "g1", title: "PM-KISAN — ₹6,000/year Eligibility", titleHi: "PM-KISAN के लिए कौन eligible है", duration: "8 min", type: "reading" },
        ]
    },
];

const QUIZ = [
    { q: "गेहूं में CRI stage कब आती है?", options: ["बुवाई के 5 दिन बाद", "बुवाई के 20–25 दिन बाद", "बुवाई के 60 दिन बाद", "कटाई के समय"], correct: 1, explanation: "CRI (Crown Root Initiation) बुवाई के 20–25 दिन बाद होती है। यह सबसे Critical irrigation stage है।" },
    { q: "PM-KISAN में एक परिवार को साल में कितना मिलता है?", options: ["₹2,000", "₹4,000", "₹6,000", "₹12,000"], correct: 2, explanation: "PM-KISAN के तहत ₹6,000 प्रति वर्ष — ₹2,000 की 3 किस्तों में।" },
    { q: "PMFBY में Kharif farmer को premium कितना देना होता है?", options: ["1%", "2%", "5%", "10%"], correct: 1, explanation: "PMFBY में Kharif crops के लिए farmer को सिर्फ 2% premium देना होता है।" },
    { q: "Yellow Mosaic Virus किसके द्वारा फैलता है?", options: ["Aphids", "Whitefly", "Thrips", "बारिश से"], correct: 1, explanation: "Yellow Mosaic Virus whitefly द्वारा फैलता है। Whitefly control ही एकमात्र उपाय है।" },
    { q: "Drip irrigation से पानी की बचत कितनी होती है?", options: ["10%", "20%", "35–50%", "70%"], correct: 2, explanation: "Drip irrigation से 35–50% पानी बचता है vs flood irrigation।" },
];

const DIFF_COLORS: Record<string, string> = { reading: "text-blue-400", video: "text-rose-400", quiz: "text-purple-400" };
const TYPE_ICONS: Record<string, string> = { reading: "📖", video: "▶️", quiz: "🧠" };

export default function LearnPage() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<string | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [category, setCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizIdx, setQuizIdx] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);

    const allCategories = ["All", ...Array.from(new Set(COURSES.map(c => c.category)))];
    const filtered = COURSES.filter(c =>
        (category === "All" || c.category === category) &&
        (c.title.toLowerCase().includes(query.toLowerCase()) || c.titleHi.includes(query))
    );

    function markComplete(id: string) { setCompletedLessons(p => { const n = new Set(p); n.add(id); return n; }); }
    function answerQuiz(i: number) { setQuizAnswer(i); if (i === QUIZ[quizIdx].correct) setQuizScore(s => s + 1); }
    function nextQ() { if (quizIdx + 1 >= QUIZ.length) setQuizDone(true); else { setQuizIdx(q => q + 1); setQuizAnswer(null); } }

    // ── Lesson view ──────────────────────────────────────────────────────────────
    if (activeLesson && selectedCourse) {
        const lesson = selectedCourse.lessons.find(l => l.id === activeLesson)!;
        const content = LESSON_CONTENT[activeLesson];
        const isComplete = completedLessons.has(activeLesson);
        const idx = selectedCourse.lessons.findIndex(l => l.id === activeLesson);
        const next = selectedCourse.lessons[idx + 1];
        return (
            <div className="flex flex-col items-center gap-8 pb-20 px-4 w-full">
                <div className="w-full max-w-3xl">
                    <button onClick={() => setActiveLesson(null)} className="text-green-600 text-sm flex items-center gap-1 hover:text-green-400 transition mb-4 mt-4"><ArrowLeft size={14} /> Back to course</button>
                    <div className="glass-card p-6 mb-6 border-teal-800/30">
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{selectedCourse.title}</p>
                            <span className="text-xs text-green-700 flex items-center gap-1"><Clock size={10} /> {lesson.duration}</span>
                        </div>
                        <h1 className="text-white font-black text-xl">{lesson.title}</h1>
                        <p className="text-teal-600 text-sm">{lesson.titleHi}</p>
                    </div>
                    {content ? (
                        <div className="glass-card p-6 mb-6">{content.body}</div>
                    ) : (
                        <div className="glass-card p-8 text-center text-green-700">
                            <p className="text-4xl mb-3">📖</p>
                            <p>Full lesson content coming soon. Check the Schemes and Finance sections for detailed guides!</p>
                        </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                        {!isComplete && (
                            <button onClick={() => markComplete(activeLesson)} className="btn-primary px-6 py-3 flex items-center gap-2 rounded-xl text-sm">
                                <CheckCircle2 size={16} /> Mark as Completed
                            </button>
                        )}
                        {isComplete && <div className="flex items-center gap-2 text-green-400 text-sm font-bold"><CheckCircle2 size={16} /> Completed!</div>}
                        {next && (
                            <button onClick={() => setActiveLesson(next.id)} className="btn-secondary px-6 py-3 flex items-center gap-2 rounded-xl text-sm">
                                Next Lesson: {next.title} <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── Course view ──────────────────────────────────────────────────────────────
    if (selectedCourse) {
        const done = selectedCourse.lessons.filter(l => completedLessons.has(l.id)).length;
        const pct = Math.round((done / selectedCourse.lessons.length) * 100);
        return (
            <div className="flex flex-col items-center gap-8 pb-20 px-4 w-full">
                <div className="w-full max-w-3xl">
                    <button onClick={() => setSelectedCourse(null)} className="text-green-600 text-sm flex items-center gap-1 hover:text-green-400 transition mb-4 mt-4"><ArrowLeft size={14} /> All Courses</button>
                    <div className={`glass-card p-7 bg-gradient-to-br ${selectedCourse.color}/20 mb-6`}>
                        <div className="text-5xl mb-3">{selectedCourse.icon}</div>
                        <h1 className="text-white font-black text-2xl">{selectedCourse.title}</h1>
                        <p className="text-white/60 text-sm mt-1">{selectedCourse.titleHi}</p>
                        <p className="text-white/80 text-sm mt-3">{selectedCourse.description}</p>
                        <div className="flex gap-3 mt-4 flex-wrap text-xs">
                            <span className="bg-black/20 text-white/60 px-3 py-1 rounded-full">⭐ {selectedCourse.rating}</span>
                            <span className="bg-black/20 text-white/60 px-3 py-1 rounded-full">👨‍🎓 {selectedCourse.students}</span>
                            <span className="bg-green-600/40 text-green-200 px-3 py-1 rounded-full">{selectedCourse.free ? "FREE" : "Premium"}</span>
                        </div>
                        <div className="mt-4 bg-black/20 rounded-xl p-3">
                            <p className="text-green-300 text-sm font-bold">💰 {selectedCourse.benefit}</p>
                        </div>
                        {pct > 0 && (
                            <div className="mt-4 space-y-1">
                                <div className="flex justify-between text-xs text-white/50"><span>Progress</span><span>{done}/{selectedCourse.lessons.length}</span></div>
                                <div className="h-2 bg-black/20 rounded-full"><div className={`h-full bg-gradient-to-r ${selectedCourse.color} rounded-full`} style={{ width: `${pct}%` }} /></div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        {selectedCourse.lessons.map((l, i) => {
                            const done = completedLessons.has(l.id);
                            const hasContent = !!LESSON_CONTENT[l.id];
                            return (
                                <button key={l.id} onClick={() => setActiveLesson(l.id)}
                                    className="glass-card p-4 flex items-center gap-4 hover:border-teal-800/30 border border-transparent transition w-full text-left">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-green-700/30" : "bg-green-900/20"}`}>
                                        {done ? <CheckCircle2 size={20} className="text-green-400" /> : <span className="text-green-700 font-black">{i + 1}</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-black text-sm ${done ? "text-green-500" : "text-white"}`}>{l.title}</p>
                                        <p className="text-green-800 text-xs">{l.titleHi}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs flex-shrink-0">
                                        <span className={DIFF_COLORS[l.type]}>{TYPE_ICONS[l.type]}</span>
                                        <span className="text-green-800 flex items-center gap-1"><Clock size={9} />{l.duration}</span>
                                        <ChevronRight size={14} className="text-green-800" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ── Course list ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col items-center gap-12 pb-20 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shadow-2xl shadow-teal-950/40">
                    <BookOpen size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Kisan Pathshala</h1>
                    <p className="text-teal-400 font-black uppercase tracking-[0.4em] text-sm">Real Lessons · Real Knowledge · Real Growth</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[{ label: "Courses", value: `${COURSES.length}`, icon: "📚" }, { label: "Learners", value: "1.8L+", icon: "👨‍🌾" }, { label: "All FREE", value: "✅", icon: "🎁" }].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-teal-700 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz */}
            <div className="w-full max-w-6xl">
                {!showQuiz ? (
                    <button onClick={() => setShowQuiz(true)} className="glass-card w-full p-5 flex items-center gap-4 hover:border-teal-700/40 border border-transparent transition">
                        <span className="text-4xl">🧠</span>
                        <div className="text-left flex-1"><p className="text-white font-black">Quick Kisan Quiz</p><p className="text-teal-600 text-sm">5 questions — test your farming knowledge</p></div>
                        <ChevronRight size={20} className="text-teal-500" />
                    </button>
                ) : !quizDone ? (
                    <div className="glass-card p-6 space-y-5 border-teal-800/30">
                        <div className="flex justify-between items-center">
                            <p className="text-teal-400 font-bold text-sm">Question {quizIdx + 1}/{QUIZ.length}</p>
                            <p className="text-green-600 text-sm font-bold">Score: {quizScore}</p>
                        </div>
                        <div className="bg-teal-900/10 rounded-xl p-4 border border-teal-800/20">
                            <p className="text-white font-black text-lg">{QUIZ[quizIdx].q}</p>
                        </div>
                        <div className="space-y-2">
                            {QUIZ[quizIdx].options.map((o, i) => {
                                const isCorrect = i === QUIZ[quizIdx].correct; const isSelected = i === quizAnswer;
                                let cls = "glass-card p-4 cursor-pointer border transition text-sm font-bold ";
                                if (quizAnswer !== null) { if (isCorrect) cls += "border-green-500 bg-green-900/20 text-green-300"; else if (isSelected) cls += "border-red-500 bg-red-900/20 text-red-300"; else cls += "border-transparent opacity-40 text-green-800"; }
                                else cls += "border-transparent hover:border-teal-700/40 text-white";
                                return <div key={i} className={cls} onClick={() => quizAnswer === null && answerQuiz(i)}>{String.fromCharCode(65 + i)}. {o}</div>;
                            })}
                        </div>
                        {quizAnswer !== null && (<>
                            <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-4"><p className="text-blue-300 text-sm">💡 {QUIZ[quizIdx].explanation}</p></div>
                            <button onClick={nextQ} className="btn-primary w-full py-3 text-sm rounded-xl">{quizIdx + 1 < QUIZ.length ? "Next →" : "See Result"}</button>
                        </>)}
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center space-y-4 border-teal-800/30">
                        <span className="text-5xl">{quizScore >= 4 ? "🏆" : quizScore >= 2 ? "👍" : "📚"}</span>
                        <p className="text-white font-black text-2xl">{quizScore}/{QUIZ.length} सही</p>
                        <p className="text-teal-400">{quizScore === 5 ? "शानदार! आप एक जानकार किसान हैं!" : "नीचे courses पढ़कर और सीखें!"}</p>
                        <button onClick={() => { setShowQuiz(false); setQuizIdx(0); setQuizAnswer(null); setQuizScore(0); setQuizDone(false); }} className="btn-secondary px-6 py-3 text-sm rounded-xl">फिर खेलें</button>
                    </div>
                )}
            </div>

            {/* Search + Filter */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" />
                    <input className="input-field pl-9 w-full text-sm" placeholder="Search courses..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {allCategories.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${category === c ? "bg-teal-700/40 border-teal-600 text-teal-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>{c}</button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(c => {
                    const done = c.lessons.filter(l => completedLessons.has(l.id)).length;
                    const pct = Math.round((done / c.lessons.length) * 100);
                    return (
                        <div key={c.id} className="glass-card flex flex-col hover:border-teal-700/30 border border-transparent transition-all cursor-pointer" onClick={() => setSelectedCourse(c)}>
                            <div className={`h-2 rounded-t-xl bg-gradient-to-r ${c.color}`} style={{ width: `${pct}%`, minWidth: pct > 0 ? "20px" : "0" }} />
                            <div className="p-6 flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-4xl">{c.icon}</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-800/40 text-green-400">FREE</span>
                                </div>
                                <div><h3 className="text-white font-black">{c.title}</h3><p className="text-teal-600 text-xs">{c.titleHi}</p></div>
                                <p className="text-green-600 text-xs leading-relaxed flex-1">{c.description}</p>
                                <div className="bg-green-900/10 rounded-xl p-3 border border-green-900/20">
                                    <p className="text-green-400 text-xs font-bold">💰 {c.benefit}</p>
                                </div>
                                <div className="flex gap-3 text-xs text-green-700">
                                    <span><Star size={10} className="inline text-yellow-500 mr-0.5" />{c.rating}</span>
                                    <span>👨‍🎓 {c.students}</span>
                                    <span>📖 {c.lessons.length} lessons</span>
                                </div>
                                {pct > 0 && <div className="h-1.5 bg-green-900/30 rounded-full"><div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${pct}%` }} /></div>}
                            </div>
                            <div className="border-t border-teal-900/20 p-4">
                                <button className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl">
                                    <Play size={14} /> {pct > 0 ? "Continue Learning" : "Start Course"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Achievements */}
            <div className="w-full max-w-6xl">
                <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2"><Award size={18} className="text-yellow-400" /> Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: "🌱", title: "First Lesson", unlocked: completedLessons.size >= 1 },
                        { icon: "💧", title: "Water Wise", unlocked: completedLessons.has("w1") },
                        { icon: "🏆", title: "Quiz Master", unlocked: quizDone && quizScore === 5 },
                        { icon: "🎓", title: "Kisan Grad", unlocked: completedLessons.size >= 5 },
                    ].map(a => (
                        <div key={a.title} className={`glass-card p-4 text-center ${a.unlocked ? "border-yellow-800/30" : "opacity-40"}`}>
                            <span className="text-3xl">{a.unlocked ? a.icon : "🔒"}</span>
                            <p className={`font-black text-sm mt-2 ${a.unlocked ? "text-white" : "text-green-900"}`}>{a.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
