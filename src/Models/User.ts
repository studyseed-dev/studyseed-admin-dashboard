import mongoose, { Schema } from "mongoose";

import { Course } from "@/enums/courses.enum";
import { ProgressModel, courses, topics } from "@/lib/types";

export interface IUser extends mongoose.Document {
  first_name: string;
  last_name: string;
  userid: string;
  enrolled_courses: Course[];
  // courses is more like Topics, but was named quite early on
  courses: string[];
  progress: Partial<ProgressModel>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    userid: {
      type: String,
    },
    enrolled_courses: {
      type: [String],
      enum: courses,
    },
    courses: {
      default: [...topics],
    },
    progress: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { minimize: false }
);

export const User = mongoose.models.Users || mongoose.model("Users", UserSchema, "users");
