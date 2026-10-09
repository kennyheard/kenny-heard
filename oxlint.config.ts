import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    reportUnusedDisableDirectives: "error",
    typeAware: true,
    typeCheck: true,
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ["eslint", "import", "jsdoc", "jsx-a11y", "nextjs", "oxc", "promise", "react", "typescript", "unicorn"],
  categories: {
    correctness: "error",
    // Nursery rules are unfinished and can flag correct code, so they warn rather than fail the build.
    nursery: "warn",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  rules: {
    // Conditional rendering inflates the score of components that are simple to follow.
    complexity: "off",

    // Single-line guard clauses read clearly without braces.
    curly: ["error", "multi-line", "consistent"],

    // Return types are inferred, and annotated only where the annotation is the contract.
    "explicit-function-return-type": "off",

    // This is an application, not a published library, so its exports have no outside consumers to fix a type for.
    "explicit-module-boundary-types": "off",

    // Matches the function declarations used throughout Next.js, React, and Sanity.
    "func-style": ["error", "declaration"],

    // Names are kept complete by convention, which a length limit can't judge.
    "id-length": "off",

    // Exports sit on their declarations, which follow the file order rather than coming last.
    "import/exports-last": "off",

    // Exports sit on their declarations rather than in a single block.
    "import/group-exports": "off",

    // The number of imports doesn't reflect how complex a module is.
    "import/max-dependencies": "off",

    // Next.js pages and layouts, the Studio configuration, and tool configuration files require default exports.
    "import/no-default-export": "off",

    // Named exports are the default wherever a framework doesn't require otherwise.
    "import/no-named-export": "off",

    // Server code uses Node.js built-in modules.
    "import/no-nodejs-modules": "off",

    // Type declarations, stylesheets, and the `server-only` guard are imported for their side effects.
    "import/no-unassigned-import": ["error", { allow: ["**/*.d.ts", "**/*.css", "server-only"] }],

    // A file with a single export still uses a named export.
    "import/prefer-default-export": "off",

    // A destructured parameter is documented on its type rather than property by property.
    "jsdoc/require-param": ["error", { checkDestructured: false }],

    // Parameter types come from TypeScript, so a JSDoc type would repeat them.
    "jsdoc/require-param-type": "off",

    // Return types come from TypeScript, so a JSDoc type would repeat them.
    "jsdoc/require-returns-type": "off",

    // Thrown types aren't declared in TypeScript, and the project's JSDoc carries no type annotations.
    "jsdoc/require-throws-type": "off",

    // Size limits don't reflect how hard code is to follow.
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-params": "off",
    "max-statements": "off",

    // Capitalised functions are React components, not constructors.
    "new-cap": ["error", { capIsNew: false }],

    // Errors are deliberately reported to the console, and the Sanity CLI loader logs through it.
    "no-console": "off",

    // An early `continue` keeps a loop body flat, as an early return does in a function.
    "no-continue": "off",

    // Type imports sit on their own line, apart from value imports from the same module.
    "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],

    // A comment sits beside the code it governs, which is sometimes on the same line.
    "no-inline-comments": "off",

    // Numbers read clearly in place, and single-use values aren't extracted into named constants.
    "no-magic-numbers": "off",

    // Every target environment supports optional chaining.
    "no-optional-chaining": "off",

    // A flat ternary is the clearest way to choose between two values; JSX children use `&&` instead.
    "no-ternary": "off",

    // `undefined` is how the codebase represents a missing value.
    "no-undefined": "off",

    // Sanity's system fields and query metadata start with an underscore.
    "no-underscore-dangle": "off",

    // Constants come before the functions they call and components before their helpers, which hoisting allows.
    "no-use-before-define": ["error", { functions: false }],

    // `void` as a statement discards a returned promise on purpose.
    "no-void": ["error", { allowAsStatement: true }],

    // One declaration per statement keeps each JSDoc block attached to the declaration it documents.
    "one-var": ["error", "never"],

    // Every target environment supports async functions.
    "oxc/no-async-await": "off",

    // The arrays mapped here are small, so building each object with a spread costs nothing noticeable.
    "oxc/no-map-spread": "off",

    // Components forward props with object rest and spread.
    "oxc/no-rest-spread-properties": "off",

    // React and Sanity types have no readonly versions to accept.
    "prefer-readonly-parameter-types": "off",

    // The rule forbids `className` and `style`, which are how components are styled.
    "react/forbid-component-props": "off",

    // Matches `func-style`.
    "react/function-component-definition": [
      "error",
      { namedComponents: "function-declaration", unnamedComponents: "function-expression" },
    ],

    // JSX lives in `.tsx` files, which the rule rejects.
    "react/jsx-filename-extension": "off",

    // Nesting depth follows the markup a component needs.
    "react/jsx-max-depth": "off",

    // React Compiler memoises context provider values.
    "react/jsx-no-constructed-context-values": "off",

    // The site has a single locale, so there's no translation layer for JSX text to go through.
    "react/jsx-no-literals": "off",

    // Returning dynamic children as a single element sometimes needs a fragment around one expression.
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],

    // Components spread their remaining props onto their root element.
    "react/jsx-props-no-spreading": "off",

    // Routes and components keep their cached and dynamic variants in the same file.
    "react/no-multi-comp": "off",

    // Components export their props type and variants alongside them, at the cost of some Fast Refresh updates.
    "react/only-export-components": "off",

    // The automatic JSX transform doesn't need React in scope.
    "react/react-in-jsx-scope": "off",

    // Oxfmt sorts import declarations, so this only sorts the members within each.
    "sort-imports": ["error", { ignoreDeclarationSort: true }],

    // Keys follow the order their definition sets, not the alphabet.
    "sort-keys": "off",

    // Sanity schemas nest `define*` calls to describe structure.
    "unicorn/max-nested-calls": "off",

    // React components return null to render nothing.
    "unicorn/no-null": "off",

    // An explicit `return undefined` keeps a function's return paths consistent.
    "unicorn/no-useless-undefined": "off",
  },
});
