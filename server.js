const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Basic request logging for easier debugging
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Payload:', req.body);
    }
    next();
});

// Koneksi Database
const db = mysql.createConnection({
    host: '34.172.113.167',
    user: 'admin',      
    password: 'mypassword',      
    database: 'notes_123230119'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return; // keep process alive so Cloud Run can show logs; handle errors per-request
    }
    console.log('MySQL Connected');
});


// 1. Ambil semua catatan
app.get('/api/notes', (req, res) => {
    const sql = 'SELECT * FROM notes ORDER BY tanggal_dibuat DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Tambah catatan baru
app.post('/api/notes', (req, res) => {
    const { judul, isi } = req.body || {};
    if (!judul || !isi) {
        return res.status(400).json({ error: 'judul dan isi wajib diisi ' });
    }
    const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    db.query(sql, [judul, isi], (err, result) => {
        if (err) {
            console.error('DB insert error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ id: result.insertId, judul, isi });
    });
});

// 3. Edit catatan
app.put('/api/notes/:id', (req, res) => {
    const { judul, isi } = req.body;
    const sql = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';
    db.query(sql, [judul, isi, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Note updated' });
    });
});

// 4. Hapus catatan
app.delete('/api/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Note deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});