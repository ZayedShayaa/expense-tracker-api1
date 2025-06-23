````markdown
# Expense Tracker API

A RESTful API for managing personal expenses, with file uploads, email notifications, job queue support, and full documentation.

---

## Requirements

- Node.js 16+
- PostgreSQL
- (Optional) Docker & Docker Compose

---

## Setup Instructions

### 1. Install dependencies

```bash
npm init -y
npm install dotenv express pg
npm install --save-dev sequelize-cli
npm install joi bcrypt jsonwebtoken multer nodemailer fast-csv bull ioredis nodemon 
npm install swagger-ui-express
```
````

### 2. Initialize Sequelize project

```bash
npx sequelize-cli init
```

Creates: `models/`, `migrations/`, `seeders/`, `config/config.json`

### 3. Generate Migrations Only

```bash
npx sequelize-cli migration:generate --name create-users-table
npx sequelize-cli migration:generate --name create-expenses-table
npx sequelize-cli migration:generate --name create-expense-files-table

```

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Seed the Database (optional)

```bash
npx sequelize-cli seed:generate --name users
npx sequelize-cli seed:generate --name expenses
npx sequelize-cli seed:generate --name expense-files
npx sequelize-cli db:seed:all
```

### 6. Undo Migrations or Seeds (optional)

```bash
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:undo:all
```

---

## Project Structure

```bash
expense-tracker-api/
├── config/
│   └── config.json       # Sequelize CLI database config
├── migrations/           # Database migrations
├── seeders/              # Seed scripts
├── src/
│   ├── app.js            # Express app entry
│   ├── config/           # dotenv & other configs
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # Sequelize models & index loader
│   ├── routes/           # Express routers
│   ├── middlewares/      # Auth, error handling, validations
│   ├── jobs/             # Queue producers & workers
│   │   ├── emailQueue.js
│   │   ├── fileQueue.js
│   │   └── Worker.js           # Helper functions & ApiError class
│   ├── validations/      # Joi schemas
│   ├── exports/          # Generated CSV files
│   └── tests/            # Unit tests
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── package.json
├── swagger.json
└── README.md
```

---

## Job Queue Setup

We use **Bull** + **Redis** for background processing (e.g., file processing, email sending).

### Run queue processor independently:

```bash
npm run worker
```

---

## File Storage & Email Configuration

### File Uploads

- Uses `multer` for handling file uploads.
- Files are stored in `./uploads` directory.

### Email (SMTP)

- Uses `nodemailer` with Mailtrap for development.

### Environment Variables (.env):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=chatapp

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
SALT_ROUNDS=10

FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5MB

ANALYTICS_DEFAULT_RANGE_DAYS=365

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
SMTP_FROM=no-reply@expensetracker.com
```

---

## Running Tests & Coverage

### Run all tests:

```bash
npm run test
```

### Run tests with coverage:

```bash
npx jest --coverage
```

### Run single test file:

```bash
npx jest tests/expenses.test.js
```

---

## API Documentation (Postman / Thunder Client)

Use the following endpoints with `Bearer <token>` in the `Authorization` header.

### Authentication

- **Register**
  `POST http://localhost:3000/auth/register`

  ```json
  {
    "name": "Zayed",
    "email": "zayed1@example.com",
    "password": "123456789"
  }
  ```

- **Login**
  `POST http://localhost:3000/auth/login`

  ```json
  {
    "email": "zayed1@example.com",
    "password": "123456789"
  }
  ```

### Expenses

- **Create Expense**: `POST /api/expenses`
- **Get All Expenses**: `GET /api/expenses`
- **Get Single Expense**: `GET /api/expenses/:id`
- **Update Expense**: `PATCH /api/expenses/:id`
- **Delete Expense**: `DELETE /api/expenses/:id`

### 📎 File Uploads

- **Upload**: `POST /api/expenses/:id/files`
- **Download**: `GET /api/expenses/:expenseId/files/:fileId`

### Analytics

- **Monthly Summary**: `GET /api/analytics/monthly`
- **Category Breakdown**: `GET /api/analytics/categories?from=YYYY-MM-DD&to=YYYY-MM-DD`

### Export CSV

- **Download CSV**:

```
GET /api/export/csv?from=2025-01-01&to=2025-06-18
```

- **Send via Email**:

```
GET /api/export/csv?from=2025-01-01&to=2025-06-18&email=test@mailtrap.io
```

---

## 🐳 Docker Compose (Optional for Deployment)

We use **Docker** + **Docker Compose** to easily run the full app (API, DB, Redis, Worker) in isolated containers.

### 🔧 docker-compose.yml

```yaml
version: "3.8"

services:
  redis:
    image: redis:7
    ports:
      - "6379:6379"

  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: testt
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: chatapp
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  api:
    build: .
    command: node src/app.js # Main API Server
    ports:
      - "3000:3000"
    volumes:
      - ./src/uploads:/app/uploads
      - ./src/exports:/app/src/exports
    environment:
      DB_NAME: testt
      DB_USER: postgres
      DB_PASS: chatapp
      DB_HOST: db
      DB_PORT: 5432
      JWT_SECRET: aVeryStrongAndLongRandomStringForJWTAndSessionSecret
      NODE_ENV: development
      REDIS_HOST: redis
      REDIS_PORT: 6379
      SMTP_HOST: sandbox.smtp.mailtrap.io
      SMTP_PORT: 2525
      SMTP_USER: f7e68a48494d1b
      SMTP_PASS: 478e9ea62c5fc0
      SMTP_FROM: expensetrackerapp@example.com
      SMTP_SECURE: "false"
    depends_on:
      - db
      - redis

  worker:
    build: .
    command: node src/jobs/worker.js # Background Job Processor
    volumes:
      - ./src/uploads:/app/uploads
      - ./src/exports:/app/src/exports
    environment:
      DB_NAME: testt
      DB_USER: postgres
      DB_PASS: chatapp
      DB_HOST: db
      DB_PORT: 5432
      NODE_ENV: development
      REDIS_HOST: redis
      REDIS_PORT: 6379
      SMTP_HOST: sandbox.smtp.mailtrap.io
      SMTP_PORT: 2525
      SMTP_USER: f7e68a48494d1b
      SMTP_PASS: 478e9ea62c5fc0
      SMTP_FROM: expensetrackerapp@example.com
      SMTP_SECURE: "false"
    depends_on:
      - db
      - redis

volumes:
  db_data:
```

---

###  Run the application

```bash
docker compose up --build
```

Runs:
- API on http://localhost:3000
- PostgreSQL on port 5432
- Redis on port 6379
- Worker to handle background jobs

> Press `Ctrl + C` to stop the running containers in the current terminal.

---

### 🧹 Stop & Clean

```bash
docker compose down
```

Removes containers and network, but **preserves volume data** (PostgreSQL data).

---

### 🛠️ Migrate inside container (if needed)

If Sequelize migrations fail automatically or you prefer to run them manually:

```bash
docker exec -it expense-tracke-api-1 sh
npx sequelize-cli db:migrate --config src/config/config.json --migrations-path src/migrations
```

---

### 🔁 Test the Worker manually (optional)

If you want to simulate the job runner manually inside the container:

```bash
docker exec -it expense-tracke-api-1 sh
npm run worker
```

---

> Make sure the file `src/jobs/worker.js` exists and exports the email & file queues properly, otherwise the worker container will crash.

## Dev Log

### Architecture Decisions

- Used Sequelize ORM for PostgreSQL
- Express.js for REST API
- JWT-based authentication
- Bull + Redis for background jobs (file/email)
- File upload via multer, email via nodemailer
- Followed **MVC pattern** and **Repository-Service pattern**

### Tradeoffs

- No TypeScript for simplicity
- Local file storage initially (easy upgrade to S3)

### Future Improvements

- OAuth login with Google
- GraphQL support
- Redis caching
- Rate limiting
- CI/CD with GitHub Actions

---

## 📎 Useful Links

- [GitHub Repository](https://github.com/ZayedShayaa/expense-tracker-api)

For issues or contributions, feel free to open a pull request or issue.

```

```
