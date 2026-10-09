/** A value that may be null or undefined. */
export type Nullable<T> = T | null | undefined;

/** Removes a type's index signatures, so a misspelt property is an error rather than `unknown`. */
export type Strict<T> = { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };
