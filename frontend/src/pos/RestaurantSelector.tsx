import { useNavigate } from 'react-router-dom';

const restaurants = ['embarcadero', 'puntoWok', 'puntoSandwich'];

export default function RestaurantSelector() {
  const navigate = useNavigate();

  const handleSelect = (restauranteId: string) => {

    navigate(`/inventory/${restauranteId}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Selecciona un restaurante</h2>
      <ul>
        {restaurants.map((rest) => (
          <li key={rest} style={{ marginBottom: '10px' }}>
            <button onClick={() => handleSelect(rest)}>
              {rest.charAt(0).toUpperCase() + rest.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
