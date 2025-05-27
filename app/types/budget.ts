export interface Event {
  id: string;
  name: string;
  amount: number;
}

export interface CreditCardRepayment {
  id: string;
  name: string;
  amount: number;
}

export interface BudgetData {
  id?: string;
  aim: string;
  month: string;
  wages: number;
  mortgage: number;
  bills: number;
  travel: number;
  groceries: number;
  barclaycard: number;
  monzoFlex: number;
  amex: number;
  oneOffRepayments: CreditCardRepayment[];
  amountToSave: number;
  events: Event[];
  previousMonthReflection: string;
  upcomingCalendarNotes: string;
  transfers: TransferItem[];
}

export interface TransferItem {
  id: string;
  description: string;
  amount: number;
  completed: boolean;
} 