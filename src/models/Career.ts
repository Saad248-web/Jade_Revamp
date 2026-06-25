import { Schema, model, models } from "mongoose";

const CareerSchema = new Schema(
  {
    jobId: String,
    jobTitle: String,
    sourcePage: String,
    applyContext: String,
    clientPath: String,
    fullName: String,
    email: String,
    phone: String,
    company: String,
    resume: {
      filename: String,
      mime: String,
      size: Number,
      gridFsId: String,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CareerModel = models.Career ?? model("Career", CareerSchema);
