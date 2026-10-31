# K12 Hunar – EdTech CRM & Inquiry Management System

A full-stack CRM inquiry management system that allows parents, students, and schools to submit inquiries and administrators to manage them through a secure dashboard.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express.js
- PostgreSQL
- Supabase
- JWT Authentication
- bcrypt

## Features

### 1. Public Inquiry Form
- User type selection (Parent, Student, School)
- Inquiry category selection (Scholarship, Concert, Admission, General Query)
- Name, email, and phone number fields
- Message submission
- Form validation
- Database integration
- Submission success and error messages

### 2. Admin Authentication
- Secure admin login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Secure logout functionality

### 3. Admin Dashboard
- View all submitted inquiries
- Dashboard statistics for total, new, contacted, and resolved inquiries
- Search by name, email, and phone number
- Filter by inquiry category
- Filter by user type
- Filter by inquiry status
- Update inquiry status
- View recent inquiries
- Inquiry category breakdown
- Resolution progress overview

## Project Structure

```text
edtech-crm/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── schema.sql
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js
- npm
- Git
- Supabase account

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd edtech-crm
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Configure your environment variables, including:
- Supabase PostgreSQL database connection
- JWT secret
- Admin credentials

Start the backend server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Configure the backend API URL.

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/inquiries` | Submit a new inquiry | Public |
| POST | `/api/admin/login` | Admin login | Public |
| GET | `/api/inquiries` | Retrieve all inquiries | Protected |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status | Protected |

**Authentication:** Protected endpoints require a valid JWT Bearer token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database

**Database:** Supabase PostgreSQL

The `schema.sql` file contains the SQL queries required to create the database tables, constraints, and indexes.

Main tables:
- `admins` – Stores administrator account details.
- `inquiries` – Stores submitted inquiry information and status.

## Inquiry Status

| Status | Description |
|---|---|
| New | Newly submitted inquiry |
| Contacted | Administrator has contacted the user |
| Resolved | Inquiry has been addressed |

## Application Workflow

1. Parents, students, or schools visit the public inquiry form.
2. Users enter their details and submit an inquiry.
3. The backend processes and stores the inquiry in Supabase PostgreSQL.
4. The administrator logs in using the admin credentials.
5. The dashboard displays submitted inquiries and statistics.
6. The administrator searches, filters, and updates inquiry statuses.

## Security
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- Environment variables for sensitive configuration.

## Future Enhancements
- Email notifications for new inquiries.
- Export inquiries to CSV or Excel.
- Advanced analytics and reports.
- Pagination for inquiry records.
- Automated follow-up reminders.

## Author

**Shreya V K**

