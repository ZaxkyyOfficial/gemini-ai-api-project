# 🌱 EcoSphere AI: Sustainable Productivity Assistant

EcoSphere AI adalah chatbot cerdas berbasis LLM yang dirancang untuk membantu pengguna mengadopsi gaya hidup berkelanjutan dan mengurangi jejak karbon harian mereka. Proyek ini dikembangkan sebagai Final Project untuk modul AI Productivity and AI API Integration for Developers di HACKTIV8.

## 🚀 Fitur Utama
- **Personal Carbon Tracker:** Memberikan saran praktis untuk mengurangi emisi berdasarkan aktivitas harian pengguna.
- **Creative Parameter Configuration:** Menggunakan gaya bahasa yang santai dan memotivasi agar interaksi terasa lebih akrab.
- **Smart Memory:** Chatbot mampu mengingat preferensi pengguna dalam satu sesi untuk memberikan rekomendasi yang lebih personal.
- **Eco-Knowledge Base:** Dilengkapi dengan domain pengetahuan khusus mengenai isu lingkungan dan produk ramah lingkungan.

## 🛠️ Tech Stack
- **Model AI:** Gemini 1.5 Flash via Google AI Studio API.
- **Frontend:** React (Vite) & Tailwind CSS (Professional & Elegant Glassmorphism Interface).
- **Backend:** Node.js (Express)

## 📋 Cara Menjalankan Proyek

Proyek ini terbagi menjadi dua bagian: **Backend** (untuk berinteraksi dengan Google Gemini API) dan **Frontend** (Antarmuka Pengguna). Anda perlu menjalankan keduanya agar aplikasi berfungsi penuh.

### 1. Prasyarat
- Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda.
- Siapkan API Key Gemini dari [Google AI Studio](https://aistudio.google.com/).

### 2. Konfigurasi Backend (Server API)
1. Buka folder `backend`:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `backend` berdasarkan contoh di bawah ini, dan masukkan API Key Anda:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_api_key_here
   ```
   *(Catatan: File `.env` disarankan untuk dimasukkan ke dalam `.gitignore` pada proyek Anda demi keamanan).*
4. Jalankan server backend:
   ```bash
   node server.js
   ```
   Server akan berjalan di `http://localhost:3000`. Biarkan terminal ini terbuka.

### 3. Konfigurasi Frontend (User Interface)
1. Buka terminal/cmd **baru**.
2. Masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi frontend (Vite):
   ```bash
   npm run dev
   ```
5. Akses aplikasi melalui browser dengan mengunjungi tautan lokal yang diberikan di terminal (biasanya `http://localhost:5173`).

## 👥 Target Pengguna
EcoSphere AI ditujukan bagi individu yang ingin berkontribusi pada pelestarian lingkungan, namun membutuhkan asisten produktivitas yang cerdas dan mudah diakses untuk memulai langkah kecil yang nyata.
