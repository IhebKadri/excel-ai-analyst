# Excel AI Analyst

A web application that allows users to upload Excel files and perform AI-powered analysis, Q&A, and report generation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Testing](#testing)

---

## Features

- **User Authentication**: Secure registration and login system.
- **File Upload**: Upload Excel files for analysis.
- **AI Analysis**: Generates summaries, insights, and answers questions using AI.
- **Report Generation**: Creates structured reports from Excel data.
- **Multi-Sheet Support**: Automatically detects and analyzes multiple sheets within an Excel file.
- **Secure & Scalable**: Built with industry best practices for security and performance.

## Tech Stack

### Backend

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: Multer, XLSX
- **AI Integration**: Google Gemini API
- **Validation**: Zod
- **Testing**: Jest, Supertest

### Frontend

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Project Structure

### Backend

```
server/
├── src/
│   ├── config/          # Application configuration (database, env, etc.)
│   ├── controllers/     # HTTP request handlers
│   ├── domain/          # Business logic and entities
│   ├── implementations/ # Concrete implementations of interfaces
│   ├── interfaces/      # TypeScript interfaces and types
│   ├── routes/          # API route definitions
│   ├── services/        # Business services
│   ├── utils/           # Utility functions (logging, helpers)
│   └── index.ts         # Application entry point
├── prisma/              # Prisma database schema and migrations
├── test/                # Unit and integration tests
└── ... (other config files)
```

### Frontend

```
client/
├── src/
│   ├── api/             # API client and request functions
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers (AuthContext)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page-level components
│   ├── types/           # TypeScript type definitions
│   └── ... (app entry point and config)
└── ... (other config files)
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (v13+)

### Backend Setup

1.  **Install Dependencies**:

    ```bash
    cd server
    npm install
    # or
    yarn install
    ```

2.  **Database Setup**:

    - Create a PostgreSQL database.
    - Update the `DATABASE_URL` in your `.env` file:

      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
      ```

    - Run migrations:

      ```bash
      npx prisma migrate dev --name init
      ```

3.  **Environment Variables**:

    - Create a `.env` file in the `server/` directory:

      ```env
      PORT=4000
      NODE_ENV=development
      JWT_SECRET=your_jwt_secret_here
      GEMINI_API_KEY=your_gemini_api_key_here
      DATABASE_URL=your_database_url
      UPLOAD_DIR=uploads
      MAX_FILE_SIZE_MB=10
      ```

4.  **Run the Server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The server will start on `http://localhost:4000`.

### Frontend Setup

1.  **Install Dependencies**:

    ```bash
    cd client
    npm install
    # or
    yarn install
    ```

2.  **Environment Variables**:

    - Create a `.env` file in the `client/` directory:

      ```env
      VITE_API_BASE_URL=http://localhost:4000/api
      ```

3.  **Run the Client**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The client will start on `http://localhost:5173`.

## API Routes

### Authentication

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get a JWT token |
| `GET` | `/api/auth/me` | Get current user info |

### Files

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/files` | Upload an Excel file |
| `GET` | `/api/files` | Get all user's files |
| `GET` | `/api/files/:id` | Get file details |

### Analysis

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/files/:id/analysis` | Get AI analysis for a file |
| `POST` | `/api/files/:id/chat` | Ask a question about the file |
| `POST` | `/api/files/:id/generate-report` | Generate a full report |

## Testing

### Running Tests

- **Run all tests**:

  ```bash
  cd server
  npm test
  # or
  yarn test
  ```

- **Run with coverage**:

  ```bash
  npm run test:coverage
  # or
  yarn test:coverage
  ```

## Project Documentation

### Key Concepts

**Clean Architecture**: The backend follows a clean architecture pattern with distinct layers:

- **Domain**: Core business logic and entities
- **Interfaces**: Abstract contracts and types
- **Implementations**: Concrete implementations of interfaces
- **Application**: Orchestration and use cases
- **Infrastructure**: External integrations (database, AI, etc.)

**Dependency Inversion**:
Services depend on interfaces (ports), not concrete implementations. This makes the system flexible and testable.

**File Processing Pipeline**:
1. **Upload**: User uploads Excel file via `POST /api/files`
2. **Parser**: `ExcelParser` reads the file and extracts tables
3. **Storage**: File metadata saved to PostgreSQL database
4. **Analysis**: AI services process the data for insights

**AI Analysis Workflow**:
1. **Summarization**: Gemini API generates a summary of the data
2. **Insights**: AI extracts key trends and patterns
3. **Q&A**: Users can ask natural language questions about the data
4. **Report Generation**: Structured report with tables and charts

### Testing with Prisma

We use a transactional testing approach:
1. **Generate a clean Prisma schema** for testing
2. **Run tests within a transaction** that gets rolled back after each test
3. **Seed test data** before each test

This ensures tests are isolated and don't affect the production database.

## Troubleshooting

### Common Issues

**1. Server won't start**
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Verify all required environment variables are set

**2. Cannot upload files**
- Check `MAX_FILE_SIZE_MB` in `.env`
- Ensure the `uploads` directory exists and has correct permissions
- Verify `GEMINI_API_KEY` is set

**3. AI analysis returns errors**
- Double-check your `GEMINI_API_KEY` is valid
- Ensure the AI service is reachable
- Check server logs for specific error messages

### Debug
# excel-copilot

> AI-powered web app that analyzes Excel files, answers financial questions, and generates reports — built for small business owners.

---

## Overview

Small business owners waste hours every week trying to extract insights from their Excel files. excel-copilot solves this by letting them upload a spreadsheet, ask questions in plain language, and get instant financial analysis — powered by AI.

- Upload any `.xlsx` or `.xls` file
- Ask financial questions in natural language ("What was total revenue in Q1?")
- Get AI-generated summaries, insights, and reports
- Works with complex sheets — multiple tables, headers at any position

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Docker (local development)
- JWT authentication + bcryptjs
- Multer (file uploads)
- SheetJS (Excel parsing)
- Zod (input validation)
- Google Gemini API (AI analysis)

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Axios

---

## Architecture

This project follows a strict **Layered Architecture** with clear separation of concerns. Dependencies always point inward — toward the domain, never outward.

```
Controllers → Services → Repositories → Database
                ↓
         Implementations
         (Parsers, AI)
```

### Design patterns used

- **Strategy Pattern** — `IFileParser` interface with `ExcelParser` as the first implementation. Adding CSV support means creating a new class, touching nothing else.
- **Repository Pattern** — all database access is behind `IFileRepository`, `IUserRepository`, `IReportRepository`. Services never import Prisma directly.
- **Dependency Injection** — services receive their dependencies via constructor. No `new ConcreteClass()` inside a service.
- **Dependency Inversion** — `AnalysisService` depends on `IAIService`, not `GeminiAIService`. Swapping AI providers is a one-line change in `app.ts`.

---

## Project Structure

```
excel-copilot/
├── server/                         # Node.js + Express API
│   ├── src/
│   │   ├── config/                 # env, database
│   │   ├── domain/                 # pure business entities (User, File, Report)
│   │   ├── interfaces/             # abstraction contracts
│   │   ├── implementations/
│   │   │   ├── parsers/            # ExcelParser
│   │   │   └── ai/                 # GeminiAIService
│   │   ├── repositories/           # Prisma data access layer
│   │   ├── services/               # business logic
│   │   ├── controllers/            # HTTP layer
│   │   ├── middlewares/            # auth, error, upload
│   │   ├── routes/                 # route definitions
│   │   └── utils/                  # ApiError, logger, sheetUtils
│   └── prisma/
│       └── schema.prisma
│
└── client/                         # React frontend
    └── src/
        ├── api/                    # axios API layer
        ├── features/               # upload, chat, reports
        ├── store/                  # Zustand global state
        └── types/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/excel-copilot.git
cd excel-copilot
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Set up the server

```bash
cd server
cp .env.example .env
# Fill in your values in .env
npm install
npx prisma migrate dev
npm run dev
```

### 4. Set up the client

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`
API runs at `http://localhost:4000`

---

## Environment Variables

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
DATABASE_URL=postgresql://dev:dev@localhost:5432/excelcopilot
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Files
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/files` | Upload Excel file | Yes |
| GET | `/api/files` | List user's files | Yes |
| DELETE | `/api/files/:id` | Delete a file | Yes |

### Analysis
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/analysis/ask` | Ask a question about a file | Yes |
| GET | `/api/analysis/report/:fileId` | Generate a report | Yes |

---

## Planned Enhancements

- RAG pipeline for large files exceeding context window limits
- CSV and Google Sheets support (Strategy Pattern already in place)
- Async report generation with job queue (BullMQ)
- File export — download AI-organized Excel reports
- S3 file storage for production

---

## License

MIT