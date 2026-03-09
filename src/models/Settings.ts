import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramAccessToken?: string;
  instagramUserId?: string;
  amazonAffiliateTag?: string;
  shippingCharges: {
    standard: number;
    express: number;
    threshold: number;
  };
  features: {
    wishlistEnabled: boolean;
    reviewsEnabled: boolean;
    codEnabled: boolean;
  };
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    siteName: { type: String, default: "MA Tech" },
    contactEmail: { type: String, default: "support@matech.com" },
    contactPhone: { type: String, default: "+91 99999 88888" },
    whatsappNumber: { type: String, default: "919999988888" },
    instagramUsername: { type: String, default: "matech_official" },
    instagramAccessToken: { type: String },
    instagramUserId: { type: String },
    amazonAffiliateTag: { type: String },
    shippingCharges: {
      standard: { type: Number, default: 0 },
      express: { type: Number, default: 500 },
      threshold: { type: Number, default: 50000 },
    },
    features: {
      wishlistEnabled: { type: Boolean, default: true },
      reviewsEnabled: { type: Boolean, default: true },
      codEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
