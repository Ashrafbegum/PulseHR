import mongoose from "mongoose";

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
  { timestamps: true },
);

holidaySchema.index({ date: 1, country: 1 });

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
export { HOLIDAY_TYPES };
