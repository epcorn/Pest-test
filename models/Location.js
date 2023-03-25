import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    floor: { type: String, required: true },
    location: { type: String, required: true },
    count: { type: Number },
    qr: { type: String },
    services: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
    ],
    shipTo: {
      type: mongoose.Types.ObjectId,
      ref: "ShipTo",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", LocationSchema);
