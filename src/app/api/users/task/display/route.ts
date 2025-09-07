import { dbConnect } from "@/dbConfig/dbConnect";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import Task from "@/models/taskSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized", message: "Try logging in again" },
                { status: 401 }
            );
        }

        const userId = await getDatafromToken(token);

        const tasks = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    priority: 1,
                    duedate: 1,
                    status: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            },
            { $sort: { duedate: 1 } }
        ]);

        return NextResponse.json({ tasks });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong", message: error.message },
            { status: 500 }
        );
    }
}
