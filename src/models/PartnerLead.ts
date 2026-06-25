import { Schema, model, models } from "mongoose";

const PartnerLeadSchema = new Schema(
  {
    email: String,
    payload: { type: Schema.Types.Mixed, default: {} },
    photos: [
      {
        ordinal: Number,
        filename: String,
        mime: String,
        size: Number,
        gridFsId: String,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const PartnerLeadModel =
  models.PartnerLead ?? model("PartnerLead", PartnerLeadSchema);
