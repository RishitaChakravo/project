import { dbConnect } from "@/dbConfig/dbConnect";
import Task from "@/models/taskSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const { taskId } = await request.json();

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user: any;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid token" }, 
                { status: 401 });
        }

        if (!taskId) {
            return NextResponse.json(
                { error: "Task ID is required" }, 
                { status: 400 });
        }

        const taskTodel = await Task.findOneAndDelete({ _id: taskId, userId: user.id });

        if (!taskTodel) {
            return NextResponse.json(
                { error: "Task not found or not authorized" }, 
                { status: 404 });
        }

        return NextResponse.json(
            { message: "Task deleted successfully" }, 
            { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error" }, 
            { status: 500 });
    }
}
