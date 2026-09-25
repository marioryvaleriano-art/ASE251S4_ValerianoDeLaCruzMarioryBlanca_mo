/**
 * Clientes — Lista
 * Tarjetas apiladas, buscador, stats, eliminar con Alert.
 * Se recarga con useFocusEffect igual que almacenes.
 */
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Cliente,
  deleteCliente,
  getClientes,
} from '@/store/clientes-store';
import { Brand, Neutral, Radius, Shadow, Spacing, Status } from '@/constants/theme';

// Colores de tipo de documento
const DOC_COLOR: Record<string, string> = {
  DNI:       '#2563EB',
  RUC:       '#059669',
  CE:        '#7C3AED',
  Pasaporte: '#B45309',
};

export default function ClientesListaScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useFocusEffect(
    useCallback(() => {
      setClientes(getClientes());
    }, [])
  );

  const filtrados = clientes.filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.numeroDocum.includes(q) ||
      c.correo.toLowerCase().includes(q)
    );
  });

  const totalActivos   = clientes.filter((c) => c.estado === 'Activo').length;
  const totalInactivos = clientes.filter((c) => c.estado === 'Inactivo').length;

  function handleEliminar(id: string, nombre: string, apellido: string) {
    Alert.alert(
      'Eliminar Cliente',
      `¿Estás seguro de eliminar a "${nombre} ${apellido}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteCliente(id);
            setClientes(getClientes());
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={st.safe} edges={['top']}>

      {/* Top Bar */}
      <View style={st.topBar}>
        <Pressable
          style={({ pressed }) => [st.backBtn, pressed && st.pressed]}
          onPress={() => router.back()}>
          <Text style={st.backIcon}>‹</Text>
        </Pressable>
        <View style={st.topCenter}>
          <Text style={st.topTitle}>Clientes</Text>
          <Text style={st.topSub}>Bodega Peirano</Text>
        </View>
        <Pressable
          style={({ pressed }) => [st.newBtn, pressed && st.pressed]}
          onPress={() => router.push('/clientes-form')}>
          <Text style={st.newBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>

      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

        {/* Breadcrumb */}
        <View style={st.breadcrumb}>
          <Text style={st.bcText}>ADMIN</Text>
          <Text style={st.bcSep}> › </Text>
          <Text style={st.bcCurrent}>CLIENTES</Text>
        </View>

        {/* Encabezado */}
        <View style={st.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={st.pageTitle}>Gestión de Clientes</Text>
            <Text style={st.pageSubtitle}>
              Administre los clientes registrados, sus documentos y datos de contacto.
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [st.newBtnLarge, pressed && st.pressed]}
            onPress={() => router.push('/clientes-form')}>
            <Text style={st.newBtnLargeText}>+ Nuevo Cliente</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={st.statsRow}>
          <View style={[st.statCard, { borderLeftColor: '#7C3AED' }]}>
            <Text style={st.statValue}>{clientes.length}</Text>
            <Text style={st.statLabel}>Total Clientes</Text>
          </View>
          <View style={[st.statCard, { borderLeftColor: Status.success }]}>
            <Text style={st.statValue}>{totalActivos}</Text>
            <Text style={st.statLabel}>Activos</Text>
          </View>
          <View style={[st.statCard, { borderLeftColor: Status.error }]}>
            <Text style={st.statValue}>{totalInactivos}</Text>
            <Text style={st.statLabel}>Inactivos</Text>
          </View>
        </View>

        {/* Buscador */}
        <View style={st.searchWrapper}>
          <Text style={st.searchIcon}>🔍</Text>
          <TextInput
            style={st.searchInput}
            placeholder="Buscar por nombre, documento o correo..."
            placeholderTextColor={Neutral.placeholder}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda('')}>
              <Text style={st.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Lista */}
        <View style={st.listSection}>
          <View style={st.listHeader}>
            <Text style={st.listTitle}>Listado de Clientes</Text>
            <Text style={st.listCount}>{filtrados.length} de {clientes.length}</Text>
          </View>

          {filtrados.length === 0 ? (
            <View style={st.empty}>
              <Text style={st.emptyIcon}>👥</Text>
              <Text style={st.emptyText}>
                {busqueda
                  ? 'No se encontraron clientes con ese criterio.'
                  : 'No hay clientes registrados. Toca "+ Nuevo Cliente" para agregar uno.'}
              </Text>
            </View>
          ) : (
            filtrados.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                onEditar={() =>
                  router.push({
                    pathname: '/clientes-form',
                    params: { id: cliente.id, data: JSON.stringify(cliente) },
                  })
                }
                onEliminar={() =>
                  handleEliminar(cliente.id, cliente.nombre, cliente.apellido)
                }
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Tarjeta de cliente ───────────────────────────────────────────────────────
function ClienteCard({
  cliente,
  onEditar,
  onEliminar,
}: {
  cliente: Cliente;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const isActivo  = cliente.estado === 'Activo';
  const docColor  = DOC_COLOR[cliente.tipoDocumento] ?? Brand.primary;

  // Formatea fecha YYYY-MM-DD → DD/MM/YYYY
  function fmtFecha(iso: string) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  return (
    <View style={cd.card}>
      {/* Header */}
      <View style={cd.header}>
        {/* Avatar con iniciales */}
        <View style={[cd.avatar, { backgroundColor: docColor + '22' }]}>
          <Text style={[cd.avatarText, { color: docColor }]}>
            {cliente.nombre.charAt(0).toUpperCase()}{cliente.apellido.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={cd.headerInfo}>
          <Text style={cd.nombre}>{cliente.nombre} {cliente.apellido}</Text>
          <View style={cd.docRow}>
            <View style={[cd.docBadge, { backgroundColor: docColor + '18', borderColor: docColor + '55' }]}>
              <Text style={[cd.docBadgeText, { color: docColor }]}>{cliente.tipoDocumento}</Text>
            </View>
            <Text style={cd.docNum}>{cliente.numeroDocum}</Text>
          </View>
        </View>

        <View style={[cd.estadoBadge, isActivo ? cd.badgeActivo : cd.badgeInactivo]}>
          <Text style={[cd.estadoText, isActivo ? cd.estadoActivoText : cd.estadoInactivoText]}>
            {cliente.estado}
          </Text>
        </View>
      </View>

      {/* Campos */}
      <View style={cd.fields}>
        <FieldRow icon="✉️" label="Correo"      value={cliente.correo} />
        <FieldRow icon="📞" label="Teléfono"    value={cliente.telefono} />
        <FieldRow icon="🎂" label="Nacimiento"  value={fmtFecha(cliente.fechaNacimiento)} />
        <FieldRow icon="📌" label="Ubigeo"      value={cliente.ubigeoId} />
      </View>

      {/* Acciones */}
      <View style={cd.actions}>
        <Pressable
          style={({ pressed }) => [cd.btnEdit, pressed && cd.pressed]}
          onPress={onEditar}>
          <Text style={cd.btnEditText}>✏️  Editar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [cd.btnDel, pressed && cd.pressed]}
          onPress={onEliminar}>
          <Text style={cd.btnDelText}>🗑  Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={cd.row}>
      <Text style={cd.rowIcon}>{icon}</Text>
      <Text style={cd.rowLabel}>{label}:</Text>
      <Text style={cd.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

// ─── Estilos pantalla ─────────────────────────────────────────────────────────
const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Neutral.bg },
  scroll: { flex: 1 },
  pressed: { opacity: 0.75 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm, ...Shadow.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon:  { color: Neutral.white, fontSize: 26, fontWeight: '300', lineHeight: 28 },
  topCenter: { flex: 1 },
  topTitle:  { color: Neutral.white, fontWeight: '800', fontSize: 17 },
  topSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  newBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 4, paddingVertical: 6,
  },
  newBtnText: { color: Neutral.white, fontWeight: '700', fontSize: 13 },

  breadcrumb: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  bcText:     { fontSize: 11, color: Neutral.textSecondary, fontWeight: '600' },
  bcSep:      { fontSize: 11, color: Neutral.textMuted },
  bcCurrent:  { fontSize: 11, color: '#7C3AED', fontWeight: '700' },

  pageHeader: {
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm, gap: Spacing.sm,
  },
  pageTitle:    { fontSize: 20, fontWeight: '800', color: Neutral.text },
  pageSubtitle: { fontSize: 13, color: Neutral.textSecondary, marginTop: 2, lineHeight: 18 },
  newBtnLarge: {
    backgroundColor: '#7C3AED', borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4, alignItems: 'center', ...Shadow.sm,
  },
  newBtnLargeText: { color: Neutral.white, fontWeight: '800', fontSize: 15 },

  statsRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.md,
    gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1, backgroundColor: Neutral.card, borderRadius: Radius.md,
    borderLeftWidth: 4, padding: Spacing.sm + 2, alignItems: 'center', ...Shadow.sm,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: Neutral.text },
  statLabel: { fontSize: 10, color: Neutral.textSecondary, textAlign: 'center', marginTop: 2 },

  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Neutral.card, borderWidth: 1, borderColor: Neutral.border,
    borderRadius: Radius.md, marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm + 4, height: 48, gap: Spacing.sm, ...Shadow.sm,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Neutral.text },
  clearSearch: { fontSize: 14, color: Neutral.textMuted, padding: 4 },

  listSection: { paddingHorizontal: Spacing.md },
  listHeader:  {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.sm,
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: Neutral.text },
  listCount: { fontSize: 12, color: Neutral.textSecondary },

  empty:     { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 14, color: Neutral.textSecondary,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: 20,
  },
});

// ─── Estilos tarjeta ──────────────────────────────────────────────────────────
const cd = StyleSheet.create({
  card: {
    backgroundColor: Neutral.card, borderRadius: Radius.lg,
    marginBottom: Spacing.md, overflow: 'hidden', ...Shadow.sm,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, borderBottomWidth: 1,
    borderBottomColor: Neutral.divider, gap: Spacing.sm,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText:  { fontSize: 16, fontWeight: '800' },
  headerInfo:  { flex: 1, gap: 3 },
  nombre:      { fontSize: 15, fontWeight: '700', color: Neutral.text },
  docRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  docBadge: {
    borderRadius: Radius.full, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  docBadgeText: { fontSize: 11, fontWeight: '700' },
  docNum:       { fontSize: 12, color: Neutral.textSecondary },
  estadoBadge:  { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeActivo:   { backgroundColor: Status.successBg },
  badgeInactivo: { backgroundColor: Status.errorBg },
  estadoText:         { fontSize: 11, fontWeight: '700' },
  estadoActivoText:   { color: Status.success },
  estadoInactivoText: { color: Status.error },

  fields: { padding: Spacing.md, gap: 6 },
  row:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowIcon:  { fontSize: 13, width: 20 },
  rowLabel: { fontSize: 12, color: Neutral.textSecondary, fontWeight: '600', width: 85 },
  rowValue: { flex: 1, fontSize: 13, color: Neutral.text },

  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Neutral.divider },
  btnEdit: {
    flex: 1, paddingVertical: 13, alignItems: 'center',
    borderRightWidth: 0.5, borderRightColor: Neutral.divider,
  },
  btnDel:     { flex: 1, paddingVertical: 13, alignItems: 'center' },
  btnEditText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  btnDelText:  { fontSize: 14, fontWeight: '700', color: Status.error },
  pressed:     { opacity: 0.7 },
});
