import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: "No token found" }, { status: 400 });
        }

        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

        response.cookies.set('token', '', { maxAge: 0, path: '/' });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}
