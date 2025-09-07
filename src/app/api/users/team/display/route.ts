import { dbConnect } from "@/dbConfig/dbConnect";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import Team from "@/models/teamModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "No token provided" }, { status: 401 });
        }

        const userId = await getDatafromToken(token);

        const yourTeams = await Team.aggregate([
            {
                $match: {
                    members: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "memberDetails"
                }
            },
            {
                $unwind: "$memberDetails"
            },
            {
                $lookup: {
                    from: "assignedtasks",
                    let: { memberId: "$memberDetails._id", teamId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$assignedTo", "$$memberId"] },
                                        { $eq: ["$team", "$$teamId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: { description: 1, status: 1, _id: 0 }  // only description and status
                        }
                    ],
                    as: "tasks"
                }
            },
            {
                $addFields: {
                    "memberDetails.tasks": "$tasks"
                }
            },
            { $project: { tasks: 0 } },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    members: { $push: "$memberDetails" }
                }
            }

        ]);

        return NextResponse.json({ teams: yourTeams }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching teams", error: error.message }, { status: 500 });
    }
}
