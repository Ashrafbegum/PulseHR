import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const USER_ROLES = ["admin", "manager", "employee"];
const USER_STATUSES = ["active", "inactive", "suspended"];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: USER_ROLES, default: "employee", required: true },
    department: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    status: { type: String, enum: USER_STATUSES, default: "active", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
export { USER_ROLES, USER_STATUSES };
