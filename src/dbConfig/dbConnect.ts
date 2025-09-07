import mongoose from 'mongoose'

export async function dbConnect() {
    // If already connected, do nothing
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB already connected")
        return
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in .env.local")
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB successfully connected")
    } catch (error: any) {
        console.error("Could not connect to MongoDB")
        console.error(error)
        throw error
    }
}
