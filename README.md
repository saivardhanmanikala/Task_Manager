# Trello-Style Task Management Application

A comprehensive web-based task management application built with Next.js, TypeScript, and MongoDB. Features include user authentication, drag-and-drop functionality, and real-time task management.

## Features

- **User Authentication**: Secure signup/login with email and password
- **Task Board**: Four-column layout (To-Do, In Progress, Under Review, Completed)
- **Task Management**: Create, edit, delete tasks with title, description, status, priority, and deadline
- **Drag & Drop**: Move tasks between columns with automatic status updates
- **Data Persistence**: MongoDB integration with user isolation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **State Management**: React Context API
- **Styling**: Tailwind CSS with shadcn/ui components
- **Drag & Drop**: @hello-pangea/dnd
- **Authentication**: JWT with bcrypt password hashing

## Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd trello-task-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## Environment Variables

- \`MONGODB_URI\`: Your MongoDB connection string
- \`JWT_SECRET\`: Secret key for JWT token generation (use a strong, random string)

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click the "+" button in any column to create a new task
3. **Edit Tasks**: Click the edit icon on any task to modify its details
4. **Move Tasks**: Drag and drop tasks between columns to change their status
5. **Delete Tasks**: Click the trash icon to remove tasks

## Task Properties

- **Title**: Required field for task identification
- **Description**: Optional detailed description
- **Status**: Automatically set based on column (To-Do, In Progress, Under Review, Completed)
- **Priority**: Optional priority level (Low, Medium, Urgent)
- **Deadline**: Optional due date

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Create new user account
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user info

### Tasks
- \`GET /api/tasks\` - Get user's tasks
- \`POST /api/tasks\` - Create new task
- \`PUT /api/tasks/[id]\` - Update task
- \`DELETE /api/tasks/[id]\` - Delete task

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- User data isolation
- Protected API routes
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational/assessment purposes only.

## Support

For issues or questions, please create an issue in the GitHub repository.
\`\`\`

Let's also fix a small issue in the TaskModal component to handle the priority selection properly:

```typescriptreact file="components/TaskModal.tsx"
[v0-no-op-code-block-prefix]"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/lib/types"
import { useTasks } from "@/contexts/TaskContext"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
  mode: "create" | "edit"
  defaultStatus?: Task["status"]
}

export default function TaskModal({ isOpen, onClose, task, mode, defaultStatus }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Task["status"]>("todo")
  const [priority, setPriority] = useState<Task["priority"] | "">("")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)
  const { addTask, updateTask } = useTasks()

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setPriority(task.priority || "")
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "")
    } else {
      setTitle("")
      setDescription("")
      setStatus(defaultStatus || "todo")
      setPriority("")
      setDeadline("")
    }
  }, [mode, task, defaultStatus, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const taskData = {
        title,
        description: description || undefined,
        status,
        priority: priority || undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      }

      if (mode === "edit" && task) {
        await updateTask(task._id!, taskData)
      } else {
        await addTask(taskData)
      }

      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input placeholder="Task title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Select value={status} onValueChange={(value: Task["status"]) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To-Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={priority || "no-priority"} onValueChange={(value: string) => setPriority(value === "no-priority" ? "" : value as Task["priority"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-priority">No priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline (optional)"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
