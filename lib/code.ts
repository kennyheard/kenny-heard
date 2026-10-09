import { bundledLanguages, codeToTokens, getTokenStyleObject } from "shiki";
import type { BundledLanguage } from "shiki";
import { cn } from "tailwind-variants";

import { codeColorClasses, codeTheme } from "@/config/code";
import { isDefined } from "@/lib/utils";

/** Run of highlighted code in one colour and style. */
export interface CodeToken {
  /** Unique key for the token, from its position in the code. */
  key: string;
  /** Text of the token. */
  content: string;
  /** Classes that colour and style the token, or undefined when it has neither. */
  className?: string;
}

/** Line of highlighted code. */
export interface CodeLine {
  /** Unique key for the line. */
  key: string;
  /** Tokens on the line, in order. */
  tokens: CodeToken[];
}

/**
 * Checks whether a language is one Shiki can highlight.
 *
 * @param language - The language's name.
 * @returns True if Shiki bundles the language.
 */
function isBundledLanguage(language: string): language is BundledLanguage {
  return language in bundledLanguages;
}

/**
 * Highlights code in the site's code theme, as plain text when the language isn't recognised.
 *
 * @param code - The code to highlight.
 * @param language - The code's language, such as `tsx`.
 * @returns The code's lines, each split into tokens with the classes that style them.
 */
export async function highlightCode(code: string, language?: string) {
  const lang = isDefined(language) && isBundledLanguage(language) ? language : "text";
  const { tokens } = await codeToTokens(code, { lang, theme: codeTheme });

  return tokens.map((line, index): CodeLine => ({
    key: `line-${index}`,
    tokens: line.map((token) => {
      const { color, "font-style": fontStyle } = getTokenStyleObject(token);

      return {
        key: `token-${token.offset}`,
        content: token.content,
        className: cn(isDefined(color) && codeColorClasses[color], fontStyle === "italic" && "italic"),
      };
    }),
  }));
}
