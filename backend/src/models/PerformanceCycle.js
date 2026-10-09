import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const reviewCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false },
);

const performanceCycleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "Cycle end date must be on or after its start date",
      },
    },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
    reviewCategories: { type: [reviewCategorySchema], default: [] },
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

performanceCycleSchema.index({ status: 1 });
performanceCycleSchema.index({ startDate: 1 });

const PerformanceCycle = mongoose.model("PerformanceCycle", performanceCycleSchema);

export default PerformanceCycle;
