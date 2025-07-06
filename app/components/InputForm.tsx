import { BudgetData, Event, CreditCardRepayment } from '../types/budget';

interface InputFormProps {
  data: BudgetData;
  onChange: (data: BudgetData) => void;
}

export default function InputForm({ data, onChange }: InputFormProps) {
  const handleChange = (field: keyof BudgetData, value: string | number) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleEventChange = (index: number, field: keyof Event, value: string | number) => {
    const newEvents = [...data.events];
    newEvents[index] = {
      ...newEvents[index],
      [field]: value,
    };
    onChange({
      ...data,
      events: newEvents,
    });
  };

  const handleRepaymentChange = (index: number, field: keyof CreditCardRepayment, value: string | number) => {
    const newRepayments = [...data.oneOffRepayments];
    newRepayments[index] = {
      ...newRepayments[index],
      [field]: value,
    };
    onChange({
      ...data,
      oneOffRepayments: newRepayments,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: keyof BudgetData) => {
    if (e.target.value === '') {
      handleChange(field, 0);
    }
  };

  const handleEventFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleEventBlur = (e: React.FocusEvent<HTMLInputElement>, index: number, field: keyof Event) => {
    if (e.target.value === '') {
      handleEventChange(index, field, 0);
    }
  };

  const handleRepaymentFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleRepaymentBlur = (e: React.FocusEvent<HTMLInputElement>, index: number, field: keyof CreditCardRepayment) => {
    if (e.target.value === '') {
      handleRepaymentChange(index, field, 0);
    }
  };

  const addEvent = () => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      name: '',
      amount: 0,
    };
    onChange({
      ...data,
      events: [...data.events, newEvent],
    });
  };

  const removeEvent = (index: number) => {
    const newEvents = data.events.filter((_, i) => i !== index);
    onChange({
      ...data,
      events: newEvents,
    });
  };

  const addOneOffRepayment = () => {
    const newRepayment: CreditCardRepayment = {
      id: crypto.randomUUID(),
      name: '',
      amount: 0,
    };
    onChange({
      ...data,
      oneOffRepayments: [...data.oneOffRepayments, newRepayment],
    });
  };

  const removeOneOffRepayment = (index: number) => {
    const newRepayments = data.oneOffRepayments.filter((_, i) => i !== index);
    onChange({
      ...data,
      oneOffRepayments: newRepayments,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Monthly Budget Input</h2>

      {/* Notes Section - moved to top */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Previous Month&apos;s Reflection</label>
          <textarea
            value={data.previousMonthReflection}
            onChange={(e) => handleChange('previousMonthReflection', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Upcoming Calendar Notes</label>
          <textarea
            value={data.upcomingCalendarNotes}
            onChange={(e) => handleChange('upcomingCalendarNotes', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Aim</label>
          <input
            type="text"
            value={data.aim || ''}
            onChange={(e) => handleChange('aim', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fixed Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Month</label>
          <input
            type="month"
            value={data.month || ''}
            onChange={(e) => handleChange('month', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Wages</label>
          <input
            type="number"
            value={data.wages}
            onChange={(e) => handleChange('wages', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'wages')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Mortgage</label>
          <input
            type="number"
            value={data.mortgage}
            onChange={(e) => handleChange('mortgage', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'mortgage')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Bills</label>
          <input
            type="number"
            value={data.bills}
            onChange={(e) => handleChange('bills', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'bills')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Travel</label>
          <input
            type="number"
            value={data.travel}
            onChange={(e) => handleChange('travel', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'travel')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Groceries</label>
          <input
            type="number"
            value={data.groceries}
            onChange={(e) => handleChange('groceries', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'groceries')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Amount to Save</label>
          <input
            type="number"
            value={data.amountToSave}
            onChange={(e) => handleChange('amountToSave', parseFloat(e.target.value) || 0)}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'amountToSave')}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Credit Card Payments Section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Regular Credit Card Payments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Barclaycard</label>
            <input
              type="number"
              value={data.barclaycard}
              onChange={(e) => handleChange('barclaycard', parseFloat(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'barclaycard')}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Monzo Flex</label>
            <input
              type="number"
              value={data.monzoFlex}
              onChange={(e) => handleChange('monzoFlex', parseFloat(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'monzoFlex')}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Amex</label>
            <input
              type="number"
              value={data.amex}
              onChange={(e) => handleChange('amex', parseFloat(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'amex')}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* One-off Credit Card Repayments */}
      <div className="mt-6">
        {data.oneOffRepayments.map((repayment, index) => (
          <div key={repayment.id} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={repayment.name}
                onChange={(e) => handleRepaymentChange(index, 'name', e.target.value)}
                placeholder="Repayment Description"
                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={repayment.amount}
                onChange={(e) => handleRepaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                onFocus={handleRepaymentFocus}
                onBlur={(e) => handleRepaymentBlur(e, index, 'amount')}
                placeholder="Amount"
                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => removeOneOffRepayment(index)}
              className="px-3 py-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addOneOffRepayment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add One-off Repayment
        </button>
      </div>

      {/* Events Section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Events</h3>
        {data.events.map((event, index) => (
          <div key={event.id} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={event.name}
                onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                placeholder="Event Name"
                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={event.amount}
                onChange={(e) => handleEventChange(index, 'amount', parseFloat(e.target.value) || 0)}
                onFocus={handleEventFocus}
                onBlur={(e) => handleEventBlur(e, index, 'amount')}
                placeholder="Amount"
                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => removeEvent(index)}
              className="px-3 py-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEvent}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Event
        </button>
      </div>
    </div>
  );
} 