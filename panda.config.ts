import { defineConfig, defineRecipe } from '@pandacss/dev';

const button = defineRecipe({
  className: 'button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: 'md',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background-color .12s ease, border-color .12s ease, transform .05s ease',
    _disabled: { opacity: 0.5, cursor: 'not-allowed' },
    _active: { transform: 'translateY(1px)' },
  },
  variants: {
    variant: {
      primary: {
        bg: 'brand',
        color: 'text.onBrand',
        _hover: { bg: 'brand.hover' },
      },
      secondary: {
        bg: 'surface.elevated',
        color: 'text',
        borderColor: 'border',
        _hover: { borderColor: 'brand' },
      },
      ghost: {
        bg: 'transparent',
        color: 'text',
        _hover: { bg: 'surface.elevated' },
      },
      danger: {
        bg: 'danger',
        color: 'white',
        _hover: { opacity: 0.9 },
      },
    },
    size: {
      sm: { h: '32px', px: '3', fontSize: '13px' },
      md: { h: '40px', px: '4' },
      lg: { h: '48px', px: '6', fontSize: '16px' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

const badge = defineRecipe({
  className: 'badge',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    borderRadius: 'full',
    fontSize: '12px',
    fontWeight: '600',
    px: '2.5',
    h: '22px',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      neutral: { bg: 'surface.elevated', color: 'text.muted', border: '1px solid', borderColor: 'border' },
      brand: { bg: 'brand.soft', color: 'brand' },
      success: { bg: 'success.soft', color: 'success' },
      warning: { bg: 'warning.soft', color: 'warning' },
      danger: { bg: 'danger.soft', color: 'danger' },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

const input = defineRecipe({
  className: 'input',
  base: {
    width: '100%',
    h: '44px',
    px: '3',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'border',
    bg: 'surface',
    color: 'text',
    fontSize: '15px',
    _placeholder: { color: 'text.muted' },
    _focus: { borderColor: 'brand' },
    _invalid: { borderColor: 'danger' },
  },
});

const card = defineRecipe({
  className: 'card',
  base: {
    bg: 'surface',
    border: '1px solid',
    borderColor: 'border',
    borderRadius: 'lg',
    boxShadow: 'card',
  },
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',

  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
  },

  theme: {
    extend: {
      tokens: {
        colors: {
          amber: {
            50: { value: '#FBEFE2' },
            100: { value: '#F5DAB9' },
            200: { value: '#EAB584' },
            300: { value: '#EA8A32' },
            400: { value: '#D97721' },
            500: { value: '#B85E19' },
            600: { value: '#984A13' },
            700: { value: '#3B2414' }, // brand-soft (dark)
          },
        },
        fonts: {
          body: { value: '"Inter Variable", Inter, system-ui, sans-serif' },
          display: { value: '"Barlow Condensed", "Inter Variable", system-ui, sans-serif' },
        },
        radii: {
          sm: { value: '6px' },
          md: { value: '10px' },
          lg: { value: '16px' },
          full: { value: '999px' },
        },
      },
      semanticTokens: {
        colors: {
          canvas: { value: { base: '#0B0D0F', _light: '#F2F0EB' } },
          surface: { value: { base: '#13171A', _light: '#FAF9F6' } },
          'surface.elevated': { value: { base: '#1A1F23', _light: '#FFFFFF' } },
          border: { value: { base: '#2A3035', _light: '#D5D1C9' } },

          text: { value: { base: '#F4F1EA', _light: '#181A1C' } },
          'text.muted': { value: { base: '#A9ADB0', _light: '#686D70' } },
          'text.onBrand': { value: { base: '#14100A', _light: '#FFF8EF' } },

          brand: { value: { base: '{colors.amber.400}', _light: '{colors.amber.500}' } },
          'brand.hover': { value: { base: '{colors.amber.300}', _light: '{colors.amber.600}' } },
          'brand.soft': { value: { base: '{colors.amber.700}', _light: '#F3E0C8' } },

          success: { value: { base: '#4E9F6D', _light: '#357A4C' } },
          warning: { value: { base: '#D6A23D', _light: '#A87621' } },
          danger: { value: { base: '#C8534C', _light: '#A93A33' } },
          info: { value: { base: '#5686A8', _light: '#3D6884' } },

          'success.soft': { value: { base: 'color-mix(in srgb, #4E9F6D 18%, transparent)', _light: 'color-mix(in srgb, #357A4C 14%, transparent)' } },
          'warning.soft': { value: { base: 'color-mix(in srgb, #D6A23D 18%, transparent)', _light: 'color-mix(in srgb, #A87621 14%, transparent)' } },
          'danger.soft': { value: { base: 'color-mix(in srgb, #C8534C 18%, transparent)', _light: 'color-mix(in srgb, #A93A33 14%, transparent)' } },
        },
        shadows: {
          card: {
            value: {
              base: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
              _light: '0 1px 0 0 rgba(255,255,255,0.6) inset, 0 8px 20px -14px rgba(24,26,28,0.25)',
            },
          },
        },
      },
      recipes: { button, badge, input, card },
      textStyles: {
        display: {
          value: {
            fontFamily: 'display',
            fontSize: '32px',
            lineHeight: '38px',
            fontWeight: '700',
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
          },
        },
        h1: { value: { fontFamily: 'body', fontSize: '28px', lineHeight: '34px', fontWeight: '700' } },
        h2: { value: { fontFamily: 'body', fontSize: '22px', lineHeight: '28px', fontWeight: '650' } },
        h3: { value: { fontFamily: 'body', fontSize: '18px', lineHeight: '24px', fontWeight: '650' } },
        body: { value: { fontFamily: 'body', fontSize: '16px', lineHeight: '24px', fontWeight: '400' } },
        bodySm: { value: { fontFamily: 'body', fontSize: '14px', lineHeight: '20px', fontWeight: '400' } },
        label: { value: { fontFamily: 'body', fontSize: '13px', lineHeight: '18px', fontWeight: '600' } },
        caption: { value: { fontFamily: 'body', fontSize: '12px', lineHeight: '16px', fontWeight: '500' } },
      },
    },
  },

  outdir: 'styled-system',
});
