
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const { error: errorType } = router.query
    if (errorType) {
      switch (errorType) {
        case "Configuration":
          setError("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setError("You do not have permission to access this resource.")
          break
        case "Verification":
          setError("The verification link may have expired or already been used.")
          break
        case "OAuthSignin":
          setError("An error occurred while trying to sign in with OAuth provider.")
          break
        case "OAuthCallback":
          setError("An error occurred while processing the OAuth callback.")
          break
        case "OAuthCreateAccount":
          setError("There was a problem creating your account.")
          break
        case "EmailCreateAccount":
          setError("There was a problem creating your account with email.")
          break
        case "Callback":
          setError("There was a problem with the authentication callback.")
          break
        case "Default":
        default:
          setError("An unexpected authentication error occurred.")
      }
    }
  }, [router.query])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-lg">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
          <p className="text-slate-300">{error}</p>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-slate-800 hover:bg-slate-700"
            >
              Return to Sign In
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
