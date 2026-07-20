# CampusShare

CampusShare is a student-focused marketplace and community platform that helps college students save money, reduce waste, and connect with verified peers on campus. Buy, sell, or rent items, find trusted PG accommodations, and share academic resources — all in one place.

## Features

- 💰 **Buy & Sell** — List and browse items at student-friendly prices instead of buying new
- ♻️ **Reuse & Recycle** — Give pre-loved books, furniture, and gadgets a second life
- 🏠 **Housing** — Find verified PG accommodations and flatmates near your campus
- 👥 **Verified Network** — Connect only with verified students from your own college
- 📚 **Academic Resources** — Share notes, textbooks, and study materials
- 🔒 **Safe Transactions** — In-app chat and verified profiles for secure dealings
- 📍 **Hyperlocal Listings** — See only what's relevant near your campus

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| Database | MySQL |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render |
| Hosting (Database) | Aiven |

## Project Structure

```
campusshare/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or higher)
- npm
- A MySQL database (local or hosted, e.g. Aiven)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/campusshare.git
cd campusshare
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
PORT=5000
```

Start the backend:

```bash
npm start
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app should now be running locally, with the frontend calling the backend API.

## Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL database host |
| `DB_USER` | MySQL database username |
| `DB_PASSWORD` | MySQL database password |
| `DB_NAME` | MySQL database name |
| `DB_PORT` | MySQL database port (default: 3306) |
| `PORT` | Port the Express server runs on |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed/local backend API |

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), auto-deployed from the `main` branch.
- **Backend** is deployed on [Render](https://render.com) as a Node web service.
- **Database** is hosted on [Aiven](https://aiven.io) (managed MySQL).

Make sure CORS on the backend is configured to allow requests from the deployed frontend URL, and that all environment variables are set in each hosting platform's dashboard (never commit `.env` files to version control).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
