import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const LEAVE_REQUEST_STATUSES = ["draft", "submitted", "approved", "rejected", "cancelled"];
const HALF_DAY_PERIODS = ["AM", "PM"];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtcDay = (date) => new Date(Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
));

const addUtcMonths = (date, months) => {
  const result = toUtcDay(date);
  const dayOfMonth = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDayOfMonth = new Date(Date.UTC(
    result.getUTCFullYear(),
    result.getUTCMonth() + 1,
    0,
  )).getUTCDate();
  result.setUTCDate(Math.min(dayOfMonth, lastDayOfMonth));
  return result;
};

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return toUtcDay(value) >= toUtcDay(new Date());
        },
        message: "Leave start date cannot be in the past",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: [
        {
          validator(value) {
            return !this.startDate || value > this.startDate;
          },
          message: "Leave end date must be after the start date",
        },
        {
          validator(value) {
            return toUtcDay(value) <= addUtcMonths(new Date(), 12);
          },
          message: "Leave end date cannot be more than 12 months in the future",
        },
      ],
    },
    halfDay: { type: String, enum: HALF_DAY_PERIODS, default: null },
    reason: { type: String, trim: true, default: "" },
    status: { type: String, enum: LEAVE_REQUEST_STATUSES, default: "draft", required: true },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvalComment: { type: String, trim: true, default: "" },
    attachments: { type: [String], default: [] },
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

leaveRequestSchema.index({ userId: 1, status: 1 });
leaveRequestSchema.index({ approverId: 1, status: 1 });
leaveRequestSchema.index({ startDate: 1, endDate: 1 });
leaveRequestSchema.index({ createdAt: 1 });

leaveRequestSchema.pre("save", function validateLeaveDateRange() {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    throw new mongoose.Error.ValidatorError({
      path: "endDate",
      value: this.endDate,
      message: "Leave end date must be after the start date",
    });
  }
});

leaveRequestSchema.methods.calculateDays = function calculateDays(holidays = []) {
  const excludedDays = new Set(holidays.map((holiday) => toUtcDay(new Date(holiday)).getTime()));
  const firstDay = toUtcDay(this.startDate);
  const lastDay = toUtcDay(this.endDate);
  let days = 0;

  for (let currentDay = firstDay.getTime(); currentDay <= lastDay.getTime(); currentDay += MS_PER_DAY) {
    if (!excludedDays.has(currentDay)) days += 1;
  }

  if (this.halfDay && days > 0) days -= 0.5;
  return days;
};

leaveRequestSchema.statics.validateOverlap = function validateOverlap({
  userId,
  startDate,
  endDate,
  excludeRequestId,
}) {
  const query = {
    userId,
    isDeleted: false,
    status: { $in: ["submitted", "approved"] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeRequestId) query._id = { $ne: excludeRequestId };
  return this.findOne(query);
};

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;
export { HALF_DAY_PERIODS, LEAVE_REQUEST_STATUSES };
