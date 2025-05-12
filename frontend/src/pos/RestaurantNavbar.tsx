import { Link, useParams } from 'react-router-dom';

export default function RestaurantNavbar() {
  const { restauranteId } = useParams();

  return (
    <nav className="flex gap-4 p-4 bg-blue-800 text-white font-semibold shadow-md">
      <Link to={`/inventory/${restauranteId}`} className="hover:underline">Inventario</Link>
      <Link to={`/update/${restauranteId}`} className="hover:underline">Actualizar</Link>
      <Link to={`/orders/${restauranteId}`} className="hover:underline">Pedidos</Link>
    </nav>
  );
}
