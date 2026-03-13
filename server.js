const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Koneksi Database
const db = mysql.createConnection({
    host: '34.135.19.199',
    user: 'admin',      
    password: '123230119',      
    database: 'notes_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// --- API ROUTES ---

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
    const { judul, isi } = req.body;
    const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    db.query(sql, [judul, isi], (err, result) => {
        if (err) return res.status(500).send(err);
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

app.listen(3000, () => console.log('Server running on http://localhost:3000'));