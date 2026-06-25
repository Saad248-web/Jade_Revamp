import { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    source: {
      type: String,
      enum: [
        "general_enquiry",
        "weekend_getaways_enquiry",
        "wedding_enquiry",
        "rathaa_enquiry",
      ],
      required: true,
    },
    payload: { type: Schema.Types.Mixed, default: {} },
    email: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const LeadModel = models.Lead ?? model("Lead", LeadSchema);
