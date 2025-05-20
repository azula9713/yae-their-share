export interface IParticipant {
  id: string;
  name: string;
}

export interface IExpense {
  id: string;
  amount: number;
  description: string;
  paidBy: string; // participant id
  splitBetween: string[]; // array of participant ids
}

export interface ISplit {
  date: string;
  id: string;
  name: string;
  participants: IParticipant[];
  expenses: any[];
}
