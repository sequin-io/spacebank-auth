export interface Transaction {
  amount_in_cents: number;
  description: string;
  id: string;
  inserted_at: Date;
  is_pending: boolean;
  updated_at: Date;
}

export type ListTransactions = Transaction[];

export interface ListTaggedTransactionIds {
  ids: string[];
}

export type DateFilter = "all" | "last-week" | "last-two-weeks";
