require('dotenv').config(); // 👈 ISSO É FUNDAMENTAL!

const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configurando conexão com banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 👈 isso é necessário no Render + Neon
  }
});

app.use(express.static('public'));
app.use(express.json());

// Rota para registrar dados
app.post('/registrar', async (req, res) => {
  console.log('📨 Dados recebidos:', req.body); // debug
  const { nome, materiais, motivo } = req.body;
  const dataHora = new Date();

  try {
    await pool.query(
      'INSERT INTO registros (nome, materiais, motivo, data_hora) VALUES ($1, $2, $3, $4)',
      [nome, materiais, motivo, dataHora]
    );
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('💥 Erro ao inserir:', err);
    res.status(500).json({ erro: 'Erro ao salvar registro' });
  }
});

// Rota para buscar registros
app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY data_hora DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('💥 Erro ao buscar registros:', err);
    res.status(500).json({ erro: 'Erro ao buscar registros' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
