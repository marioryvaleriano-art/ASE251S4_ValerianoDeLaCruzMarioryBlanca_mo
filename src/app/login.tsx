/**
 * Pantalla 1 de 3 — LOGIN (estilo Rappi)
 *
 * Componentes AP3 demostrados:
 *  View + StyleSheet + Flexbox → estructura y layout
 *  Text                        → títulos y etiquetas
 *  TextInput                   → captura de teléfono / correo
 *  Pressable                   → botones con feedback visual
 *  Image (expo-image)          → logotipo
 */
import { Image } from 'expo-image';
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

// ─── Colores de marca (Rappi-like) ──────────────────────────────────────────
const BRAND = '#FF441F';
const BRAND_DARK = '#CC2A00';
const BG = '#FFF8F6';
const CARD = '#FFFFFF';
const GRAY = '#6B6B6B';
const GRAY_LIGHT = '#F2F2F2';
const BORDER = '#E0E0E0';

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  function handleContinue() {
    router.replace('/home');
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Banner paso 1 */}
      <View style={styles.stepBanner}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>1</Text>
        </View>
        <Text style={styles.stepText}>
          <Text style={styles.stepBold}>PASO 1 DE 3: LOGIN  </Text>
          Ingresa credenciales o teléfono y presiona{' '}
          <Text style={styles.stepBold}>Iniciar sesión</Text> para avanzar a Restaurantes.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <Image
                source={require('@/assets/images/expo-logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <View style={styles.expressBadge}>
              <Text style={styles.expressText}>⚡ Express</Text>
            </View>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>¡Pide lo que quieras en minutos!</Text>
          <Text style={styles.subheadline}>
            Tu comida favorita, supermercado y antojos en tu puerta.
          </Text>

          {/* Tabs Teléfono / Correo */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, activeTab === 'phone' && styles.tabActive]}
              onPress={() => setActiveTab('phone')}>
              <Text style={[styles.tabText, activeTab === 'phone' && styles.tabTextActive]}>
                📱  Teléfono celular
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'email' && styles.tabActive]}
              onPress={() => setActiveTab('email')}>
              <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
                ✉️  Correo electrónico
              </Text>
            </Pressable>
          </View>

          {/* Input dinámico según tab */}
          {activeTab === 'phone' ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NÚMERO DE TELÉFONO</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryPicker}>
                  <Text style={styles.countryFlag}>🇲🇽</Text>
                  <Text style={styles.countryCode}> MX (+52) ▾</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="55 1234 5678"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
          ) : (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={styles.emailInput}
                placeholder="tu@correo.com"
                placeholderTextColor="#BDBDBD"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          )}

          {/* Botón principal */}
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
            onPress={handleContinue}>
            <Text style={styles.btnPrimaryText}>Continuar / Iniciar sesión  →</Text>
          </Pressable>

          {/* Separador */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O CONTINÚA CON</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botones sociales */}
          <View style={styles.socialRow}>
            {['G', '🍎', 'f'].map((icon) => (
              <Pressable
                key={icon}
                style={({ pressed }) => [styles.socialBtn, pressed && styles.btnPressed]}>
                <Text style={styles.socialIcon}>{icon}</Text>
              </Pressable>
            ))}
          </View>

          {/* Promo envío gratis */}
          <View style={styles.promoRow}>
            <Text style={styles.promoIcon}>✅</Text>
            <View style={styles.promoText}>
              <Text style={styles.promoBold}>Envío gratis en tu primer pedido</Text>
              <Text style={styles.promoSub}>Únete hoy y disfruta promociones exclusivas</Text>
            </View>
          </View>

          {/* Link registro */}
          <Text style={styles.registerHint}>
            ¿Aún no tienes cuenta?{' '}
            <Text style={styles.registerLink} onPress={handleContinue}>
              Crear cuenta nueva
            </Text>
          </Text>

          {/* Términos */}
          <Text style={styles.terms}>
            Al continuar, aceptas nuestros{' '}
            <Text style={styles.termsLink}>Términos y condiciones</Text> y{' '}
            <Text style={styles.termsLink}>Aviso de Privacidad de Rappi</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },

  // ── Step banner ────────────────────────────────────────
  stepBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3F0',
    borderColor: BRAND,
    borderWidth: 1,
    borderRadius: 8,
    margin: 12,
    padding: 10,
    gap: 8,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 12, color: '#333', lineHeight: 17 },
  stepBold: { fontWeight: '700' },

  // ── Logo ───────────────────────────────────────────────
  logoWrapper: { alignItems: 'center', marginTop: 16, gap: 6 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: BRAND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 52, height: 52 },
  expressBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  expressText: { color: '#2E7D32', fontSize: 12, fontWeight: '700' },

  // ── Textos ─────────────────────────────────────────────
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 30,
  },
  subheadline: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Tabs ───────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: CARD, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 13, color: GRAY, fontWeight: '500' },
  tabTextActive: { color: '#1A1A1A', fontWeight: '700' },

  // ── Campos ────────────────────────────────────────────
  fieldGroup: { width: '100%', gap: 6 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: GRAY, letterSpacing: 0.5 },
  phoneRow: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    height: 52,
    alignItems: 'center',
    overflow: 'hidden',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    height: '100%',
  },
  countryFlag: { fontSize: 18 },
  countryCode: { fontSize: 13, color: '#333', fontWeight: '500' },
  phoneInput: { flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#1A1A1A' },
  emailInput: {
    width: '100%',
    height: 52,
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },

  // ── Botón principal ────────────────────────────────────
  btnPrimary: {
    width: '100%',
    height: 54,
    backgroundColor: BRAND,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btnPressed: { opacity: 0.75 },

  // ── Separador ─────────────────────────────────────────
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { fontSize: 11, color: GRAY, fontWeight: '600', letterSpacing: 0.5 },

  // ── Social ─────────────────────────────────────────────
  socialRow: { flexDirection: 'row', gap: 16 },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  socialIcon: { fontSize: 22 },

  // ── Promo ──────────────────────────────────────────────
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF0',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    width: '100%',
  },
  promoIcon: { fontSize: 22 },
  promoText: { flex: 1, gap: 2 },
  promoBold: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  promoSub: { fontSize: 12, color: GRAY },

  // ── Pie ────────────────────────────────────────────────
  registerHint: { fontSize: 13, color: GRAY },
  registerLink: { color: BRAND, fontWeight: '700' },
  terms: { fontSize: 11, color: GRAY, textAlign: 'center', lineHeight: 16 },
  termsLink: { color: BRAND, fontWeight: '500' },
});
