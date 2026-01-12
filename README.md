# Expense Tracker App - Frontend

A modern React-based frontend for the Expense Tracker application built with Vite, Tailwind CSS, and Recharts.


## 🚀 Quick Start

npm install

npm run dev

The application will open at http://localhost:5173


📦 Project Setup
Installation-cd frontend/expense-tracker

npm install

Development Server-npm run dev

Runs the app in development mode with hot module replacement (HMR).

Build for Production-npm run build

Creates an optimized production build in the dist/ folder.

Preview Production Build-npm run preview



🎯 Key Features

Authentication

User registration and login

JWT token-based authentication

Protected routes

User context for state management

Dashboard

Financial overview with charts

Income tracking

Expense tracking

Recent transactions

Income and expense lists

Last 30/60 days analytics

Reports

Download income reports as Excel

Download expense reports as Excel

Data visualization with Recharts

Profile

Profile photo upload

User profile management

🛠️ Tech Stack

React 19 - UI framework

Vite - Build tool and dev server

Tailwind CSS - Utility-first CSS framework

Recharts - Data visualization library

React Router - Client-side routing

Axios - HTTP client for API calls

React Icons - Icon library


📱 Available Components

Layout Components

Navbar - Top navigation bar

SideMenu - Sidebar navigation

AuthLayout - Authentication pages layout

DashboardLayout - Dashboard pages layout

Card Components

InfoCard - Display financial information

TransactionInfoCard - Display transaction details

CharAvatar - User avatar with initial

Dashboard Components

ExpenseOverview - Expense summary

IncomeOverview - Income summary

FinanceOverview - Overall financial view

ExpensesList - List of expenses

IncomeList - List of income entries

RecentTransactions - Recent activity

Last30DaysExpenses - Expense chart

IncomeLast60Days - Income chart


🔗 API Integration

The frontend communicates with the backend API. Key endpoints:

Authentication

POST /api/v1/auth/register - User registration

POST /api/v1/auth/login - User login

GET /api/v1/auth/getUser - Get current user

POST /api/v1/auth/upload-image - Upload profile photo

Income

GET /api/v1/income/get - Get all income

POST /api/v1/income/add - Add income

DELETE /api/v1/income/:id - Delete income

GET /api/v1/income/download-excel - Download income report

Expense
GET /api/v1/expense/get - Get all expenses

POST /api/v1/expense/add - Add expense

DELETE /api/v1/expense/:id - Delete expense

GET /api/v1/expense/download-excel - Download expense report

Dashboard

GET /api/v1/dashboard - Get dashboard data


🎨 Styling
The project uses Tailwind CSS for styling. Global styles are defined in src/index.css.

🔒 Authentication Flow

User signs up or logs in via the auth pages

Backend returns a JWT token

Token is stored in localStorage via userContext

Token is sent with every API request via axios interceptor

Protected routes redirect unauthenticated users to login

📈 State Management

The app uses React Context (userContext) for managing:

Current user information

Authentication state

User token

🖼️ Application Screenshots

Below are some key screens from the application demonstrating the user flow and core features.

🚦 Routing

Routes are managed using React Router:

/auth/login - Login page

/auth/signup - Registration page

/dashboard - Main dashboard

/dashboard/income - Income page

/dashboard/expense - Expense page

📝 Scripts

Command	Description

npm run dev	-Start development server

npm run build-	Build for production

npm run preview-	Preview production build

npm run lint-	Run ESLint

Page	Screenshot

Sign In Page -<img width="1916" height="847" alt="image" src="https://github.com/user-attachments/assets/32b6bdc2-b433-457f-be50-7c7710efaa1a" />

Sign Up Page-<img width="1850" height="841" alt="image" src="https://github.com/user-attachments/assets/46551d68-7ba5-4cba-9a93-ae0023ef33c0" />
	
Dashboard	-<img width="1920" height="1937" alt="screencapture-localhost-5179-home-2026-01-02-20_06_41" src="https://github.com/user-attachments/assets/3637870e-5885-40f1-8672-b4330917fb41" />

Expense Page-<img width="1920" height="1345" alt="image" src="https://github.com/user-attachments/assets/76f2aa6b-c7a3-4ea7-8ae1-057c3d4b500b" />

Income Page	-<img width="1920" height="1340" alt="image" src="https://github.com/user-attachments/assets/7c32e9a9-8f04-442e-9f09-9e5e7f2852e3" />


📌 Make sure to place your images inside a screenshots folder in the repository and name them accordingly.

🚀 Project Status

🌐 Deployment: Coming Soon

🔄 Future Enhancements:

Advanced analytics & charts

Export reports in multiple formats

Improved UI/UX and performance optimizations

👩‍💻 Author

Osagani Perera

Second-Year Computer Science Undergraduate

Passionate about Full-Stack Development and UI/UX


