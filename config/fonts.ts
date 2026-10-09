import { Geist } from "next/font/google";

/** Primary typeface, exposed as a CSS variable for the Tailwind theme. */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
