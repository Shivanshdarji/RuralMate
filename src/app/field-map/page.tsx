"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
    Map, Navigation, Plus, Trash2, Edit3, Layers, Download,
    Save, X, Ruler, Sprout, AlertTriangle, CheckCircle2, ChevronRight, Target
} from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

interface Field {
    id: string;
    name: string;
    crop: string;
    area: string;    // computed from polygon or manual
    color: string;
    lat: number;
    lng: number;
    stage?: string;
    health?: "Good" | "Fair" | "Poor";
    notes?: string;
    polygonCoords?: [number, number][];
}

const CROP_OPTIONS = ["Wheat", "Rice", "Mustard", "Chickpea", "Soybean", "Cotton", "Sugarcane", "Maize", "Onion", "Potato", "Tomato", "Other"];
const STAGE_OPTIONS = ["Sowing", "Germination", "Vegetative", "Flowering", "Pod Fill", "Maturity", "Harvested"];
const FIELD_COLORS = ["#22c55e", "#facc15", "#60a5fa", "#f97316", "#a78bfa", "#f43f5e", "#2dd4bf", "#fb923c"];

const DEFAULT_FIELDS: Field[] = [
    {
        id: "1", name: "Field A", area: "2.0 acres", crop: "Wheat", color: "#22c55e",
        lat: 22.7196, lng: 75.8577, stage: "Growing", health: "Good",
        notes: "Applied urea on Jan 10",
        polygonCoords: [[22.722, 75.856], [22.722, 75.860], [22.717, 75.860], [22.717, 75.856]],
    },
    {
        id: "2", name: "Field B", area: "2.0 acres", crop: "Mustard", color: "#facc15",
        lat: 22.7210, lng: 75.8610, stage: "Flowering", health: "Good",
        notes: "Flowering stage — check for aphids",
        polygonCoords: [[22.723, 75.860], [22.723, 75.864], [22.718, 75.864], [22.718, 75.860]],
    },
    {
        id: "3", name: "Field C", area: "1.5 acres", crop: "Chickpea", color: "#60a5fa",
        lat: 22.7183, lng: 75.8550, stage: "Pod Fill", health: "Fair",
        notes: "Poor germination in northeast corner",
        polygonCoords: [[22.721, 75.853], [22.721, 75.857], [22.716, 75.857], [22.716, 75.853]],
    },
];

function computeArea(coords: [number, number][]): string {
    if (coords.length < 3) return "—";
    // Shoelace formula for approximate area in m², then convert to acres
    let area = 0;
    const n = coords.length;
    const R = 6371000; // earth radius in meters
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const lat1 = (coords[i][0] * Math.PI) / 180;
        const lat2 = (coords[j][0] * Math.PI) / 180;
        const lng1 = (coords[i][1] * Math.PI) / 180;
        const lng2 = (coords[j][1] * Math.PI) / 180;
        area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs((area * R * R) / 2);
    const acres = (area / 4047).toFixed(2);
    return `${acres} acres`;
}

export default function FieldMapPage() {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<{ map: any; L: any; layers: Record<string, any>; polygons: Record<string, any> } | null>(null);
    const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
    const [selected, setSelected] = useState<Field | null>(null);
    const [editing, setEditing] = useState<Field | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "found" | "denied">("idle");
    const [activeLayer, setActiveLayer] = useState<"satellite" | "street">("satellite");
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [newField, setNewField] = useState<Partial<Field>>({ name: "", crop: "Wheat", color: "#22c55e", stage: "Sowing", health: "Good" });
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawingCoords, setDrawingCoords] = useState<[number, number][]>([]);
    const drawingLayersRef = useRef<any[]>([]);
    const currentTileRef = useRef<any>(null);

    const TILE_URLS = {
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    };

    // Render all field polygons on map
    const renderFieldsOnMap = useCallback((fields: Field[], L: any, map: any, polygonsMap: Record<string, any>) => {
        // Remove existing polygons
        Object.values(polygonsMap).forEach(p => map.removeLayer(p));
        Object.keys(polygonsMap).forEach(k => delete polygonsMap[k]);

        fields.forEach(field => {
            if (!field.polygonCoords || field.polygonCoords.length < 3) return;
            const poly = L.polygon(field.polygonCoords, {
                color: field.color,
                fillColor: field.color,
                fillOpacity: 0.25,
                weight: 3,
            }).addTo(map);
            poly.bindPopup(
                `<div style="font-family:sans-serif;min-width:140px">
                    <b style="color:${field.color};font-size:14px">${field.name}</b><br>
                    <span style="color:#aaa;font-size:12px">🌱 ${field.crop}</span><br>
                    <span style="color:#aaa;font-size:12px">📐 ${field.area}</span><br>
                    <span style="color:#aaa;font-size:12px">🩺 ${field.health || "—"}</span>
                </div>`,
                { maxWidth: 200 }
            );
            poly.on("click", () => setSelected(field));
            polygonsMap[field.id] = poly;
        });
    }, []);

    // Init map once
    useEffect(() => {
        if (!mapRef.current || leafletRef.current) return;

        const loadMap = async () => {
            const L = (await import("leaflet")).default;
            if (!mapRef.current) return;
            if ((mapRef.current as any)._leaflet_id) return;

            if (!document.getElementById("leaflet-css")) {
                const link = document.createElement("link");
                link.id = "leaflet-css";
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
            }

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current!, { center: [22.7196, 75.858], zoom: 15, zoomControl: true });
            const tile = L.tileLayer(TILE_URLS.satellite, { maxZoom: 20, attribution: "© Esri" }).addTo(map);
            currentTileRef.current = tile;

            const polygonsMap: Record<string, any> = {};
            leafletRef.current = { map, L, layers: {}, polygons: polygonsMap };
            renderFieldsOnMap(DEFAULT_FIELDS, L, map, polygonsMap);
            setMapLoaded(true);
        };

        loadMap().catch(console.error);
        return () => {
            if (leafletRef.current) {
                leafletRef.current.map.remove();
                leafletRef.current = null;
                setMapLoaded(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-render polygons when fields change
    useEffect(() => {
        if (!leafletRef.current) return;
        const { L, map, polygons } = leafletRef.current;
        renderFieldsOnMap(fields, L, map, polygons);
    }, [fields, renderFieldsOnMap]);

    // Layer toggle
    const toggleLayer = () => {
        if (!leafletRef.current) return;
        const { map, L } = leafletRef.current;
        if (currentTileRef.current) map.removeLayer(currentTileRef.current);
        const next = activeLayer === "satellite" ? "street" : "satellite";
        const tile = L.tileLayer(TILE_URLS[next], { maxZoom: 20 }).addTo(map);
        currentTileRef.current = tile;
        setActiveLayer(next);
    };

    // GPS
    const getLocation = () => {
        setLocationStatus("loading");
        navigator.geolocation?.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocationStatus("found");
                if (leafletRef.current) {
                    const { map, L } = leafletRef.current;
                    map.setView([latitude, longitude], 17, { animate: true });
                    const icon = L.divIcon({
                        html: `<div style="width:18px;height:18px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 0 10px rgba(34,197,94,0.8)"></div>`,
                        className: "", iconSize: [18, 18],
                    });
                    L.marker([latitude, longitude], { icon }).addTo(map).bindPopup("📍 You are here").openPopup();
                }
            },
            () => setLocationStatus("denied")
        );
    };

    // Drawing mode: click on map to add polygon points
    const startDrawing = () => {
        if (!leafletRef.current) return;
        setDrawingMode(true);
        setDrawingCoords([]);
        drawingLayersRef.current.forEach(l => leafletRef.current!.map.removeLayer(l));
        drawingLayersRef.current = [];
        const { map, L } = leafletRef.current;
        map.getContainer().style.cursor = "crosshair";
        const onClick = (e: any) => {
            const coord: [number, number] = [e.latlng.lat, e.latlng.lng];
            setDrawingCoords(prev => {
                const next = [...prev, coord];
                // Draw temp circle marker
                const marker = L.circleMarker(coord, { radius: 5, color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1 }).addTo(map);
                drawingLayersRef.current.push(marker);
                // Draw temp polygon
                if (next.length >= 2) {
                    if (drawingLayersRef.current.length > next.length) {
                        map.removeLayer(drawingLayersRef.current[drawingLayersRef.current.length - 2]);
                        drawingLayersRef.current.splice(drawingLayersRef.current.length - 2, 1);
                    }
                    const poly = L.polygon(next, { color: "#22c55e", dashArray: "6,4", fillOpacity: 0.15, weight: 2 }).addTo(map);
                    drawingLayersRef.current.push(poly);
                }
                return next;
            });
        };
        map._drawingHandler = onClick;
        map.on("click", onClick);
    };

    const stopDrawing = (save = false) => {
        if (!leafletRef.current) return;
        const { map } = leafletRef.current;
        if (map._drawingHandler) { map.off("click", map._drawingHandler); delete map._drawingHandler; }
        map.getContainer().style.cursor = "";
        drawingLayersRef.current.forEach(l => { try { map.removeLayer(l); } catch { } });
        drawingLayersRef.current = [];
        if (!save) {
            setDrawingMode(false);
            setDrawingCoords([]);
        } else {
            setShowAddPanel(true);
        }
        setDrawingMode(false);
    };

    const saveNewField = () => {
        if (!newField.name?.trim()) return;
        const coords = drawingCoords.length >= 3 ? drawingCoords : undefined;
        const centroid = coords
            ? [coords.reduce((s, c) => s + c[0], 0) / coords.length, coords.reduce((s, c) => s + c[1], 0) / coords.length]
            : [22.7196, 75.858];
        const id = Date.now().toString();
        const area = coords ? computeArea(coords) : (newField.area || "—");
        const field: Field = {
            id, name: newField.name!, crop: newField.crop || "Wheat",
            color: newField.color || "#22c55e", area,
            lat: centroid[0], lng: centroid[1],
            stage: newField.stage, health: newField.health || "Good",
            notes: newField.notes,
            polygonCoords: coords,
        };
        setFields(prev => [...prev, field]);
        setNewField({ name: "", crop: "Wheat", color: "#22c55e", stage: "Sowing", health: "Good" });
        setDrawingCoords([]);
        setShowAddPanel(false);
    };

    const saveEdit = () => {
        if (!editing) return;
        setFields(prev => prev.map(f => f.id === editing.id ? editing : f));
        if (selected?.id === editing.id) setSelected(editing);
        setEditing(null);
    };

    const deleteField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
        if (selected?.id === id) setSelected(null);
        if (editing?.id === id) setEditing(null);
    };

    const flyToField = (f: Field) => {
        if (!leafletRef.current) return;
        leafletRef.current.map.flyTo([f.lat, f.lng], 17, { animate: true, duration: 1.2 });
        setSelected(f);
    };

    const totalAcres = fields.reduce((s, f) => {
        const n = parseFloat(f.area);
        return s + (isNaN(n) ? 0 : n);
    }, 0).toFixed(1);

    const healthColor = { Good: "text-green-400", Fair: "text-yellow-400", Poor: "text-red-400" };

    return (
        <div className="flex flex-col items-center gap-16 pb-20 px-4 w-full">

            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-500 flex items-center justify-center shadow-2xl shadow-cyan-950/40">
                    <Map size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Field Mapping</h1>
                    <p className="text-cyan-400 font-black uppercase tracking-[0.5em] text-sm">Draw · Manage · Monitor Your Land</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
                {[
                    { label: "Total Area", value: `${totalAcres} ac`, icon: "📐" },
                    { label: "Fields Mapped", value: String(fields.length), icon: "📍" },
                    { label: "Crops Active", value: [...new Set(fields.map(f => f.crop))].length.toString(), icon: "🌾" },
                ].map(s => (
                    <div key={s.label} className="glass-card p-5 text-center">
                        <p className="text-3xl mb-2">{s.icon}</p>
                        <p className="text-white font-black text-lg">{s.value}</p>
                        <p className="text-green-700 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Map + Side Panel */}
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

                {/* Map Container */}
                <div className="glass-card overflow-hidden relative border-cyan-900/20">
                    <div ref={mapRef} className="h-[520px] w-full bg-[#0d1f10]" />

                    {/* Map overlay controls */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
                        <button
                            onClick={getLocation}
                            disabled={locationStatus === "loading"}
                            className="bg-[#0a1a0d]/90 backdrop-blur border border-green-800/50 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition hover:border-green-600 disabled:opacity-60"
                        >
                            <Navigation size={13} className={locationStatus === "found" ? "text-green-400" : "text-green-600"} />
                            {locationStatus === "loading" ? "Locating..." : locationStatus === "found" ? "Located ✓" : "My Location"}
                        </button>
                        <button
                            onClick={toggleLayer}
                            className="bg-[#0a1a0d]/90 backdrop-blur border border-green-800/50 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition hover:border-cyan-600"
                        >
                            <Layers size={13} className="text-cyan-500" />
                            {activeLayer === "satellite" ? "Street View" : "Satellite"}
                        </button>
                    </div>

                    {/* Drawing controls */}
                    <div className="absolute bottom-4 left-4 flex gap-2 z-[1000]">
                        {!drawingMode ? (
                            <button
                                onClick={startDrawing}
                                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                            >
                                <Plus size={13} /> Draw Field
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => stopDrawing(true)}
                                    disabled={drawingCoords.length < 3}
                                    className="bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                                >
                                    <CheckCircle2 size={13} /> Done ({drawingCoords.length} pts)
                                </button>
                                <button
                                    onClick={() => stopDrawing(false)}
                                    className="bg-red-800/70 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                                >
                                    <X size={13} /> Cancel
                                </button>
                            </>
                        )}
                    </div>

                    {drawingMode && (
                        <div className="absolute top-4 right-4 bg-[#0a1a0d]/90 backdrop-blur border border-yellow-700/50 rounded-xl px-3 py-2 z-[1000]">
                            <p className="text-yellow-400 text-xs font-bold flex items-center gap-1">
                                <Target size={12} /> Click map to draw field boundary
                            </p>
                        </div>
                    )}

                    {!mapLoaded && (
                        <div className="absolute inset-0 bg-[#0d1f10] flex items-center justify-center z-[999]">
                            <div className="text-center gap-3 flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-green-900/30 border-t-green-500 rounded-full animate-spin" />
                                <p className="text-green-600 text-sm font-medium">Loading map…</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div className="flex flex-col gap-4">

                    {/* Add Field Panel */}
                    {showAddPanel && (
                        <div className="glass-card p-5 border-green-700/30 bg-green-950/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-green-300 font-black flex items-center gap-2"><Plus size={16} /> New Field</h3>
                                <button onClick={() => { setShowAddPanel(false); setDrawingCoords([]); }} className="text-green-700 hover:text-red-400 transition">
                                    <X size={16} />
                                </button>
                            </div>
                            {drawingCoords.length >= 3 && (
                                <p className="text-xs text-green-600 bg-green-900/20 px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Ruler size={11} /> Polygon with {drawingCoords.length} points · ~{computeArea(drawingCoords)}
                                </p>
                            )}
                            <input
                                className="input-field text-sm w-full" placeholder="Field name (e.g. Field D)"
                                value={newField.name || ""} onChange={e => setNewField(p => ({ ...p, name: e.target.value }))}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    className="input-field text-sm"
                                    value={newField.crop} onChange={e => setNewField(p => ({ ...p, crop: e.target.value }))}
                                >
                                    {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <select
                                    className="input-field text-sm"
                                    value={newField.stage} onChange={e => setNewField(p => ({ ...p, stage: e.target.value }))}
                                >
                                    {STAGE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            {drawingCoords.length < 3 && (
                                <input
                                    className="input-field text-sm w-full" placeholder="Area (e.g. 2.5 acres)"
                                    value={newField.area || ""} onChange={e => setNewField(p => ({ ...p, area: e.target.value }))}
                                />
                            )}
                            <textarea
                                className="input-field text-sm w-full h-16 resize-none" placeholder="Notes (optional)..."
                                value={newField.notes || ""} onChange={e => setNewField(p => ({ ...p, notes: e.target.value }))}
                            />
                            <div className="flex gap-1 flex-wrap">
                                {FIELD_COLORS.map(c => (
                                    <button
                                        key={c} onClick={() => setNewField(p => ({ ...p, color: c }))}
                                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-125"
                                        style={{ background: c, borderColor: newField.color === c ? "white" : "transparent" }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={saveNewField}
                                disabled={!newField.name?.trim()}
                                className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-40"
                            >
                                <Save size={14} /> Save Field
                            </button>
                        </div>
                    )}

                    {/* Edit Panel */}
                    {editing && (
                        <div className="glass-card p-5 border-cyan-700/30 bg-cyan-950/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-cyan-300 font-black flex items-center gap-2"><Edit3 size={16} /> Edit Field</h3>
                                <button onClick={() => setEditing(null)} className="text-green-700 hover:text-red-400 transition"><X size={16} /></button>
                            </div>
                            <input className="input-field text-sm w-full" value={editing.name} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-2">
                                <select className="input-field text-sm" value={editing.crop} onChange={e => setEditing(p => ({ ...p!, crop: e.target.value }))}>
                                    {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <select className="input-field text-sm" value={editing.stage || ""} onChange={e => setEditing(p => ({ ...p!, stage: e.target.value }))}>
                                    {STAGE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input className="input-field text-sm" value={editing.area} placeholder="Area" onChange={e => setEditing(p => ({ ...p!, area: e.target.value }))} />
                                <select className="input-field text-sm" value={editing.health || "Good"} onChange={e => setEditing(p => ({ ...p!, health: e.target.value as any }))}>
                                    <option>Good</option><option>Fair</option><option>Poor</option>
                                </select>
                            </div>
                            <textarea className="input-field text-sm w-full h-16 resize-none" placeholder="Notes..." value={editing.notes || ""} onChange={e => setEditing(p => ({ ...p!, notes: e.target.value }))} />
                            <div className="flex gap-1 flex-wrap">
                                {FIELD_COLORS.map(c => (
                                    <button key={c} onClick={() => setEditing(p => ({ ...p!, color: c }))}
                                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-125"
                                        style={{ background: c, borderColor: editing.color === c ? "white" : "transparent" }} />
                                ))}
                            </div>
                            <button onClick={saveEdit} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                                <Save size={14} /> Save Changes
                            </button>
                        </div>
                    )}

                    {/* Field List */}
                    <div className="glass-card p-5 border-cyan-900/20 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-black flex items-center gap-2">
                                <Sprout size={16} className="text-green-400" /> My Fields
                            </h3>
                            {!showAddPanel && !drawingMode && (
                                <button
                                    onClick={() => { setShowAddPanel(true); setNewField({ name: "", crop: "Wheat", color: "#22c55e", stage: "Sowing", health: "Good" }); setDrawingCoords([]); }}
                                    className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg"
                                >
                                    <Plus size={12} /> Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {fields.map(f => (
                                <div
                                    key={f.id}
                                    className={`group rounded-xl border transition-all duration-200 ${selected?.id === f.id
                                        ? "border-cyan-600/60 bg-cyan-950/20"
                                        : "border-transparent bg-green-900/10 hover:bg-green-900/20 hover:border-green-800/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => flyToField(f)}>
                                        <div className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/20" style={{ background: f.color }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-bold truncate">{f.name}</p>
                                            <p className="text-green-700 text-xs">{f.crop} · {f.area} · <span className={(healthColor as any)[f.health || "Good"]}>{f.health || "Good"}</span></p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={e => { e.stopPropagation(); setEditing(f); }}
                                                className="p-1.5 rounded-lg text-cyan-500 hover:bg-cyan-900/30 transition"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteField(f.id); }}
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/30 transition"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                        <ChevronRight size={14} className="text-green-800 flex-shrink-0" />
                                    </div>

                                    {/* Expanded detail */}
                                    {selected?.id === f.id && (
                                        <div className="px-3 pb-3 border-t border-cyan-900/30 mt-1 pt-3 space-y-2">
                                            {f.stage && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-green-700">Stage</span>
                                                    <span className="text-green-300 font-bold">{f.stage}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-xs">
                                                <span className="text-green-700">Coordinates</span>
                                                <span className="text-green-400 font-mono">{f.lat.toFixed(4)}, {f.lng.toFixed(4)}</span>
                                            </div>
                                            {f.notes && (
                                                <div className="bg-green-900/10 rounded-lg p-2 border border-green-900/20">
                                                    <p className="text-green-700 text-[10px] font-bold uppercase tracking-widest mb-1">Notes</p>
                                                    <p className="text-green-300 text-xs">{f.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center py-10 text-green-800">
                                    <Map size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No fields yet. Click &quot;Draw Field&quot; to add one.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Export */}
                    <button
                        onClick={() => {
                            const data = JSON.stringify(fields, null, 2);
                            const blob = new Blob([data], { type: "application/json" });
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = "ruralmate_fields.json";
                            a.click();
                        }}
                        className="glass-card w-full py-3 text-green-500 hover:text-green-300 text-sm font-bold flex items-center justify-center gap-2 transition rounded-xl hover:border-green-700/40"
                    >
                        <Download size={16} /> Export Fields as JSON
                    </button>
                </div>
            </div>
        </div>
    );
}
