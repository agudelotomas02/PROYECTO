import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import RestaurantNavbar from './RestaurantNavbar';

export default function InventoryPOS() {
  const { restauranteId } = useParams();
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{ [id: string]: number }>({});
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/inventory/${restauranteId}`);
      setProductos(res.data);
    };
    fetch();
  }, [restauranteId]);

  const agregar = (id: string) => {
    setCarrito((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const quitar = (id: string) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (nuevo[id] > 1) nuevo[id]--;
      else delete nuevo[id];
      return nuevo;
    });
  };

  const vender = async () => {
    for (const id in carrito) {
      await api.put(`/inventory/${restauranteId}/${id}`, {
        stock: productos.find(p => p.id === id).stock - carrito[id]
      });
    }
    alert('Venta realizada');
    setCarrito({});
    const res = await api.get(`/inventory/${restauranteId}`);
    setProductos(res.data);
  };

  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(filtro.toLowerCase())
  );

  const total = Object.entries(carrito).reduce((sum, [id, cant]) => {
    const producto = productos.find(p => p.id === id);
    return sum + (producto ? producto.price * cant : 0);
  }, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <RestaurantNavbar />

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button className="bg-blue-900 text-white px-4 py-2 rounded">Inventario</button>
            <button className="bg-gray-300 px-4 py-2 rounded">Actualizar</button>
            <button className="bg-gray-300 px-4 py-2 rounded">Pedidos</button>
          </div>
          <input
            className="border px-4 py-2 rounded w-1/3"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white border shadow-md rounded-lg p-4">
              <div className="bg-blue-900 text-white p-2 rounded-t font-semibold">{p.name}</div>
              <div className="bg-gray-300 text-right text-sm p-1">{p.id}</div>

              <div className="mt-2 flex items-center justify-between">
                <span className="bg-blue-800 text-white rounded px-2 py-1">{p.stock}</span>
                <div className="flex items-center gap-2">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => quitar(p.id)}>-</button>
                  <span>{carrito[p.id] || 0}</span>
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => agregar(p.id)}>+</button>
                </div>
              </div>

              <p className="mt-2 text-center font-bold">${p.price.toLocaleString()}</p>
              <button className="bg-green-400 w-full py-1 mt-2 rounded font-bold">🛒</button>
            </div>
          ))}
        </div>

        {/* CARRITO */}
        {Object.keys(carrito).length > 0 && (
          <div className="fixed right-0 top-24 w-1/4 bg-white p-4 border-l shadow-md">
            <h3 className="font-bold mb-2">Carrito</h3>
            <ul className="space-y-2">
              {Object.entries(carrito).map(([id, cantidad]) => {
                const prod = productos.find(p => p.id === id);
                return prod ? (
                  <li key={id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{prod.name}</span>
                    <span className="bg-blue-900 text-white px-2 py-1 rounded">{cantidad}</span>
                  </li>
                ) : null;
              })}
            </ul>
            <div className="flex justify-between items-center mt-4 font-bold text-lg">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <button
              onClick={vender}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
            >
              Vender
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


