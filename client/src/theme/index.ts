import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsRoot: "html",
  theme: {
    breakpoints: {
      xs: "375px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    tokens: {
      colors: {
        sweetpet: {
          primary: {
            50: { value: "#f0f2ff" },
            100: { value: "#e1e5ff" },
            200: { value: "#c3cbff" },
            300: { value: "#a5b1ff" },
            400: { value: "#8797ff" },
            500: { value: "#4758EF" },
            600: { value: "#2639E6" },
            700: { value: "#1f2db8" },
            800: { value: "#18228a" },
            900: { value: "#12165c" },
            950: { value: "#0c0f3d" },
          },
          accent: {
            50: { value: "#fef9f2" },
            100: { value: "#fef2e5" },
            200: { value: "#fde5cb" },
            300: { value: "#fcd8b1" },
            400: { value: "#fbcb97" },
            500: { value: "#F58E2E" },
            600: { value: "#F78012" },
            700: { value: "#c4650e" },
            800: { value: "#914b0a" },
            900: { value: "#5e3007" },
            950: { value: "#3d1f04" },
          },
          gray: {
            50: { value: "#f8f9fa" },
            100: { value: "#e9ecef" },
            200: { value: "#dee2e6" },
            300: { value: "#ced4da" },
            400: { value: "#adb5bd" },
            500: { value: "#6c757d" },
            600: { value: "#495057" },
            700: { value: "#343a40" },
            800: { value: "#212529" },
            900: { value: "#1a1e21" },
            1000: { value: "#262626" },
            1100: { value: "#0A0A0A" },
          },
        },
      },
      fonts: {
        body: { value: "IBM Plex Sans, sans-serif" },
        heading: { value: "IBM Plex Sans, sans-serif" },
      },
      fontSizes: {
        xl: { value: "32px" },
        headingLg: { value: "32px" },
        headingMd: { value: "26px" },
        headingSm: { value: "21px" },
        body: { value: "16px" },
        label: { value: "14px" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
