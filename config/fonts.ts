import localFont from "next/font/local";

/** Timeless Sans's Grotesk Regular, as a CSS variable for the theme. */
export const timelessSans = localFont({
  src: "../app/fonts/TimelessSans-Grotesk.woff2",
  weight: "400",
  variable: "--font-timeless-sans",
  display: "swap",
});

/** Timeless Serif's Text cut from light to medium, with its italic, as a CSS variable for the theme. */
export const timelessSerif = localFont({
  src: [
    { path: "../app/fonts/TimelessSerif-Text.woff2", weight: "300 500", style: "normal" },
    { path: "../app/fonts/TimelessSerif-Italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-timeless-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Geist Mono from regular to medium, with its italic, as a CSS variable for the theme. */
export const geistMono = localFont({
  src: [
    { path: "../app/fonts/GeistMono.woff2", weight: "400 500", style: "normal" },
    { path: "../app/fonts/GeistMono-Italic.woff2", weight: "400 500", style: "italic" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  adjustFontFallback: false,
});
