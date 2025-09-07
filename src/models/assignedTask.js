import mongoose, {Schema} from "mongoose";

const assignedTaskSchema = new Schema({
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timeStamps: true})

const AssignedTask = mongoose.models.AssignedTask || mongoose.model('AssignedTask', assignedTaskSchema)
export default AssignedTask
// export async function POST() {

// }