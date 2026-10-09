import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const CANDIDATE_STAGES = [
  "applied",
  "screening",
  "interview1",
  "interview2",
  "offer",
  "accepted",
  "hired",
  "rejected",
];

const STAGE_TRANSITIONS = {
  applied: ["screening", "rejected"],
  screening: ["interview1", "rejected"],
  interview1: ["interview2", "rejected"],
  interview2: ["offer", "rejected"],
  offer: ["accepted", "rejected"],
  accepted: ["hired"],
  hired: [],
  rejected: [],
};

const candidateSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    resume: { type: String, trim: true, default: "" },
    coverLetter: { type: String, trim: true, default: "" },
    stage: { type: String, enum: CANDIDATE_STAGES, default: "applied" },
    aiScore: { type: Number, min: 0, max: 100, default: null },
    rejectionReason: { type: String, trim: true, default: "" },
    appliedAt: { type: Date, default: Date.now },
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

candidateSchema.index({ jobId: 1, stage: 1 });
candidateSchema.index({ email: 1, jobId: 1 }, { unique: true });
candidateSchema.index({ stage: 1 });

candidateSchema.methods.moveStage = function moveStage(nextStage) {
  if (!CANDIDATE_STAGES.includes(nextStage)) {
    throw new RangeError(`Unknown candidate stage: ${nextStage}`);
  }
  if (!STAGE_TRANSITIONS[this.stage]?.includes(nextStage)) {
    throw new Error(`Candidate cannot move from ${this.stage} to ${nextStage}`);
  }
  this.stage = nextStage;
  return this;
};

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
export { CANDIDATE_STAGES, STAGE_TRANSITIONS };
