# 💊 Med-trak(A Full Stack Medication Adherence and Effectiveness Tracker App)

A full-stack web application to help users **track medications, adherence, and effectiveness** with real-time insights.

---

## 🚀 Features

### 🔐 Authentication

* Secure user login/signup using Supabase Auth
* Session-based authentication (JWT)
* Each user has isolated data

---

### 💊 Medication Management

* Add, update, delete medications
* Track dosage, frequency, and notes
* Organized medication list per user

---

### ⏱️ Adherence Tracking

* Log medication intake (taken / skipped / late)
* View adherence history
* Summary insights (adherence percentage)

---

### 📊 Effectiveness Tracking

* Rate medication effectiveness (1–10)
* Track symptoms and side effects
* Weekly trend analysis

---

### 📈 Dashboard

* Overview of medications
* Adherence statistics
* Effectiveness trends (charts)

---

### 🎨 UI/UX

* Responsive design
* Clean modern interface
* Built with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios (API calls)
* Tailwind CSS (styling)
* Recharts (charts)

### Backend

* Node.js
* Express.js
* Supabase (Database + Auth)

### Database

* PostgreSQL (via Supabase)

---

## 🧠 Architecture

Client → Express API → Supabase Database

* Frontend communicates with backend via REST APIs
* Backend verifies JWT tokens from Supabase
* All data operations are performed using Supabase client

---

## 📂 Project Structure

medication-tracker/

client/ → React frontend
server/ → Express backend
.env → environment variables (not included in repo)

---

## ⚙️ Setup Instructions

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/med-trak.git
cd med-trak
```

---

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

### 3. Setup Supabase

1. Go to https://supabase.com
2. Create a new project
3. Get:

   * Project URL
   * Service Role Key

---

### 4. Create `.env` file (server)

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
PORT=5000
```

---

### 5. Create Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
CREATE TABLE medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  start_date date,
  end_date date,
  notes text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE adherence_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  medication_id uuid REFERENCES medications(id),
  status text,
  taken_at timestamp DEFAULT now(),
  notes text
);

CREATE TABLE effectiveness_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  medication_id uuid REFERENCES medications(id),
  rating int,
  symptoms text,
  side_effects text,
  notes text,
  logged_at timestamp DEFAULT now()
);
```

---

### 6. Enable Row Level Security (IMPORTANT)

```sql
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE effectiveness_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User access"
ON medications
FOR ALL USING (auth.uid() = user_id);
```

---

### 7. Run the application

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

### 8. Open in browser

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Frontend

* Deploy on Vercel

### Backend

* Deploy on Render / Railway

### Database

* Hosted on Supabase

---

## 🔐 Security Notes

* `.env` file is excluded from GitHub
* Service role key should NEVER be exposed publicly
* Authentication handled securely via Supabase

---

## 📌 Future Improvements

* Notifications/reminders
* AI-based insights
* Export reports (PDF)
* Mobile responsiveness improvements

---

## 👨‍💻 Author

Developed by **Yashwa D**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
