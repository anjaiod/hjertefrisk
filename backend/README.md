## 🗄️ Database Setup

### 📦 Last ned dependencies

Kjør følgende kommandoer i terminalen:

```bash
cd backend
dotnet restore
dotnet tool install --global dotnet-ef
```

---

## 🔄 Dersom du puller fra Git

Hvis du har hentet nye endringer fra Git, kjør:

```bash
docker compose down
docker compose up --build
dotnet ef database update
```

Dette vil:
- stoppe eksisterende Docker-containere
- bygge prosjektet på nytt
- oppdatere databasen med siste migrasjoner

---

## 🔌 Koble til databasen med pgAdmin

1. Åpne **pgAdmin**
2. Høyreklikk på **Servers**
3. Velg **Register → Server**

### General

- **Name:** `hjertefrisk`  
  *(du kan kalle den hva du vil)*

### Connection

Fyll inn følgende informasjon:

| Field | Value |
|------|------|
| Hostname / Address | `localhost` |
| Port | `5434` |
| Maintenance database | `hjertefriskdb` |
| Username | `hjertefriskuser` |
| Password | `hjertepass3421` |

✔ Huk av **Save password**

Trykk **Save** nede i høyre hjørne.

---

## 🎥 Video: pgAdmin + Docker

Hvis du trenger hjelp med å koble pgAdmin til databasen, se videoen under  
(se fra **4:30 til 5:15**):

[Run Postgres in a Docker Container (Easiest PostgreSQL Setup)](https://www.youtube.com/watch?v=GpqJzH4nVnY)

---

## ➕ Legge til noe i databasen (EF Core Migrations)

Opprett en ny migrasjon:

```bash
dotnet ef migrations add NavnPåMigrasjonen
```

Eksempel:

```bash
dotnet ef migrations add AddedPatientTable
```

Oppdater databasen:

```bash
dotnet ef database update
```
