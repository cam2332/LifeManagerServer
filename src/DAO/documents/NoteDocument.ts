import { Document, Types } from "mongoose";

export interface NoteDocument extends Document {
    title: string;
    text: string;
    createDate: Date;
    lastEditDate: Date;
    userId: Types.ObjectId;
}