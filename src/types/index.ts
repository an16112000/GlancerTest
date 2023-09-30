import type { User } from "@prisma/client";
import { type DocumentData, type QueryDocumentSnapshot, type Timestamp } from "firebase/firestore";

export interface IConversation {
  id: string;
  members: string[];
  updatedAt: Timestamp;
  doc: QueryDocumentSnapshot<DocumentData>;
}

export interface IMessage {
  id: string;
  message: string;
  sender: string;
  createdAt: Timestamp;
}

export interface ISelectedConversation {
  otherPerson: User;
  conversation: IConversation;
}

export type FilterFeedProps = {
  categoryId?: string | undefined;
  searchString?: string | undefined;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
};

export * from "./next-auth";
