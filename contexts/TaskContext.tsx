"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { TaskContextType, Task } from "@/lib/types"
import { useAuth } from "./AuthContext"

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const tasksData = await response.json()
        setTasks(tasksData)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData: Omit<Task, "_id" | "userId" | "createdAt" | "updatedAt">) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks((prev) => [...prev, newTask])
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, fetchTasks, loading }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
