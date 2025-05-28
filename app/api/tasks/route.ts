import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const tasks = db.collection("tasks")
    const userTasks = await tasks.find({ userId: decoded.userId }).toArray()

    const formattedTasks = userTasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }))

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error("Fetch tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const taskData = await request.json()

    if (!taskData.title || !taskData.status) {
      return NextResponse.json({ error: "Title and status are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const tasks = db.collection("tasks")

    const newTask = {
      ...taskData,
      userId: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await tasks.insertOne(newTask)
    const createdTask = { ...newTask, _id: result.insertedId.toString() }

    return NextResponse.json(createdTask)
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
