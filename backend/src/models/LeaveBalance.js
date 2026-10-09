import mongoose from "mongoose";

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
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false,
  },
);

leaveBalanceSchema.index({ userId: 1, leaveTypeId: 1, year: 1 }, { unique: true });

leaveBalanceSchema.virtual("balancedDays").get(function balancedDays() {
  return this.allocatedDays + this.carryForwardDays - this.usedDays;
});

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);

export default LeaveBalance;
