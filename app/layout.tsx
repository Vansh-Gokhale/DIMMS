import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuroraBackground } from "@/components/ui/aurora-background"
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'DIMMS - Digital Internship & Mentorship Management System',
  description: 'Digital Internship & Mentorship Management System',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-white selection:bg-purple-500/30`}>
        <AuroraBackground>
          {children}
        </AuroraBackground>
        <Analytics />
      </body>
    </html>
  )
}
