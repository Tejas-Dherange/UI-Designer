import mongoose, { Schema, model, models } from "mongoose";

const chatSchema = new Schema(
  {
    teamId: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Use existing model or create a new one
const Chat = models["Grp-Chat"] || model("Grp-Chat", chatSchema);

export default Chat;
