import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const attendanceSessionSchema = new mongoose.Schema(
  {
    checkIn: { type: Date, required: true },
    checkOut: {
      type: Date,
      default: null,
      validate: {
        validator(value) {
          return value == null || value > this.checkIn;
        },
        message: "Check-out must be later than check-in",
      },
    },
    duration: { type: Number, min: 0, default: null },
  },
  { _id: false },
);

const amendmentSchema = new mongoose.Schema(
  {
    requestedTime: { type: Date, default: null },
    requestedReason: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
  },
  { _id: false },
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    sessions: { type: [attendanceSessionSchema], default: [] },
    status: { type: String, enum: ["present", "absent", "halfDay"], required: true },
    amendment: { type: amendmentSchema, default: null },
    totalDuration: { type: Number, min: 0, default: 0 },
    location: { type: String, trim: true, default: "" },
    ipAddress: { type: String, trim: true, default: "" },
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

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

attendanceSchema.pre("validate", function validateSessions() {
  const openSessions = this.sessions.filter((session) => !session.checkOut);
  if (openSessions.length > 1) {
    this.invalidate("sessions", "An attendance record cannot have multiple open sessions");
  }
});

attendanceSchema.methods.addSession = function addSession(checkIn = new Date()) {
  if (this.sessions.some((session) => !session.checkOut)) {
    throw new Error("Cannot add a session while another session is open");
  }

  const checkedInAt = new Date(checkIn);
  if (Number.isNaN(checkedInAt.getTime())) throw new RangeError("Check-in must be a valid date");

  const session = { checkIn: checkedInAt, checkOut: null, duration: null };
  this.sessions.push(session);
  return this.sessions[this.sessions.length - 1];
};

attendanceSchema.methods.closeSession = function closeSession(checkOut = new Date()) {
  const session = [...this.sessions].reverse().find((item) => !item.checkOut);
  if (!session) throw new Error("Cannot close a session when none is open");

  const closedAt = new Date(checkOut);
  if (Number.isNaN(closedAt.getTime()) || closedAt <= session.checkIn) {
    throw new RangeError("Check-out must be later than check-in");
  }

  session.checkOut = closedAt;
  session.duration = Math.floor((closedAt.getTime() - session.checkIn.getTime()) / 60000);
  this.totalDuration = this.constructor.calculateDuration(this.sessions);
  return session;
};

attendanceSchema.statics.calculateDuration = function calculateDuration(sessions = []) {
  return sessions.reduce((total, session) => {
    if (!session.checkOut) return total;
    const checkIn = new Date(session.checkIn).getTime();
    const checkOut = new Date(session.checkOut).getTime();
    if (!Number.isFinite(checkIn) || !Number.isFinite(checkOut) || checkOut <= checkIn) {
      throw new RangeError("Session must have a valid check-out later than check-in");
    }
    const duration = Math.floor((checkOut - checkIn) / 60000);
    return total + duration;
  }, 0);
};

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
