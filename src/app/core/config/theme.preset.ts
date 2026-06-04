import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

const semanticColorScheme = {
  primary: {
    color: "var(--primary)",
    contrastColor: "var(--primary-foreground)",
    hoverColor: "color-mix(in oklch, var(--primary), var(--foreground) 8%)",
    activeColor: "color-mix(in oklch, var(--primary), var(--background) 8%)",
  },
  highlight: {
    background: "var(--accent)",
    focusBackground: "var(--secondary)",
    color: "var(--accent-foreground)",
    focusColor: "var(--secondary-foreground)",
  },
  formField: {
    background: "var(--background)",
    disabledBackground: "var(--muted)",
    filledBackground: "var(--secondary)",
    filledHoverBackground: "var(--secondary)",
    filledFocusBackground: "var(--background)",
    borderColor: "var(--input)",
    hoverBorderColor: "var(--ring)",
    focusBorderColor: "var(--ring)",
    invalidBorderColor: "var(--destructive)",
    color: "var(--foreground)",
    disabledColor: "var(--muted-foreground)",
    placeholderColor: "var(--muted-foreground)",
    invalidPlaceholderColor: "var(--destructive)",
    floatLabelColor: "var(--muted-foreground)",
    floatLabelFocusColor: "var(--foreground)",
    floatLabelActiveColor: "var(--muted-foreground)",
    floatLabelInvalidColor: "var(--destructive)",
    iconColor: "var(--muted-foreground)",
  },
  text: {
    color: "var(--foreground)",
    hoverColor: "var(--foreground)",
    mutedColor: "var(--muted-foreground)",
    hoverMutedColor: "var(--foreground)",
  },
  content: {
    background: "var(--card)",
    hoverBackground: "var(--accent)",
    borderColor: "var(--border)",
    color: "var(--card-foreground)",
    hoverColor: "var(--accent-foreground)",
  },
  overlay: {
    select: {
      background: "var(--popover)",
      borderColor: "var(--border)",
      color: "var(--popover-foreground)",
    },
    popover: {
      background: "var(--popover)",
      borderColor: "var(--border)",
      color: "var(--popover-foreground)",
    },
    modal: {
      background: "var(--popover)",
      borderColor: "var(--border)",
      color: "var(--popover-foreground)",
    },
  },
  list: {
    option: {
      focusBackground: "var(--accent)",
      selectedBackground: "var(--primary)",
      selectedFocusBackground: "var(--primary)",
      color: "var(--foreground)",
      focusColor: "var(--accent-foreground)",
      selectedColor: "var(--primary-foreground)",
      selectedFocusColor: "var(--primary-foreground)",
      icon: {
        color: "var(--muted-foreground)",
        focusColor: "var(--foreground)",
      },
    },
    optionGroup: {
      background: "transparent",
      color: "var(--muted-foreground)",
    },
  },
  navigation: {
    item: {
      focusBackground: "var(--accent)",
      activeBackground: "var(--accent)",
      color: "var(--foreground)",
      focusColor: "var(--accent-foreground)",
      activeColor: "var(--accent-foreground)",
      icon: {
        color: "var(--muted-foreground)",
        focusColor: "var(--foreground)",
        activeColor: "var(--foreground)",
      },
    },
    submenuLabel: {
      background: "transparent",
      color: "var(--muted-foreground)",
    },
    submenuIcon: {
      color: "var(--muted-foreground)",
      focusColor: "var(--foreground)",
      activeColor: "var(--foreground)",
    },
  },
};

export const fcgPrimePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "var(--primary)",
      100: "var(--primary)",
      200: "var(--primary)",
      300: "var(--primary)",
      400: "var(--primary)",
      500: "var(--primary)",
      600: "var(--primary)",
      700: "var(--primary)",
      800: "var(--primary)",
      900: "var(--primary)",
      950: "var(--primary)",
    },
    focusRing: {
      color: "var(--ring)",
    },
    colorScheme: {
      light: semanticColorScheme,
      dark: semanticColorScheme,
    },
  },
});
