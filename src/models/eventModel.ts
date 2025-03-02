import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  event_name: string;
  event_date: Date;
  event_venue: string;
  organization_name: string;
  event_description: string;
  event_type: string;
  deadline_date: Date;
  registration_fee: number;
  max_participants: number;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
}

const EventSchema: Schema = new Schema(
  {
    event_name: { type: String, required: true },
    event_date: { type: Date, required: true },
    event_venue: { type: String, required: true },
    organization_name: { type: String, required: true },
    event_description: { type: String, required: true },
    event_type: { type: String, required: true },
    deadline_date: { type: Date, required: true },
    registration_fee: { type: Number, required: true },
    max_participants: { type: Number, required: true },
    contact_person_name: { type: String, required: true },
    contact_person_email: { type: String, required: true },
    contact_person_phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
