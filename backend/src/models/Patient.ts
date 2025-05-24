import mongoose, { type Document, Schema } from "mongoose"

export interface IPatient extends Document {
  name: string
  dob: Date
  allergies: string
  medicalHistory: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PatientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters long"],
    },
    dob: {
      type: Date,
      required: [true, "Please provide a date of birth"],
    },
    allergies: {
      type: String,
      default: "",
    },
    medicalHistory: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IPatient>("Patient", PatientSchema)
