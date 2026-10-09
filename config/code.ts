import type { ThemeRegistration } from "shiki";

/**
 * Zen, Kenny's Zed theme, as a Shiki theme whose colours are the site's code tokens, so it follows light and dark
 * mode without highlighting twice.
 */
export const codeTheme: ThemeRegistration = {
  name: "zen",
  type: "light",
  colors: {
    "editor.foreground": "var(--color-code)",
    "editor.background": "transparent",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "var(--color-code-comment)", fontStyle: "italic" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "constant.language"],
      settings: { foreground: "var(--color-code-keyword)", fontStyle: "italic" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.type",
        "entity.name.class",
        "entity.name.tag",
        "support.class",
        "support.type",
      ],
      settings: { foreground: "var(--color-code-function)" },
    },
    {
      scope: ["variable", "variable.parameter", "meta.object-literal.key", "support.variable"],
      settings: { foreground: "var(--color-code-variable)" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "var(--color-code-operator)", fontStyle: "" },
    },
  ],
};

/** Tailwind class for each colour in the code theme, so highlighted code is styled with the site's tokens. */
export const codeColorClasses: Record<string, string> = {
  "var(--color-code)": "text-code",
  "var(--color-code-variable)": "text-code-variable",
  "var(--color-code-operator)": "text-code-operator",
  "var(--color-code-keyword)": "text-code-keyword",
  "var(--color-code-comment)": "text-code-comment",
  "var(--color-code-function)": "text-code-function",
};
