import { getDatafromToken } from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskSchema";
import { dbConnect } from "@/dbConfig/dbConnect";

export async function PATCH(request: NextRequest) {
    await dbConnect();
    try {
        const reqBody = await request.json();
        const { taskId, title, description, priority, duedate, status } = reqBody;

        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized", message: "No token provided." }, { status: 401 });
        }

        const userId = await getDatafromToken(token);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", message: "Invalid token." }, { status: 401 });
        }

        if (!taskId) {
            return NextResponse.json({ error: "Task ID missing", message: "Provide a taskId to update." }, { status: 400 });
        }

        if ([title, description, priority, duedate, status].every((field) => !field || field.toString().trim() === "")) {
            return NextResponse.json(
                { error: "No fields to update", message: "Provide at least one field to update." },
                { status: 400 }
            );
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (duedate) updateData.duedate = duedate;
        if (status) {
            const validStatuses = ["todo", "in-progress", "completed", "overdue"];
            if (!validStatuses.includes(status.toLowerCase().trim())) {
                return NextResponse.json(
                    { error: "Invalid Status", message: `Status must be one of: ${validStatuses.join(", ")}` },
                    { status: 400 }
                );
            }
            updateData.status = status.toLowerCase().trim();
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, user: userId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                { error: "Not Found", message: "Task not found or not authorized." },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Server Error", message: "Something went wrong." }, { status: 500 });
    }
}
