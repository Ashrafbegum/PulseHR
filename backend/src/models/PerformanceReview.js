import mongoose from "mongoose";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const peerRatingSchema = new mongoose.Schema(
  {
    peerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const performanceReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: "PerformanceCycle", required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selfRating: { type: Number, min: 1, max: 5, default: null },
    reviewerRating: { type: Number, min: 1, max: 5, default: null },
    selfComment: { type: String, trim: true, default: "" },
    reviewerComment: { type: String, trim: true, default: "" },
    peerRatings: { type: [peerRatingSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "submitted", "review", "finalized", "archived"],
      default: "draft",
    },
    isDeleted: { type: Boolean, default: false },
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

performanceReviewSchema.index({ userId: 1, cycleId: 1 });
performanceReviewSchema.index({ reviewerId: 1, cycleId: 1 });
performanceReviewSchema.index({ cycleId: 1, status: 1 });

performanceReviewSchema.statics.findVisibleTo = function findVisibleTo(user) {
  if (!user?._id || !user?.role) {
    throw new TypeError("A user with an id and role is required to query reviews");
  }
  if (user.role === "admin") return this.find({ isDeleted: false });

  return this.find({
    isDeleted: false,
    $or: [{ userId: user._id }, { reviewerId: user._id }],
  });
};

const PerformanceReview = mongoose.model("PerformanceReview", performanceReviewSchema);

export default PerformanceReview;
