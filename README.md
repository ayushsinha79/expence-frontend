# Expense Tracker

A modern expense and cashback tracking application built with React, Vite, Node.js, Express, and MongoDB.

## Features

* User registration and login
* Track expenses and cashback transactions
* Group transactions by user
* Real-time expense summary
* Net expense calculation
* Transaction update and delete support
* Mobile-responsive design
* Modern dashboard UI

## Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* React Icons
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### Install Frontend Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Start Development Server

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## Backend Setup

Navigate to the backend project:

```bash
cd backend
npm install
npm start
```

Server will run on:

```text
http://localhost:5000
```

## Project Structure

```text
src/
├── components/
│   └── TransactionTable.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── TransactionForm.jsx
├── config.js
├── App.jsx
└── main.jsx
```

## Screens

### Login

* User authentication
* Auto-login support
* Responsive design

### Dashboard

* Expense overview
* Cashback summary
* Net expense tracking
* User-wise transaction grouping

### Transactions

* Create transactions
* Update existing transactions
* Delete transactions
* View transaction descriptions

## Deployment

### Frontend

Deploy using:

* Vercel
* Netlify
* GitHub Pages

### Backend

Deploy using:

* Render
* Railway
* Fly.io

> Note: Free-tier backend services may take 5–10 seconds to wake up after inactivity.

## Future Enhancements

* JWT Authentication
* Dark/Light Theme
* Monthly Analytics
* Charts and Reports
* Export to Excel/PDF
* Category-based Expenses
* Search and Filters

## Author

Ayush Sinha

Backend Developer | SDET | Cloud & Automation Enthusiast
