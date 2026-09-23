/**
 * Home — Bodega Peirano
 * Diseño minimalista: fondo lavanda, top bar blanco, stats en fila,
 * acceso rápido con íconos de línea, bottom tab bar con botón + central.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const BURGUNDY      = '#7B1B2E';   // burdeos principal
const BURGUNDY_DARK = '#5C0D1C';   // burdeos oscuro (sidebar, FAB)
const BURGUNDY_SOFT = '#F5EEF0';   // burdeos muy suave (fondo chips activos)
const BG            = '#F0EEF5';   // lavanda muy suave (fondo general)
const CARD          = '#FFFFFF';
const BORDER        = '#E8E2EE';
const TEXT          = '#1A1025';
const TEXT_SEC      = '#8A7F95';
const TEXT_MUT      = '#B5ADBE';

// ─── Íconos de línea (SVG como texto Unicode / caracteres) ────────────────────
// Usamos caracteres Unicode que simulan íconos de línea delgada
const ICON = {
  menu:       '≡',
  bell:       '🔔',  // se reemplaza abajo con outline simulado
  settings:   '⚙',
  home:       '⌂',
  warehouse:  '▦',
  inventory:  '◫',
  products:   '◻',
  clients:    '◎',
  cart:       '⊟',
  user:       '◯',
  plus:       '+',
  almacen:    '▤',
  botellas:   '|',
  vino:       '∪',
  personas:   '◒',
  close:      '✕',
  back:       '‹',
  logout:     '→',
};

// ─── Módulos sidebar ──────────────────────────────────────────────────────────
const MODULES = [
  { id: 'dashboard',   label: 'Dashboard',   symbol: '⊞', route: '/home' },
  { id: 'almacenes',   label: 'Almacenes',   symbol: '▦', route: '/almacenes-lista' },
  { id: 'inventario',  label: 'Inventario',  symbol: '◫', route: '/home' },
  { id: 'registros',   label: 'Registros',   symbol: '☰', route: '/home' },
  { id: 'pagos',       label: 'Pagos',       symbol: '◈', route: '/home' },
  { id: 'ventas',      label: 'Ventas',      symbol: '⊟', route: '/home' },
  { id: 'clientes',    label: 'Clientes',    symbol: '◎', route: '/home' },
  { id: 'productos',   label: 'Productos',   symbol: '◻', route: '/home' },
  { id: 'promociones', label: 'Promociones', symbol: '◇', route: '/home' },
];

// ─── Stats del dashboard ──────────────────────────────────────────────────────
const STATS = [
  { label: 'Total\nAlmacenes', value: '0', symbol: '▦', bg: '#F5EEF0', iconColor: '#7B1B2E', valColor: '#7B1B2E' },
  { label: 'Total\nBotellas',  value: '0', symbol: '⌽', bg: '#EBF4FF', iconColor: '#2563EB', valColor: '#2563EB' },
  { label: 'Productos',        value: '0', symbol: '◻', bg: '#ECFDF5', iconColor: '#059669', valColor: '#059669' },
  { label: 'Clientes',         value: '0', symbol: '◎', bg: '#FFF7ED', iconColor: '#B45309', valColor: '#B45309' },
];

// ─── Acceso rápido ────────────────────────────────────────────────────────────
const QUICK = [
  { id: 'almacenes',  label: 'Almacenes',  symbol: '▦', route: '/almacenes-lista', bg: '#F5EEF0', iconColor: '#7B1B2E' },
  { id: 'inventario', label: 'Inventario', symbol: '◫', route: '/home',            bg: '#EBF4FF', iconColor: '#2563EB' },
  { id: 'ventas',     label: 'Ventas',     symbol: '⊟', route: '/home',            bg: '#ECFDF5', iconColor: '#059669' },
  { id: 'productos',  label: 'Productos',  symbol: '◻', route: '/home',            bg: '#FFF7ED', iconColor: '#B45309' },
  { id: 'clientes',   label: 'Clientes',   symbol: '◎', route: '/home',            bg: '#F5F3FF', iconColor: '#7C3AED' },
  { id: 'pagos',      label: 'Pagos',      symbol: '◈', route: '/home',            bg: '#FFF0F6', iconColor: '#BE185D' },
];

// ─── Bottom tabs ──────────────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { id: 'home',       symbol: '⌂',  label: 'Inicio' },
  { id: 'almacenes',  symbol: '▦',  label: 'Almacenes' },
  { id: 'new',        symbol: '+',  label: '',          isFab: true },
  { id: 'ventas',     symbol: '⊟',  label: 'Ventas' },
  { id: 'perfil',     symbol: '◎',  label: 'Perfil' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeTab, setActiveTab]       = useState('home');

  function handleModule(mod: (typeof MODULES)[0]) {
    setActiveModule(mod.id);
    setSidebarOpen(false);
    if (mod.route !== '/home') router.push(mod.route as any);
  }

  function handleBottomTab(tab: (typeof BOTTOM_TABS)[0]) {
    if (tab.isFab) {
      router.push('/almacenes-lista');
      return;
    }
    if (tab.id === 'almacenes') {
      router.push('/almacenes-lista');
      return;
    }
    setActiveTab(tab.id);
  }

  function handleLogout() {
    setSidebarOpen(false);
    router.replace('/login');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

      {/* ── Top Bar ── */}
      <View style={s.topBar}>
        <Pressable
          style={({ pressed }) => [s.iconBtn, pressed && s.pressed]}
          onPress={() => setSidebarOpen(true)}>
          <Text style={s.menuIcon}>{ICON.menu}</Text>
        </Pressable>

        <Text style={s.topTitle}>BP Peirano Admin</Text>

        <View style={s.topRight}>
          <Pressable style={s.iconBtn}>
            <Text style={s.topIconSymbol}>🔔</Text>
          </Pressable>
          <Pressable style={s.iconBtn}>
            <Text style={s.topIconSymbol}>⚙</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Sidebar Modal ── */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarOpen(false)}>
        <View style={s.overlay}>
          <Pressable style={s.backdrop} onPress={() => setSidebarOpen(false)} />
          <View style={s.sidebar}>

            <View style={s.sidebarHead}>
              <View style={s.sidebarLogo}>
                <View style={s.sbLogoBox}>
                  <Text style={s.sbLogoText}>BP</Text>
                </View>
                <View>
                  <Text style={s.sbBrand}>Peirano Admin</Text>
                  <Text style={s.sbRole}>ADMINISTRATIVE PORTAL</Text>
                </View>
              </View>
              <Pressable style={s.closeBtn} onPress={() => setSidebarOpen(false)}>
                <Text style={s.closeBtnTxt}>{ICON.close}</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {MODULES.map((mod) => {
                const active = activeModule === mod.id;
                return (
                  <Pressable
                    key={mod.id}
                    style={[s.sbItem, active && s.sbItemActive]}
                    onPress={() => handleModule(mod)}>
                    <Text style={[s.sbItemSymbol, active && s.sbItemSymbolActive]}>
                      {mod.symbol}
                    </Text>
                    <Text style={[s.sbItemLabel, active && s.sbItemLabelActive]}>
                      {mod.label}
                    </Text>
                    {active && <View style={s.sbActiveDot} />}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={s.sidebarFoot}>
              <View style={s.sbUserRow}>
                <View style={s.sbAvatar}>
                  <Text style={s.sbAvatarTxt}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sbUserName}>Admin User</Text>
                  <Text style={s.sbUserEmail}>admin@peirano.com</Text>
                </View>
              </View>
              <Pressable style={s.logoutRow} onPress={handleLogout}>
                <Text style={s.logoutTxt}>Cerrar Sesión  {ICON.logout}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Contenido principal ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Breadcrumb */}
        <Text style={s.breadcrumb}>
          <Text style={s.breadcrumbMut}>Dashboard</Text>
        </Text>

        {/* Saludo */}
        <Text style={s.greeting}>¡Bienvenido!</Text>

        {/* Stats en fila de 4 */}
        <View style={s.statsRow}>
          {STATS.map((st) => (
            <View key={st.label} style={[s.statCard, { backgroundColor: st.bg }]}>
              <Text style={[s.statSymbol, { color: st.iconColor }]}>{st.symbol}</Text>
              <Text style={[s.statValue, { color: st.valColor }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Acceso rápido */}
        <Text style={s.sectionTitle}>Acceso rápido</Text>
        <View style={s.quickGrid}>
          {QUICK.map((q) => (
            <Pressable
              key={q.id}
              style={({ pressed }) => [s.quickCard, { backgroundColor: q.bg }, pressed && s.pressed]}
              onPress={() => {
                if (q.route !== '/home') router.push(q.route as any);
              }}>
              <View style={[s.quickIconBox, { backgroundColor: q.iconColor + '22' }]}>
                <Text style={[s.quickSymbol, { color: q.iconColor }]}>{q.symbol}</Text>
              </View>
              <Text style={[s.quickLabel, { color: q.iconColor }]}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <View style={s.bottomBar}>
        {BOTTOM_TABS.map((tab) => {
          if (tab.isFab) {
            return (
              <Pressable
                key={tab.id}
                style={({ pressed }) => [s.fab, pressed && s.fabPressed]}
                onPress={() => handleBottomTab(tab)}>
                <Text style={s.fabIcon}>{tab.symbol}</Text>
              </Pressable>
            );
          }
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={s.tabBtn}
              onPress={() => handleBottomTab(tab)}>
              <Text style={[s.tabSymbol, isActive && s.tabSymbolActive]}>
                {tab.symbol}
              </Text>
              <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // ── Top Bar ────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  menuIcon: {
    fontSize: 26,
    color: TEXT,
    lineHeight: 30,
  },
  iconBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: 0.2,
  },
  topRight: { flexDirection: 'row', gap: 2 },
  topIconSymbol: { fontSize: 18, color: TEXT_SEC },

  // ── Sidebar ────────────────────────────────────────────
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sidebar: {
    width: 270,
    backgroundColor: BURGUNDY_DARK,
    height: '100%',
  },
  sidebarHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sidebarLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sbLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sbLogoText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  sbBrand: { color: '#fff', fontWeight: '800', fontSize: 13 },
  sbRole: { color: 'rgba(255,255,255,0.45)', fontSize: 8, letterSpacing: 1 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  sbItemActive: { backgroundColor: 'rgba(255,255,255,0.12)' },
  sbItemSymbol: { fontSize: 16, color: 'rgba(255,255,255,0.55)', width: 22, textAlign: 'center' },
  sbItemSymbolActive: { color: '#fff' },
  sbItemLabel: { flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  sbItemLabelActive: { color: '#fff', fontWeight: '700' },
  sbActiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  sidebarFoot: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    gap: 10,
  },
  sbUserRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sbAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sbAvatarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sbUserName: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sbUserEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  logoutRow: { paddingVertical: 4 },
  logoutTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  // ── Scroll ─────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 16 },

  breadcrumb: { fontSize: 13, color: TEXT_SEC, marginBottom: 6 },
  breadcrumbMut: { color: TEXT_SEC },

  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 22,
  },

  // ── Stats ──────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
  },
  statSymbol: {
    fontSize: 22,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: TEXT_MUT,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ── Acceso rápido ──────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_SEC,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '47%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  quickSymbol: { fontSize: 20, width: 24, textAlign: 'center' },
  quickLabel: { fontSize: 14, fontWeight: '700' },

  // ── Bottom Bar ─────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  tabSymbol: { fontSize: 22, color: TEXT_MUT },
  tabSymbolActive: { color: BURGUNDY },
  tabLabel: { fontSize: 9, color: TEXT_MUT },
  tabLabelActive: { color: BURGUNDY, fontWeight: '700' },

  quickIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // FAB (botón + central)
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BURGUNDY_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: BURGUNDY_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
  fabIcon: { color: '#fff', fontSize: 26, fontWeight: '300', lineHeight: 30 },

  pressed: { opacity: 0.7 },
});
