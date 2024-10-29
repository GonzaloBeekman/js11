// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'Score'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para guardar el puntaje
app.post('/api/score', (req, res) => {
    const { tiempo, puntos, fecha, nombre } = req.body;
    const sql = 'INSERT INTO score (tiempo, puntos, fecha, nombre) VALUES (?, ?, ?, ?)';
    db.query(sql, [tiempo, puntos, fecha, nombre], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Puntaje guardado correctamente');
    });
});

// Ruta para obtener la tabla de posiciones
app.get('/api/score', (req, res) => {
    const sql = 'SELECT * FROM score ORDER BY puntos DESC LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
