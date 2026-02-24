"use client";

import Link from "next/link";
import {
  Brain,
  LayoutDashboard,
  Cloud,
  TrendingUp,
  Bug,
  Calendar,
  Droplets,
  BookOpen,
  MessageSquare,
  HeartPulse,
  Map,
  FlaskConical,
  Leaf,
  Droplet,
  ShoppingBag,
  Tractor,
  Newspaper,
  Warehouse,
  Truck,
  Shield,
  FileText,
  Bell,
  User,
  Beef,
  AlertTriangle,
  BarChart2,
  Video,
  TreePine,
} from "lucide-react";

const features = [
  { href: "/dashboard", label: "Overview Dashboard", icon: LayoutDashboard, category: "Core" },
  { href: "/ai-advisor", label: "AI Crop Advisor", icon: Brain, category: "AI" },
  { href: "/health", label: "Health & Doctor", icon: HeartPulse, category: "Health" },
  { href: "/market-prices", label: "Market Prices", icon: TrendingUp, category: "Market" },
  { href: "/weather", label: "Weather", icon: Cloud, category: "Weather" },
  { href: "/pest-detector", label: "Pest & Disease Detector", icon: Bug, category: "AI" },
  { href: "/crop-calendar", label: "Crop Calendar", icon: Calendar, category: "Planning" },
  { href: "/irrigation", label: "Irrigation Planner", icon: Droplets, category: "Water" },
  { href: "/schemes", label: "Govt. Schemes", icon: BookOpen, category: "Schemes" },
  { href: "/community", label: "Community Forum", icon: MessageSquare, category: "Community" },
  { href: "/insurance", label: "Crop Insurance", icon: Shield, category: "Finance" },
  { href: "/finance", label: "Finance & Loans", icon: FileText, category: "Finance" },
  { href: "/soil-health", label: "Soil Health", icon: Leaf, category: "Soil" },
  { href: "/fertilizer", label: "Fertilizer Calculator", icon: FlaskConical, category: "Soil" },
  { href: "/crop-rotation", label: "Crop Rotation Advisor", icon: Droplet, category: "Soil" },
  { href: "/field-map", label: "GPS Field Map", icon: Map, category: "Farm" },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, category: "Market" },
  { href: "/equipment-rental", label: "Equipment Rental", icon: Tractor, category: "Farm" },
  { href: "/storage", label: "Storage & Warehouses", icon: Warehouse, category: "Post-harvest" },
  { href: "/transport", label: "Transport Finder", icon: Truck, category: "Post-harvest" },
  { href: "/news", label: "Agri News", icon: Newspaper, category: "Information" },
  { href: "/reports", label: "Reports & Exports", icon: FileText, category: "Records" },
  { href: "/notifications", label: "Notifications", icon: Bell, category: "Core" },
  { href: "/profile", label: "Farmer Profile", icon: User, category: "Account" },
  { href: "/settings", label: "Settings", icon: FileText, category: "Account" },
  { href: "/livestock", label: "Livestock Management", icon: Beef, category: "Livestock" },
  { href: "/yield-predictor", label: "Yield Predictor", icon: BarChart2, category: "Planning" },
  { href: "/learn", label: "E-Learning", icon: Video, category: "Education" },
  { href: "/carbon-tracker", label: "Carbon Tracker", icon: TreePine, category: "Sustainability" },
  { href: "/help", label: "Help & Support", icon: MessageSquare, category: "Support" },
  { href: "/emergency", label: "Emergency / SOS", icon: AlertTriangle, category: "Support" },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">All features</h1>
          <p className="text-green-600 text-sm mt-1">A simple list of everything inside RuralMate</p>
        </div>
        <Link href="/dashboard" className="btn-secondary text-xs sm:text-sm">
          Go to dashboard
        </Link>
      </div>

      <div className="glass-card p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ href, label, icon: Icon, category }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-900/30 transition text-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{label}</p>
                <p className="text-green-700 text-[11px] uppercase tracking-wide">{category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

