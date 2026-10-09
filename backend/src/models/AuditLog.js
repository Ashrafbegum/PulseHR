import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const AUDIT_ACTIONS = ["create", "update", "delete", "approve", "reject"];

const changesSchema = new mongoose.Schema(
  {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
    action: { type: String, enum: AUDIT_ACTIONS, required: true, immutable: true },
    entity: { type: String, required: true, trim: true, immutable: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
    changes: { type: changesSchema, immutable: true },
    timestamp: { type: Date, default: Date.now, immutable: true },
    ipAddress: { type: String, trim: true, default: "", immutable: true },
  },
  {
    timestamps: true,
    versionKey: false,
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

auditLogSchema.index({ userId: 1, entity: 1, timestamp: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
export { AUDIT_ACTIONS };
