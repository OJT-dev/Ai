import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Navigation from '../components/Navigation'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const showNavigation = router.pathname !== '/' && router.pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-900">
      <Component {...pageProps} />
      {showNavigation && <Navigation />}
    </div>
  )
}
