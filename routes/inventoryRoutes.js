const express = require('express');
const router = express.Router();

const inventario = [
  { id: 'prod1', nombre: 'Hamburguesa', ubicacion: 'Embarcadero' },
  { id: 'prod2', nombre: 'Pizza', ubicacion: 'Punto Sandwich' },
  { id: 'prod3', nombre: 'Wok de Pollo', ubicacion: 'Punto Wok' }
];

// GET: devuelve todos o filtra
router.get('/inventory', (req, res) => {
  const filtro = req.query.filter;

  if (typeof filtro === 'string' && filtro.trim() !== '') {
    const resultado = inventario.filter(p =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    return res.json(resultado);
  }

  res.json(inventario);
});

// POST: agrega nuevo producto
router.post('/inventory', (req, res) => {
  const { id, nombre, ubicacion } = req.body;

  if (!id || !nombre || !ubicacion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  inventario.push({ id, nombre, ubicacion });

  res.status(201).json({
    mensaje: 'Producto registrado',
    producto: { id, nombre, ubicacion }
  });
});

module.exports = router;


// PUT /api/inventory/:id - actualizar producto
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;

  const producto = inventario.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (nombre) producto.nombre = nombre;
  if (ubicacion) producto.ubicacion = ubicacion;

  res.json({ mensaje: 'Producto actualizado', producto });
});


// DELETE /api/inventory/:id - eliminar producto
router.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;

  const index = inventario.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const eliminado = inventario.splice(index, 1);

  res.json({ mensaje: 'Producto eliminado', eliminado });
});