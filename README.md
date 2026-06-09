# excel-ai-analyst
 
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
git clone https://github.com/IhebKadri/excel-ai-analyst.git
cd excel-ai-analyst
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
