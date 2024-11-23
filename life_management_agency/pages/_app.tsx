
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import Navigation from '../components/Navigation'
import { ThemeProvider } from '../components/theme-provider'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const showNavigation = router.pathname !== '/' && router.pathname !== '/login' && router.pathname !== '/auth/signin'

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Component {...pageProps} />
            {showNavigation && <Navigation />}
          </div>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
