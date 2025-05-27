import { BudgetData, TransferItem } from '../types/budget';

export const calculateTotalFixedExpenses = (data: BudgetData): number => {
  return data.mortgage + data.bills + data.travel + data.groceries;
};

export const calculateTotalEventSpending = (events: BudgetData['events']): number => {
  return events.reduce((sum, event) => sum + event.amount, 0);
};

export const calculateTotalCreditCardPayments = (data: BudgetData): number => {
  const regularPayments = data.barclaycard + data.monzoFlex + data.amex;
  const oneOffPayments = data.oneOffRepayments.reduce((sum, payment) => sum + payment.amount, 0);
  return regularPayments + oneOffPayments;
};

export const calculateInitialRemainingBalance = (data: BudgetData): number => {
  const totalFixedExpenses = calculateTotalFixedExpenses(data);
  const totalEventSpending = calculateTotalEventSpending(data.events);
  const totalCreditCardPayments = calculateTotalCreditCardPayments(data);
  
  return data.wages - (
    totalFixedExpenses +
    totalCreditCardPayments +
    totalEventSpending +
    data.amountToSave
  );
};

export const TARGET_DAILY_SPENDING = 800;

export const calculateAdjustmentNeeded = (remainingBalance: number): number => {
  return remainingBalance - TARGET_DAILY_SPENDING;
};

export const generateTransferList = (data: BudgetData): TransferItem[] => {
  const transfers: TransferItem[] = [
    {
      id: 'mortgage',
      description: 'Mortgage Payment',
      amount: data.mortgage,
      completed: false,
    },
    {
      id: 'bills',
      description: 'Bills Payment',
      amount: data.bills,
      completed: false,
    },
    {
      id: 'travel',
      description: 'Travel Expenses',
      amount: data.travel,
      completed: false,
    },
    {
      id: 'groceries',
      description: 'Groceries Budget',
      amount: data.groceries,
      completed: false,
    },
    {
      id: 'barclaycard',
      description: 'Barclaycard Payment',
      amount: data.barclaycard,
      completed: false,
    },
    {
      id: 'monzo-flex',
      description: 'Monzo Flex Payment',
      amount: data.monzoFlex,
      completed: false,
    },
    {
      id: 'amex',
      description: 'Amex Payment',
      amount: data.amex,
      completed: false,
    },
    {
      id: 'savings',
      description: 'Savings Transfer',
      amount: data.amountToSave,
      completed: false,
    },
    {
      id: 'daily-spending',
      description: 'Daily Spending Pot',
      amount: TARGET_DAILY_SPENDING,
      completed: false,
    },
  ];

  // Add one-off credit card repayments
  data.oneOffRepayments.forEach((repayment) => {
    transfers.push({
      id: `repayment-${repayment.id}`,
      description: `Credit Card Payment: ${repayment.name}`,
      amount: repayment.amount,
      completed: false,
    });
  });

  // Add event transfers
  data.events.forEach((event) => {
    transfers.push({
      id: `event-${event.id}`,
      description: event.name,
      amount: event.amount,
      completed: false,
    });
  });

  return transfers;
}; 