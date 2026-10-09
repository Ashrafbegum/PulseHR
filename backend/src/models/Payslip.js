import mongoose from "mongoose";
import PDFDocument from "pdfkit";

// Relationships:
// User -> LeaveRequest (many), Attendance (many), PerformanceReview (many as reviewee, many as reviewer)
// User -> SalaryStructure (many), Payslip (many)
// LeaveType -> LeaveRequest (many), LeaveBalance (many)
// Job -> Candidate (many)
// PerformanceCycle -> PerformanceReview (many)

const deductionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const payslipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    grossAmount: { type: Number, required: true, min: 0 },
    deductions: { type: [deductionSchema], default: [] },
    netAmount: { type: Number, required: true, min: 0 },
    taxableIncome: { type: Number, required: true, min: 0 },
    taxDeducted: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ["draft", "approved", "paid", "archived"], default: "draft" },
    generatedAt: { type: Date, default: Date.now },
    paidAt: { type: Date, default: null },
    downloadedAt: { type: Date, default: null },
    pdf: { type: String, trim: true, default: "" },
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

payslipSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
payslipSchema.index({ userId: 1 });
payslipSchema.index({ paidAt: 1 });

payslipSchema.statics.generate = function generate({
  userId,
  month,
  year,
  grossAmount,
  deductions = [],
  taxableIncome = grossAmount,
  taxDeducted = 0,
  status = "draft",
}) {
  const totalDeductions = deductions.reduce((total, deduction) => total + deduction.amount, 0);
  const netAmount = grossAmount - totalDeductions - taxDeducted;
  if (netAmount < 0) throw new RangeError("Total deductions cannot exceed gross amount");

  return new this({
    userId,
    month,
    year,
    grossAmount,
    deductions,
    netAmount,
    taxableIncome,
    taxDeducted,
    status,
  });
};

payslipSchema.methods.toPDF = function toPDF() {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 50 });
    const chunks = [];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("error", reject);
    document.on("end", () => resolve(Buffer.concat(chunks)));

    document.fontSize(20).text("Payslip", { align: "center" });
    document.moveDown();
    document.fontSize(12).text(`Period: ${this.month}/${this.year}`);
    document.text(`Gross amount: ${this.grossAmount.toFixed(2)}`);
    document.text("Deductions:");
    for (const deduction of this.deductions) {
      document.text(`${deduction.name}: ${deduction.amount.toFixed(2)}`, { indent: 20 });
    }
    document.text(`Tax deducted: ${this.taxDeducted.toFixed(2)}`);
    document.text(`Taxable income: ${this.taxableIncome.toFixed(2)}`);
    document.text(`Net amount: ${this.netAmount.toFixed(2)}`);
    document.end();
  });
};

const Payslip = mongoose.model("Payslip", payslipSchema);

export default Payslip;
