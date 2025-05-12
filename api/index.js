const express = require('express');
const { router: inventoryRoutes } = require('../routes/inventoryRoutes');
const { router: cartsRoutes } = require('../routes/cartsRoutes');
const { router: pedidosRoutes } = require('../routes/pedidosRoutes');
const authRoutes = require('../routes/authRoutes');
const { createServer } = require('@vercel/node');

const app = express();

app.use(express.json());
app.use('/api', inventoryRoutes);
app.use('/api', cartsRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', authRoutes);

// Exporta como handler de Vercel
module.exports = app;
