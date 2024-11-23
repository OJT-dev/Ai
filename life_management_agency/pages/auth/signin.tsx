
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-300">Sign in to access your Life Management Assistant</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700"
          >
            <Github className="w-5 h-5" />
            <span>Sign in with GitHub</span>
          </Button>
        </div>

        <div className="text-center text-sm text-slate-400">
          <p>
            By signing in, you agree to our{" "}
            <a href="/privacy" className="text-slate-300 hover:text-white underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}
