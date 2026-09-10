/**
 * Pantalla 3 de 3 — DETALLE RESTAURANTE (estilo Rappi)
 *
 * Componentes AP3 demostrados:
 *  View + StyleSheet + Flexbox → hero, info, lista de platos
 *  Text                        → nombre, descripción, precios
 *  Pressable                   → botón "+", tabs de menú, "Ver canasta"
 *  Image (expo-image)          → hero del restaurante e imágenes de platos
 *  ScrollView                  → contenido largo scrolleable
 */
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND = '#FF441F';
const CARD = '#FFFFFF';
const BG = '#F7F7F7';
const GRAY = '#6B6B6B';
const YELLOW = '#FFC107';
const GREEN = '#2E7D32';

// ─── Tabs de menú ────────────────────────────────────────────────────────────
const MENU_TABS = ['Populares', 'Combos', 'Smash Burgers', 'Bebidas'];

// ─── Platos ──────────────────────────────────────────────────────────────────
const DISHES = [
  {
    id: '1',
    badge: '🏆 Bestseller',
    name: 'Doble Bacon Truffle Burger',
    desc: 'Pan brioche tostado con mantequilla, 2x carne Angus 120g, tocino crocante y salsa de trufa.',
    price: 'S/50.00 COP',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80',
  },
  {
    id: '2',
    badge: '🥩 Crujiente y Jugoso',
    name: 'Crispy Chicken Supreme',
    desc: 'Pechuga de pollo marinada 24h super crocante, ensalada coleslaw, pepinillos y mayo picante.',
    price: 'S/24.50 COP',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80',
  },
  {
    id: '3',
    badge: null,
    name: 'Papas Rústicas con Queso & Bacon',
    desc: 'Porción generosa de papas rústicas sazonadas con paprika y romero, queso cheddar fundido.',
    price: 'S/12.90 COP',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80',
  },
  {
    id: '4',
    badge: null,
    name: 'Limonada de Coco Artesanal',
    desc: 'Bebida refrescante y cremosa elaborada al instante con pulpa de coco natural y limón fresco.',
    price: 'S/9.50 COP',
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&q=80',
  },
];

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = 68.9;

  function addToCart(id: string) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      {/* ── Step banner ── */}
      <View style={styles.stepBanner}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
        <Text style={styles.stepText}>
          <Text style={styles.stepBold}>PASO 3 DE 3  Detalle local{'\n'}</Text>
          Elige tus favoritos y finaliza 🍴
        </Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Imagen hero ── */}
        <View style={styles.heroWrapper}>
          {/* Botones superpuestos */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Pressable style={[styles.overlayBtn, styles.heartOverlay]}>
            <Text>🤍</Text>
          </Pressable>
          <Pressable style={[styles.overlayBtn, styles.shareOverlay]}>
            <Text>↗</Text>
          </Pressable>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' }}
            style={styles.heroImage}
            contentFit="cover"
          />
          {/* Badge envío gratis */}
          <View style={styles.heroFreeBadge}>
            <Text style={styles.heroFreeBadgeText}>✅ Envío Gratis</Text>
          </View>
        </View>

        {/* ── Info del restaurante ── */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Text style={styles.restaurantName}>Burger Lab Gourmet</Text>
            <View style={styles.topPartnerBadge}>
              <Text style={styles.topPartnerText}>🏅 Top Partner</Text>
            </View>
          </View>
          <Text style={styles.restaurantTags}>
            Hamburguesas artesanales • Papas rústicas • Bebidas premium
          </Text>

          {/* Métricas */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>⭐ 4.9</Text>
              <Text style={styles.metricLabel}>(1,240+)</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>🚀 Envío sin</Text>
              <Text style={styles.metricLabel}>costo</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>🕐 20–30</Text>
              <Text style={styles.metricLabel}>min</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>♻️ Empaque</Text>
              <Text style={styles.metricLabel}>eco</Text>
            </View>
          </View>
        </View>

        {/* ── Tabs de menú ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {MENU_TABS.map((tab, i) => (
            <Pressable
              key={tab}
              style={[styles.menuTab, activeTab === i && styles.menuTabActive]}
              onPress={() => setActiveTab(i)}>
              <Text style={[styles.menuTabText, activeTab === i && styles.menuTabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Sección "Los más pedidos" ── */}
        <View style={styles.dishesSection}>
          <View style={styles.dishesSectionHeader}>
            <Text style={styles.dishesSectionTitle}>Los más pedidos</Text>
            <Text style={styles.selectionChef}>SELECCIÓN CHEF</Text>
          </View>

          {DISHES.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              <View style={styles.dishInfo}>
                {dish.badge && (
                  <View style={styles.dishBadge}>
                    <Text style={styles.dishBadgeText}>{dish.badge}</Text>
                  </View>
                )}
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishDesc} numberOfLines={3}>{dish.desc}</Text>
                <Text style={styles.dishPrice}>{dish.price}</Text>
              </View>

              {/* Imagen + botón + */}
              <View style={styles.dishImageWrapper}>
                <Image
                  source={{ uri: dish.imageUrl }}
                  style={styles.dishImage}
                  contentFit="cover"
                />
                <Pressable
                  style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
                  onPress={() => addToCart(dish.id)}>
                  <Text style={styles.addBtnText}>+</Text>
                </Pressable>
                {cart[dish.id] > 0 && (
                  <View style={styles.cartCountBadge}>
                    <Text style={styles.cartCountText}>{cart[dish.id]}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Botón flotante "Ver canasta" ── */}
      {totalItems > 0 && (
        <Pressable
          style={({ pressed }) => [styles.cartBtn, pressed && styles.cartBtnPressed]}>
          <View style={styles.cartBtnLeft}>
            <View style={styles.cartBtnBadge}>
              <Text style={styles.cartBtnBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartBtnText}>Ver canasta</Text>
          </View>
          <Text style={styles.cartBtnPrice}>S/{totalPrice.toFixed(2)} COP</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },

  // ── Step banner ──────────────────────────────────────
  stepBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3F0',
    borderColor: BRAND,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  stepBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: BRAND, justifyContent: 'center', alignItems: 'center',
  },
  stepBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 12, color: '#333', lineHeight: 17 },
  stepBold: { fontWeight: '700' },

  // ── Hero ─────────────────────────────────────────────
  heroWrapper: { position: 'relative' },
  heroImage: { width: '100%', height: 240 },
  backBtn: {
    position: 'absolute', top: 14, left: 14, zIndex: 10,
    backgroundColor: CARD, borderRadius: 20, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4,
  },
  backBtnText: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  overlayBtn: {
    position: 'absolute', top: 14, zIndex: 10,
    backgroundColor: CARD, borderRadius: 20, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4,
  },
  heartOverlay: { right: 60 },
  shareOverlay: { right: 14 },
  heroFreeBadge: {
    position: 'absolute', bottom: 12, right: 14,
    backgroundColor: '#E8F5E9', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  heroFreeBadgeText: { color: GREEN, fontSize: 12, fontWeight: '700' },

  // ── Info ─────────────────────────────────────────────
  infoSection: { backgroundColor: CARD, padding: 16, gap: 10 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  restaurantName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  topPartnerBadge: {
    backgroundColor: '#FFF8E1', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  topPartnerText: { fontSize: 11, fontWeight: '700', color: '#F57F17' },
  restaurantTags: { fontSize: 13, color: GRAY, lineHeight: 18 },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  metricItem: { alignItems: 'center', flex: 1, gap: 2 },
  metricValue: { fontSize: 12, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  metricLabel: { fontSize: 11, color: GRAY, textAlign: 'center' },
  metricDivider: { width: 1, height: 30, backgroundColor: '#E0E0E0' },

  // ── Tabs ─────────────────────────────────────────────
  tabsRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  menuTab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F2F2F2',
  },
  menuTabActive: {
    backgroundColor: BRAND,
  },
  menuTabText: { fontSize: 13, fontWeight: '600', color: GRAY },
  menuTabTextActive: { color: '#fff', fontWeight: '700' },

  // ── Dishes section ───────────────────────────────────
  dishesSection: { padding: 14, gap: 2 },
  dishesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dishesSectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  selectionChef: { fontSize: 11, fontWeight: '700', color: BRAND, letterSpacing: 0.5 },

  // ── Dish card ─────────────────────────────────────────
  dishCard: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  dishInfo: { flex: 1, gap: 5 },
  dishBadge: {
    backgroundColor: '#FFF8E1', borderRadius: 20, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3,
  },
  dishBadgeText: { fontSize: 11, fontWeight: '700', color: '#F57F17' },
  dishName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', lineHeight: 20 },
  dishDesc: { fontSize: 12, color: GRAY, lineHeight: 17 },
  dishPrice: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginTop: 4 },

  dishImageWrapper: { position: 'relative', width: 100 },
  dishImage: { width: 100, height: 100, borderRadius: 10 },
  addBtn: {
    position: 'absolute', bottom: -8, right: -6,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BRAND, justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: BRAND, shadowOpacity: 0.4, shadowRadius: 4,
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 26 },
  addBtnPressed: { opacity: 0.75 },
  cartCountBadge: {
    position: 'absolute', top: -6, right: -6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  cartCountText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // ── Botón canasta flotante ────────────────────────────
  cartBtn: {
    position: 'absolute', bottom: 20, left: 16, right: 16,
    backgroundColor: BRAND, borderRadius: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
    elevation: 6, shadowColor: BRAND, shadowOpacity: 0.4, shadowRadius: 8,
  },
  cartBtnPressed: { opacity: 0.85 },
  cartBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartBtnBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  cartBtnBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  cartBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cartBtnPrice: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
