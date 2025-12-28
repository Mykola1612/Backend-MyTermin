import Joi from "joi";
import mongoose from "mongoose";

import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["task", "appointment", "note"],
      default: "appointment",
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
    attendees: {
      type: [
        {
          name: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

export const Task = model("task", taskSchema);

const addTaskSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  address: Joi.string().optional(),
  attendees: Joi.array().items(Joi.string()).default([]),
});
