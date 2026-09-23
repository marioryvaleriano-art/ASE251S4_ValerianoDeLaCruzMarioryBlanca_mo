/**
 * Login — Bodega Peirano
 * Pantalla de inicio de sesión adaptada para móvil.
 */
import { Brand, Neutral, Radius, Shadow, Spacing, Status } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Credenciales de prueba
  const CREDENTIALS = [
    { role: 'Administrador', email: 'admin@peirano.com', password: 'admin123' },
    { role: 'Usuario', email: 'usuario@peirano.com', password: 'usuario123' },
  ];

  function handleLogin() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }
    const match = CREDENTIALS.find(
      (c) => c.email === email.trim() && c.password === password
    );
    if (!match) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    setLoading(true);
    // Simula autenticación
    setTimeout(() => {
      setLoading(false);
      router.replace('/home');
    }, 800);
  }

  function fillCredential(cred: (typeof CREDENTIALS)[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* ── Cabecera de marca ── */}
          <View style={styles.brandHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoLetters}>BP</Text>
            </View>
            <View style={styles.brandTextBlock}>
              <Text style={styles.brandName}>PEIRANO</Text>
              <Text style={styles.brandTagline}>Bodega desde 1948</Text>
            </View>
          </View>

          {/* ── Tagline imagen hero (simulada con color) ── */}
          <View style={styles.heroBanner}>
            <Text style={styles.heroTitle}>BODEGA PEIRANO</Text>
            <Text style={styles.heroSub}>Tradición, excelencia y pasión por nuestros vinos.</Text>
          </View>

          {/* ── Formulario ── */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Iniciar Sesión</Text>
            <Text style={styles.formSubtitle}>
              Ingrese su correo electrónico y contraseña para acceder al sistema.
            </Text>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* Campo correo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CORREO ELECTRÓNICO</Text>
              <View style={[styles.inputWrapper, error && !email ? styles.inputError : null]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="admin@peirano.com"
                  placeholderTextColor={Neutral.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                />
              </View>
            </View>

            {/* Campo contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
              <View style={[styles.inputWrapper, error && !password ? styles.inputError : null]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Neutral.placeholder}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Recordarme + ¿Olvidaste? */}
            <View style={styles.rememberRow}>
              <Pressable
                style={styles.checkRow}
                onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Recordarme</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            {/* Botón iniciar */}
            <Pressable
              style={({ pressed }) => [
                styles.btnLogin,
                pressed && styles.btnPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}>
              <Text style={styles.btnLoginText}>
                {loading ? 'Verificando...' : 'INICIAR SESIÓN'}
              </Text>
            </Pressable>

            {/* Separador */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Credenciales de prueba</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Tarjetas de credenciales */}
            {CREDENTIALS.map((cred) => (
              <Pressable
                key={cred.role}
                style={({ pressed }) => [styles.credCard, pressed && styles.credCardPressed]}
                onPress={() => fillCredential(cred)}>
                <Text style={styles.credIcon}>
                  {cred.role === 'Administrador' ? '👑' : '👤'}
                </Text>
                <View style={styles.credInfo}>
                  <Text style={styles.credRole}>{cred.role}</Text>
                  <Text style={styles.credEmail}>Correo: {cred.email}</Text>
                  <Text style={styles.credPass}>Contraseña: {cred.password}</Text>
                </View>
                <Text style={styles.credArrow}>›</Text>
              </Pressable>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © 2024 Bodega Peirano • Portal Administrativo
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.primary },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },

  // ── Cabecera marca ──────────────────────────────────
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetters: { color: Neutral.white, fontWeight: '900', fontSize: 16 },
  brandTextBlock: { gap: 1 },
  brandName: { color: Neutral.white, fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  brandTagline: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },

  // ── Hero ────────────────────────────────────────────
  heroBanner: {
    backgroundColor: Brand.primaryDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  heroTitle: {
    color: Neutral.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Formulario ──────────────────────────────────────
  formCard: {
    backgroundColor: Neutral.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    flex: 1,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Neutral.text,
  },
  formSubtitle: {
    fontSize: 14,
    color: Neutral.textSecondary,
    lineHeight: 20,
    marginTop: -Spacing.sm,
  },

  // ── Error ───────────────────────────────────────────
  errorBox: {
    backgroundColor: Status.errorBg,
    borderWidth: 1,
    borderColor: Status.error,
    borderRadius: Radius.md,
    padding: Spacing.sm + 4,
  },
  errorText: { color: Status.error, fontSize: 13, fontWeight: '600' },

  // ── Campos ──────────────────────────────────────────
  fieldGroup: { gap: 6 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Neutral.textSecondary,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Neutral.inputBg,
    borderWidth: 1,
    borderColor: Neutral.border,
    borderRadius: Radius.md,
    height: 52,
    paddingHorizontal: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  inputError: {
    borderColor: Status.error,
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: 16,
    color: Neutral.text,
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },

  // ── Recordarme ──────────────────────────────────────
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -Spacing.xs,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Neutral.borderDark,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  checkMark: { color: Neutral.white, fontSize: 11, fontWeight: '900' },
  checkLabel: { fontSize: 14, color: Neutral.text },
  forgotLink: { fontSize: 14, color: Brand.primary, fontWeight: '600' },

  // ── Botón login ─────────────────────────────────────
  btnLogin: {
    height: 54,
    backgroundColor: Brand.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  btnLoginText: {
    color: Neutral.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  btnPressed: { opacity: 0.8 },
  btnDisabled: { opacity: 0.6 },

  // ── Separador ───────────────────────────────────────
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: Spacing.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Neutral.border },
  dividerText: { fontSize: 12, color: Neutral.textSecondary, fontWeight: '600' },

  // ── Tarjetas credenciales ───────────────────────────
  credCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Neutral.bg,
    borderWidth: 1,
    borderColor: Neutral.border,
    borderRadius: Radius.md,
    padding: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  credCardPressed: { backgroundColor: Brand.primaryLight },
  credIcon: { fontSize: 24 },
  credInfo: { flex: 1, gap: 2 },
  credRole: { fontSize: 14, fontWeight: '700', color: Neutral.text },
  credEmail: { fontSize: 12, color: Neutral.textSecondary },
  credPass: { fontSize: 12, color: Neutral.textSecondary },
  credArrow: { fontSize: 20, color: Neutral.textMuted },

  // ── Footer ──────────────────────────────────────────
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    backgroundColor: Brand.primary,
    paddingVertical: Spacing.md,
  },
});
