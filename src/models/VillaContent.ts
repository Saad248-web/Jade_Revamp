import { Schema } from "mongoose";

export const VillaContentSchema = new Schema(
  {
    description: { type: String, default: "" },
    socialProof: { type: String, default: "" },
    categories: { type: [String], default: [] },
    perfectForTags: { type: [String], default: [] },
    perfectForCards: {
      type: [{ title: String, image: String }],
      default: [],
    },
    amenities: {
      type: [
        {
          label: String,
          icon: String,
          description: String,
        },
      ],
      default: [],
    },
    services: {
      type: [
        {
          title: String,
          description: String,
          footer: String,
          icon: String,
        },
      ],
      default: [],
    },
    propertyDetails: {
      type: [
        {
          label: String,
          description: String,
          icon: String,
        },
      ],
      default: [],
    },
    activities: {
      type: [
        {
          title: String,
          image: String,
          description: String,
        },
      ],
      default: [],
    },
    categorizedSpaces: {
      type: [
        {
          id: String,
          title: String,
          category: String,
          amenities: [String],
          images: [String],
        },
      ],
      default: [],
    },
    spaces: {
      type: [{ name: String, image: String }],
      default: [],
    },
    images: { type: [String], default: [] },
    locationDetails: {
      mapImage: { type: String, default: "" },
      address: { type: String, default: "" },
      distance: { type: String, default: "" },
      nearby: {
        type: [{ label: String, distance: String }],
        default: [],
      },
      googleMapsUrl: { type: String, default: "" },
    },
    video: {
      youtubeUrl: { type: String, default: "" },
      thumbnail: { type: String, default: "" },
      duration: { type: String, default: "" },
    },
    faq: {
      type: [{ question: String, answer: String }],
      default: [],
    },
    hideFromVillasDirectory: { type: Boolean, default: false },
  },
  { _id: false },
);

export const AxisRoomsSchema = new Schema(
  {
    propertyId: String,
    roomTypeId: String,
    ratePlanId: String,
    apiKeyConfigured: { type: Boolean, default: false },
  },
  { _id: false },
);
