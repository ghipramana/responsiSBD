import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api.js'; // Pastikan file api.js ada di folder routes

// 1. Inisialisasi
dotenv.config();
const app = express();

// 2. Middleware
app.use(cors()); // Supaya API bisa diakses dari mana saja
app.use(express.json()); // Supaya bisa baca data JSON dari body request

// 3. Jembatan Utama API
// Semua rute (authors, categories, reports) sekarang lewat sini
app.use('/api', apiRoutes); 

// 4. Rute Tes (Buka http://localhost:3000 di browser)
app.get('/', (req, res) => {
    res.send('✅ Smart Library API is Running...!');
});

// 5. Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server nyala di http://localhost:${PORT}`);
    console.log(`📊 Cek Laporan di http://localhost:3000/api/reports/stats`);
});