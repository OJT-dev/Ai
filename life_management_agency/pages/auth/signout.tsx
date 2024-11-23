
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Card } from "@/components/ui/card"

export default function SignOut() {
  useEffect(() => {
    // Automatically sign out when the component mounts
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Signing Out</h1>
          <p className="text-slate-300">Please wait while we sign you out...</p>
        </div>
      </Card>
    </div>
  )
}
