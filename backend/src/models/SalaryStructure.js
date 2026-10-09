import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const salaryComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["earning", "deduction"], required: true },
    amount: { type: Number, min: 0, default: null },
    percentage: { type: Number, min: 0, max: 100, default: null },
    isRecurring: { type: Boolean, default: true },
  },
  { _id: false },
);

salaryComponentSchema.pre("validate", function validateAmountOrPercentage() {
  const hasAmount = this.amount != null;
  const hasPercentage = this.percentage != null;
  if (hasAmount === hasPercentage) {
    this.invalidate("amount", "Provide exactly one of amount or percentage");
  }
});

const salaryStructureSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    validFrom: { type: Date, required: true },
    validTo: {
      type: Date,
      default: null,
      validate: {
        validator(value) {
          return value == null || !this.validFrom || value >= this.validFrom;
        },
        message: "Salary structure end date must be on or after its start date",
      },
    },
    components: { type: [salaryComponentSchema], default: [] },
    country: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: "" },
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

salaryStructureSchema.index({ userId: 1, validFrom: -1 });

salaryStructureSchema.pre("save", async function validateSalaryStructureDatesAndOverlap() {
  if (this.validTo && this.validTo < this.validFrom) {
    throw new mongoose.Error.ValidatorError({
      path: "validTo",
      value: this.validTo,
      message: "Salary structure end date must be on or after its start date",
    });
  }

  const startsBeforeEnd = this.validTo ? { $lte: this.validTo } : { $exists: true };
  const overlappingStructure = await this.constructor.exists({
    _id: { $ne: this._id },
    userId: this.userId,
    validFrom: startsBeforeEnd,
    $or: [{ validTo: null }, { validTo: { $gte: this.validFrom } }],
  });

  if (overlappingStructure) {
    throw new mongoose.Error.ValidatorError({
      path: "validFrom",
      value: this.validFrom,
      message: "Salary structure validity period cannot overlap another structure for this user",
    });
  }
});

const SalaryStructure = mongoose.model("SalaryStructure", salaryStructureSchema);

export default SalaryStructure;
