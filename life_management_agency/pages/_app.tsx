import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
