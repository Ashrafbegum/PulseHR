import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const HOLIDAY_TYPES = ["national", "regional", "company"];

const holidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    country: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: "" },
    type: { type: String, enum: HOLIDAY_TYPES, required: true },
    recurring: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

holidaySchema.index({ date: 1, country: 1 });

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
export { HOLIDAY_TYPES };
