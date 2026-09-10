/**
 * Pantalla 2 de 3 — HOME / INICIO (estilo Rappi)
 *
 * Componentes AP3 demostrados:
 *  View + StyleSheet + Flexbox → header, cards, secciones
 *  Text                        → títulos, subtítulos, etiquetas
 *  TextInput                   → barra de búsqueda
 *  Pressable                   → categorías, tarjetas de restaurante
 *  Image (expo-image)          → imágenes de restaurantes
 *  ScrollView                  → lista scrolleable
 */
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND = '#FF441F';
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const GRAY = '#6B6B6B';
const GRAY_LIGHT = '#F2F2F2';
const YELLOW = '#FFC107';

// ─── Datos de ejemplo ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Hamburguesas', emoji: '🍔' },
  { id: '2', label: 'Pizza', emoji: '🍕' },
  { id: '3', label: 'Saludable', emoji: '🥗' },
  { id: '4', label: 'Sushi', emoji: '🍱' },
  { id: '5', label: 'Tacos', emoji: '🌮' },
];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Burger Lab Gourmet',
    tags: 'Hamburguesas & Papas • Artesanales • Gourmet',
    rating: '4.9',
    reviews: '1.2k',
    time: '20–30 min',
    promo: 'Envío Gratis Prime',
    coupon: '$2.500 cupón aplicado',
    recommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  },
  {
    id: '2',
    name: 'Bella Italia Trattoria',
    tags: 'Pastas & Pizzas • Cocina Italiana Tradicional',
    rating: '4.8',
    reviews: '980',
    time: '30–40 min',
    promo: null,
    coupon: null,
    recommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  },
  {
    id: '3',
    name: 'Green Bowl',
    tags: 'Ensaladas • Bowls saludables • Vegano',
    rating: '4.7',
    reviews: '540',
    time: '15–25 min',
    promo: null,
    coupon: null,
    recommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Step banner ── */}
      <View style={styles.stepBanner}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
        <Text style={styles.stepText}>
          <Text style={styles.stepBold}>PASO 2 DE 3  Flujo Restaurantes{'\n'}</Text>
          Acción guiada: Toca <Text style={styles.stepBold}>Burger Lab Gourmet</Text> para explorar el detalle local.
        </Text>
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLabel}>ENTREGAR EN</Text>
          <Pressable style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Cra. 15 #85-30, Bogotá</Text>
            <Text style={styles.locationChevron}>▾</Text>
          </Pressable>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerMeta}>⏱ 25–35 min</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Búsqueda ── */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar comida, hamburguesas, sushi..."
            placeholderTextColor="#BDBDBD"
          />
        </View>

        {/* ── Categorías ── */}
        <Text style={styles.sectionTitle}>Explorar antojos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [styles.categoryChip, pressed && styles.pressed]}>
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Banner promo ── */}
        <View style={styles.promoBanner}>
          <View style={styles.promoBannerLeft}>
            <Text style={styles.promoBannerTag}>🟠 Rappi Prime Days</Text>
            <Text style={styles.promoBannerHeadline}>Hasta 40% OFF</Text>
            <Text style={styles.promoBannerSub}>
              En selección gourmet exclusiva{'\n'}y envíos gratis
            </Text>
            <Text style={styles.promoBannerNote}>Aplica con tarjetas seleccionadas</Text>
            <Pressable style={styles.promoBannerBtn}>
              <Text style={styles.promoBannerBtnText}>Aprovechar</Text>
            </Pressable>
          </View>
          <View style={styles.promoBannerRight}>
            <Text style={styles.promoBannerDay}>HOY</Text>
          </View>
        </View>

        {/* ── Lista Restaurantes ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Restaurantes cerca</Text>
          <Text style={styles.sectionBadge}>Abiertos</Text>
          <Text style={styles.sectionMeta}>  Orden: Relevancia</Text>
        </View>

        {RESTAURANTS.map((r) => (
          <Pressable
            key={r.id}
            style={({ pressed }) => [styles.restaurantCard, pressed && styles.pressed]}
            onPress={() => router.push('/restaurant-detail')}>

            {/* Imagen */}
            <View style={styles.restaurantImageWrapper}>
              {r.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>⭐ Recomendado</Text>
                </View>
              )}
              <Image source={{ uri: r.imageUrl }} style={styles.restaurantImage} contentFit="cover" />
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>⏱ {r.time}</Text>
              </View>
              <Pressable style={styles.heartBtn}>
                <Text>🤍</Text>
              </Pressable>
            </View>

            {/* Info */}
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantRow}>
                <Text style={styles.restaurantName}>{r.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {r.rating}</Text>
                  <Text style={styles.reviewsText}> ({r.reviews}+)</Text>
                </View>
              </View>
              <Text style={styles.restaurantTags}>{r.tags}</Text>
              {r.promo && (
                <View style={styles.promoTag}>
                  <Text style={styles.promoTagText}>✅ {r.promo}</Text>
                </View>
              )}
              {r.coupon && <Text style={styles.couponText}>🏷 {r.coupon}</Text>}
            </View>
          </Pressable>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

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

  // ── Header ───────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  headerLeft: { gap: 2 },
  headerLabel: { fontSize: 10, color: GRAY, fontWeight: '600', letterSpacing: 0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationIcon: { fontSize: 14 },
  locationText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  locationChevron: { fontSize: 12, color: GRAY },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerMeta: { fontSize: 12, color: GRAY },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BRAND, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  scroll: { flex: 1 },

  // ── Búsqueda ─────────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 46,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  // ── Secciones ─────────────────────────────────────────
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginHorizontal: 14, marginTop: 20, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 14, marginTop: 20, marginBottom: 10 },
  sectionBadge: { fontSize: 12, color: '#2E7D32', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, fontWeight: '700', marginLeft: 8 },
  sectionMeta: { fontSize: 12, color: GRAY },

  // ── Categorías ────────────────────────────────────────
  categoriesRow: { paddingHorizontal: 14, gap: 10, paddingBottom: 4 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    gap: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3,
  },
  categoryEmoji: { fontSize: 16 },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },

  // ── Banner promo ──────────────────────────────────────
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    marginHorizontal: 14,
    marginTop: 8,
    padding: 16,
    overflow: 'hidden',
  },
  promoBannerLeft: { flex: 1, gap: 4 },
  promoBannerTag: { fontSize: 12, fontWeight: '700', color: '#E65100' },
  promoBannerHeadline: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  promoBannerSub: { fontSize: 13, color: '#333', lineHeight: 18 },
  promoBannerNote: { fontSize: 11, color: GRAY },
  promoBannerBtn: {
    marginTop: 8, backgroundColor: BRAND, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 7, alignSelf: 'flex-start',
  },
  promoBannerBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  promoBannerRight: {
    width: 50, justifyContent: 'center', alignItems: 'center',
  },
  promoBannerDay: { fontSize: 12, fontWeight: '900', color: BRAND, textAlign: 'center' },

  // ── Tarjeta restaurante ───────────────────────────────
  restaurantCard: {
    backgroundColor: CARD, borderRadius: 16, marginHorizontal: 14,
    marginBottom: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6,
  },
  restaurantImageWrapper: { position: 'relative' },
  restaurantImage: { width: '100%', height: 180 },
  recommendedBadge: {
    position: 'absolute', top: 10, left: 10, zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  recommendedText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  timeBadge: {
    position: 'absolute', bottom: 10, left: 10,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  timeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heartBtn: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: CARD, borderRadius: 20, width: 34, height: 34,
    justifyContent: 'center', alignItems: 'center',
  },
  restaurantInfo: { padding: 14, gap: 5 },
  restaurantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '700', color: YELLOW },
  reviewsText: { fontSize: 12, color: GRAY },
  restaurantTags: { fontSize: 13, color: GRAY },
  promoTag: {
    backgroundColor: '#E8F5E9', borderRadius: 20, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3,
  },
  promoTagText: { fontSize: 12, color: '#2E7D32', fontWeight: '700' },
  couponText: { fontSize: 12, color: GRAY },

  pressed: { opacity: 0.8 },
});
