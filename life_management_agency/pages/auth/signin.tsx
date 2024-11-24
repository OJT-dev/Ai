import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Github } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const { callbackUrl } = router.query

  const handleSignIn = async () => {
    await signIn('github', { 
      callbackUrl: (callbackUrl as string) || '/home'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Life AI</h2>
          <p className="mt-2 text-gray-600">Sign in to continue your journey</p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Secure authentication
              </span>
            </div>
          </div>

          <div className="text-center text-sm">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Status: Online</span>
            </div>
            <p className="mt-2 text-gray-500">
              Your data is protected and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
