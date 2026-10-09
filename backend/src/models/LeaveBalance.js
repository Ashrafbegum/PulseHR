import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const leaveBalanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
    year: { type: Number, required: true, min: 2000 },
    allocatedDays: { type: Number, required: true, min: 0, default: 0 },
    usedDays: { type: Number, required: true, min: 0, default: 0 },
    carryForwardDays: { type: Number, required: true, min: 0, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.refreshTokens;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
    versionKey: false,
  },
);

leaveBalanceSchema.index({ userId: 1, leaveTypeId: 1, year: 1 }, { unique: true });

leaveBalanceSchema.virtual("balancedDays").get(function balancedDays() {
  return this.allocatedDays + this.carryForwardDays - this.usedDays;
});

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);

export default LeaveBalance;
