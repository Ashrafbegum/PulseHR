import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const salarySchema = new mongoose.Schema(
  {
    min: { type: Number, min: 0, default: null },
    max: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator(value) {
          return value == null || this.min == null || value >= this.min;
        },
        message: "Maximum salary must be greater than or equal to minimum salary",
      },
    },
  },
  { _id: false },
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: salarySchema, default: null },
    skills: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "open", "closed"], default: "draft" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postedAt: { type: Date, default: Date.now },
    closingDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
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

jobSchema.index({ status: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ postedAt: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
