"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { TaskProvider } from "@/contexts/TaskContext"
import AuthForm from "@/components/AuthForm"
import TaskBoard from "@/components/TaskBoard"

function AppContent() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm mode={authMode} onToggleMode={() => setAuthMode(authMode === "login" ? "signup" : "login")} />
  }

  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
