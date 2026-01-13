// models/Subscriber.ts
import mongoose from "mongoose";

const SubscribeSchema = new mongoose.Schema({
  emailSubscribe: { type: String, required: true },
  subscribedAt: Date,
});

const SubscriberModel = mongoose.model("SubscribeModel", SubscribeSchema);

export default SubscriberModel;
