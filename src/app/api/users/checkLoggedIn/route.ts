import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import User from "@/models/userModel";
import { dbConnect } from "@/dbConfig/dbConnect";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ loggedIn: false }, { status: 404 });
    }

    return NextResponse.json({
      loggedIn: true,
      user,
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { loggedIn: false},
      { status: 500 }
    );
  }
}

