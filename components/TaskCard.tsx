"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import type { Task } from "@/lib/types"
import { useTasks } from "@/contexts/TaskContext"
import TaskModal from "./TaskModal"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { deleteTask } = useTasks()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id!)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString()
  }

  return (
    <>
      <Card className={`mb-3 cursor-move ${isDragging ? "opacity-50" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">{task.title}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)} className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {task.description && <p className="text-xs text-gray-600 mb-2">{task.description}</p>}
          <div className="flex flex-wrap gap-1 items-center">
            {task.priority && (
              <Badge variant="secondary" className={`text-white text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
            )}
            {task.deadline && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(task.deadline)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} task={task} mode="edit" />
    </>
  )
}
