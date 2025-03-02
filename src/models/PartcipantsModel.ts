import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  linkedin: { type: String, required: false },
  event: { type: String, required: true },
}, { timestamps: true });

const Participant = mongoose.models.Participant || mongoose.model("Participant", ParticipantSchema);
export default Participant;
