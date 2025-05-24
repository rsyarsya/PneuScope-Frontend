import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "doctor" | "guest"
  hospitalAffiliation?: string
  licenseNumber?: string
  specialization?: string
  phoneNumber?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "guest"],
      default: "doctor",
    },
    hospitalAffiliation: {
      type: String,
      required: function () {
        return this.role === "doctor"
      },
      trim: true,
      maxlength: 200,
    },
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: 50,
      sparse: true, // Allows multiple null values but unique non-null values
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Index for efficient queries
UserSchema.index({ hospitalAffiliation: 1 })
UserSchema.index({ role: 1, hospitalAffiliation: 1 })
UserSchema.index({ email: 1 }, { unique: true })

export default mongoose.model<IUser>("User", UserSchema)
