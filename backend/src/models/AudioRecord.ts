import mongoose, { type Document, Schema } from "mongoose"

export interface IAudioRecord extends Document {
  patientId: mongoose.Types.ObjectId
  audioData: number[]
  riskScore: number
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AudioRecordSchema = new Schema<IAudioRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please provide a patient ID"],
    },
    audioData: {
      type: [Number],
      required: [true, "Please provide audio data"],
    },
    riskScore: {
      type: Number,
      required: [true, "Please provide a risk score"],
      min: 0,
      max: 1,
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

export default mongoose.model<IAudioRecord>("AudioRecord", AudioRecordSchema)
