import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  specifications: Record<string, string>;
  features: string[];
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  brand: string;
  amazonLink?: string;
  flipkartLink?: string;
  whatsappQuickOrder: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    brand: { type: String, default: "" },
    amazonLink: { type: String },
    flipkartLink: { type: String },
    whatsappQuickOrder: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
