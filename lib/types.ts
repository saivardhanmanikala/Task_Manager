export interface User {
  _id?: string
  email: string
  password: string
  createdAt?: Date
}

export interface Task {
  _id?: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "under-review" | "completed"
  priority?: "low" | "medium" | "urgent"
  deadline?: Date
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

export interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "_id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTasks: () => Promise<void>
  loading: boolean
}
