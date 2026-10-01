import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import {
  slate,
  slateDark,
  slateA,
  slateDarkA,
  ruby,
  rubyDark,
  rubyA,
  rubyDarkA,
  blackA,
  whiteA,
  red,
  redDark,
  redA,
  redDarkA,
  purpleA,
  purpleDarkA,
} from "@radix-ui/colors"

function formatScale(scaleObj: Record<string, string>) {
  const result: Record<string, { value: string }> = {}
  for (const [key, value] of Object.entries(scaleObj)) {
    const step = key.replace(/^[a-zA-Z]+/, "")
    result[step] = { value }
  }
  return result
}

function formatNumericScale(scaleObj: Record<string, string>, prefix: string) {
  const base = formatScale(scaleObj)
  const numericSteps: Record<string, string> = {
    "50": `${prefix}1`,
    "100": `${prefix}2`,
    "200": `${prefix}3`,
    "300": `${prefix}4`,
    "400": `${prefix}5`,
    "500": `${prefix}6`,
    "600": `${prefix}7`,
    "700": `${prefix}8`,
    "800": `${prefix}9`,
    "900": `${prefix}10`,
    "950": `${prefix}11`,
  }
  for (const [step, key] of Object.entries(numericSteps)) {
    if (scaleObj[key]) {
      base[step] = { value: scaleObj[key] }
    }
  }
  return base
}

function formatSemanticAlphaScale(lightPrefix: string, darkPrefix: string) {
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

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "bg",
      color: "fg",
      fontFamily: "body",
      lineHeight: "1.5",
      textRendering: "optimizeLegibility",
    },
    "#root": {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    "*": {
      boxSizing: "border-box",
    },
    "::selection": {
      backgroundColor: "ruby.subtle",
      color: "ruby.fg",
    },
    "::-webkit-scrollbar": {
      width: "0.375rem",
      height: "0.375rem",
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "border.subtle",
      borderRadius: "9999rem",
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "border.default",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Fraunces', Georgia, serif" },
        body: { value: "'Plus Jakarta Sans', system-ui, sans-serif" },
        reading: { value: "'Literata', 'Newsreader', Georgia, serif" },
        editorial: { value: "'Newsreader', 'Literata', Georgia, serif" },
        ui: { value: "'Plus Jakarta Sans', system-ui, sans-serif" },
        analysis: { value: "'Epilogue', system-ui, sans-serif" },
        mono: { value: "'JetBrains Mono', monospace" },
      },
      radii: {
        xs: { value: "0.25rem" },
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.75rem" },
        xl: { value: "1rem" },
        "2xl": { value: "1.25rem" },
        "3xl": { value: "1.5rem" },
        full: { value: "9999rem" },
      },
      shadows: {
        subtle: {
          value: "0 0.0625rem 0.1875rem {colors.blackA.3}",
        },
        card: {
          value: "0 0.25rem 0.75rem -0.125rem {colors.blackA.4}",
        },
        glow: {
          value: "0 0 1.25rem {colors.rubyA.7}",
        },
        glowLg: {
          value: "0 0 2rem {colors.rubyA.8}",
        },
        elevation: {
          value: "0 1.25rem 2.5rem -0.5rem {colors.blackA.9}",
        },
      },
      colors: {
        slate: formatNumericScale(slate, "slate"),
        slateDark: formatNumericScale(slateDark, "slateDark"),
        slateA: formatScale(slateA),
        slateDarkA: formatScale(slateDarkA),
        ruby: formatNumericScale(ruby, "ruby"),
        rubyDark: formatNumericScale(rubyDark, "rubyDark"),
        rubyA: formatScale(rubyA),
        rubyDarkA: formatScale(rubyDarkA),
        blackA: formatScale(blackA),
        whiteA: formatScale(whiteA),
        red: formatNumericScale(red, "red"),
        redDark: formatNumericScale(redDark, "redDark"),
        redA: formatScale(redA),
        redDarkA: formatScale(redDarkA),
        purpleA: formatScale(purpleA),
        purpleDarkA: formatScale(purpleDarkA),
      },
    },
    layerStyles: {
      glassHeader: {
        value: {
          backdropFilter: "blur(1.5rem)",
          backgroundColor: "{colors.glass.header}",
          borderBottomWidth: "0.0625rem",
          borderBottomColor: "{colors.glass.borderSubtle}",
          boxShadow: {
            _light: "0 0.25rem 1rem {colors.blackA.2}",
            _dark: "0 0.25rem 1.5rem {colors.blackA.6}",
          },
        },
      },
      glassPanel: {
        value: {
          backdropFilter: "blur(1.5rem)",
          backgroundColor: "{colors.glass.panel}",
          borderWidth: "0.0625rem",
          borderColor: "{colors.glass.borderSubtle}",
          borderRadius: "2xl",
          boxShadow: {
            _light: "0 0.5rem 1.5rem {colors.blackA.2}",
            _dark: "0 1rem 2.5rem {colors.blackA.7}, inset 0 0.0625rem 0.0625rem {colors.whiteA.2}",
          },
        },
      },
      glassModal: {
        value: {
          backdropFilter: "blur(2rem)",
          backgroundColor: "{colors.glass.modal}",
          borderWidth: "0.0625rem",
          borderColor: "{colors.glass.border}",
          borderRadius: "3xl",
          boxShadow: {
            _light: "0 1.25rem 2.5rem -0.5rem {colors.blackA.4}, 0 0 1.5rem {colors.rubyA.3}",
            _dark: "0 1.5rem 3.5rem -0.5rem {colors.blackA.9}, 0 0 2rem {colors.rubyA.5}",
          },
        },
      },
      cardInteractive: {
        value: {
          backdropFilter: "blur(1.25rem)",
          backgroundColor: "{colors.glass.card}",
          borderWidth: "0.0625rem",
          borderColor: "{colors.glass.borderSubtle}",
          borderRadius: "xl",
          boxShadow: {
            _light: "0 0.5rem 1.5rem {colors.blackA.2}",
            _dark: "0 0.75rem 2rem {colors.blackA.7}, inset 0 0.0625rem 0.0625rem {colors.whiteA.2}",
          },
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          _hover: {
            borderColor: "ruby.solid",
            boxShadow: {
              _light: "0 0.75rem 2rem -0.25rem {colors.rubyA.4}, 0 0 1.25rem {colors.rubyA.3}",
              _dark: "0 1rem 2.5rem -0.25rem {colors.blackA.9}, 0 0 1.5rem {colors.rubyA.6}",
            },
          },
        },
      },
      ambientGlow: {
        value: {
          backgroundImage: {
            _light: "radial-gradient(ellipse 60% 50% at 50% -10%, {colors.rubyA.3} 0%, transparent 80%)",
            _dark: "radial-gradient(ellipse 60% 50% at 50% -10%, {colors.rubyA.5} 0%, transparent 80%)",
          },
        },
      },
    },
    semanticTokens: {
      colors: {
        ruby: {
          solid: { value: { _light: "{colors.ruby.9}", _dark: "{colors.rubyDark.9}" } },
          contrast: { value: { _light: "#ffffff", _dark: "#ffffff" } },
          fg: { value: { _light: "{colors.ruby.11}", _dark: "{colors.rubyDark.11}" } },
          muted: { value: { _light: "{colors.ruby.4}", _dark: "{colors.rubyDark.4}" } },
          subtle: { value: { _light: "{colors.ruby.3}", _dark: "{colors.rubyDark.3}" } },
          emphasized: { value: { _light: "{colors.ruby.5}", _dark: "{colors.rubyDark.5}" } },
          focusRing: { value: { _light: "{colors.ruby.8}", _dark: "{colors.rubyDark.8}" } },
          border: { value: { _light: "{colors.ruby.6}", _dark: "{colors.rubyDark.6}" } },
        },
        rubyA: formatSemanticAlphaScale("rubyA", "rubyDarkA"),
        slateA: formatSemanticAlphaScale("slateA", "slateDarkA"),
        redA: formatSemanticAlphaScale("redA", "redDarkA"),
        purpleA: formatSemanticAlphaScale("purpleA", "purpleDarkA"),
        glass: {
          header: { value: { _light: "{colors.whiteA.9}", _dark: "{colors.slateDarkA.2}" } },
          panel: { value: { _light: "{colors.whiteA.8}", _dark: "{colors.slateDarkA.3}" } },
          container: { value: { _light: "{colors.whiteA.10}", _dark: "{colors.slateDarkA.2}" } },
          sidebar: { value: { _light: "{colors.whiteA.7}", _dark: "{colors.blackA.5}" } },
          card: { value: { _light: "{colors.whiteA.9}", _dark: "{colors.slateDarkA.4}" } },
          modal: { value: { _light: "{colors.whiteA.11}", _dark: "{colors.slateDarkA.5}" } },
          input: { value: { _light: "{colors.whiteA.8}", _dark: "{colors.slateDarkA.3}" } },
          border: { value: { _light: "{colors.blackA.3}", _dark: "{colors.whiteA.3}" } },
          borderSubtle: { value: { _light: "{colors.blackA.2}", _dark: "{colors.whiteA.2}" } },
          borderStrong: { value: { _light: "{colors.blackA.4}", _dark: "{colors.whiteA.4}" } },
          hover: { value: { _light: "{colors.blackA.2}", _dark: "{colors.whiteA.2}" } },
          active: { value: { _light: "{colors.blackA.3}", _dark: "{colors.whiteA.3}" } },
        },
        slate: {
          solid: { value: { _light: "{colors.slate.9}", _dark: "{colors.slateDark.9}" } },
          contrast: { value: { _light: "#ffffff", _dark: "{colors.slateDark.1}" } },
          fg: { value: { _light: "{colors.slate.12}", _dark: "{colors.slateDark.12}" } },
          muted: { value: { _light: "{colors.slate.4}", _dark: "{colors.slateDark.4}" } },
          subtle: { value: { _light: "{colors.slate.3}", _dark: "{colors.slateDark.3}" } },
          emphasized: { value: { _light: "{colors.slate.5}", _dark: "{colors.slateDark.5}" } },
          focusRing: { value: { _light: "{colors.slate.8}", _dark: "{colors.slateDark.8}" } },
          border: { value: { _light: "{colors.slate.6}", _dark: "{colors.slateDark.6}" } },
        },
        gray: {
          solid: { value: { _light: "{colors.slate.9}", _dark: "{colors.slateDark.9}" } },
          contrast: { value: { _light: "#ffffff", _dark: "{colors.slateDark.1}" } },
          fg: { value: { _light: "{colors.slate.12}", _dark: "{colors.slateDark.12}" } },
          muted: { value: { _light: "{colors.slate.4}", _dark: "{colors.slateDark.4}" } },
          subtle: { value: { _light: "{colors.slate.3}", _dark: "{colors.slateDark.3}" } },
          emphasized: { value: { _light: "{colors.slate.5}", _dark: "{colors.slateDark.5}" } },
          focusRing: { value: { _light: "{colors.slate.8}", _dark: "{colors.slateDark.8}" } },
          border: { value: { _light: "{colors.slate.6}", _dark: "{colors.slateDark.6}" } },
        },
        brand: {
          solid: { value: { _light: "{colors.ruby.9}", _dark: "{colors.rubyDark.9}" } },
          contrast: { value: { _light: "#ffffff", _dark: "#ffffff" } },
          fg: { value: { _light: "{colors.ruby.11}", _dark: "{colors.rubyDark.11}" } },
          muted: { value: { _light: "{colors.ruby.4}", _dark: "{colors.rubyDark.4}" } },
          subtle: { value: { _light: "{colors.ruby.3}", _dark: "{colors.rubyDark.3}" } },
          emphasized: { value: { _light: "{colors.ruby.5}", _dark: "{colors.rubyDark.5}" } },
          focusRing: { value: { _light: "{colors.ruby.8}", _dark: "{colors.rubyDark.8}" } },
          border: { value: { _light: "{colors.ruby.6}", _dark: "{colors.rubyDark.6}" } },
        },
        bg: {
          DEFAULT: { value: { _light: "{colors.slate.1}", _dark: "{colors.slateDark.1}" } },
          subtle: { value: { _light: "{colors.slate.2}", _dark: "{colors.slateDark.2}" } },
          muted: { value: { _light: "{colors.slate.3}", _dark: "{colors.slateDark.3}" } },
          emphasized: { value: { _light: "{colors.slate.4}", _dark: "{colors.slateDark.4}" } },
          panel: { value: { _light: "{colors.slate.2}", _dark: "{colors.slateDark.2}" } },
          surface: { value: { _light: "{colors.slate.3}", _dark: "{colors.slateDark.3}" } },
          hover: { value: { _light: "{colors.slate.4}", _dark: "{colors.slateDark.4}" } },
          canvas: { value: { _light: "{colors.slate.1}", _dark: "{colors.slateDark.1}" } },
        },
        fg: {
          DEFAULT: { value: { _light: "{colors.slate.12}", _dark: "{colors.slateDark.12}" } },
          muted: { value: { _light: "{colors.slate.11}", _dark: "{colors.slateDark.11}" } },
          subtle: { value: { _light: "{colors.slate.10}", _dark: "{colors.slateDark.10}" } },
          inverted: { value: { _light: "{colors.slateDark.12}", _dark: "{colors.slate.12}" } },
        },
        border: {
          DEFAULT: { value: { _light: "{colors.slate.6}", _dark: "{colors.slateDark.6}" } },
          subtle: { value: { _light: "{colors.slate.4}", _dark: "{colors.slateDark.4}" } },
          muted: { value: { _light: "{colors.slate.5}", _dark: "{colors.slateDark.5}" } },
          emphasized: { value: { _light: "{colors.slate.7}", _dark: "{colors.slateDark.7}" } },
          focusRing: { value: { _light: "{colors.ruby.8}", _dark: "{colors.rubyDark.8}" } },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
