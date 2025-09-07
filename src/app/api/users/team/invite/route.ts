import Team from "@/models/teamModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { teamId, email } = await request.json();

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return NextResponse.json(
                { message: "Team not found" },
                { status: 404 }
            );
        }

        if (team.members.includes(userToInvite._id)) {
            return NextResponse.json(
                { message: "User already in team" },
                { status: 400 }
            );
        }

        team.members.push(userToInvite._id);
        await team.save();

        return NextResponse.json(
            { message: "User invited and added to team", team },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error inviting user", error: error.message },
            { status: 500 }
        );
    }
}
