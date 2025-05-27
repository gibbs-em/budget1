# Budget Planner

A Next.js application for managing personal budgets, tracking expenses, and planning monthly finances.

## Features

- Create and manage monthly budgets
- Track regular expenses and income
- Manage credit card payments
- Plan for upcoming events
- Track transfer items and savings goals
- Monthly reflections and calendar notes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- Tailwind CSS
- Neon Database (PostgreSQL)

## Prerequisites

- Node.js 18+ and npm
- A Neon database account (or any PostgreSQL database)

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd budget-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your Neon database connection string

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

Replace the DATABASE_URL with your actual database connection string from Neon or your PostgreSQL provider.

## Database Schema

The application uses the following main models:
- Budget: Main budget information and monthly targets
- Event: One-time events and their associated costs
- CreditCardRepayment: One-off credit card payments
- TransferItem: Transfer items and their completion status

## Development

- The Prisma client is generated in `app/generated/prisma`
- API routes are located in `app/api`
- Components are in `app/components`
- Types are defined in `app/types`

## Deployment

The application can be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

MIT
