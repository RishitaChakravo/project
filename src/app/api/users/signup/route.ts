import { dbConnect } from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        
        const { name, email, password, username } = await request.json()

        if ([name, email, password, username].some((value) => value?.trim() === "")) {
            return NextResponse.json(
                { error: "Error", message: "All fields are required" },
                { status: 400 }
            )
        }


        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
        })

        return NextResponse.json(
            { message: "User created successfully", user },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Something went wrong"},
            { status: 500 }
        )
    }
}
