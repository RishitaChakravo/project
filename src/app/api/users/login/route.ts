import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    try{
        await dbConnect()
        
        const reqBody = await request.json()
        const {email, password} = reqBody

        if(!email || !password) {
            return NextResponse.json({}, {status: 400})
        }

        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({}, {status: 400})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            return NextResponse.json({}, {status: 400})
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {
            expiresIn: '7d'
        })

        user.isLoggedIn = true;

        await user.save({validateBeforeSave: false})
        const response = NextResponse.json({
            message: "User LOGGEDIN successfully",
            success: true,
            status: 200,
            data: user
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        })
        
        return response
    } catch(error: any) {
        return NextResponse.json({}, {status: 500})
    }
}