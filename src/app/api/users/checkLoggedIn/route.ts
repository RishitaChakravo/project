import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/userModel";
import { dbConnect } from "@/dbConfig/dbConnect";

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ loggedIn: false }, { status: 404 });
    }

    return NextResponse.json({
      loggedIn: true,
      user,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GET /checkLoggedIn error:", error.message);
    }
    return NextResponse.json({ loggedIn: false }, { status: 500 });
  }
}

