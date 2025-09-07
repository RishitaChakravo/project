import { dbConnect } from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        
        const { name, email, password, username } = await request.json()

        // Validate fields
        if ([name, email, password, username].some((value) => value?.trim() === "")) {
            return NextResponse.json(
                { error: "Error", message: "All fields are required" },
                { status: 400 }
            )
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
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

    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: "Something went wrong", message: error.message },
            { status: 500 }
        )
    }
}
