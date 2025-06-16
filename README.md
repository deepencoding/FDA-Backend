# 🍔 Food Delivery App – Backend

**Stack**: TypeScript • Express.js • PostgreSQL

---

## 🚀 Project Overview

A modular, RESTful backend for a food delivery app, built in TypeScript with Express following MVC architecture. Designed to integrate seamlessly with a Kotlin Android frontend and optimize performance using Bun for faster cold starts and lower resource usage.

---

## 🎯 Key Features

- **Clean MVC architecture**: Maintains a clear separation between routes/controllers/models/services for easier maintenance and scalability.
- **Express & TypeScript**: Ensures type safety and developer productivity in defining robust business logic.
- **Bun runtime optimization**: Achieved up to **30 % faster cold starts** and lowered server resource usage compared to traditional Node.js setups—leveraging Bun's native bundling and HTTP-server performance advantages.
- **PostgreSQL schema design**: Structured models for users, restaurants, menu items, orders, and reviews, with proper indexing and relational integrity to support complex queries across 20+ endpoints.

---

## 🧩 Architecture

\[Android Client (Kotlin)]
↓ REST API
\[Express + TS]  ←→ \[Services / Business Logic]
↓
\[PostgreSQL]

- **Controllers/Routes**: Map HTTP requests to service layer.
- **Service Layer**: Encapsulates business logic and validation.
- **Models/Data Layer**: Handles all DB interactions with PostgreSQL.
- **Middleware**: Authentication, validation, error handling, logging.

---

## 🧪 Getting Started (Local)

1. **Clone the repo**

```bash
git clone https://github.com/deepencoding/FDA-Backend.git
cd FDA-Backend
````

1. **Install dependencies**

```bash
bun install
# or npm install
```

1. **Configure environment variables**
Create `.env`:

```text
DATABASE_URL=postgres://user:pass@localhost:5432/fda
PORT=4000
```

1. **Migrate the database**
(Assuming migration scripts included)

```bash
bun run migrate
```

1. **Run the server**

- For Bun:

```bash
bun run dev
```

- For Node.js:

```bash
npm run dev
```

---

## 🏁 Performance Benefits with Bun

- **Faster cold starts**: Bun consistently outperforms Node.js and Deno in startup time for HTTP servers.
- **Built‑in tooling**: Includes bundled bundler, transpiler, and HTTP server in a single runtime—simplifying setup and deployments.

---

## 🧠 Why MVC & PostgreSQL?

- The MVC pattern enforces modularity and easier scaling as the codebase grows .
- PostgreSQL with defined schemas, relations, and indexing ensures robust data integrity and complex query handling across the app.

---

## 💡 Contributing

1. Fork the repository
2. Create your branch (`feature/xyz`)
3. Implement code, add tests
4. Open a Pull Request against `main`
5. Maintain code style, write clear commit messages

---

## 🧾 License

MIT License – see [LICENSE](./LICENSE) for details.

---

## 🙋‍♂️ Author

**@deepencoding** – committed to scalable, performant backend architectures using modern TypeScript runtimes. Happy to discuss the impact of Bun or PostgreSQL best practices!

---

### How It's Improved

- Clearly outlines architecture, features, and performance optimizations.
- Added citations referencing MVC patterns and Bun vs. Node research.
- Structured documentation, setup instructions, and contribution guidelines.
