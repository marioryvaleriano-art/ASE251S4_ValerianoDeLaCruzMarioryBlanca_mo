/**
 * Almacenes — Lista
 * Lee y modifica el store global. Los cambios del formulario aparecen aquí.
 */
import { Brand, Neutral, Radius, Shadow, Spacing, Status } from '@/constants/theme';
import {
    Almacen,
    deleteAlmacen,
    getAlmacenes,
} from '@/store/almacenes-store';
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

export default function AlmacenesListaScreen() {
  const router = useRouter();
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [busqueda, setBusqueda]   = useState('');

  // Recarga la lista cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setAlmacenes(getAlmacenes());
    }, [])
  );

  // ── Filtrar ──────────────────────────────────────────────────────────────
  const filtrados = almacenes.filter((a) => {
    const q = busqueda.toLowerCase();
    return (
      a.nombre.toLowerCase().includes(q) ||
      a.codigoAlmacen.toLowerCase().includes(q) ||
      a.responsable.toLowerCase().includes(q)
    );
  });

  const totalBotellas = almacenes.reduce((acc, a) => acc + a.cantidadBotellas, 0);
  const totalActivos  = almacenes.filter((a) => a.estado === 'Activo').length;

  // ── Eliminar ─────────────────────────────────────────────────────────────
  function handleEliminar(id: string, nombre: string) {
    Alert.alert(
      'Eliminar Almacén',
      `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteAlmacen(id);
            setAlmacenes(getAlmacenes());
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>Almacenes</Text>
          <Text style={styles.topBarSub}>Bodega Peirano</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.newBtn, pressed && styles.pressed]}
          onPress={() => router.push('/almacenes-form')}>
          <Text style={styles.newBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>ADMIN</Text>
          <Text style={styles.breadcrumbSep}> › </Text>
          <Text style={styles.breadcrumbCurrent}>ALMACENES</Text>
        </View>

        {/* Título */}
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Gestión de Almacenes</Text>
            <Text style={styles.pageSubtitle}>
              Administre los almacenes de la bodega, sus responsables y stock de botellas.
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.newBtnLarge, pressed && styles.pressed]}
            onPress={() => router.push('/almacenes-form')}>
            <Text style={styles.newBtnLargeText}>+ Nuevo Almacén</Text>
          </Pressable>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: Brand.primary }]}>
            <Text style={styles.statValue}>{almacenes.length}</Text>
            <Text style={styles.statLabel}>Total Almacenes</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#2B6CB0' }]}>
            <Text style={styles.statValue}>{totalBotellas.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Botellas</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Status.success }]}>
            <Text style={styles.statValue}>{totalActivos}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
        </View>

        {/* ── Buscador ── */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, código o responsable..."
            placeholderTextColor={Neutral.placeholder}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* ── Lista ── */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Listado de Almacenes</Text>
            <Text style={styles.listCount}>
              {filtrados.length} de {almacenes.length}
            </Text>
          </View>

          {filtrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏚️</Text>
              <Text style={styles.emptyText}>
                {busqueda
                  ? 'No se encontraron almacenes con ese criterio.'
                  : 'No hay almacenes registrados. Toca "+ Nuevo Almacén" para agregar uno.'}
              </Text>
            </View>
          ) : (
            filtrados.map((almacen) => (
              <AlmacenCard
                key={almacen.id}
                almacen={almacen}
                onEditar={() =>
                  router.push({
                    pathname: '/almacenes-form',
                    params: { id: almacen.id, data: JSON.stringify(almacen) },
                  })
                }
                onEliminar={() => handleEliminar(almacen.id, almacen.nombre)}
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Tarjeta de almacén ───────────────────────────────────────────────────────
function AlmacenCard({
  almacen,
  onEditar,
  onEliminar,
}: {
  almacen: Almacen;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const isActivo = almacen.estado === 'Activo';
  return (
    <View style={card.card}>
      <View style={card.header}>
        <View style={card.codeBox}>
          <Text style={card.codeText}>{almacen.codigoAlmacen}</Text>
        </View>
        <Text style={card.nombre} numberOfLines={1}>{almacen.nombre}</Text>
        <View style={[card.badge, isActivo ? card.badgeActivo : card.badgeInactivo]}>
          <Text style={[card.badgeText, isActivo ? card.badgeActivoText : card.badgeInactivoText]}>
            {almacen.estado}
          </Text>
        </View>
      </View>

      <View style={card.fields}>
        <FieldRow icon="📍" label="Ubicación"    value={almacen.ubicacion} />
        <FieldRow icon="👤" label="Responsable"  value={almacen.responsable} />
        <FieldRow icon="📞" label="Teléfono"     value={almacen.telefono} />
        <FieldRow icon="🍷" label="Tipo"         value={almacen.tipoProducto} />
        <FieldRow icon="🍾" label="Botellas"     value={almacen.cantidadBotellas.toLocaleString()} />
        <FieldRow icon="📌" label="Ubigeo"       value={almacen.ubigeoId} />
      </View>

      <View style={card.actions}>
        <Pressable
          style={({ pressed }) => [card.btnEdit, pressed && card.pressed]}
          onPress={onEditar}>
          <Text style={card.btnEditText}>✏️  Editar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [card.btnDel, pressed && card.pressed]}
          onPress={onEliminar}>
          <Text style={card.btnDelText}>🗑  Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={card.row}>
      <Text style={card.rowIcon}>{icon}</Text>
      <Text style={card.rowLabel}>{label}:</Text>
      <Text style={card.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Neutral.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { color: Neutral.white, fontSize: 26, fontWeight: '300', lineHeight: 28 },
  topBarCenter: { flex: 1 },
  topBarTitle: { color: Neutral.white, fontWeight: '800', fontSize: 17 },
  topBarSub:   { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  newBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
  },
  newBtnText: { color: Neutral.white, fontWeight: '700', fontSize: 13 },
  scroll: { flex: 1 },
  breadcrumb: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  breadcrumbText:    { fontSize: 11, color: Neutral.textSecondary, fontWeight: '600' },
  breadcrumbSep:     { fontSize: 11, color: Neutral.textMuted },
  breadcrumbCurrent: { fontSize: 11, color: Brand.primary, fontWeight: '700' },
  pageHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  pageTitle:    { fontSize: 20, fontWeight: '800', color: Neutral.text },
  pageSubtitle: { fontSize: 13, color: Neutral.textSecondary, marginTop: 2, lineHeight: 18 },
  newBtnLarge: {
    backgroundColor: Brand.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    ...Shadow.sm,
  },
  newBtnLargeText: { color: Neutral.white, fontWeight: '800', fontSize: 15 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Neutral.card,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    padding: Spacing.sm + 2,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: Neutral.text },
  statLabel: { fontSize: 10, color: Neutral.textSecondary, textAlign: 'center', marginTop: 2 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Neutral.card,
    borderWidth: 1,
    borderColor: Neutral.border,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm + 4,
    height: 48,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Neutral.text },
  clearSearch: { fontSize: 14, color: Neutral.textMuted, padding: 4 },
  listSection: { paddingHorizontal: Spacing.md },
  listHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  listTitle:   { fontSize: 16, fontWeight: '700', color: Neutral.text },
  listCount:   { fontSize: 12, color: Neutral.textSecondary },
  emptyState:  { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyIcon:   { fontSize: 40 },
  emptyText:   { fontSize: 14, color: Neutral.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  pressed: { opacity: 0.75 },
});

const card = StyleSheet.create({
  card: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Neutral.divider,
    gap: Spacing.sm,
  },
  codeBox: {
    backgroundColor: Brand.primaryLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  codeText:  { color: Brand.primary, fontSize: 12, fontWeight: '800' },
  nombre:    { flex: 1, fontSize: 15, fontWeight: '700', color: Neutral.text },
  badge:     { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeActivo:   { backgroundColor: Status.successBg },
  badgeInactivo: { backgroundColor: Status.errorBg },
  badgeText:         { fontSize: 11, fontWeight: '700' },
  badgeActivoText:   { color: Status.success },
  badgeInactivoText: { color: Status.error },
  fields: { padding: Spacing.md, gap: 6 },
  row:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowIcon:  { fontSize: 13, width: 18 },
  rowLabel: { fontSize: 12, color: Neutral.textSecondary, fontWeight: '600', width: 85 },
  rowValue: { flex: 1, fontSize: 13, color: Neutral.text },
  actions:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Neutral.divider },
  btnEdit:  { flex: 1, paddingVertical: 13, alignItems: 'center', borderRightWidth: 0.5, borderRightColor: Neutral.divider },
  btnDel:   { flex: 1, paddingVertical: 13, alignItems: 'center' },
  btnEditText: { fontSize: 14, fontWeight: '700', color: '#2B6CB0' },
  btnDelText:  { fontSize: 14, fontWeight: '700', color: Status.error },
  pressed: { opacity: 0.7 },
});
