export function formatSemanticAlphaScale(lightPrefix: string, darkPrefix: string) {
  const result: Record<string, { value: { _light: string; _dark: string } }> = {}
  for (let i = 1; i <= 12; i++) {
    result[i.toString()] = {
      value: {
        _light: `{colors.${lightPrefix}.${i}}`,
        _dark: `{colors.${darkPrefix}.${i}}`,
      },
    }
  }
  return result
}

export const semanticColorTokens = {
  ruby: {
    solid: { value: { _light: '{colors.ruby.9}', _dark: '{colors.rubyDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '#ffffff' } },
    fg: { value: { _light: '{colors.ruby.11}', _dark: '{colors.rubyDark.11}' } },
    muted: { value: { _light: '{colors.ruby.4}', _dark: '{colors.rubyDark.4}' } },
    subtle: { value: { _light: '{colors.ruby.3}', _dark: '{colors.rubyDark.3}' } },
    emphasized: { value: { _light: '{colors.ruby.5}', _dark: '{colors.rubyDark.5}' } },
    focusRing: { value: { _light: '{colors.ruby.8}', _dark: '{colors.rubyDark.8}' } },
    border: { value: { _light: '{colors.ruby.6}', _dark: '{colors.rubyDark.6}' } },
  },
  rubyA: formatSemanticAlphaScale('rubyA', 'rubyDarkA'),
  slate: {
    solid: { value: { _light: '{colors.slate.9}', _dark: '{colors.slateDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '{colors.slateDark.1}' } },
    fg: { value: { _light: '{colors.slate.12}', _dark: '{colors.slateDark.12}' } },
    muted: { value: { _light: '{colors.slate.4}', _dark: '{colors.slateDark.4}' } },
    subtle: { value: { _light: '{colors.slate.3}', _dark: '{colors.slateDark.3}' } },
    emphasized: { value: { _light: '{colors.slate.5}', _dark: '{colors.slateDark.5}' } },
    focusRing: { value: { _light: '{colors.slate.8}', _dark: '{colors.slateDark.8}' } },
    border: { value: { _light: '{colors.slate.6}', _dark: '{colors.slateDark.6}' } },
  },
  slateA: formatSemanticAlphaScale('slateA', 'slateDarkA'),
  gray: {
    solid: { value: { _light: '{colors.slate.9}', _dark: '{colors.slateDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '{colors.slateDark.1}' } },
    fg: { value: { _light: '{colors.slate.12}', _dark: '{colors.slateDark.12}' } },
    muted: { value: { _light: '{colors.slate.4}', _dark: '{colors.slateDark.4}' } },
    subtle: { value: { _light: '{colors.slate.3}', _dark: '{colors.slateDark.3}' } },
    emphasized: { value: { _light: '{colors.slate.5}', _dark: '{colors.slateDark.5}' } },
    focusRing: { value: { _light: '{colors.slate.8}', _dark: '{colors.slateDark.8}' } },
    border: { value: { _light: '{colors.slate.6}', _dark: '{colors.slateDark.6}' } },
  },
  brand: {
    solid: { value: { _light: '{colors.ruby.9}', _dark: '{colors.rubyDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '#ffffff' } },
    fg: { value: { _light: '{colors.ruby.11}', _dark: '{colors.rubyDark.11}' } },
    muted: { value: { _light: '{colors.ruby.4}', _dark: '{colors.rubyDark.4}' } },
    subtle: { value: { _light: '{colors.ruby.3}', _dark: '{colors.rubyDark.3}' } },
    emphasized: { value: { _light: '{colors.ruby.5}', _dark: '{colors.rubyDark.5}' } },
    focusRing: { value: { _light: '{colors.ruby.8}', _dark: '{colors.rubyDark.8}' } },
    border: { value: { _light: '{colors.ruby.6}', _dark: '{colors.rubyDark.6}' } },
  },
  red: {
    solid: { value: { _light: '{colors.red.9}', _dark: '{colors.redDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '#ffffff' } },
    fg: { value: { _light: '{colors.red.11}', _dark: '{colors.redDark.11}' } },
    muted: { value: { _light: '{colors.red.4}', _dark: '{colors.redDark.4}' } },
    subtle: { value: { _light: '{colors.red.3}', _dark: '{colors.redDark.3}' } },
    emphasized: { value: { _light: '{colors.red.5}', _dark: '{colors.redDark.5}' } },
    focusRing: { value: { _light: '{colors.red.8}', _dark: '{colors.redDark.8}' } },
    border: { value: { _light: '{colors.red.6}', _dark: '{colors.redDark.6}' } },
  },
  redA: formatSemanticAlphaScale('redA', 'redDarkA'),
  purple: {
    solid: { value: { _light: '{colors.purple.9}', _dark: '{colors.purpleDark.9}' } },
    contrast: { value: { _light: '#ffffff', _dark: '#ffffff' } },
    fg: { value: { _light: '{colors.purple.11}', _dark: '{colors.purpleDark.11}' } },
    muted: { value: { _light: '{colors.purple.4}', _dark: '{colors.purpleDark.4}' } },
    subtle: { value: { _light: '{colors.purple.3}', _dark: '{colors.purpleDark.3}' } },
    emphasized: { value: { _light: '{colors.purple.5}', _dark: '{colors.purpleDark.5}' } },
    focusRing: { value: { _light: '{colors.purple.8}', _dark: '{colors.purpleDark.8}' } },
    border: { value: { _light: '{colors.purple.6}', _dark: '{colors.purpleDark.6}' } },
  },
  purpleA: formatSemanticAlphaScale('purpleA', 'purpleDarkA'),
  glass: {
    header: { value: { _light: '{colors.whiteA.9}', _dark: '{colors.slateDarkA.2}' } },
    panel: { value: { _light: '{colors.whiteA.8}', _dark: '{colors.slateDarkA.3}' } },
    container: { value: { _light: '{colors.whiteA.10}', _dark: '{colors.slateDarkA.2}' } },
    sidebar: { value: { _light: '{colors.whiteA.7}', _dark: '{colors.blackA.5}' } },
    card: { value: { _light: '{colors.whiteA.9}', _dark: '{colors.slateDarkA.4}' } },
    modal: { value: { _light: '{colors.whiteA.11}', _dark: '{colors.slateDarkA.5}' } },
    input: { value: { _light: '{colors.whiteA.8}', _dark: '{colors.slateDarkA.3}' } },
    border: { value: { _light: '{colors.blackA.3}', _dark: '{colors.whiteA.3}' } },
    borderSubtle: { value: { _light: '{colors.blackA.2}', _dark: '{colors.whiteA.2}' } },
    borderStrong: { value: { _light: '{colors.blackA.4}', _dark: '{colors.whiteA.4}' } },
    hover: { value: { _light: '{colors.blackA.2}', _dark: '{colors.whiteA.2}' } },
    active: { value: { _light: '{colors.blackA.3}', _dark: '{colors.whiteA.3}' } },
    backdrop: { value: { _light: '{colors.blackA.7}', _dark: '{colors.blackA.9}' } },
  },
  bg: {
    DEFAULT: { value: { _light: '{colors.slate.1}', _dark: '{colors.slateDark.1}' } },
    subtle: { value: { _light: '{colors.slate.2}', _dark: '{colors.slateDark.2}' } },
    muted: { value: { _light: '{colors.slate.3}', _dark: '{colors.slateDark.3}' } },
    emphasized: { value: { _light: '{colors.slate.4}', _dark: '{colors.slateDark.4}' } },
    panel: { value: { _light: '{colors.slate.2}', _dark: '{colors.slateDark.2}' } },
    surface: { value: { _light: '{colors.slate.3}', _dark: '{colors.slateDark.3}' } },
    hover: { value: { _light: '{colors.slate.4}', _dark: '{colors.slateDark.4}' } },
    canvas: { value: { _light: '{colors.slate.1}', _dark: '{colors.slateDark.1}' } },
  },
  fg: {
    DEFAULT: { value: { _light: '{colors.slate.12}', _dark: '{colors.slateDark.12}' } },
    muted: { value: { _light: '{colors.slate.11}', _dark: '{colors.slateDark.11}' } },
    subtle: { value: { _light: '{colors.slate.10}', _dark: '{colors.slateDark.10}' } },
    inverted: { value: { _light: '{colors.slateDark.12}', _dark: '{colors.slate.12}' } },
  },
  border: {
    DEFAULT: { value: { _light: '{colors.slate.6}', _dark: '{colors.slateDark.6}' } },
    subtle: { value: { _light: '{colors.slate.4}', _dark: '{colors.slateDark.4}' } },
    muted: { value: { _light: '{colors.slate.5}', _dark: '{colors.slateDark.5}' } },
    emphasized: { value: { _light: '{colors.slate.7}', _dark: '{colors.slateDark.7}' } },
    focusRing: { value: { _light: '{colors.ruby.8}', _dark: '{colors.rubyDark.8}' } },
  },
  aura: {
    gridDot: { value: { _light: '{colors.blackA.2}', _dark: '{colors.whiteA.2}' } },
  },
  gradient: {
    brandPrimary: {
      value: 'linear-gradient(135deg, {colors.ruby.9} 0%, {colors.ruby.10} 100%)',
    },
    brandPrimaryHover: {
      value: 'linear-gradient(135deg, {colors.ruby.8} 0%, {colors.ruby.9} 100%)',
    },
    brandPrimaryActive: {
      value: 'linear-gradient(135deg, {colors.ruby.10} 0%, {colors.ruby.11} 100%)',
    },
    brandTextTitle: {
      value: {
        _light: 'linear-gradient(135deg, {colors.slate.12} 30%, {colors.slate.11} 100%)',
        _dark: 'linear-gradient(135deg, #ffffff 40%, {colors.whiteA.9} 100%)',
      },
    },
    emptyIllustrationBg: {
      value: {
        _light: 'linear-gradient(145deg, {colors.slate.3} 0%, {colors.slate.1} 100%)',
        _dark: 'linear-gradient(145deg, {colors.slateDark.2} 0%, {colors.slateDark.1} 100%)',
      },
    },
    emptyHalo: {
      value: 'radial-gradient(circle, {colors.rubyA.6} 0%, {colors.purpleA.4} 45%, transparent 70%)',
    },
    sparkleCircle: {
      value: 'linear-gradient(135deg, {colors.ruby.9} 0%, {colors.ruby.10} 100%)',
    },
  },
}
