import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for the Hackathon document
interface IHackathon extends Document {
  hackathonName: string;
  teamName: string;
  problemStatement: string;
  details: string;
  teamLeader: string;
  teamMembers: string[];
}

// Define the Schema
const HackathonSchema: Schema<IHackathon> = new Schema(
  {
    hackathonName: { type: String, required: true, trim: true },
    teamName: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    teamLeader: { type: String, required: true, trim: true },
    teamMembers: { type: [String], required: true }, // Array of team member names
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Define and Export the Model
const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon || mongoose.model<IHackathon>("Hackathon", HackathonSchema);

export default Hackathon;
