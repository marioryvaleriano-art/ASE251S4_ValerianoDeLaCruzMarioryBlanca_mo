/**
 * almacenes-store.ts
 * Estado global compartido para los almacenes.
 * Usa un patrón de suscriptores simple (sin dependencias externas).
 */

export interface Almacen {
  id: string;
  codigoAlmacen: string;
  nombre: string;
  ubicacion: string;
  responsable: string;
  telefono: string;
  tipoProducto: string;
  cantidadBotellas: number;
  estado: 'Activo' | 'Inactivo';
  ubigeoId: string;
}

// ─── Estado interno ───────────────────────────────────────────────────────────
let _almacenes: Almacen[] = [
  {
    id: '1',
    codigoAlmacen: 'VB-0001',
    nombre: 'Almacén Central Norte',
    ubicacion: 'Sector A, Nave 1, Bodega Principal',
    responsable: 'Carlos Mendoza',
    telefono: '987654321',
    tipoProducto: 'Vinos',
    cantidadBotellas: 1200,
    estado: 'Activo',
    ubigeoId: '150501',
  },
  {
    id: '2',
    codigoAlmacen: 'VB-0002',
    nombre: 'Depósito Sur Licores',
    ubicacion: 'Sector B, Almacén 3',
    responsable: 'María García',
    telefono: '956123456',
    tipoProducto: 'Licores',
    cantidadBotellas: 840,
    estado: 'Activo',
    ubigeoId: '150102',
  },
  {
    id: '3',
    codigoAlmacen: 'VB-0003',
    nombre: 'Bodega Temporada',
    ubicacion: 'Exterior, Patio Sur',
    responsable: 'Luis Torres',
    telefono: '912345678',
    tipoProducto: 'Cervezas',
    cantidadBotellas: 300,
    estado: 'Inactivo',
    ubigeoId: '150301',
  },
];

type Listener = () => void;
const _listeners = new Set<Listener>();

// ─── API pública ──────────────────────────────────────────────────────────────

/** Devuelve la copia actual del array (inmutable desde fuera). */
export function getAlmacenes(): Almacen[] {
  return [..._almacenes];
}

/** Suscribe una función que se llama cada vez que cambia el estado. */
export function subscribe(fn: Listener): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn());
}

/** Genera un ID único simple. */
function _newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Genera código VB-XXXX único. */
function _genCodigo(): string {
  const nums = _almacenes.map((a) => {
    const m = a.codigoAlmacen.match(/VB-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `VB-${String(max + 1).padStart(4, '0')}`;
}

/** Agrega un nuevo almacén y devuelve el objeto creado. */
export function addAlmacen(
  data: Omit<Almacen, 'id' | 'codigoAlmacen'>
): Almacen {
  const nuevo: Almacen = {
    ...data,
    id: _newId(),
    codigoAlmacen: _genCodigo(),
  };
  _almacenes = [..._almacenes, nuevo];
  _notify();
  return nuevo;
}

/** Edita un almacén existente por id. */
export function updateAlmacen(
  id: string,
  data: Partial<Omit<Almacen, 'id'>>
): void {
  _almacenes = _almacenes.map((a) =>
    a.id === id ? { ...a, ...data } : a
  );
  _notify();
}

/** Elimina un almacén por id. */
export function deleteAlmacen(id: string): void {
  _almacenes = _almacenes.filter((a) => a.id !== id);
  _notify();
}
