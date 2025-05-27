import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
      include: {
        events: true,
        oneOffRepayments: true,
        transfers: true,
      },
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (err) {
    console.error('Failed to fetch budget:', err);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
} 