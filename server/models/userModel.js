import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userID: String,
    creator: String,
    name: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    studentID: String,
    role: String,
    profileImg: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const userModel = mongoose.model('userModel', userSchema);

export default userModel;