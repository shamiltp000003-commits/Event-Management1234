import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Link to the customer (User who booked)
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔥 NEW: Store customer name snapshot
    customerName: {
      type: String,
      required: true,
    },

    // Link to the provider
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔥 NEW: Store provider name snapshot
    providerName: {
      type: String,
      required: true,
    },

    // Snapshot of user contact info
    email: { type: String, required: true },
    phone: { type: String, required: true },

    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    guests: { type: Number, default: 50 },
    hours: { type: Number, default: 4 },
    specialRequests: { type: String },

    category: {
      type: String,
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "categoryModel",
      required: true,
    },

    categoryModel: {
      type: String,
      required: true,
    },

    // 🔥 NEW: Store service name snapshot
    serviceName: {
      type: String,
      required: true,
    },

    selectedPackage: {
      _id: { type: String },
      packageName: { type: String },
      description: { type: String },
      pricePerPerson: { type: Number },
      pricePerHour: { type: Number },
      pricePerDay: { type: Number },
      foodType: { type: String },
    },

    auditoriumPricing: {
      type: String,
      enum: ["daily", "hourly"],
    },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    refundAmount: { type: Number, default: 0 },
    cancellationFee: { type: Number, default: 0 },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);