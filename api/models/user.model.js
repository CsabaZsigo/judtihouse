import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fuser-profile&psig=AOvVaw0X1XsuN9HLpSuoG-qIXHJX&ust=1711538909537000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJCEm7jpkYUDFQAAAAAdAAAAABAE"
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;