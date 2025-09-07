import mongoose, {Schema} from 'mongoose'

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema)

export default Team