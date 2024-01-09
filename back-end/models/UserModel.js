import mongoose from 'mongoose'
const { Schema } = mongoose


const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            min: 8
        }, // REQ

        username: {
            type: String,
            required: true,
            min: 3,
            max: 75
        },// REQ

        password: { type: String, required: true, min:6}, // REQ
        firstName: { type: String, required: true, min:2, max:100},// REQ
        lastName: { type: String, required: true, min:2, max:100},// REQ
        activationToken: { type: String },
        isVerified: { type: Boolean, default: false },
        userImg: { type: String, default: "default.png" },
    },
    { timestamps: true}
)

const User = mongoose.model("User", UserSchema)
export default User