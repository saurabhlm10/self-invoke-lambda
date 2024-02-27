import mongoose from "mongoose";
import { ENV } from "../constants";

const tempPostSchema = new mongoose.Schema(
  {
    source_reel_url: {
      type: String,
      required: true,
      unique: true,
    },
    video_url: {
      type: String,
      required: true,
      unique: true,
    },
    cover_url: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      required: true,
      unique: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    ownerUsername: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["not-processed", "processed"],
      default: "not-processed",
    },
    page: {
      type: String,
      required: true,
    },
    publishMonth: {
      type: String,
      required: true,
      enum: ENV.months,
    },
    caption: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TempPost = mongoose.model("TempPost", tempPostSchema);

export default TempPost;
