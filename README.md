# excel-ai-analyst

> AI-powered web app that analyzes Excel files, answers financial questions, and generates reports — built for small business owners.

---

## Overview

Small business owners waste hours every week trying to extract insights from their Excel files. excel-copilot solves this by letting them upload a spreadsheet, ask questions in plain language, and get instant financial analysis — powered by AI.

- Upload any `.xlsx` or `.xls` file
- Ask financial questions in natural language ("What was total revenue in Q1?")
- Get AI-generated summaries, insights, and reports
- Works with complex sheets — multiple tables, headers at any position
- Handles large files via a full RAG pipeline — no context window limits

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM + pgvector (vector similarity search)
- Docker (local development)
- HttpOnly cookie authentication + bcryptjs
- Multer (file uploads)
- SheetJS (Excel parsing)
- Zod (input validation)
- Google Gemini API (AI chat, summarization, embeddings)
- `pg` (raw SQL for vector queries)

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management)
- Axios (with cookie credentials)
- React Router v6

---

## Architecture

This project follows a strict **Layered Architecture** with clear separation of concerns. Dependencies always point inward — toward the domain, never outward.

```
Controllers → Services → Repositories → Database
                ↓
         Implementations
         (Parsers, AI, Embeddings)
```

### Design patterns used

- **Strategy Pattern** — `IFileParser` interface with `ExcelParser` as the first implementation. Adding CSV support means creating a new class, touching nothing else.
- **Repository Pattern** — all database access is behind `IFileRepository`, `IUserRepository`, `IReportRepository`, `IChunkRepository`. Services never import Prisma directly.
- **Dependency Injection** — services receive their dependencies via constructor. No `new ConcreteClass()` inside a service.
- **Dependency Inversion** — `AnalysisService` depends on `IAIService` and `IEmbeddingService`, not their concrete implementations. Swapping AI providers is a one-line change in `app.ts`.

---

## RAG Pipeline

excel-copilot implements a full Retrieval-Augmented Generation pipeline using pgvector for semantic search.

```
Upload
  └── Parse Excel → Detect tables → Extract rows
        └── Chunk rows (20 rows per chunk)
              └── Embed each chunk via Gemini (768-dim vectors)
                    └── Store in PostgreSQL with pgvector (HNSW index)

Ask a question
  └── Embed the question (768-dim vector)
        └── Similarity search → top-5 relevant chunks (cosine similarity)
              └── Filter chunks below 0.5 similarity threshold
                    ├── Relevant chunks found → send only those as context
                    └── No relevant chunks → fallback to full-sheet context
                          └── Send context + question to Gemini → return answer
```

This means questions are answered using only the most semantically relevant portions of the spreadsheet, not the entire file — making large files (thousands of rows) fully supported without context window overflow.

---

## Smart Excel Parsing

The `ExcelParser` uses a heuristic table detection algorithm that handles real-world messy spreadsheets:

- Detects multiple distinct tables within a single sheet separated by blank rows
- Identifies headers at any position (not just row 1)
- Handles tables that start at any column (not just column A)
- Normalizes headers to lowercase and strips whitespace
- Skips empty rows and null-padding between tables

---

## Project Structure

```
excel-copilot/
├── server/                         # Node.js + Express API
│   ├── src/
│   │   ├── config/                 # env, database (Prisma client)
│   │   ├── domain/                 # pure business entities (User, UploadedFile, Report)
│   │   ├── interfaces/             # abstraction contracts
│   │   │   ├── IFileParser.ts
│   │   │   ├── IAIService.ts
│   │   │   ├── IEmbeddingService.ts
│   │   │   ├── IChunkRepository.ts
│   │   │   ├── IFileRepository.ts
│   │   │   ├── IUserRepository.ts
│   │   │   └── IReportRepository.ts
│   │   ├── implementations/
│   │   │   ├── parsers/            # ExcelParser (Strategy Pattern)
│   │   │   └── ai/                 # GeminiAIService, GeminiEmbeddingService
│   │   ├── repositories/           # Prisma + pg data access layer
│   │   ├── services/               # business logic (Auth, File, Analysis)
│   │   ├── controllers/            # thin HTTP handlers
│   │   ├── middlewares/            # auth, error, upload, rate limiting
│   │   ├── routes/                 # route definitions
│   │   └── utils/                  # ApiError, logger, sheetUtils, chunkUtils
│   └── prisma/
│       └── schema.prisma
│
└── client/                         # React frontend
    └── src/
        ├── api/                    # axios API layer (auth, files, analysis)
        ├── features/
        │   ├── auth/               # hooks/, components/forms/
        │   ├── upload/             # hooks/, components/
        │   ├── chat/               # hooks/, components/
        │   ├── files/              # hooks/, components/
        │   └── reports/            # hooks/, components/
        ├── hooks/                  # shared hooks (useAuthBootstrap)
        ├── components/             # shared components (ProtectedRoute)
        ├── pages/                  # LoginPage, RegisterPage, DashboardPage
        ├── store/                  # Zustand global state
        └── types/                  # shared TypeScript types
```

---

## Security

- **HttpOnly cookies** — JWT tokens are stored in HttpOnly cookies, never in localStorage. JavaScript cannot read them, preventing XSS token theft.
- **SameSite=Strict** — cookies are only sent with same-origin requests, preventing CSRF attacks.
- **Password hashing** — bcryptjs with 12 salt rounds.
- **Rate limiting** — two-tier: 5 requests/minute + 100 requests/day per IP on analysis endpoints. Auth endpoints limited to 10 attempts per 15 minutes.
- **Input validation** — Zod schemas on all endpoints. Question length capped at 300 characters. History capped at 10 messages per request.
- **File ownership** — every file and analysis request verifies the requesting user owns the resource.
- **Duplicate file replacement** — unique constraint on `(userId, originalName)` prevents duplicate uploads at the database level.

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
npm install
npx prisma migrate deploy
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
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key
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
| POST | `/api/auth/login` | Login and receive cookie | No |
| POST | `/api/auth/logout` | Clear session cookie | Yes |
| GET | `/api/auth/me` | Get current user info | Yes |

### Files
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/files` | Upload Excel file (triggers chunking + embedding) | Yes |
| GET | `/api/files` | List user's files | Yes |
| DELETE | `/api/files/:id` | Delete a file and its chunks | Yes |

### Analysis
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/analysis/ask` | Ask a question (RAG-powered) | Yes |
| GET | `/api/analysis/report/:fileId` | Generate AI summary and insights | Yes |

---

## Known Limitations

- Table detection assumes at least one blank row separates distinct tables within a sheet. Stacked tables without a gap may not be detected correctly.
- Headers composed primarily of numbers (e.g. year columns `2022`, `2023`) may not be detected correctly by the heuristic.
- Merged cells in Excel are partially supported — SheetJS only populates the top-left cell, which may cause column misalignment.
- The HNSW vector index supports up to 2000 dimensions. Embeddings are reduced to 768 dimensions via Gemini's `outputDimensionality` parameter.
- Rate limit counters reset on server restart (in-memory store). Production deployments should back rate limiting with Redis.

---

## Planned Enhancements

- RAG status indicator in the chat UI (showing when chunks vs full-sheet context is used)
- LangChain refactor branch — replacing manual RAG orchestration with LangChain's retrieval chains
- CSV and Google Sheets support (Strategy Pattern already in place — just add a new `IFileParser` implementation)
- Async report generation with job queue (BullMQ)
- File export — download AI-organized Excel reports
- S3 / Cloudflare R2 file storage for production
- Redis-backed rate limiting for multi-instance deployments

---

## License

MIT