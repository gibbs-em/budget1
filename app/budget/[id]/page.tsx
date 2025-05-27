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
        setBudgetData(data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
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
              {params.id === "new" ? "Create New Budget" : "Edit Budget"}
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Budget
          </button>
        </div>

        <div className="space-y-8">
          <InputForm data={budgetData} onChange={setBudgetData} />
          <BudgetSummary data={budgetData} />
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
      </div>
    </main>
  );
}
