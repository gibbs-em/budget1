import { BudgetData } from '../types/budget';
import {
  calculateTotalFixedExpenses,
  calculateTotalEventSpending,
  calculateTotalCreditCardPayments,
  calculateInitialRemainingBalance,
  calculateAdjustmentNeeded,
  TARGET_DAILY_SPENDING,
} from '../utils/budgetCalculations';

interface BudgetSummaryProps {
  data: BudgetData;
}

export default function BudgetSummary({ data }: BudgetSummaryProps) {
  const totalFixedExpenses = calculateTotalFixedExpenses(data);
  const totalEventSpending = calculateTotalEventSpending(data.events);
  const totalCreditCardPayments = calculateTotalCreditCardPayments(data);
  const initialRemainingBalance = calculateInitialRemainingBalance(data);
  const adjustmentNeeded = calculateAdjustmentNeeded(initialRemainingBalance);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Budget Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Income</h3>
          <p className="text-2xl font-bold text-green-600">£{data.wages.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Fixed Expenses</h3>
          <p className="text-2xl font-bold text-red-600">£{totalFixedExpenses.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Credit Card Payments</h3>
          <p className="text-2xl font-bold text-red-600">£{totalCreditCardPayments.toLocaleString()}</p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Barclaycard: £{data.barclaycard.toLocaleString()}</p>
            <p>Monzo Flex: £{data.monzoFlex.toLocaleString()}</p>
            <p>Amex: £{data.amex.toLocaleString()}</p>
            {data.oneOffRepayments.length > 0 && (
              <div className="mt-1">
                <p className="font-medium">One-off Payments:</p>
                {data.oneOffRepayments.map((repayment) => (
                  <p key={repayment.id}>
                    {repayment.name}: £{repayment.amount.toLocaleString()}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Fun Money</h3>
          <p className="text-2xl font-bold text-red-600">£{totalEventSpending.toLocaleString()}</p>
          <div className="mt-2 text-sm text-gray-600">
            {data.events.length > 0 ? (
              data.events.map((event) => (
                <p key={event.id}>
                  {event.name}: £{event.amount.toLocaleString()}
                </p>
              ))
            ) : (
              <p className="text-gray-500 italic">No events added</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Savings</h3>
          <p className="text-2xl font-bold text-blue-600">£{data.amountToSave.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Initial Remaining Balance</h3>
          <p className={`text-2xl font-bold ${initialRemainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{initialRemainingBalance.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Target Daily Spending</h3>
          <p className="text-2xl font-bold text-blue-600">£{TARGET_DAILY_SPENDING.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Amount left to spend</h3>
          <p className={`text-2xl font-bold ${adjustmentNeeded >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{adjustmentNeeded.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
} 