import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProviders } from "@/components/auth/AuthProviders";
import { UserProvider } from "@/context/UserContext";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  title: "RuralMate — Smart Farming & Rural Life App",
  description: "India's most comprehensive app for farmers and rural communities. AI-powered crop advice, mandi prices, government schemes, health services, and more.",
  keywords: "farming, agriculture, rural, India, kisan, mandi prices, crop advice, AI assistant",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#052e16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0a1a0d] text-green-50 font-sans overflow-x-hidden">
        <AuthProviders>
          <UserProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </UserProvider>
        </AuthProviders>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#0a1a0d", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" },
          }}
        />
      </body>
    </html>
  );
}
