import { getDatafromToken } from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import Task from '@/models/taskSchema';
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const reqBody = await request.json();
        const { title, description, priority, duedate, status } = reqBody;

        if ([title, description, priority, duedate, status].some((value) => value?.toString().trim() === "")) {
            return NextResponse.json(
                { error: "Invalid Input", message: "All fields are required." }, 
                { status: 400 }
            );
        }
        
        const validStatuses = ["todo", "in-progress", "completed", "overdue"];
        if (!validStatuses.includes(status.toLowerCase().trim())) {
            return NextResponse.json(
                { 
                    error: "Invalid Status", 
                    message: `Invalid status type. Allowed: ${validStatuses.join(", ")}` 
                }, 
                { status: 400 }
            );
        }

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No token provided." }, 
                { status: 401 }
            );
        }

        const userId = await getDatafromToken(token);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized", message: "Invalid token." }, 
                { status: 401 }
            );
        }

        const dueDateObj = duedate ? new Date(duedate) : null;

        const task = await Task.create({
            title, 
            description, 
            priority, 
            duedate: dueDateObj, 
            status,
            user: userId
        });

        return NextResponse.json({
            message: "New Task Added!!",
            task
        }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            error: "Server Error",
            message: error.message || ""
        }, { status: 500 });
    }
}
