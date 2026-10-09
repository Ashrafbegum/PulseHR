import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isRevoked: { type: Boolean, default: false },
  ipAddress: { type: String, trim: true, default: "" },
},
{
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      delete ret.password;
      delete ret.token;
      delete ret.refreshToken;
      delete ret.refreshTokens;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    },
  },
},
);

refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
