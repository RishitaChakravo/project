import { dbConnect } from "@/dbConfig/dbConnect";
import Task from "@/models/taskSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";


export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const { taskId } = await request.json();

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user: string | JwtPayload;        
        try {
            user = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            console.log(error)
            return NextResponse.json(
                { error: "Invalid token" }, 
                { status: 401 });
        }

        if (!taskId) {
            return NextResponse.json(
                { error: "Task ID is required" }, 
                { status: 400 });
        }
        const userId = typeof user === "string" ? user : user._id;

        const taskTodel = await Task.findOneAndDelete({ _id: taskId, userId});

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
