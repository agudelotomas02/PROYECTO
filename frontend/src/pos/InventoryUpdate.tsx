import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import RestaurantNavbar from './RestaurantNavbar';

export default function InventoryUpdate() {
  const { restauranteId } = useParams();
  const [productos, setProductos] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [busqueda, setBusqueda] = useState('');
  const [nuevo, setNuevo] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/inventory/${restauranteId}`);
      setProductos(res.data);
      const form = Object.fromEntries(res.data.map((p: any) => [p.id, { ...p }]));
      setFormValues(form);
    };
    fetch();
  }, [restauranteId]);

  const handleChange = (id: string, field: string, value: string | number) => {
    setFormValues((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleConfirmar = async (id: string) => {
    try {
      await api.put(`/inventory/${restauranteId}/${id}`, formValues[id]);
      alert('Producto actualizado');
    } catch {
      alert('Error al actualizar');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await api.delete(`/inventory/${restauranteId}/${id}`);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert('Producto eliminado');
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleCrear = async () => {
    const { id, name, price, stock, category } = nuevo;
    if (!id || !name || !price || !stock || !category) {
      return alert('Todos los campos son requeridos');
    }
    try {
      await api.post(`/inventory/${restauranteId}`, {
        id,
        name,
        price: Number(price),
        stock: Number(stock),
        category
      });
      alert('Producto creado');
      setNuevo({ id: '', name: '', price: '', stock: '', category: '' });
      const res = await api.get(`/inventory/${restauranteId}`);
      setProductos(res.data);
      const form = Object.fromEntries(res.data.map((p: any) => [p.id, { ...p }]));
      setFormValues(form);
    } catch {
      alert('Error al crear producto');
    }
  };

  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <RestaurantNavbar />
      <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
        <div style={{ flex: 2 }}>
          <h2>Actualizar productos - {restauranteId}</h2>

          <input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ marginBottom: '1rem', display: 'block' }}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><input value={formValues[p.id]?.name || ''} onChange={e => handleChange(p.id, 'name', e.target.value)} /></td>
                  <td><input type="number" value={formValues[p.id]?.price || ''} onChange={e => handleChange(p.id, 'price', Number(e.target.value))} /></td>
                  <td><input type="number" value={formValues[p.id]?.stock || ''} onChange={e => handleChange(p.id, 'stock', Number(e.target.value))} /></td>
                  <td><input value={formValues[p.id]?.category || ''} onChange={e => handleChange(p.id, 'category', e.target.value)} /></td>
                  <td>
                    <button onClick={() => handleConfirmar(p.id)}>✅</button>
                    <button onClick={() => handleEliminar(p.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Nuevo producto</h3>
          <input placeholder="ID" value={nuevo.id} onChange={(e) => setNuevo({ ...nuevo, id: e.target.value })} />
          <input placeholder="Nombre" value={nuevo.name} onChange={(e) => setNuevo({ ...nuevo, name: e.target.value })} />
          <input type="number" placeholder="Precio" value={nuevo.price} onChange={(e) => setNuevo({ ...nuevo, price: e.target.value })} />
          <input type="number" placeholder="Stock" value={nuevo.stock} onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })} />
          <input placeholder="Categoría" value={nuevo.category} onChange={(e) => setNuevo({ ...nuevo, category: e.target.value })} />
          <br />
          <button onClick={handleCrear}>Crear producto</button>
        </div>
      </div>
    </div>
  );
}


