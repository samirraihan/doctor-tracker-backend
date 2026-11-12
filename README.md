# Doctor Tracker Backend API

## Description

Doctor Tracker Backend is a high-performance RESTful API service built with Node.js, Express, TypeScript, and MongoDB. It provides secure administrative endpoints for medical practitioner registration, patient records tracking, doctor assignment workflows, compound query filtering, and clinical practice analytics with centralized Zod validation and JWT authentication.

## Setup Guide

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB 7 local daemon or MongoDB Atlas connection string

### Environment Configuration

The repository includes a standardized `.env.example` file.

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Contents of `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/doctor_tracker
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@doctortracker.local
ADMIN_PASSWORD=ChangeMe123!
```

Ensure `MONGODB_URI` points to your accessible database instance and `JWT_SECRET` is set to a secure string.

### Step-by-Step Local Installation

1. Clone the repository and navigate into the project directory:

   ```bash
   git clone https://github.com/samirraihan/doctor-tracker-backend.git
   cd doctor-tracker-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Populate the database with the administrator account and demo dataset:

   ```bash
   npm run seed
   ```

   The automated seeder registers:
   - System administrator: `admin@doctortracker.local` / `ChangeMe123!`
   - 20 demo doctors across 14 specialties
   - 45 demo patients distributed across all 20 doctors with clinical notes and historical registration timestamps

4. Build the TypeScript codebase:

   ```bash
   npm run build
   ```

5. Launch the development server with live reload:

   ```bash
   npm run dev
   ```

   The API will listen on `http://localhost:5000`.

## System Architecture

The backend implements a decoupled Controller-Service-Repository architecture pattern that enforces strict separation of concerns between HTTP transport negotiation, business domain logic, and database persistence.

```text
+-------------------------------------------------------------+
|                     Client Applications                     |
|           Next.js Frontend | Mobile Clients | External      |
+-------------------------------------------------------------+
                              |
                              | HTTP REST / JSON
                              | Authorization: Bearer <JWT>
                              v
+-------------------------------------------------------------+
|                      Security Pipeline                      |
|         Helmet -> Rate Limiter -> CORS -> Error Handler      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Controller Layer                       |
|           HTTP Negotiation, Zod Schema Validation           |
|      AuthController | DoctorController | PatientController  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                        Service Layer                        |
|        Business Rules, Password Hashing, JWT Tokens         |
|      AuthService | DoctorService | PatientService | Dash    |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Repository Layer                       |
|        Mongoose Models, Text Indexes, Aggregations          |
|      DoctorModel | PatientModel | UserModel                 |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      MongoDB Database                       |
|             Collections: users, doctors, patients           |
+-------------------------------------------------------------+
```

### Data Flow and Service Interactions

1. **Request Intake**: Inbound HTTP requests pass through security middleware (Helmet for HTTP headers, CORS for origin policy enforcement, Express Rate Limit for DDoS protection).
2. **Authentication Middleware**: Protected routes pass through the JWT verification middleware, validating token signatures and attaching the authenticated user payload to `req.user`.
3. **Controller Validation**: Controllers parse query and body parameters, validating inputs against declarative Zod schemas before calling service methods.
4. **Service Logic**: Domain services execute business rules (such as checking email uniqueness, hashing passwords with bcrypt, or cascading patient updates).
5. **Persistence**: The repository layer executes optimized MongoDB operations including compound text indexes (`$text`), range filters on timestamps, and aggregation pipelines (`$facet`, `$group`) to return data with pagination metadata in a single round trip.

## Technical Decisions

### Decision 1: Dedicated Express REST Service over Next.js Route Handlers

We chose an independent Express REST API rather than embedding Next.js App Router route handlers.

- **Independent Scalability**: Decoupling the API service allows backend processes, connection pools, and worker threads to scale based on API traffic independently from client frontend rendering nodes.
- **Strict Architectural Boundaries**: Presentation logic in the UI is fully isolated from data validation and business rules, enabling independent deployments and distinct CI/CD pipelines.
- **Extensibility**: A standalone REST API is ready to serve future clients (such as native mobile applications or third-party clinic integrations) without dependency on Next.js server runtimes.

### Decision 2: MongoDB Aggregation Pipelines and Text Indexes over In-Memory Operations

Rather than retrieving large document sets and filtering or calculating aggregates in Node.js memory, the backend leverages native MongoDB aggregation pipelines and compound indexes.

- **High-Performance Aggregations**: The dashboard endpoint utilizes `$facet` to compute total counts, medical specialization distribution, and monthly registration volumes within a single database round trip.
- **Index-Backed Queries**: Text searches across doctor names, hospital affiliations, patient conditions, and contact details utilize compound text indexes, preventing slow collection scans.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user and issue JWT token |
| GET | `/api/auth/me` | Fetch authenticated user profile |
| GET | `/api/dashboard/summary` | Practice metrics, registration trend, and doctor distribution |
| GET | `/api/doctors` | List doctors with search, specialization, date filters, pagination |
| POST | `/api/doctors` | Register a new doctor |
| GET | `/api/doctors/:id` | Retrieve specific doctor details |
| DELETE | `/api/doctors/:id` | Remove doctor and cascade deletion of assigned patients |
| GET | `/api/doctors/:id/patients` | Retrieve patients assigned to a specific doctor |
| POST | `/api/doctors/:id/patients` | Add a new patient assigned directly to a doctor |
| GET | `/api/patients` | List patients with search, condition, doctor, date filters, pagination |
| POST | `/api/patients` | Create a new patient record |
| PATCH | `/api/patients/:id` | Update patient details |
| DELETE | `/api/patients/:id` | Delete a patient record |
