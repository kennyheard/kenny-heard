/** A value that may be null or undefined. */
export type Nullable<T> = T | null | undefined;

/** Removes a type's index signatures, so a misspelt property is an error rather than `unknown`. */
export type Strict<T> = { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };

/** Either of two sets of props, with the other set's props forbidden. */
export type Exclusive<A, B> =
  | (A & Partial<Record<Exclude<keyof B, keyof A>, never>>)
  | (B & Partial<Record<Exclude<keyof A, keyof B>, never>>);

declare module "react" {
  interface CSSProperties {
    /** Size of an inline icon, which the space kept for it in the line matches. */
    "--icon-size"?: string | number;
  }
}
