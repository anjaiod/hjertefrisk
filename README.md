# HJERTEFRISK

A full-stack web application for Hjertefrisk algorithm. The algorithm is a tool for assessing and managing cardiometabolic risk in patients with severe mental illness or substance use disorders. It focuses on lifestyle and physical health (smoking, diet, physical activity, sleep, alcohol) to prevent cardiovascular disease.

## 📋 Tech Stack

- **Backend:** ASP.NET Core (.NET 10)
- **Frontend:** Next.js 15 with React 19
- **Database:** PostgreSQL 17 (local via Docker)
- **Containerization:** Docker & Docker Compose

## Andre ReadMEs
- [Backend README](backend/README.md)

## Deploy Docs
- [Deployment Docs](docs/README.md)

## 📑 Innholdsfortegnelse
- [Prosjektoppsett](#prosjektoppsett)
- [Koding i Frontend](#koding-i-frontend-database--api-kjøres-i-docker)
- [Alle Nødvendige Installasjoner](#alle-nødvendige-installasjoner)
- [Backend Commands](#backend-commands)
- [Frontend Commands](#frontend-commands)
- [Team](#-team)
- [Links](#-links)


# 🚀 Prosjektoppsett

## Kjøre prosjektet med Docker

### Bygging og start av hele prosjektet ved hjelp av Docker

Docker Desktop-appen må være åpen før du kjører alle kommandoer der man bruker docker.

Kjør følgende kommando i **rotmappen**:

```bash
docker compose up --build
```
Eventuelt

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
   docker compose up --build
   ```

---

# 💻 Koding i frontend (Database + API kjøres i docker):

I **rotmappen**:
```bash
# Kjører database og backend i docker
docker compose up --build db backend
```


Kjøring av **Next.js (frontend)**:

```bash
# Kjører frontend lokalt
cd frontend
npm install
npm run build
npm run dev
```

# Før Git commits:
## Dersom du har gjort endringer gjort i Frontend

### ESLint (Finner feil i koden din)
```bash
cd frontend
npm run lint
```
### Prettier (Formaterer koden din)
```bash
cd frontend

# Hvis du vil sjekke om filene er formatert riktig i forhold til prettier
npx prettier . --check

# Hvis du vil automatiske formatere alle filer i frontend
npx prettier . --write
```

### Dersom du har gjort endringer gjort i Backend
```bash
cd backend

# Formaterer koden i backend
dotnet format
```


## 🔧 Alle nødvendige installasjoner

Pass på at du har installert alle nødvendige programmer:

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



### Install dependencies

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


### Backend Commands

```bash
cd backend

# Restore packages/Build dependencies
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
