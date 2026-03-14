# Webscraping Frontend

A React frontend for the Web Scraping Manager system. Allows users to register, log in, create vehicle listing scraping tasks, and track their results in real time.

---

## 🏗️ Architecture

```
webscraping-frontend (this)
        ↓ HTTP
webscraping-manager (Rails API)
        ↓
auth-service + notification-service
```

---

## 🛠️ Tech Stack

- **React** + **TypeScript** (via Vite)
- **Tailwind CSS v4** — styling
- **Axios** — HTTP requests
- **React Router** — client-side routing

---

## 📋 Requirements

- Node.js 18+
- The `webscraping-manager` API running on port 3000

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/webscraping-frontend.git
cd webscraping-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create the `.env` file:
```bash
cp .env.example .env
```

4. Fill in the environment variables in `.env`

5. Start the development server:
```bash
npm run dev
```

Access at: `http://localhost:5173`

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Webscraping Manager API URL | `http://localhost:3000` |

---

## 📱 Pages

### `/login`
Sign in with email and password. Redirects to `/tasks` on success.

### `/register`
Create a new account. Redirects to `/tasks` on success.

### `/tasks`
List all scraping tasks for the logged-in user. Create new tasks by pasting a Webmotors listing URL.

### `/tasks/:id`
View task details. Automatically refreshes every 3 seconds while the task is pending or processing.

---

## 🔄 Task Status Flow

| Status | Description |
|--------|-------------|
| `Pending` | Task created, waiting to be processed |
| `Processing` | Sidekiq is running the scraping job |
| `Completed` | Data collected successfully |
| `Failed` | Scraping failed |

---

## 🧪 How to Test

1. Start the backend with Docker:
```bash
cd webscraping-manager
docker compose up --build
```

2. Start the frontend:
```bash
npm run dev
```

3. Create an account at `/register`

4. Go to [webmotors.com.br](https://www.webmotors.com.br), open any vehicle listing and copy the URL

5. Create a new task with the copied URL

6. Watch the task status update automatically from `Pending` → `Processing` → `Completed`

---

## 🐳 Running with Docker

Add the frontend to the `docker-compose.yml` in the `webscraping-manager` repository:

```yaml
frontend:
  build: ../webscraping-frontend
  ports:
    - "5173:80"
  depends_on:
    - webscraping-manager
```

Create a `Dockerfile` in the frontend root:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```