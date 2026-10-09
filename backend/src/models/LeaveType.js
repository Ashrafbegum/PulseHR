import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const LEAVE_TYPE_NAMES = ["Annual", "Sick", "Personal", "Casual"];

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, enum: LEAVE_TYPE_NAMES, required: true, unique: true, trim: true },
    maxDaysPerYear: { type: Number, required: true, min: 0 },
    carryForwardLimit: { type: Number, default: 0, min: 0 },
    expiryDays: { type: Number, default: null, min: 0 },
    requiresApproval: { type: Boolean, default: true },
    description: { type: String, trim: true, default: "" },
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

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

export default LeaveType;
export { LEAVE_TYPE_NAMES };
