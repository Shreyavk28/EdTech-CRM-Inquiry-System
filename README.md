# EdTech CRM & Inquiry Management System

A full-stack CRM inquiry management system developed for K12 Hunar to collect, manage, track, and resolve inquiries submitted by parents, students, and schools through a centralized administrative dashboard.

## Live Demo

- **Frontend:** https://k12-hunar.vercel.app
- **Backend API:** https://k12-hunar-backend-jbv7.onrender.com
- **Database:** Supabase PostgreSQL

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
- User type selection (Parent, Student, School).
- Inquiry category selection (Scholarship, Concert, Admission, General Query).
- Name, email, and phone number fields.
- Message submission.
- Form validation.
- Database integration.
- Submission success and error messages.

### 2. Admin Authentication
- Secure administrator login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.
- Secure logout functionality.

### 3. Admin Dashboard
- View all submitted inquiries.
- Dashboard statistics for total, new, contacted, and resolved inquiries.
- Search by name, email, and phone number.
- Filter by inquiry category.
- Filter by user type.
- Filter by inquiry status.
- Update inquiry status.
- View recent inquiries.
- Inquiry category breakdown.
- Resolution progress overview.

## Project Structure

```text
EdTech-CRM-Inquiry-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
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
git clone https://github.com/Shreyavk28/EdTech-CRM-Inquiry-System.git
cd EdTech-CRM-Inquiry-System
```

### 2. Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Copy the contents of `schema.sql`.
4. Execute the SQL queries to create the required tables, constraints, and indexes.
5. Obtain your PostgreSQL database connection details.

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Configure the following environment variables with your actual values:

```env
PORT=5000

PGHOST=your_supabase_host
PGPORT=5432
PGDATABASE=postgres
PGUSER=your_supabase_user
PGPASSWORD=your_database_password

JWT_SECRET=your_jwt_secret

ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Create the initial administrator account:

```bash
npm run create-admin
```

Start the backend development server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

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

### Authentication

Protected endpoints require a valid JWT Bearer token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database

**Database:** Supabase PostgreSQL

The `schema.sql` file contains the SQL queries required to create the database tables, constraints, and indexes.

### Main Tables

- **admins** – Stores administrator account details and hashed passwords.
- **inquiries** – Stores submitted inquiry information and inquiry status.

## Inquiry Status

| Status | Description |
|---|---|
| New | Newly submitted inquiry |
| Contacted | Administrator has contacted the user |
| Resolved | Inquiry has been addressed |

## Application Workflow

1. Parents, students, or schools visit the public inquiry form.
2. Users enter their details and submit an inquiry.
3. The backend validates and processes the inquiry.
4. Inquiry information is stored in Supabase PostgreSQL.
5. The administrator logs in using the admin credentials.
6. The dashboard displays submitted inquiries and statistics.
7. The administrator searches and filters inquiries.
8. The administrator updates inquiry statuses as required.

## Testing

### Backend Testing

Start the backend server:

```bash
npm run dev
```

Check the backend health endpoint:

`http://localhost:5000/`

Expected response:

```json
{
  "success": true,
  "message": "EdTech CRM API is running"
}
```

Check database connectivity:

`http://localhost:5000/api/test-db`

Expected response:

```json
{
  "success": true,
  "message": "Supabase database connected successfully"
}
```

### Frontend Testing

Start the frontend:

```bash
npm run dev
```

Verify the following application features:

- Submit a new inquiry through the public form.
- Log in using administrator credentials.
- View submitted inquiries in the dashboard.
- Search inquiries by name, email, and phone number.
- Filter inquiries by category, user type, and status.
- Update inquiry status.
- Verify dashboard statistics and recent inquiries.

### Production Testing

Verify the deployed application:

- Open the live frontend.
- Submit a test inquiry.
- Log in to the administrator dashboard.
- Check whether the submitted inquiry appears.
- Update its status.
- Verify that the changes are reflected correctly.

## Deployment

### Frontend Deployment – Vercel

- Connect the GitHub repository to Vercel.
- Set the root directory to `frontend`.
- Select Vite as the framework preset.
- Set the build command to `npm run build`.
- Set the output directory to `dist`.
- Configure `VITE_API_URL` with the deployed backend URL.

### Backend Deployment – Render

- Connect the GitHub repository to Render.
- Create a Node.js Web Service.
- Set the root directory to `backend`.
- Set the build command to `npm install`.
- Set the start command to `npm start`.
- Configure the required database, JWT, and administrator environment variables.

### Database Hosting

Supabase PostgreSQL is used as the hosted database for storing inquiry and administrator information.

## Security

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- Environment variables for sensitive configuration.
- Parameterized SQL queries for database operations.
- Administrator passwords are not stored in plain text.

## Future Enhancements

- Email notifications for new inquiries.
- Export inquiries to CSV or Excel.
- Advanced analytics and reports.
- Pagination for inquiry records.
- Automated follow-up reminders.

## Author

**Shreya V K**