import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to NIFI',
  description: 'Coming soon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}