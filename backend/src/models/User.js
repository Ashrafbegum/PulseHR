import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken as createRefreshToken,
} from "../services/tokenService.js";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const USER_ROLES = ["admin", "manager", "employee", "hr", "recruiter"];
const USER_STATUSES = ["active", "inactive", "suspended"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false, minlength: 8 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "employee",
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
      required: true,
    },
    avatar: { type: String, trim: true, default: "" },
    lastLogin: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.refreshToken;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.virtual("fullName").get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.index({ department: 1 });
userSchema.index({ managerId: 1 });
userSchema.index({ role: 1, status: 1 });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.generateAuthToken = function generateAuthToken(user) {
  return generateAccessToken(user);
};

userSchema.statics.generateRefreshToken = function generateRefreshToken(user) {
  return createRefreshToken(user);
};

const User = mongoose.model("User", userSchema);

export default User;
export { USER_ROLES, USER_STATUSES };
