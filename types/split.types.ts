export interface IParticipant {
  participantId: string;
  name: string;
}

export interface IExpense {
  expenseId: string;
  amount: number;
  description: string;
  paidBy: string; // participant id
  splitBetween: string[]; // array of participant ids
}

export interface ISplit {
  date: string;
  splitId: string;
  name: string;
  participants: IParticipant[];
  expenses: IExpense[];
  _id: string; // Unique identifier for the split by convex
  isPrivate: boolean; // Optional field to indicate if the split is private
  createdBy: string; // User ID of the creator
  isDeleted?: boolean; // Optional field to mark as deleted
  deletedAt?: string; // Optional field to store deletion timestamp
  updatedAt?: string; // Optional field to store last update timestamp
  createdAt?: string; // Optional field to store creation timestamp
  updatedBy?: string; // Optional field to store the user who last updated the split
  _creationTime?: number; // Timestamp of creation by dexie
}
