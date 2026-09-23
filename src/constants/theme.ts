/**
 * Colores y constantes de marca — Bodega Peirano
 */
import { Platform } from 'react-native';

// ─── Paleta de marca ──────────────────────────────────────────────────────────
export const Brand = {
  primary: '#8B1A1A',       // Burdeos principal
  primaryDark: '#6B1212',   // Burdeos oscuro (hover / pressed)
  primaryLight: '#F5E6E6',  // Burdeos muy claro (fondo alertas)
  accent: '#C0392B',        // Rojo acento
  sidebar: '#7B1111',       // Burdeos sidebar
  sidebarDark: '#5C0D0D',   // Sidebar fondo oscuro / footer
} as const;

// ─── Neutros ──────────────────────────────────────────────────────────────────
export const Neutral = {
  white: '#FFFFFF',
  bg: '#F5F6FA',            // Fondo general app
  card: '#FFFFFF',          // Fondo tarjetas
  border: '#E2E8F0',        // Bordes suaves
  borderDark: '#CBD5E0',    // Bordes marcados
  text: '#1A202C',          // Texto principal
  textSecondary: '#718096', // Texto secundario
  textMuted: '#A0AEC0',     // Texto apagado
  placeholder: '#BDBDBD',  // Placeholders
  divider: '#EDF2F7',       // Separadores
  inputBg: '#FAFAFA',       // Fondo inputs
} as const;

// ─── Estado ───────────────────────────────────────────────────────────────────
export const Status = {
  success: '#48BB78',
  successBg: '#F0FFF4',
  error: '#E53E3E',
  errorBg: '#FFF5F5',
  warning: '#ED8936',
  warningBg: '#FFFAF0',
  info: '#4299E1',
  infoBg: '#EBF8FF',
} as const;

// ─── Espaciado ────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Radios ───────────────────────────────────────────────────────────────────
export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// ─── Sombras ──────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
} as const;

// ─── Compatibilidad con código anterior ───────────────────────────────────────
export const Colors = {
  light: {
    text: Neutral.text,
    background: Neutral.bg,
    backgroundElement: Neutral.divider,
    backgroundSelected: Neutral.border,
    textSecondary: Neutral.textSecondary,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A202C',
    backgroundElement: '#2D3748',
    backgroundSelected: '#4A5568',
    textSecondary: '#A0AEC0',
  },
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
});
