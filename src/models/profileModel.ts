import mongoose, { Document, Model } from "mongoose";

// Define the interface for Profile document
interface IProfile extends Document {
  name: string;
  email: string;
  age: number;
  department: string;
  phone_number?: string;
  college?: string;
  city?: string;
  skills?: string[];
  degree?: string;
  Linkedin?: string;
}

// Define the schema
const profileSchema = new mongoose.Schema<IProfile>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please enter a valid email address"
    ],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [1, "Age must be greater than 0"],
    max: [120, "Age must be less than 120"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Allow optional phone number, but if provided, must be 6-15 digits
        return v === undefined || v === '' || /^\d{6,15}$/.test(v);
      },
      message: (props: { value: string }) => 
        `${props.value} is not a valid phone number! Phone number should be between 6-15 digits.`
    }
  },
  college: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v === undefined || Array.isArray(v);
      },
      message: "Skills must be an array of strings"
    }
  },
  degree: {
    type: String,
    trim: true,
  },
  Linkedin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return v === undefined || v === '' || 
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(v);
      },
      message: "Please provide a valid LinkedIn URL"
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add any indexes you need
profileSchema.index({ email: 1 }, { unique: true });

// Add any instance methods if needed
profileSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Declare the Profile model with proper typing
const Profile: Model<IProfile> = mongoose.models.Profile || 
  mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;