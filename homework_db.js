require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, name, email });
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(result[0]);
    });
});

app.get('/search', (req, res) => {
    const { name } = req.query;
    const sql = 'SELECT * FROM users WHERE name LIKE ?';
    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'User deleted successfully' });
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    console.log('Received PUT request for user ID:', id);
    console.log('Data:', { name, email });

    if (!name || !email) {
        return res.status(400).send({ message: 'Name and email are required' });
    }

    const sql = 'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?';
    db.query(sql, [name, email, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User updated successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
