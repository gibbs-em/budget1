import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface BudgetData {
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
  oneOffRepayments: { name: string; amount: number }[];
  amountToSave: number;
  events: { name: string; amount: number }[];
  previousMonthReflection: string;
  upcomingCalendarNotes: string;
  transfers: { description: string; amount: number; completed: boolean }[];
}

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        events: true,
        oneOffRepayments: true,
        transfers: true,
      },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: BudgetData = await request.json();
    const budget = await prisma.budget.create({
      data: {
        aim: data.aim,
        month: new Date(data.month),
        wages: data.wages,
        mortgage: data.mortgage,
        bills: data.bills,
        travel: data.travel,
        groceries: data.groceries,
        barclaycard: data.barclaycard,
        monzoFlex: data.monzoFlex,
        amex: data.amex,
        amountToSave: data.amountToSave,
        previousMonthReflection: data.previousMonthReflection,
        upcomingCalendarNotes: data.upcomingCalendarNotes,
        events: {
          create: data.events.map(event => ({
            name: event.name,
            amount: event.amount,
          })),
        },
        oneOffRepayments: {
          create: data.oneOffRepayments.map(repayment => ({
            name: repayment.name,
            amount: repayment.amount,
          })),
        },
        transfers: {
          create: data.transfers.map(transfer => ({
            description: transfer.description,
            amount: transfer.amount,
            completed: transfer.completed,
          })),
        },
      },
      include: {
        events: true,
        oneOffRepayments: true,
        transfers: true,
      },
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data: BudgetData & { id: string } = await request.json();
    const { id, ...budgetData } = data;

    // First, delete existing related records
    await prisma.event.deleteMany({
      where: { budgetId: id },
    });
    await prisma.creditCardRepayment.deleteMany({
      where: { budgetId: id },
    });
    await prisma.transferItem.deleteMany({
      where: { budgetId: id },
    });

    // Then update the budget and create new records
    const budget = await prisma.budget.update({
      where: { id },
      data: {
        aim: budgetData.aim,
        month: new Date(budgetData.month),
        wages: budgetData.wages,
        mortgage: budgetData.mortgage,
        bills: budgetData.bills,
        travel: budgetData.travel,
        groceries: budgetData.groceries,
        barclaycard: budgetData.barclaycard,
        monzoFlex: budgetData.monzoFlex,
        amex: budgetData.amex,
        amountToSave: budgetData.amountToSave,
        previousMonthReflection: budgetData.previousMonthReflection,
        upcomingCalendarNotes: budgetData.upcomingCalendarNotes,
        events: {
          create: budgetData.events.map(event => ({
            name: event.name,
            amount: event.amount,
          })),
        },
        oneOffRepayments: {
          create: budgetData.oneOffRepayments.map(repayment => ({
            name: repayment.name,
            amount: repayment.amount,
          })),
        },
        transfers: {
          create: budgetData.transfers.map(transfer => ({
            description: transfer.description,
            amount: transfer.amount,
            completed: transfer.completed,
          })),
        },
      },
      include: {
        events: true,
        oneOffRepayments: true,
        transfers: true,
      },
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
} 