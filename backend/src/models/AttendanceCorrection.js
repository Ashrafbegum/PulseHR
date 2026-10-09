import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const attendanceCorrectionSchema = new mongoose.Schema(
  {
    attendanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalTime: { type: Date, required: true },
    correctedTime: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.refreshTokens;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
  },
);

attendanceCorrectionSchema.index({ userId: 1, status: 1 });
attendanceCorrectionSchema.index({ createdAt: 1 });

const AttendanceCorrection = mongoose.model("AttendanceCorrection", attendanceCorrectionSchema);

export default AttendanceCorrection;
