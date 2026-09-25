/**
 * Clientes — Formulario (Crear / Editar)
 * Campos: tipoDocumento, numeroDocum, nombre, apellido, correo,
 * telefono (9 dígitos), fechaNacimiento, ubigeoId, estado.
 * Validaciones idénticas al componente Angular original.
 */
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
import { addCliente, updateCliente, TipoDocumento } from '@/store/clientes-store';
import { Neutral, Radius, Shadow, Spacing, Status } from '@/constants/theme';

// ─── Constantes ───────────────────────────────────────────────────────────────
const COLOR_PURPLE   = '#7C3AED';
const COLOR_PURPLEDK = '#5B21B6';
const COLOR_PURPLEBG = '#F5F3FF';

const TIPOS_DOC: TipoDocumento[] = ['DNI', 'RUC', 'CE', 'Pasaporte'];
const ESTADOS = ['Activo', 'Inactivo'] as const;

// Longitud y placeholder por tipo de doc
const DOC_CONFIG: Record<TipoDocumento, { max: number; placeholder: string }> = {
  DNI:       { max: 8,  placeholder: 'Ej: 12345678' },
  RUC:       { max: 11, placeholder: 'Ej: 20512345678' },
  CE:        { max: 12, placeholder: 'Ej: 000123456' },
  Pasaporte: { max: 9,  placeholder: 'Ej: AB123456' },
};

// ─── Interfaz formulario ──────────────────────────────────────────────────────
interface FormData {
  tipoDocumento:   TipoDocumento;
  numeroDocum:     string;
  nombre:          string;
  apellido:        string;
  correo:          string;
  telefono:        string;
  fechaNacimiento: string;
  ubigeoId:        string;
  estado:          string;
}

const EMPTY: FormData = {
  tipoDocumento:   'DNI',
  numeroDocum:     '',
  nombre:          '',
  apellido:        '',
  correo:          '',
  telefono:        '',
  fechaNacimiento: '',
  ubigeoId:        '',
  estado:          'Activo',
};

export default function ClientesFormScreen() {
  const router    = useRouter();
  const params    = useLocalSearchParams<{ id?: string; data?: string }>();
  const esEdicion = !!params.id;

  const [form,         setForm]         = useState<FormData>(EMPTY);
  const [errores,      setErrores]      = useState<Partial<Record<keyof FormData, string>>>({});
  const [guardando,    setGuardando]    = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  // ── Carga en edición ────────────────────────────────────────────────────
  useEffect(() => {
    if (esEdicion && params.data) {
      try {
        const d = JSON.parse(params.data);
        setForm({
          tipoDocumento:   d.tipoDocumento   ?? 'DNI',
          numeroDocum:     d.numeroDocum     ?? '',
          nombre:          d.nombre          ?? '',
          apellido:        d.apellido        ?? '',
          correo:          d.correo          ?? '',
          telefono:        d.telefono        ?? '',
          fechaNacimiento: d.fechaNacimiento ?? '',
          ubigeoId:        d.ubigeoId        ?? '',
          estado:          d.estado          ?? 'Activo',
        });
      } catch {
        setErrorGeneral('Error al cargar los datos del cliente.');
      }
    }
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrores((p) => ({ ...p, [key]: '' }));
    setErrorGeneral('');
  }

  function onTipoDocChange(tipo: TipoDocumento) {
    setField('tipoDocumento', tipo);
    setField('numeroDocum', '');
  }

  // ── Validación ───────────────────────────────────────────────────────────
  function validar(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    const cfg = DOC_CONFIG[form.tipoDocumento];

    // Número de documento
    if (!form.numeroDocum.trim()) {
      e.numeroDocum = 'El número de documento es obligatorio.';
    } else if (form.tipoDocumento === 'DNI' && !/^\d{8}$/.test(form.numeroDocum)) {
      e.numeroDocum = 'El DNI debe tener exactamente 8 dígitos.';
    } else if (form.tipoDocumento === 'RUC' && !/^\d{11}$/.test(form.numeroDocum)) {
      e.numeroDocum = 'El RUC debe tener exactamente 11 dígitos.';
    } else if (form.tipoDocumento === 'CE' && !/^[a-zA-Z0-9]{6,12}$/.test(form.numeroDocum)) {
      e.numeroDocum = 'El CE debe tener entre 6 y 12 caracteres alfanuméricos.';
    } else if (form.tipoDocumento === 'Pasaporte' && !/^[a-zA-Z0-9]{6,9}$/.test(form.numeroDocum)) {
      e.numeroDocum = 'El pasaporte debe tener entre 6 y 9 caracteres alfanuméricos.';
    }

    // Nombre
    if (!form.nombre.trim())
      e.nombre = 'El nombre es obligatorio.';
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre))
      e.nombre = 'Solo letras y espacios.';
    else if (form.nombre.length > 60)
      e.nombre = 'Máximo 60 caracteres.';

    // Apellido
    if (!form.apellido.trim())
      e.apellido = 'El apellido es obligatorio.';
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellido))
      e.apellido = 'Solo letras y espacios.';
    else if (form.apellido.length > 60)
      e.apellido = 'Máximo 60 caracteres.';

    // Correo
    if (!form.correo.trim())
      e.correo = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      e.correo = 'Ingrese un correo válido.';

    // Teléfono
    if (!form.telefono.trim())
      e.telefono = 'El teléfono es obligatorio.';
    else if (!/^\d{9}$/.test(form.telefono))
      e.telefono = 'Debe tener exactamente 9 dígitos.';

    // Fecha de nacimiento
    if (!form.fechaNacimiento)
      e.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    else {
      const fecha = new Date(form.fechaNacimiento);
      const hoy   = new Date();
      if (isNaN(fecha.getTime()))
        e.fechaNacimiento = 'Fecha inválida.';
      else if (fecha >= hoy)
        e.fechaNacimiento = 'La fecha debe ser anterior a hoy.';
    }

    // Ubigeo
    if (!form.ubigeoId.trim())
      e.ubigeoId = 'El ubigeo es obligatorio.';
    else if (!/^\d{6}$/.test(form.ubigeoId))
      e.ubigeoId = 'Debe tener exactamente 6 dígitos.';

    // Estado
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
      tipoDocumento:   form.tipoDocumento,
      numeroDocum:     form.numeroDocum.trim(),
      nombre:          form.nombre.trim(),
      apellido:        form.apellido.trim(),
      correo:          form.correo.trim().toLowerCase(),
      telefono:        form.telefono.trim(),
      fechaNacimiento: form.fechaNacimiento,
      ubigeoId:        form.ubigeoId.trim(),
      estado:          form.estado as 'Activo' | 'Inactivo',
    };

    setTimeout(() => {
      if (esEdicion && params.id) {
        updateCliente(params.id, payload);
      } else {
        addCliente(payload);
      }
      setGuardando(false);
      router.back();
    }, 600);
  }

  const docCfg = DOC_CONFIG[form.tipoDocumento];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Top Bar */}
      <View style={s.topBar}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
          onPress={() => router.back()}>
          <Text style={s.backIcon}>‹</Text>
        </Pressable>
        <View style={s.topCenter}>
          <Text style={s.topTitle}>{esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>
          <Text style={s.topSub}>Bodega Peirano</Text>
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
            <Text style={s.bcText}>CLIENTES</Text>
            <Text style={s.bcSep}> › </Text>
            <Text style={s.bcCurrent}>{esEdicion ? 'EDITAR' : 'NUEVO'}</Text>
          </View>

          <Text style={s.pageTitle}>{esEdicion ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</Text>
          <Text style={s.pageSubtitle}>
            {esEdicion
              ? 'Modifique los datos del cliente.'
              : 'Complete el formulario para registrar un nuevo cliente.'}
          </Text>

          {errorGeneral ? (
            <View style={s.errorBox}>
              <Text style={s.errorBoxText}>⚠ {errorGeneral}</Text>
            </View>
          ) : null}

          <View style={s.card}>
            <View style={s.cardHead}>
              <Text style={s.cardHeadIcon}>👤</Text>
              <Text style={s.cardHeadTitle}>Datos del Cliente</Text>
            </View>

            {/* TIPO DOCUMENTO */}
            <Field label="TIPO DOCUMENTO" required error={errores.tipoDocumento}>
              <View style={s.chipGroup}>
                {TIPOS_DOC.map((t) => (
                  <Pressable
                    key={t}
                    style={[s.chip, form.tipoDocumento === t && s.chipActive]}
                    onPress={() => onTipoDocChange(t)}>
                    <Text style={[s.chipText, form.tipoDocumento === t && s.chipTextActive]}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            {/* NÚMERO DE DOCUMENTO */}
            <Field label="NO. DOCUMENTO" required error={errores.numeroDocum}>
              <TextInput
                style={[s.input, errores.numeroDocum ? s.inputErr : null]}
                placeholder={docCfg.placeholder}
                placeholderTextColor={Neutral.placeholder}
                keyboardType={
                  form.tipoDocumento === 'CE' || form.tipoDocumento === 'Pasaporte'
                    ? 'default'
                    : 'number-pad'
                }
                value={form.numeroDocum}
                onChangeText={(v) => setField('numeroDocum', v)}
                maxLength={docCfg.max}
                autoCapitalize="characters"
              />
            </Field>

            {/* NOMBRE */}
            <Field label="NOMBRE" required error={errores.nombre}>
              <TextInput
                style={[s.input, errores.nombre ? s.inputErr : null]}
                placeholder="Nombre(s)"
                placeholderTextColor={Neutral.placeholder}
                value={form.nombre}
                onChangeText={(v) => setField('nombre', v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                maxLength={60}
              />
            </Field>

            {/* APELLIDO */}
            <Field label="APELLIDO" required error={errores.apellido}>
              <TextInput
                style={[s.input, errores.apellido ? s.inputErr : null]}
                placeholder="Apellido(s)"
                placeholderTextColor={Neutral.placeholder}
                value={form.apellido}
                onChangeText={(v) => setField('apellido', v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                maxLength={60}
              />
            </Field>

            {/* CORREO */}
            <Field label="CORREO" required error={errores.correo}>
              <View style={[s.inputRow, errores.correo ? s.inputErr : null]}>
                <Text style={s.inputIcon}>✉️</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={form.correo}
                  onChangeText={(v) => setField('correo', v)}
                />
              </View>
            </Field>

            {/* TELÉFONO */}
            <Field label="TELÉFONO (9 dígitos)" required error={errores.telefono}>
              <View style={[s.inputRow, errores.telefono ? s.inputErr : null]}>
                <Text style={s.inputIcon}>📞</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="Ej: 999999999"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="phone-pad"
                  value={form.telefono}
                  onChangeText={(v) => setField('telefono', v.replace(/\D/g, ''))}
                  maxLength={9}
                />
              </View>
            </Field>

            {/* FECHA DE NACIMIENTO */}
            <Field label="FECHA DE NACIMIENTO" required error={errores.fechaNacimiento}>
              <View style={[s.inputRow, errores.fechaNacimiento ? s.inputErr : null]}>
                <Text style={s.inputIcon}>🎂</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={Neutral.placeholder}
                  value={form.fechaNacimiento}
                  onChangeText={(v) => {
                    // Auto-inserta guiones: AAAA-MM-DD
                    let val = v.replace(/[^\d]/g, '');
                    if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4);
                    if (val.length > 7) val = val.slice(0, 7) + '-' + val.slice(7);
                    setField('fechaNacimiento', val.slice(0, 10));
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              <Text style={s.hint}>Formato: AAAA-MM-DD (Ej: 1995-04-20)</Text>
            </Field>

            {/* UBIGEO */}
            <Field label="UBIGEO" required error={errores.ubigeoId}>
              <View style={[s.inputRow, errores.ubigeoId ? s.inputErr : null]}>
                <Text style={s.inputIcon}>📌</Text>
                <TextInput
                  style={s.inputInner}
                  placeholder="Ej: 150101"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="number-pad"
                  value={form.ubigeoId}
                  onChangeText={(v) => setField('ubigeoId', v.replace(/\D/g, ''))}
                  maxLength={6}
                />
              </View>
            </Field>

            {/* ESTADO */}
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
                {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Guardar'}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Componente de campo ──────────────────────────────────────────────────────
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

// ─── Estilos pantalla ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Neutral.bg },
  scrollContent: { paddingBottom: 20 },
  pressed:       { opacity: 0.75 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLOR_PURPLE,
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

  breadcrumb: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  bcText:     { fontSize: 11, color: Neutral.textSecondary, fontWeight: '600' },
  bcSep:      { fontSize: 11, color: Neutral.textMuted },
  bcCurrent:  { fontSize: 11, color: COLOR_PURPLE, fontWeight: '700' },

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
  inputInner: { flex: 1, fontSize: 15, color: Neutral.text },
  inputIcon:  { fontSize: 16 },
  inputErr:   { borderColor: Status.error, backgroundColor: Status.errorBg },
  hint:       { fontSize: 11, color: Neutral.textSecondary, fontStyle: 'italic' },

  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Neutral.borderDark, backgroundColor: Neutral.inputBg,
  },
  chipActive:   { backgroundColor: COLOR_PURPLEBG, borderColor: COLOR_PURPLE },
  chipInactivo: { backgroundColor: Status.errorBg, borderColor: Status.error },
  chipText:     { fontSize: 13, color: Neutral.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLOR_PURPLE },

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
    backgroundColor: COLOR_PURPLE,
    justifyContent: 'center', alignItems: 'center', ...Shadow.sm,
  },
  btnSaveText: { fontSize: 15, fontWeight: '800', color: Neutral.white },
  btnDisabled: { opacity: 0.6 },
});
