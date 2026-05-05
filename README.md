# FreelanceFlow — Project & Invoice Manager for Freelancers

> A full-stack web application I built from scratch in 30 days while simultaneously learning Spring Boot and React.js.

**Live Demo:** [https://freelanceflow-frontend.onrender.com](https://freelanceflow-frontend-k43w.onrender.com)  
**Backend API:** [https://freelanceflow-backend.onrender.com](https://freelanceflow-latest.onrender.com)

---

## What I Built

FreelanceFlow is a project and invoice management platform built specifically for freelancers. The idea came from a very real observation — most freelancers I know manage their entire professional life across WhatsApp, sticky notes, Excel sheets, and Word documents. They forget to track hours, delay invoices because creating them manually is painful, and have no clear picture of whether their projects are actually profitable.

FreelanceFlow solves that by putting everything in one place.

A freelancer using this app can:

- Maintain a complete client directory with contact details and project history
- Create and manage projects linked to specific clients, with deadlines and budgets
- Break projects into tasks and move them across a Kanban board (Todo → In Progress → Done)
- Track billable hours using a live browser timer or manual entry
- Generate professional PDF invoices in seconds — with line items, tax calculation, and totals computed automatically
- Send invoices directly to clients by email with the PDF attached
- View a real-time analytics dashboard showing revenue, active projects, unpaid invoices, and upcoming deadlines
- Ask an AI assistant questions about their business — "which client owes me money?" or "what is my revenue this month?" — and get answers drawn from their actual data

---

## Why This Matters

Here is a real scenario this app addresses.

A freelance developer quotes a client Rs. 40,000 for a website. The project drags on with revision after revision. By the end, the developer has logged 52 hours — but quoted for 40. Without time tracking, they never noticed the scope creep happening in real time. They deliver the project, invoice for Rs. 40,000, and silently lose Rs. 12,000 worth of work.

With FreelanceFlow, the developer sees the hours ticking past the budget mid-project. They can have the conversation with the client before it is too late. Every logged session is timestamped and linked to a specific task. When the client questions the invoice, the developer opens the time log and shows exactly what was done, when, and for how long. The dispute ends there.

The app does not just manage tasks. It protects a freelancer's income.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, Bootstrap 5, Chart.js, React Hook Form |
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security, JWT (JSON Web Tokens), BCrypt |
| Database | PostgreSQL (production), MySQL (development) |
| ORM | Spring Data JPA, Hibernate |
| PDF Engine | iText7 |
| Email | SendGrid SMTP |
| AI | Groq API (LLaMA 3.1) |
| Deployment | Render (backend + database + frontend) |
| Version Control | Git, GitHub |

---

## How I Built It

### The approach

I divided the project into 30 daily targets. Each day had a specific deliverable — not just "work on authentication" but "POST /api/auth/register saves a user to MySQL and returns a JSON response." Every day ended with a Postman test that either passed or did not. No moving on until it passed.

This kept me honest. It is easy to feel like you are making progress when you are actually just reading documentation. Forcing a working deliverable every day meant I had to actually understand what I was building.

### Week 1 — Backend foundations

The first week was entirely Spring Boot. I built the three-layer architecture from scratch — Controller receives the HTTP request, passes it to the Service which contains the business logic, which calls the Repository to talk to the database. Once this pattern clicked for one entity (User), every other entity (Client, Project, Task, Invoice) was just the same pattern applied again.

Security was the hardest part of week one. Spring Security has a steep learning curve and the documentation assumes you already know what a filter chain is. The JWT implementation took me a full day to get right — the signature mismatch error I kept hitting turned out to be a single missing `@PostConstruct` annotation that meant my signing key was being rebuilt from scratch on every method call.

### Week 2 — Complex features

Week two tackled the harder backend features. The Invoice entity was the most complex data structure in the project — a parent entity (Invoice) with a child collection (InvoiceItem) managed through JPA cascade operations. Getting the `@OneToMany` relationship right, understanding `CascadeType.ALL` and `orphanRemoval`, and using BigDecimal for all financial arithmetic (never double — floating point errors on money are a real problem) were the main challenges here.

PDF generation with iText7 was genuinely satisfying. Writing Java code that produces a formatted, professional PDF document with the client's name, line items, tax breakdown, and totals — all generated in memory and streamed directly as an HTTP response — felt like real engineering.

### Week 3 — React frontend

Switching to React after two weeks of Spring Boot felt like starting a new project. The mental model is completely different. Instead of thinking about what the database needs, you think about what the user sees and what happens when they interact with it.

The Kanban board was my favourite frontend challenge. I implemented optimistic UI updates — when a user clicks the arrow to move a task, the card moves instantly in the browser, and then the API call happens in the background. If the API fails, the card snaps back. The result feels instant and responsive even on a slow connection.

The live invoice builder was the most complex form I wrote. Dynamic line items using `useFieldArray` from React Hook Form, live tax and total calculation updating as the user types, and auto-importing time logs from the selected project as pre-filled line items — all of it connected through a single controlled form.

### Week 4 — Integration, AI, and deployment

The final week connected everything together. The AI chatbot was the most interesting feature to build. The trick is not the AI call itself — that is just an HTTP request. The interesting part is building the context: fetching the user's actual data from the database, formatting it into a clear prompt, and sending it with the user's question so the AI can answer specifically about their business rather than giving generic advice.

Deploying on Render required migrating from MySQL to PostgreSQL, which turned out to be almost entirely a configuration change — swap the driver dependency, change the dialect, and Hibernate handles the rest. The case sensitivity difference between MySQL and PostgreSQL caught me once (email lookups) and required a LOWER() function in the JPQL query to fix.

---

## Features in Detail

### Secure Authentication
JWT-based stateless authentication. Passwords stored as BCrypt hashes. Every API endpoint (except register and login) requires a valid token. The JWT filter runs before every request, validates the signature using HMAC SHA-256, and rejects anything invalid with a 403.

### Client Management
Full CRUD for client records. Every query is scoped to the authenticated user — you can never accidentally see another user's clients. This data isolation is enforced at the repository layer, not the controller layer.

### Project and Task Management
Projects link to clients and carry a status (Active, Completed, On Hold), deadline, and budget. Tasks belong to projects and live on a three-column Kanban board. Status updates use optimistic UI — the board responds instantly.

### Time Tracking
A live browser timer built with `useRef` and `setInterval`. Stops cleanly when you navigate away (cleanup in `useEffect` return). Converts elapsed seconds to decimal hours on stop and pre-fills the log form. All logs are timestamped and task-linked. A JPQL SUM query aggregates total hours per project.

### Invoice Generation
Invoices support multiple line items with quantity, unit price, and computed amount. Tax is configurable per invoice. All totals are calculated server-side using BigDecimal. PDFs are generated on demand using iText7 — never stored on disk, always generated fresh and streamed as bytes. Time logs can be imported directly into the invoice builder, grouped by task, with hours as quantities.

### AI Dashboard Chatbot
A chat widget that answers questions about your business using your real data. The backend fetches all the user's projects, clients, invoices, and time logs, builds a structured context string, and sends it with the user's question to the Groq LLaMA 3.1 model. Conversation history is maintained across messages within a session.

### Analytics Dashboard
A single API call returns all dashboard data — total revenue (sum of paid invoices), active project count, unpaid invoice count, hours this month, monthly revenue for the last six months, and upcoming deadlines. Bar chart and doughnut chart built with Chart.js.

---

## Project Structure

```
FreelanceFlow/
├── freelanceFlow-backend/          Spring Boot REST API
│   └── src/main/java/com/freelanceflow/
│       ├── config/                 SecurityConfig, CORS
│       ├── controller/             7 controllers
│       ├── dto/                    Request and response DTOs
│       ├── entity/                 7 JPA entities
│       ├── entity/enums/           ProjectStatus, TaskStatus, Priority, InvoiceStatus
│       ├── repository/             Spring Data JPA repositories
│       ├── security/               JwtFilter
│       ├── service/                Business logic layer
│       └── util/                   JwtUtil
│
└── freelanceflow-frontend/         React.js SPA
    └── src/
        ├── api/                    Axios instance with interceptors
        ├── components/             Reusable UI components
        ├── context/                AuthContext
        ├── pages/                  Route-level page components
        ├── services/               API call functions per feature
        └── utils/                  Date and currency formatters
```

---

## Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+ (or MySQL 8.0)
- Maven

### Backend setup

```bash
# Clone the repository
git clone https://github.com/akanksha-2104/FreelanceFlow.git
cd FreelanceFlow/freelanceFlow-backend

# Copy the example properties file
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties

# Fill in your database credentials and other values
# then run
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. Hibernate creates all database tables automatically on first run.

### Frontend setup

```bash
cd ../freelanceflow-frontend
npm install

# Create local environment file
echo "VITE_API_URL=http://localhost:8080/api" > .env

npm run dev
```

The frontend starts on `http://localhost:5173`.

### Environment variables required

```
DATABASE_URL          PostgreSQL JDBC connection string
DATABASE_USERNAME     Database username
DATABASE_PASSWORD     Database password
JWT_SECRET            At least 32 characters
MAIL_USERNAME         Gmail or SendGrid sender email
MAIL_PASSWORD         Gmail App Password or SendGrid API key
GROQ_API_KEY          Groq API key from console.groq.com
```

---

Key endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/clients | All clients (JWT required) |
| POST | /api/projects | Create project |
| PATCH | /api/tasks/{id}/status | Move task on Kanban |
| POST | /api/time-logs | Log hours |
| POST | /api/invoices | Create invoice with line items |
| GET | /api/invoices/{id}/pdf | Download PDF |
| POST | /api/invoices/{id}/send | Email invoice to client |
| GET | /api/dashboard/summary | All dashboard KPIs |
| POST | /api/ai/chat | Ask the AI assistant |

---

## What I Learned

This section is the honest one.

**Spring Boot is opinionated and that is a feature, not a bug.** Before this project I thought frameworks were shortcuts for people who did not understand the fundamentals. I was wrong. Spring Boot's opinions — the three-layer architecture, dependency injection, convention over configuration — are not shortcuts. They are the result of a decade of collective industry experience encoded into structure. Once I stopped fighting the conventions and started following them, everything became much cleaner.

**DTOs are not optional.** I tried returning entities directly from controllers in the first two days. It took exactly one circular reference exception and one accidental password hash leak to understand why DTOs exist. The entity is the database shape. The DTO is the API contract. They are different things for good reasons.

**Security is not something you add at the end.** I tried to build features first and add JWT security later. The refactoring was painful. Building authentication first — as I ended up doing after Day 4 — means every feature is secure from the moment you write it. Security is architecture, not a feature.

**Optimistic UI updates feel like magic until you understand them.** The Kanban board was the moment React clicked for me. Understanding that you can update state immediately and sync with the server asynchronously — and revert on failure — fundamentally changed how I think about building interfaces. Users do not care about your network calls. They care about whether the thing they clicked did something.

**BigDecimal is not optional for money.** I used double for the first version of the invoice total calculation. The rounding errors were small — fractions of a rupee — but they were there. Financial software has to be exact. BigDecimal is verbose but correct. The correct solution and the convenient solution are not always the same solution.

**Debugging across a full stack is a skill in itself.** When something does not work in a full-stack application, the bug could be in the frontend JavaScript, the Axios request, the Spring Security filter, the controller, the service, the repository query, or the database. Learning to isolate which layer is the problem — starting with Postman to eliminate the frontend, then logging in the filter, then checking the query — saved me hours once I had the discipline to do it systematically.

**Reading error messages carefully is underrated.** Most of my debugging time in the first two weeks was spent Googling the error instead of reading it. The JWT signature mismatch error told me exactly what was wrong. The PostgreSQL case sensitivity error told me exactly what was wrong. The CORS error told me exactly what was wrong. Slowing down and actually reading the error message before reaching for Google would have saved me days across the project.

**Deployment is not the end, it is when the real problems start.** Everything that worked perfectly on localhost stopped working in production in at least one interesting way. SMTP ports blocked by Render. PostgreSQL case sensitivity breaking email lookup. Environment variables not loading. Render's free tier sleeping after 15 minutes. Deploying taught me more about how production systems actually work than any tutorial could have.

**Building something real is the best way to learn.** I watched more tutorials before this project than I can count. None of them stuck the way building this did. When you are debugging a real 401 error at 11pm because you actually want the app to work, you learn in a way that no classroom or course can replicate. The struggle is the learning.

---

## Future Scope

- Payment gateway integration (Razorpay) so clients can pay directly from the invoice
- Import time logs into invoices at the click of a button with hourly rate calculation
- Recurring invoice scheduler for retainer clients using Spring @Scheduled
- Native mobile app using React Native against the existing REST API
- AI-powered project cost estimator using historical time log data

---

## Acknowledgements

Built as a final year engineering project at Bajaj Institute of Technology, Wardha.

The open source libraries that made this possible: Spring Boot, React.js, iText7, Chart.js, Bootstrap, Groq, and every Stack Overflow answer that saved me at 2am.

---

*Built with curiosity, debugged with patience, deployed with relief.*
