import { getDatafromToken } from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import AssignedTask from '@/models/assignedTask';

export async function POST(request: NextRequest) {
    try {
        const { description, teamId, assignedToId } = await request.json();

        if (!description || !assignedToId) {
            return NextResponse.json(
                { message: "Description and assignedToId are required" },
                { status: 400 }
            );
        }

        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            );
        }

        const userId = await getDatafromToken(token);

        const task = await AssignedTask.create({
            description,
            assignedTo: assignedToId,
            assignedBy: userId,
            team: teamId || null,
        });

        return NextResponse.json(
            { message: "Task assigned successfully", task },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: "Error assigning task", error: error.message },
            { status: 500 }
        );
    }
}
