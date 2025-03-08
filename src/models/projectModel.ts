import mongoose, { Schema, Document } from "mongoose";

interface IProject extends Document {
  name: string;
  userId: string;
  components: any[];
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true }, // ✅ Keep "name"
    userId: { type: String, required: true },
    components: { type: Array, required: true }, // ✅ Store components array
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;