import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    Domains: String,
    password: String,
    isVerified: { type: Boolean, default: false },

}, { timestamps: true })


const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;