import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"            options={{ headerShown: false }} />
      <Stack.Screen name="login"            options={{ headerShown: false }} />
      <Stack.Screen name="home"             options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="almacenes-lista"  options={{ headerShown: false }} />
      <Stack.Screen name="almacenes-form"   options={{ headerShown: false }} />
      <Stack.Screen name="clientes-lista"   options={{ headerShown: false }} />
      <Stack.Screen name="clientes-form"    options={{ headerShown: false }} />
      {/* Pantallas heredadas */}
      <Stack.Screen name="restaurant-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
