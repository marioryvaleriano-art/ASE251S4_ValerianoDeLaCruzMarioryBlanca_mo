/**
 * index.tsx — Punto de entrada
 * Redirige automáticamente a la pantalla de Login (pantalla 1 de 3).
 */
import { Redirect } from 'expo-router';

export default function Root() {
  return <Redirect href="/login" />;
}
