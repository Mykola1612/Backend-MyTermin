import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
  refreshToken: {
    type: String,
    default: null,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Token = model("Token", tokenSchema);
