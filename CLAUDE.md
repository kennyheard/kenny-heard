# Project Guidelines

## Environment

**Package manager.** Use Bun as the package manager and runtime: to install dependencies, run scripts, and execute packages. Install dependencies with exact versions using `-E`, and use `-D` for development dependencies.

**Dependencies.** Declare every package the application imports, even if it's already installed as a dependency of another package. The exception is a package that a host framework provides to code running inside it, such as `@sanity/ui` or `rxjs` in Studio components, or `@next/env` from Next.js. Declaring one of those separately risks installing a second copy alongside the host's.

**Scripts.** Use the scripts in `package.json` rather than running tools directly. Run a tool manually only when no script covers what you need.

**Linting.** Never add a lint suppression comment without explicit approval. If a rule seems worth suppressing, suggest it and wait.

## Oxlint Configuration

**Ordering.** Keep the rules in `oxlint.config.ts` in alphabetical order.

**Configure before disabling.** Check a rule's options before turning it off. Only disable a rule when no configuration makes it useful.

**Comments.** Every rule needs a comment explaining why it's configured that way, not what the rule does.

**Tool boundaries.** Oxfmt handles formatting and Oxlint handles linting. Configure them so they don't overlap.

## Behaviour

**British English.** Write everything in British English: responses, comments, and documentation. The exception is code identifiers and keywords that require American spelling, like `color` in CSS or `backgroundColor` in JavaScript.

**Stay focused.** Work only on what was asked. If you spot problems elsewhere, flag them but don't fix them, because other people or agents may be working on those parts of the codebase.

**Match existing patterns.** Match the structure, naming, and spacing of existing examples of whatever you're creating. If there are no examples, or they conflict with each other, ask before going ahead.

## Structure

**Directories.** `lib/` holds helpers and factories. `config/` calls those factories with the project's own definitions. `sanity/lib/` and `sanity/config/` follow the same split for code that only makes sense in terms of Sanity schemas. `hooks/` holds React hooks, one per file named after the hook, along with any types they produce. `contexts/` holds React contexts and their value types, while the component that provides a context stays in `components/`.

**Cross-references.** The split is about where things are defined, not a rule that imports only go one way. A factory in `lib/` can import another factory's configured instance from `config/` instead of taking it as an argument. The only hard rule is that no import may create a module cycle.

**Shared code.** A helper, type, or constant used by more than one component lives in `lib/`, `config/`, `hooks/`, or `contexts/`, never exported from a component or section file. Before writing one, look for an existing one with the same shape and reuse it.

## Code

**Naming.** Use complete, unabbreviated names. Constants use camelCase like any other variable. Import exports by name rather than through a namespace (except where lint requires a default import, such as `node:path`), and use path aliases rather than relative paths.

**Ordering.** When a definition sets an order, such as a type, an interface, or a schema, everything that uses or mirrors it follows the same order. That includes destructuring, function parameters, component props, and query fields. Where a spread makes this impractical, the properties after the spread still follow the definition's order. A component's own props come first, in the order its type declares them, followed by its variant props. Where a TypeScript type and its Sanity schema disagree, the TypeScript type sets the order.

**File structure.** Order each file as imports, types and interfaces, constants, functions, then components. A helper that only serves the file's main definition goes directly above it, even when that definition is a constant.

**Absence.** Use `undefined` for missing values. Only use `null` where something outside the codebase requires it, such as a third-party API, or a React component that intentionally renders nothing.

**Existence checks.** Use `isDefined` instead of truthiness checks or comparisons with `undefined`. It already treats empty strings, arrays, and objects as absent, so use it instead of a `.length` check, and keep `.length` for actual counts. An array counts as absent unless at least one of its elements is present, so `isDefined([first, second, third])` checks whether any of several values exists. Check real booleans directly.

**Destructuring.** When a function reads several properties from the same object, or reads one property repeatedly, destructure them at the top: `const { links, name } = menu ?? {}` rather than repeated `menu?.…` reads. A single read doesn't need destructuring, and optional chaining is fine. Don't destructure where it would lose a type guard's narrowing or force you to rename properties to avoid a clash.

**Abstraction.** Don't create named constants for trivial or single-use values. Inline a unit conversion, and put a one-off options object at its call site. Only extract values that are shared, act as configuration, or aren't obvious.

**Definition tables.** Only use `as const satisfies T[]` on a list of literals when a type is derived from the value. When the type comes first, use a plain type annotation, which is clearer and keeps the value mutable.

**Styling.** Use only Tailwind utilities. Never write plain CSS, except for vendor prefixes and browser overrides that Tailwind can't express. Don't add custom utilities without approval. Studio components are the exception: the Studio only loads theme tokens, so style them with `@sanity/ui` primitives, and use an inline `style` only for what those can't do.

**CSS values.** Never copy a CSS value into JavaScript, such as a radius, padding, or duration a class already sets. Share it through a CSS custom property, or read it from the laid-out element.

**Canonical classes.** Write every Tailwind class in its canonical form, the one Tailwind CSS IntelliSense's `suggestCanonicalClasses` check proposes. Prefer a theme utility to an arbitrary value, and where an arbitrary value is unavoidable, write it the way the check expects. Before finishing any change to classes, check them with Tailwind's own canonicaliser rather than by eye: load the design system from the project's main stylesheet with `__unstable__loadDesignSystem` from `@tailwindcss/node`, pass each class to `canonicalizeCandidates`, and fix any that come back different.

**Variants.** Each component has exactly one `tv` object, exported as `variants` and applied to the root element with `variants({ className })`. Don't create a second variants object, or a wrapper component that only holds a class string; style other elements with inline Tailwind classes. A component with no root element of its own has no variants object and takes no `className`. An empty `tv({})` is a placeholder for styling to come, so leave it in place.

**Slots.** Only use `tv` slots when shared variant keys restyle several elements together. A component with a few statically styled elements uses a single `base` and inline classes.

**Conditional classes.** Build every conditional class with `cn` from `tailwind-variants`, including inside a `variants({ className })` call. Never pass a bare ternary or array as a `className`. Plain concatenation with no condition doesn't need `cn`.

## React

**Server components.** Only add `"use client"` when a component needs client-side interactivity. Everything a client component imports ships to the browser, so keep client components small: render content in server components and pass it to them as `children`.

**Memoisation.** React Compiler handles memoisation, so never use `useMemo`, `useCallback`, or `React.memo`.

**Props.** Derive a component's props from `ComponentProps<"element">` for its root element, intersected with `VariantProps<typeof variants>`, so standard attributes are inherited rather than redeclared. Export the props type, and spread `{...props}` onto the root element as its last attribute so the consumer's values take precedence.

**Attribute order.** Order a JSX element's attributes from what it is to how it looks: `key` first, then what it renders, then behaviour such as `target`, event handlers, `ref`, and `tabIndex`, then `role` and ARIA attributes, then presentation (a component's variant props, `className`, and `style`), with the spread last.

**Wrapping components.** When wrapping an existing component, derive its props from the wrapped component's type and use `Omit` for the props you handle internally, so the original's type constraints carry over. `Omit` flattens a union, so when the wrapped props are a union, also omit the props of any branch the wrapper never uses. Never omit `className` or `children` only to declare them again as a `string` or `ReactNode`. Omit `children` only when the wrapper renders its own content and takes none.

**Conditional rendering.** Render conditional elements with `{condition && <Element />}`, never with a ternary whose else branch is `undefined`. This only applies to JSX children; value ternaries like `aria-current={isActive ? "page" : undefined}` are fine.

**Markup.** Only use `ul`, `ol`, and `li` for actual text lists. Lay out card grids, icon groups, tab strips, and pagination with `div` and `span`.

**DOM access.** Target elements with refs, not ids and `querySelector`. When the element and the code that uses it are in different components, share the ref through a small client context. Ids used only as CSS hooks are fine.

## TypeScript

**No `any`.** Never use `any`, and prefer specific types over `unknown` wherever possible.

**Inferred return types.** Let TypeScript infer return types. Only annotate one where the annotation is the contract, such as unifying several branch shapes or typing a callback's parameters, or where a named type reads better on hover than an expanded object. The compiler asking for an annotation is a reason to look, not a reason to add one. If an annotation only makes up for a weak type upstream, fix that type instead. Next.js metadata routes and `generateMetadata` are annotated by convention.

**Exports.** Export every type that describes data, settings, or props, including the pieces it's built from, even when nothing outside the file uses them yet. Keep a type local only when it's a function's private working shape that no caller should need.

**Exclusive props.** For props that can't be passed together, use `Exclusive` from `types.ts` rather than writing out `?: never` by hand.

## Documentation

**What to document.** Add JSDoc to utility functions, hooks, context providers, non-obvious constants (including any returned by a `lib/` or `config/` factory), and interface properties. Types and interfaces in `lib/` also get JSDoc on the definition itself. Don't document React components or their props types, Sanity schema types or their properties (their `description` strings cover them), `variants` objects, constants that are framework conventions or obvious from context, Sanity's `_type` and `_key` properties, or a single property already explained by its definition's JSDoc. Functions nested inside a component or hook, such as event handlers, aren't documented. If one needs explaining, move it to a module-level helper and document that.

**How to document.** Describe what the code does, not how it does it, so the documentation stays true after a refactor; don't mention specific function names or implementation details. Always include `@param` and `@returns` tags without type annotations, and `@throws` when a function throws. Don't use any other tags. A function that returns nothing has no `@returns`. Describe a missing value as "or undefined when …", never "where". Start a boolean's description with "Whether …", or with "True if …" when it narrows a type. Never document a parameter name that isn't in the signature: name each parameter, or let a props type carry the documentation.

**Length.** Write more only when the code does something surprising; importance alone doesn't justify length. Add a second sentence only when the behaviour would catch someone out, and make the point once. Keep reasons out of `@param` and `@returns`, which describe values.

**Layout.** Put a single-sentence block on one line when it fits within the print width. Tags require the multi-line form, with a blank line between the summary and the tags.

**Comments.** JSDoc carries the documentation, so keep inline `//` comments rare. Never add one that narrates or restates the code. Only use one for something the code can't show: a deliberate omission that looks like a mistake, a constraint that isn't visible locally, or the reason behind a decision that someone might otherwise undo. Put the comment next to the code it applies to, keep it to one line within the print width, and never put it inside JSX. Every lint suppression must say why.

## Sanity

**Descriptions.** Give every field a `description` for CMS authors. Write it as a noun phrase naming the value, with no leading article and a full stop at the end. Add a second sentence only for an instruction the author needs to act on. Keep descriptions consistent with the existing ones.

**Type safety.** Use `defineField` for all fields and `defineArrayMember` inside array `of` properties. Use `satisfies` to keep field names in sync with their TypeScript types. An inline `defineArrayMember` needs a singular `name`. One that references a type registered elsewhere uses that type's name instead: a different `name` registers the type again under that name, and the `name` is what's stored as `_type` on the value.

**Validation messages.** A custom validator returns a sentence saying what's wrong and what to do, ending in a full stop. `rule.required()` takes no message, so required fields show the Studio's standard message.

**Previews.** Every document and object type needs a preview. Use `select` to map fields to preview properties, and add `prepare` when the values need transforming or a fallback. Authors can select objects in the CMS just like documents, so objects need useful previews too, including inline array members.

**Titles.** Don't set a `title` on fields or array members unless title-casing the `name` would get it wrong, typically with abbreviations like "SEO" or "URL".

**Queries.** Name GROQ helpers in `sanity/groq/` after what they return. A standalone `*[...]` expression is a `*Query`, and a projection spread into a parent query is a `*Fragment`.

**Fetching.** Fetch only the fields a page renders. Give listings their own card fragment rather than reusing a document's full projection or `...`, which brings in its body, and never expand a bare `asset->`, which brings in the whole asset document. Pass a client component only the values it renders: map documents to plain values in the server component, or render items on the server and pass them in as `children`.

**Data strings.** Sanity strings contain invisible stega characters on any fetch that doesn't turn stega off. Rendering one as text is safe, but a string that gets parsed, compared, or put into a URL, key, or filter must go through `stegaClean` first. Otherwise it fails silently, and only in Presentation mode.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
