# Land Project Hisab — Hill's Pride

A bilingual (**Bangla / English**) web application for managing the accounts of a shared land and flat development project. Owners and project managers can track plots, investors, deposits, expenses and reports in one dashboard instead of paper records.

Built during my industrial internship (CSE 4001) at **Authentic Four IT**.

> 📸 _Add a screenshot of the dashboard here_  
> 🔗 _Live demo: add link after deploying_

## Features

- **Dashboard** — the project's key financial totals at a glance
- **Plots & Shares** — list of plots/flats and their share details
- **Investors & Members** — member records with their payable, paid and due amounts
- **Collections & Digital Receipts** — record deposits and generate printable receipts
- **Project Expenses** — log every expense with date, description and amount
- **Accounts & Reports** — summary statements of the project's finances
- **Installment Calculator** — generate a monthly payment schedule
- **Multiple projects** — switch between projects
- **Bangla / English toggle** across the whole interface
- Data saved in the browser (localStorage), so records stay after a refresh

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Build tool | Vite |
| State | React Context API |
| Icons & animation | lucide-react, motion |

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Build for production:

```bash
npm run build
```

## Project structure

```
src/
├── components/      # Dashboard, Plots, Members, Collections, Expenses,
│                    # Reports, Calculator, Receipt modal, Header, Sidebar
├── context/         # ProjectContext — app state + localStorage
├── types/           # TypeScript interfaces (Plot, Member, Collection, ...)
├── utils/           # Number and currency formatters
└── data/            # Sample data
```

## Planned improvements

- Central database and API instead of browser storage
- Login with roles (admin, owner, engineer)
- Receipt image/PDF upload
- Export reports to Excel/PDF

## Author

**Abir Ahamed Omi** — CSE, Premier University, Chittagong
