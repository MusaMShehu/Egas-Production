import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

/**
 * /auth                → LoginPage
 * /auth?mode=register  → RegisterPage
 *
 * Keeps a stable `/auth` URL for marketing links while giving us clean components.
 */
export default function AuthGateway() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mode = params.get('mode');

  return mode === 'register' ? <RegisterPage /> : <LoginPage />;
}