import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from '../auth/Login';
import RestaurantSelector from '../pos/RestaurantSelector';
import OrdersPOS from '../pos/OrdersPOS';
import InventoryPOS from '../pos/InventoryPOS';
import InventoryUpdate from '../pos/InventoryUpdate';



function CatalogPage() {
  return (
    <div>
      <h2>Client Catalog</h2>
      <p>This is where the client will browse products.</p>
    </div>
  );
}

export default function AppRoutes() {
  const [user, setUser] = useState<any>(null);
  console.log("👤 User in AppRoutes:", user);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />

        <Route
          path="/catalogo"
          element={
            user?.role === 'cliente'
              ? <CatalogPage />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/select-restaurant"
          element={
            user?.role === 'pos'
              ? <RestaurantSelector />
              : <Navigate to="/" replace />
          }
        />

        <Route
        path="/inventory/:restauranteId"
        element={
            user?.role === 'pos'
            ? <InventoryPOS />
            : <Navigate to="/" replace />
        }
        />
        
        <Route
            path="/update/:restauranteId"
            element={
                user?.role === 'pos'
                ? <InventoryUpdate />
                : <Navigate to="/" replace />
            }
        />



        <Route
          path="/orders/:restauranteId"
          element={
            user?.role === 'pos'
              ? <OrdersPOS />
              : <Navigate to="/" replace />
          }
        />

        {/* Redirección luego de login */}
        <Route
          path="*"
          element={
            user
              ? <Navigate to={user.role === 'cliente' ? '/catalogo' : '/select-restaurant'} />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
