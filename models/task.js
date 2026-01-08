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
    notifications: {
      type: [Number],
      default: [30],
    },
    notificationSent: {
      type: [Boolean],
      default: [false],
    },
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

const Task = model("task", taskSchema);

const joiAddTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  date: Joi.string().required(),
  address: Joi.string().optional(),
  attendees: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .default([]),
});
const joiUpdateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.string(),
  address: Joi.string(),
  attendees: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .default([]),
});

const schemas = {
  joiAddTaskSchema,
  joiUpdateTaskSchema,
};

export { Task, schemas };
