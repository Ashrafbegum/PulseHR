import mongoose from "mongoose";

const LEAVE_TYPE_NAMES = ["Annual", "Sick", "Personal", "Casual"];

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, enum: LEAVE_TYPE_NAMES, required: true, unique: true, trim: true },
    maxDaysPerYear: { type: Number, required: true, min: 0 },
    carryForwardLimit: { type: Number, default: 0, min: 0 },
    expiryDays: { type: Number, default: null, min: 0 },
    requiresApproval: { type: Boolean, default: true },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

export default LeaveType;
export { LEAVE_TYPE_NAMES };
