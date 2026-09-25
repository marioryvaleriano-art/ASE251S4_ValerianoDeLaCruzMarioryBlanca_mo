/**
 * clientes-store.ts
 * Estado global compartido para Clientes.
 * Mismo patrón que almacenes-store (sin dependencias externas).
 */

export type TipoDocumento = 'DNI' | 'RUC' | 'CE' | 'Pasaporte';
export type EstadoCliente = 'Activo' | 'Inactivo';

export interface Cliente {
  id:              string;
  tipoDocumento:   TipoDocumento;
  numeroDocum:     string;
  nombre:          string;
  apellido:        string;
  correo:          string;
  telefono:        string;
  fechaNacimiento: string;   // ISO: YYYY-MM-DD
  ubigeoId:        string;
  estado:          EstadoCliente;
}

// ─── Estado interno ───────────────────────────────────────────────────────────
let _clientes: Cliente[] = [
  {
    id:              '1',
    tipoDocumento:   'DNI',
    numeroDocum:     '12345678',
    nombre:          'Ana',
    apellido:        'Ramírez',
    correo:          'ana.ramirez@email.com',
    telefono:        '987654321',
    fechaNacimiento: '1992-04-15',
    ubigeoId:        '150101',
    estado:          'Activo',
  },
  {
    id:              '2',
    tipoDocumento:   'RUC',
    numeroDocum:     '20512345678',
    nombre:          'Distribuidora',
    apellido:        'Norte SAC',
    correo:          'ventas@norte.com',
    telefono:        '012345678',
    fechaNacimiento: '2000-01-01',
    ubigeoId:        '150201',
    estado:          'Activo',
  },
  {
    id:              '3',
    tipoDocumento:   'DNI',
    numeroDocum:     '87654321',
    nombre:          'Luis',
    apellido:        'Torres',
    correo:          'luis.torres@email.com',
    telefono:        '956781234',
    fechaNacimiento: '1985-11-30',
    ubigeoId:        '150301',
    estado:          'Inactivo',
  },
];

type Listener = () => void;
const _listeners = new Set<Listener>();

// ─── API pública ──────────────────────────────────────────────────────────────

export function getClientes(): Cliente[] {
  return [..._clientes];
}

export function subscribe(fn: Listener): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn());
}

function _newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function addCliente(data: Omit<Cliente, 'id'>): Cliente {
  const nuevo: Cliente = { ...data, id: _newId() };
  _clientes = [..._clientes, nuevo];
  _notify();
  return nuevo;
}

export function updateCliente(id: string, data: Partial<Omit<Cliente, 'id'>>): void {
  _clientes = _clientes.map((c) => (c.id === id ? { ...c, ...data } : c));
  _notify();
}

export function deleteCliente(id: string): void {
  _clientes = _clientes.filter((c) => c.id !== id);
  _notify();
}
