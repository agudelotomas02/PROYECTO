import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      console.log('✅ Login success', res.data);
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);

      // 👇 Redirigir según el rol inmediatamente
      const destino = res.data.user.role === 'cliente' ? '/catalogo' : '/select-restaurant';
      navigate(destino);
    } catch (err) {
      console.error('❌ Login failed:', err);
      alert('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}
