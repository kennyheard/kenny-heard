import localFont from "next/font/local";

/** Timeless Sans's Grotesk Regular, as a CSS variable for the theme. */
export const timelessSans = localFont({
  src: "../app/fonts/TimelessSans-GroteskRegular.woff2",
  weight: "400",
  variable: "--font-timeless-sans",
  display: "swap",
});

/** Timeless Serif's Text cut in light, regular, and medium, with their italics, as a CSS variable for the theme. */
export const timelessSerif = localFont({
  src: [
    { path: "../app/fonts/TimelessSerif-TextLight.woff2", weight: "300", style: "normal" },
    { path: "../app/fonts/TimelessSerif-TextRegular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/TimelessSerif-TextMedium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/TimelessSerif-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../app/fonts/TimelessSerif-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../app/fonts/TimelessSerif-MediumItalic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-timeless-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Geist Mono in regular and medium, with their italics, as a CSS variable for the theme. */
export const geistMono = localFont({
  src: [
    { path: "../app/fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/GeistMono-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../app/fonts/GeistMono-MediumItalic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  adjustFontFallback: false,
});
