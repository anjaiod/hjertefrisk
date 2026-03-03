# HJERTEFRISK

A full-stack web application for Hjertefrisk algorithm. The algorithm is a tool for assessing and managing cardiometabolic risk in patients with severe mental illness or substance use disorders. It focuses on lifestyle and physical health (smoking, diet, physical activity, sleep, alcohol) to prevent cardiovascular disease.

## 📋 Tech Stack

- **Backend:** ASP.NET Core (.NET 10)
- **Frontend:** Next.js 15 with React 19
- **Database:** PostgreSQL 17 (local via Docker)
- **Containerization:** Docker & Docker Compose

## 📑 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [Team](#-team)
- [Links](#-links)


# 🚀 Prosjektoppsett

## Kjøre prosjektet med Docker

### Bygge og starte prosjektet

Docker Desktop appen må være åpne før du kjører alle kommandoer der man bruker docker.

Kjør følgende kommando i **rotmappen**:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Prosjektet er ferdig bygget når du ser noe tilsvarende dette i terminalen:

```text
backend-1  | info: Microsoft.Hosting.Lifetime[0]
backend-1  |       Hosting environment: Development
backend-1  | info: Microsoft.Hosting.Lifetime[0]
backend-1  |       Content root path: /src
```

---

## Tilgang til applikasjonen

Når containerne kjører kan du åpne:

### Frontend (Next.js)
- http://localhost:3000/

### Backend (Swagger)
- http://localhost:5000/swagger/index.html  

Swagger viser alle tilgjengelige API-kall.  
*(Per nå er det kun kobling mot databasen.)*

---

## Stoppe Docker

For å stoppe containerne:

```bash
docker compose down
```

---

## Hot Reload

Hot reload fungerer foreløpig **ikke** for frontend i Docker. Du må derfor stoppe docker og deretter starte containerne på nytt for å se endringer.

For å se endringer må du:

1. Stoppe containerne:
   ```bash
   docker compose down
   ```

2. Bygge og starte på nytt:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

---

# 💻 Kjøre prosjektet lokalt i frontend (Database + API kjøres i docker)

I **rotmappen**:
```bash
docker compose up --build db backend
```


Eksempel for **Next.js (frontend)**:

```bash
npm install
npm run build
npm run dev
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

### 1. .NET SDK 10
**Check installation:**
```bash
dotnet --version
```

**Installation:**
- **macOS:**
  ```bash
  brew install --cask dotnet-sdk
  ```
- **Windows:**
  ```bash
  winget install Microsoft.DotNet.SDK.10
  ```
- **Linux/Manual:** [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)

### 2. Node.js (LTS version recommended)
**Check installation:**
```bash
node --version
npm --version
```

**Installation:**
- **macOS:**
  ```bash
  brew install node
  ```
- **Windows:**
  ```bash
  winget install OpenJS.NodeJS.LTS
  ```
- **Linux:** Use [nvm](https://github.com/nvm-sh/nvm) or your package manager

### 3. Docker Desktop
**Check installation:**
```bash
docker --version
docker compose version
```

**Installation:**
- **macOS:**
  ```bash
  brew install --cask docker
  brew install docker-compose
  ```
- **Windows:**
  ```bash
  winget install Docker.DockerDesktop
  ```
- **Linux:** [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

**NOTE:** Make sure to start Docker Desktop after installation!

## 📦 Installation

### 1. Clone the repository
```bash
git clone [repository-url]
cd hjertefrisk
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```bash
```

### 3. Install dependencies

**Backend:**
```bash
cd backend
dotnet restore
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## 🚀 Running the Project

### Start the database
From the root directory:
```bash
docker compose up -d db
```

Verify the database is running:
```bash
docker compose ps
docker compose logs db
```

### Start the backend
In a new terminal:
```bash
cd backend
dotnet run
```

Backend runs on: `http://localhost:`

### Start the frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:`


## 📁 Project Structure

```
hjertefrisk/
├── backend/
│   ├── Controllers/         # API endpoints
│   ├── Models/              # Data models
│   ├── Services/            # Business logic
│   ├── Data/                # Database context & migrations
│   ├── appsettings.json     # Configuration
│   └── Program.cs           # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React components
│   │   │   ├── atoms/      # Basic components
│   │   │   ├── molecules/  # Composite components
│   │   │   ├── organisms/  # Complex components
│   │   │   └── templates/  # Page layouts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & helpers
│   │   └── styles/         # Global CSS
│   ├── public/             # Static files
│   └── package.json
│
├── docker-compose.yml       # Docker configuration
├── .env                     # Environment variables
└── README.md
```


## 🛠️ Development Commands

### Database Commands

```bash
# Start database
docker compose up -d db

# Stop database
docker compose stop db

# Stop and delete data (factory reset)
docker compose down -v

# View logs
docker compose logs -f db

# Run SQL commands
docker exec -it hjertefrisk-db psql -U postgres -d hjertefrisk_db
```

### Backend Commands

```bash
cd backend

# Restore packages
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Run with hot reload
dotnet watch run

# Run tests
dotnet test

# Create database migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update
```

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Linting
npm run lint

# Type-checking
npm run type-check
```


## 👥 Team

Agnes, Anja, Aurora, Camilla, Julie, Johannes, Fredrik


## 🔗 Links

- [Figma Design](link)