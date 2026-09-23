/**
 * Almacenes — Formulario (Crear / Editar)
 * Persiste en el store global. Al volver, la lista refleja el cambio.
 */
import { Brand, Neutral, Radius, Shadow, Spacing, Status } from '@/constants/theme';
import { addAlmacen, updateAlmacen } from '@/store/almacenes-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIPOS_PRODUCTO = ['Vinos', 'Licores', 'Cervezas', 'Otros'];
const ESTADOS        = ['Activo', 'Inactivo'] as const;

interface FormData {
  codigoAlmacen:    string;
  nombre:           string;
  ubicacion:        string;
  responsable:      string;
  telefono:         string;
  tipoProducto:     string;
  cantidadBotellas: string;
  estado:           string;
  ubigeoId:         string;
}

const EMPTY: FormData = {
  codigoAlmacen:    '',
  nombre:           '',
  ubicacion:        '',
  responsable:      '',
  telefono:         '',
  tipoProducto:     '',
  cantidadBotellas: '0',
  estado:           'Activo',
  ubigeoId:         '',
};

export default function AlmacenesFormScreen() {
  const router   = useRouter();
  const params   = useLocalSearchParams<{ id?: string; data?: string }>();
  const esEdicion = !!params.id;

  const [form,         setForm]         = useState<FormData>(EMPTY);
  const [errores,      setErrores]      = useState<Partial<Record<keyof FormData, string>>>({});
  const [guardando,    setGuardando]    = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  // ── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    if (esEdicion && params.data) {
      try {
        const d = JSON.parse(params.data);
        setForm({
          codigoAlmacen:    d.codigoAlmacen    ?? '',
          nombre:           d.nombre           ?? '',
          ubicacion:        d.ubicacion        ?? '',
          responsable:      d.responsable      ?? '',
          telefono:         d.telefono         ?? '',
          tipoProducto:     d.tipoProducto     ?? '',
          cantidadBotellas: String(d.cantidadBotellas ?? '0'),
          estado:           d.estado           ?? 'Activo',
          ubigeoId:         d.ubigeoId         ?? '',
        });
      } catch {
        setErrorGeneral('Error al cargar los datos del almacén.');
      }
    }
    // Para nuevo almacén el código se genera en el store al guardar
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrores((p) => ({ ...p, [key]: '' }));
    setErrorGeneral('');
  }

  // ── Validación ───────────────────────────────────────────────────────────
  function validar(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (!form.nombre.trim())
      e.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.length > 100)
      e.nombre = 'Máximo 100 caracteres.';
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre))
      e.nombre = 'Solo letras y espacios.';

    if (!form.ubicacion.trim())
      e.ubicacion = 'La ubicación es obligatoria.';
    else if (form.ubicacion.length > 150)
      e.ubicacion = 'Máximo 150 caracteres.';

    if (!form.responsable.trim())
      e.responsable = 'El responsable es obligatorio.';
    else if (form.responsable.length > 100)
      e.responsable = 'Máximo 100 caracteres.';
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.responsable))
      e.responsable = 'Solo letras y espacios.';

    if (!form.telefono.trim())
      e.telefono = 'El teléfono es obligatorio.';
    else if (!/^\d{9}$/.test(form.telefono))
      e.telefono = 'Debe tener exactamente 9 dígitos.';

    if (!form.tipoProducto)
      e.tipoProducto = 'Seleccione un tipo de producto.';

    const botellas = parseInt(form.cantidadBotellas, 10);
    if (form.cantidadBotellas === '' || isNaN(botellas))
      e.cantidadBotellas = 'Ingrese la cantidad de botellas.';
    else if (botellas < 0)
      e.cantidadBotellas = 'La cantidad debe ser ≥ 0.';

    if (!form.ubigeoId.trim())
      e.ubigeoId = 'El ubigeo es obligatorio.';
    else if (!/^\d{6}$/.test(form.ubigeoId))
      e.ubigeoId = 'El ubigeo debe tener 6 dígitos.';

    if (!form.estado)
      e.estado = 'Seleccione un estado.';

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  // ── Guardar ──────────────────────────────────────────────────────────────
  function guardar() {
    if (!validar()) {
      setErrorGeneral('Corrige los errores antes de guardar.');
      return;
    }
    setGuardando(true);

    const payload = {
      nombre:           form.nombre.trim(),
      ubicacion:        form.ubicacion.trim(),
      responsable:      form.responsable.trim(),
      telefono:         form.telefono.trim(),
      tipoProducto:     form.tipoProducto,
      cantidadBotellas: parseInt(form.cantidadBotellas, 10),
      estado:           form.estado as 'Activo' | 'Inactivo',
      ubigeoId:         form.ubigeoId.trim(),
    };

    setTimeout(() => {
      if (esEdicion && params.id) {
        updateAlmacen(params.id, payload);
      } else {
        addAlmacen(payload);
      }
      setGuardando(false);
      router.back();
    }, 600);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Top Bar */}
      <View style={s.topBar}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
          onPress={() => router.back()}>
          <Text style={s.backIcon}>‹</Text>
        </Pressable>
        <View style={s.topBarCenter}>
          <Text style={s.topBarTitle}>{esEdicion ? 'Editar Almacén' : 'Nuevo Almacén'}</Text>
          <Text style={s.topBarSub}>Bodega Peirano</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.scrollContent}>

          {/* Breadcrumb */}
          <View style={s.breadcrumb}>
            <Text style={s.bcText}>ALMACENES</Text>
            <Text style={s.bcSep}> › </Text>
            <Text style={s.bcCurrent}>{esEdicion ? 'EDITAR' : 'NUEVO'}</Text>
          </View>

          <Text style={s.pageTitle}>{esEdicion ? 'Editar Almacén' : 'Nuevo Almacén'}</Text>
          <Text style={s.pageSubtitle}>
            Complete todos los campos. El código se genera automáticamente.
          </Text>

          {errorGeneral ? (
            <View style={s.errorBox}>
              <Text style={s.errorBoxText}>⚠ {errorGeneral}</Text>
            </View>
          ) : null}

          {/* Tarjeta del formulario */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <Text style={s.cardHeadIcon}>🏭</Text>
              <Text style={s.cardHeadTitle}>Información del Almacén</Text>
            </View>

            <Field label="NOMBRE" required error={errores.nombre}>
              <TextInput
                style={[s.input, errores.nombre ? s.inputErr : null]}
                placeholder="Ej: Almacén Central Norte"
                placeholderTextColor={Neutral.placeholder}
                value={form.nombre}
                onChangeText={(v) => setField('nombre', v)}
                maxLength={100}
              />
            </Field>

            <Field label="UBICACIÓN" required error={errores.ubicacion}>
              <TextInput
                style={[s.input, errores.ubicacion ? s.inputErr : null]}
                placeholder="Ej: Sector A, Nave 1"
                placeholderTextColor={Neutral.placeholder}
                value={form.ubicacion}
                onChangeText={(v) => setField('ubicacion', v)}
                maxLength={150}
              />
            </Field>

            <Field label="RESPONSABLE" required error={errores.responsable}>
              <View style={[s.inputRow, errores.responsable ? s.inputErr : null]}>
                <Text style={s.inputIcon}>👤</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="Nombre del encargado"
                  placeholderTextColor={Neutral.placeholder}
                  value={form.responsable}
                  onChangeText={(v) => setField('responsable', v)}
                  maxLength={100}
                />
              </View>
            </Field>

            <Field label="TELÉFONO (9 dígitos)" required error={errores.telefono}>
              <View style={[s.inputRow, errores.telefono ? s.inputErr : null]}>
                <Text style={s.inputIcon}>📞</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="999000000"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="phone-pad"
                  value={form.telefono}
                  onChangeText={(v) => setField('telefono', v.replace(/\D/g, ''))}
                  maxLength={9}
                />
              </View>
            </Field>

            <Field label="TIPO DE PRODUCTO" required error={errores.tipoProducto}>
              <View style={s.chipGroup}>
                {TIPOS_PRODUCTO.map((t) => (
                  <Pressable
                    key={t}
                    style={[s.chip, form.tipoProducto === t && s.chipActive]}
                    onPress={() => setField('tipoProducto', t)}>
                    <Text style={[s.chipText, form.tipoProducto === t && s.chipTextActive]}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            {esEdicion && (
              <Field label="CÓDIGO DE ALMACÉN">
                <View style={[s.inputRow, s.inputReadOnly]}>
                  <TextInput style={s.inputInner} value={form.codigoAlmacen} editable={false} />
                  <Text style={s.inputIcon}>🔄</Text>
                </View>
                <Text style={s.hint}>Generado automáticamente — formato VB-XXXX.</Text>
              </Field>
            )}

            <Field label="CANTIDAD DE BOTELLAS" required error={errores.cantidadBotellas}>
              <View style={[s.inputRow, errores.cantidadBotellas ? s.inputErr : null]}>
                <Text style={s.inputIcon}>🍾</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="0"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="number-pad"
                  value={form.cantidadBotellas}
                  onChangeText={(v) => setField('cantidadBotellas', v.replace(/\D/g, ''))}
                />
              </View>
            </Field>

            <Field label="UBIGEO" required error={errores.ubigeoId}>
              <View style={[s.inputRow, errores.ubigeoId ? s.inputErr : null]}>
                <Text style={s.inputIcon}>📌</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="Ej: 150501"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="number-pad"
                  value={form.ubigeoId}
                  onChangeText={(v) => setField('ubigeoId', v.replace(/\D/g, ''))}
                  maxLength={6}
                />
              </View>
            </Field>

            <Field label="ESTADO" required error={errores.estado}>
              <View style={s.chipGroup}>
                {ESTADOS.map((est) => (
                  <Pressable
                    key={est}
                    style={[
                      s.chip,
                      form.estado === est && s.chipActive,
                      form.estado === est && est === 'Inactivo' && s.chipInactivo,
                    ]}
                    onPress={() => setField('estado', est)}>
                    <Text style={[s.chipText, form.estado === est && s.chipTextActive]}>
                      {est === 'Activo' ? '✅ ' : '❌ '}{est}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            {/* Nota */}
            <View style={s.nota}>
              <Text style={s.notaTitle}>📌 Nota Informativa:</Text>
              <Text style={s.notaText}>
                Todos los códigos se generan automáticamente bajo el formato único global{' '}
                <Text style={{ fontWeight: '800' }}>VB-XXXX</Text>.
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View style={s.actionsRow}>
            <Pressable
              style={({ pressed }) => [s.btnCancel, pressed && s.pressed]}
              onPress={() => router.back()}
              disabled={guardando}>
              <Text style={s.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [s.btnSave, pressed && s.pressed, guardando && s.btnDisabled]}
              onPress={guardar}
              disabled={guardando}>
              <Text style={s.btnSaveText}>
                {guardando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Crear Almacén'}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Componente de campo ───────────────────────────────────────────────────────
function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <View style={f.group}>
      <Text style={f.label}>
        {label}{required && <Text style={f.req}> *</Text>}
      </Text>
      {children}
      {error ? <Text style={f.error}>{error}</Text> : null}
    </View>
  );
}
const f = StyleSheet.create({
  group: { gap: 6 },
  label: { fontSize: 11, fontWeight: '700', color: Neutral.textSecondary, letterSpacing: 0.5 },
  req:   { color: Status.error },
  error: { fontSize: 12, color: Status.error, fontWeight: '500' },
});

// ── Estilos pantalla ──────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Neutral.bg },
  scrollContent: { paddingBottom: 20 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm, ...Shadow.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon:   { color: Neutral.white, fontSize: 26, fontWeight: '300', lineHeight: 28 },
  topBarCenter: { flex: 1 },
  topBarTitle:  { color: Neutral.white, fontWeight: '800', fontSize: 17 },
  topBarSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  breadcrumb: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  bcText:     { fontSize: 11, color: Neutral.textSecondary, fontWeight: '600' },
  bcSep:      { fontSize: 11, color: Neutral.textMuted },
  bcCurrent:  { fontSize: 11, color: Brand.primary, fontWeight: '700' },

  pageTitle:    { fontSize: 20, fontWeight: '800', color: Neutral.text, paddingHorizontal: Spacing.md, paddingTop: 4 },
  pageSubtitle: { fontSize: 13, color: Neutral.textSecondary, paddingHorizontal: Spacing.md, marginTop: 4, lineHeight: 18, marginBottom: Spacing.md },

  errorBox:     { backgroundColor: Status.errorBg, borderWidth: 1, borderColor: Status.error, borderRadius: Radius.md, marginHorizontal: Spacing.md, marginBottom: Spacing.sm, padding: Spacing.sm + 4 },
  errorBoxText: { fontSize: 13, color: Status.error, fontWeight: '600' },

  card: {
    backgroundColor: Neutral.card, borderRadius: Radius.lg,
    marginHorizontal: Spacing.md, padding: Spacing.md,
    gap: Spacing.md, ...Shadow.sm,
  },
  cardHead: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Neutral.divider,
  },
  cardHeadIcon:  { fontSize: 22 },
  cardHeadTitle: { fontSize: 16, fontWeight: '800', color: Neutral.text },

  input: {
    height: 52, backgroundColor: Neutral.inputBg,
    borderWidth: 1, borderColor: Neutral.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    fontSize: 15, color: Neutral.text,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    backgroundColor: Neutral.inputBg, borderWidth: 1,
    borderColor: Neutral.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm + 4, gap: Spacing.sm,
  },
  inputInner:   { flex: 1, fontSize: 15, color: Neutral.text },
  inputIcon:    { fontSize: 16 },
  inputErr:     { borderColor: Status.error, backgroundColor: Status.errorBg },
  inputReadOnly: { backgroundColor: Neutral.divider },
  hint:         { fontSize: 11, color: Neutral.textSecondary, fontStyle: 'italic' },

  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Neutral.borderDark, backgroundColor: Neutral.inputBg,
  },
  chipActive:   { backgroundColor: Brand.primaryLight, borderColor: Brand.primary },
  chipInactivo: { backgroundColor: Status.errorBg, borderColor: Status.error },
  chipText:     { fontSize: 13, color: Neutral.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Brand.primary },

  nota: {
    backgroundColor: '#FFFDF0', borderWidth: 1,
    borderColor: '#FFE066', borderRadius: Radius.md,
    padding: Spacing.md, gap: 4,
  },
  notaTitle: { fontSize: 13, fontWeight: '800', color: '#856404' },
  notaText:  { fontSize: 13, color: '#856404', lineHeight: 19 },

  actionsRow: {
    flexDirection: 'row', marginHorizontal: Spacing.md,
    marginTop: Spacing.md, gap: Spacing.sm,
  },
  btnCancel: {
    flex: 1, height: 52, borderRadius: Radius.md,
    borderWidth: 2, borderColor: Neutral.borderDark,
    justifyContent: 'center', alignItems: 'center',
  },
  btnCancelText: { fontSize: 15, fontWeight: '700', color: Neutral.textSecondary },
  btnSave: {
    flex: 2, height: 52, borderRadius: Radius.md,
    backgroundColor: Brand.primary,
    justifyContent: 'center', alignItems: 'center',
    ...Shadow.sm,
  },
  btnSaveText:  { fontSize: 15, fontWeight: '800', color: Neutral.white },
  btnDisabled:  { opacity: 0.6 },
  pressed:      { opacity: 0.75 },
});
