import Joi from "joi";
import mongoose from "mongoose";

import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    notifications: [
      {
        type: Date,
      },
    ],
    address: {
      type: String,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { versionKey: false, timestamps: true }
);

export const Task = model("task", taskSchema);

const addTaskSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required,
});
