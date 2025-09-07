import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        requiredd: [true, 'Enter your name'],
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    // profileImage: {
    //     type: String,
    //     required: true
    // },
    // coverImage: {
    //     type: String
    // },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn : {
        type: Boolean,
        default: false
    },
    team : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    verifyToken: String,
    verifyTokenExpiry: Date
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User