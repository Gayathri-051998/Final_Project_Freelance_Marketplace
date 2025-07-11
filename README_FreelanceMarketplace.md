# Freelance Marketplace – MERN Stack Project

A full-stack freelance marketplace application where **freelancers offer services** and **clients post jobs**, with secure payments, reviews, and contracts.

---

## Tech Stack

- **Frontend**: React.js + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Auth**: JWT Token Authentication
- **Payments**: Stripe (mocked/test mode)
- **Deployment**: Render (backend) + Netlify (frontend)

---

##  Folder Structure

```
freelance-marketplace/
├── backend/               # Node + Express + MongoDB
├── frontend/              # React + Tailwind
```

---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/freelance-marketplace.git
cd freelance-marketplace
```

---

##  Backend Setup (`/backend`)

### Step 1: Install dependencies

```bash
cd backend
npm install
```

### Step 2: Create `.env` file

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=your_jwt_secret
```

### Step 3: Start the backend

```bash
npm run dev
```

> Server will run on: `http://localhost:5000`

---

##  Frontend Setup (`/frontend`)

### Step 1: Install dependencies

```bash
cd frontend
npm install
```

### Step 2: Create `.env` file

```
VITE_API_URL=http://localhost:5000
```

### Step 3: Start the frontend

```bash
npm run dev
```

> Frontend will run on: `http://localhost:5173`

---

##  Test Login Credentials (after registration)

- Roles: `client` or `freelancer`
- You can register new users from the Register page

---

##  Features

###  Auth
- Register & login (JWT)
- Role-based (client / freelancer)

###  Freelancers
- Post/manage services
- View contracts
- Respond to reviews

### ✔️ Clients
- Post/manage jobs
- Hire freelancers
- Review contracts

### ✔️ Shared
- Contract system (job + freelancer)
- Reviews and ratings
- Notifications (basic)
- Dashboard with nav
- Protected routes

---

##  Deployment Instructions

###  Backend on Render

1. Push `backend/` folder to a GitHub repo
2. Go to [https://render.com](https://render.com)
3. New → Web Service → Connect GitHub
4. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables: `MONGO_URI`, `JWT_SECRET`
5. Deploy & get API base URL

###  Frontend on Netlify

1. Push `frontend/` to GitHub
2. Go to [https://netlify.com](https://netlify.com)
3. New site from Git → Connect your repo
4. Set:
   - Build Command: `npm run build`
   - Publish folder: `dist`
   - Environment variable: `VITE_API_URL = <your_render_api_url>`
5. Deploy & get live frontend URL

---

##  Screenshots

_(Optional: include login, dashboard, job/service forms, contract views)_

---

##  Author

- Built by Gayathri
- Submitted for Institute Project (MERN Full Stack)
