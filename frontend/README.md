This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Rask Oppstart

# 🚀 Prosjektoppsett

## Kjøre prosjektet med Docker

### Bygge og starte prosjektet

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

## 🌐 Tilgang til applikasjonen

Når containerne kjører kan du åpne:

### Frontend (Next.js)
- http://localhost:3000/

### Backend (Swagger)
- http://localhost:5000/swagger/index.html  

Swagger viser alle tilgjengelige API-kall.  
*(Per nå er det kun kobling mot databasen.)*

---

## 🛑 Stoppe Docker

For å stoppe containerne:

```bash
docker compose down
```

---

## 🔄 Hot Reload

Hot reload fungerer foreløpig **ikke** for frontend i Docker.

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

# 💻 Kjøre prosjektet lokalt (uten Docker)

Eksempel for **Next.js (frontend)**:

```bash
npm install
npm run build
npm run dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
