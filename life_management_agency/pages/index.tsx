import type { NextPage } from 'next'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  }, [session, router])

  const handleGetStarted = () => {
    if (session) {
      router.push('/home')
    } else {
      signIn('github')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
        
        <h1 className="text-6xl font-bold text-white tracking-tight">
          Welcome to Life AI
        </h1>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Your personal AI companion for growth, wellness, and life management. Experience the future of personal development.
        </p>
        
        <div className="space-y-4 pt-8">
          <button 
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            {status === 'loading' ? 'Loading...' : 'Get Started'}
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>System Status: Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
