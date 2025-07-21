const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// Configurando conexão com banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.static('public')); // colocar o HTML em uma pasta "public"
app.use(express.json());

// Rota para registrar dados
app.post('/registrar', async (req, res) => {
  const { nome, materiais, motivo } = req.body;
  const dataHora = new Date();

  try {
    await pool.query(
      'INSERT INTO registros (nome, materiais, motivo, data_hora) VALUES ($1, $2, $3, $4)',
      [nome, materiais, motivo, dataHora]
    );
    res.status(200).send('Registrado com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir:', err);
    res.status(500).send('Erro ao salvar registro');
  }
});

app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY data_hora DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar registros:', err);
    res.status(500).send('Erro ao buscar registros');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
