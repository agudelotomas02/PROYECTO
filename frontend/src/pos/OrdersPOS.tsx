import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import RestaurantNavbar from './RestaurantNavbar';

type Pedido = {
  usuario: string;
  estado: 'creado' | 'preparando' | 'listo';
  productos: {
    [productoId: string]: {
      cantidad: number;
      total: number;
    };
  };
};

export default function OrdersPOS() {
  const { restauranteId } = useParams();
  const [pedidos, setPedidos] = useState<{ [id: string]: Pedido }>({});
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarPedidos = async () => {
    try {
      const res = await api.get(`/orders/restaurante/${restauranteId}`);
      setPedidos(res.data);
    } catch (err) {
      console.error('❌ Error al cargar pedidos', err);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [restauranteId]);

  const cambiarEstado = async (id: string, nuevoEstado: Pedido['estado']) => {
    try {
      await api.put(`/orders/${restauranteId}/${id}`, { estado: nuevoEstado });
      setPedidos((prev) => ({
        ...prev,
        [id]: { ...prev[id], estado: nuevoEstado }
      }));
      setSeleccionado(null);
    } catch (err) {
      console.error('❌ Error al cambiar estado', err);
    }
  };

  const pedidosFiltrados = Object.entries(pedidos)
    .filter(([id]) => id.toLowerCase().includes(busqueda.toLowerCase()))
    .map(([id, data]) => ({ id, ...data }));

  const porEstado = (estado: Pedido['estado']) =>
    pedidosFiltrados.filter(p => p.estado === estado);

  const renderColumna = (estado: Pedido['estado'], titulo: string, accion?: {
    label: string;
    next: Pedido['estado'];
  }) => (
    <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
      <h3>{titulo}</h3>
      {porEstado(estado).length === 0 ? (
        <p>Vacío</p>
      ) : (
        porEstado(estado).map(p => (
          <div
            key={p.id}
            onClick={() => setSeleccionado(p.id)}
            style={{
              border: seleccionado === p.id ? '2px solid blue' : '1px solid #aaa',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              cursor: 'pointer',
              background: seleccionado === p.id ? '#e0f0ff' : 'white'
            }}
          >
            <strong>{p.id}</strong>
            <ul>
              {Object.entries(p.productos).map(([pid, det]) => (
                <li key={pid}>
                  {pid} × {det.cantidad} = ${det.total}
                </li>
              ))}
            </ul>
            {accion && seleccionado === p.id && (
              <button onClick={() => cambiarEstado(p.id, accion.next)}>
                {accion.label}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <RestaurantNavbar />

      <div style={{ padding: '1rem' }}>
        <h2>Pedidos - {restauranteId}</h2>

        <input
          placeholder="Buscar pedido por ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ marginBottom: '1rem', display: 'block' }}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          {renderColumna('creado', 'Creados', { label: 'Preparar', next: 'preparando' })}
          {renderColumna('preparando', 'Preparando', { label: 'Terminar', next: 'listo' })}
          {renderColumna('listo', 'Listos')}
        </div>
      </div>
    </div>
  );
}
