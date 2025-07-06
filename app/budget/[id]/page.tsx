"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BudgetData, TransferItem } from "@/app/types/budget";
import InputForm from "@/app/components/InputForm";
import BudgetSummary from "@/app/components/BudgetSummary";
import TransferList from "@/app/components/TransferList";
import { generateTransferList } from "@/app/utils/budgetCalculations";

const initialBudgetData: BudgetData = {
  aim: "",
  month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  wages: 0,
  mortgage: 0,
  bills: 0,
  travel: 0,
  groceries: 0,
  barclaycard: 0,
  monzoFlex: 0,
  amex: 0,
  oneOffRepayments: [],
  amountToSave: 0,
  events: [],
  previousMonthReflection: "",
  upcomingCalendarNotes: "",
  transfers: [],
};

export default function BudgetPage() {
  const params = useParams();
  const [budgetData, setBudgetData] = useState<BudgetData>(initialBudgetData);
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize transfers for new budget
  useEffect(() => {
    if (params.id === "new") {
      const initialTransfers = generateTransferList(initialBudgetData);
      setTransfers(initialTransfers);
    }
  }, [params.id]);

  // Update transfers when budget data changes
  useEffect(() => {
    if (params.id === "new") {
      const updatedTransfers = generateTransferList(budgetData);
      setTransfers(updatedTransfers);
    }
  }, [budgetData, params.id]);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`/api/budget/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch budget");
        }
        const data = await response.json();
        // Format the month to YYYY-MM for the input field
        const formattedData = {
          ...data,
          month: new Date(data.month).toISOString().slice(0, 7)
        };
        setBudgetData(formattedData);
        // Use existing transfers from the database, or generate new ones if none exist
        setTransfers(
          data.transfers?.length > 0
            ? data.transfers
            : generateTransferList(data)
        );
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id !== "new") {
      fetchBudget();
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  const handleSave = async () => {
    try {
      const method = params.id === "new" ? "POST" : "PUT";
      const response = await fetch("/api/budget", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...budgetData,
          id: params.id === "new" ? undefined : params.id,
          transfers: transfers.map((transfer) => ({
            description: transfer.description,
            amount: transfer.amount,
            completed: transfer.completed,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save budget");
      }

      const savedBudget = await response.json();
      // Redirect to the budget page
      window.location.href = `/budget/${savedBudget.id}`;
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/budget?id=${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to delete budget');
      }

      // Redirect to the dashboard after successful deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete budget. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {params.id === "new" ? "Create New Budget" : `Edit Budget - ${new Date(budgetData.month).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric'
              })}`}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {params.id !== "new" && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Budget
              </button>
            )}
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Budget
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Delete Budget</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this budget? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <InputForm data={budgetData} onChange={setBudgetData} />
            <TransferList
              transfers={transfers}
              onTransferComplete={(id, completed) => {
                setTransfers((prevTransfers) =>
                  prevTransfers.map((transfer) =>
                    transfer.id === id ? { ...transfer, completed } : transfer
                  )
                );
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <BudgetSummary data={budgetData} />
          </div>
        </div>
      </div>
    </main>
  );
}
