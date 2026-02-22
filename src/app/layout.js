// app/layout.js
import { Inter } from "next/font/google";
import { SidebarProvider } from '@/context/SidebarContext';
import ClientLayout from '@/components/ClientLayout';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "NEXUS Dashboard - Futuristic Workspace",
  description: "Advanced dashboard with neon-themed sidebar and appbar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        style={{ 
          background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%)',
          minHeight: '100vh',
          color: '#ffffff',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <SidebarProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}