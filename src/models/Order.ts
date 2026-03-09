import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "card" | "cod" | "whatsapp" | "online" | "instagram" | "facebook";
  externalPlatform: "website" | "amazon" | "flipkart" | "instagram" | "facebook" | "whatsapp";
  externalOrderId?: string;
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cod", "whatsapp", "online", "instagram", "facebook"],
      required: true,
    },
    razorpayOrderId: { type: String },
    externalPlatform: {
      type: String,
      enum: ["website", "amazon", "flipkart", "instagram", "facebook", "whatsapp"],
      default: "website",
    },
    externalOrderId: { type: String },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
