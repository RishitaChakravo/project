import { getDatafromToken } from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import Team from '@/models/teamModel';
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    try {
        await dbConnect() 

        const reqbody = await request.json();
        const { name } = reqbody
        if (!name) {
      return NextResponse.json({ message: "Team name is required" }, { status: 400 });
    }

        const token = request.cookies.get('token')?.value;
        if (!token) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
        const userId = await getDatafromToken(token!);

        const team = await Team.create({
            name,
            members: [userId]
        });

        return NextResponse.json({
            message: "Team created successfully",
            team
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            message: "Error creating team",
            error: error.message
        }, { status: 500 });
    }
}
