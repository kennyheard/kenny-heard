import type { Reference } from "sanity";

import { isProduction } from "@/lib/environment";
import type { Nullable } from "@/types";

/**
 * Checks whether a value is present. `false`, blank strings, and empty plain objects count as absent,
 * as does an array with no present elements.
 *
 * @param value - The value to check.
 * @returns True if the value is present.
 */
export function isDefined<T>(value: Nullable<T>): value is T {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some((element) => isDefined(element));

  if (typeof value === "object") {
    const prototype = Reflect.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return true;

    return Object.keys(value).length > 0;
  }

  return true;
}

/**
 * Checks whether a query expanded a Sanity reference into the document it points to, logging an error
 * outside production when it did not.
 *
 * @param reference - The reference to check.
 * @returns True if the reference is expanded.
 */
export function isExpandedReference<
  T extends object & ([Extract<T, { _ref: string }>] extends [never] ? never : unknown),
>(reference: T | undefined): reference is Exclude<T, Reference> {
  if (!isDefined(reference)) return false;

  if ("_ref" in reference) {
    if (!isProduction) {
      console.error(
        `Reference "${String(reference._ref)}" has not been expanded. See: https://www.sanity.io/docs/content-lake/how-queries-work#k8ca3cefc3a31`,
      );
    }

    return false;
  }

  return true;
}

/**
 * Returns an object's key–value pairs, keeping their types.
 *
 * @param object - The object to read.
 * @returns The object's key–value pairs.
 */
export function objectEntries<T extends object>(object: T) {
  // oxlint-disable-next-line no-unsafe-type-assertion -- Object.entries returns loosely typed pairs.
  return Object.entries(object) as [keyof T, T[keyof T]][];
}

/**
 * Builds an object from key–value pairs, keeping their types.
 *
 * @param entries - The key–value pairs.
 * @returns An object built from the pairs.
 */
export function objectFromEntries<K extends PropertyKey, V>(entries: readonly (readonly [K, V])[]) {
  // oxlint-disable-next-line no-unsafe-type-assertion -- Object.fromEntries returns a loosely typed object.
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Returns an object's keys, keeping their type.
 *
 * @param object - The object to read.
 * @returns The object's keys.
 */
export function objectKeys<T extends object>(object: T) {
  // oxlint-disable-next-line no-unsafe-type-assertion -- Object.keys returns loosely typed keys.
  return Object.keys(object) as (keyof T)[];
}

/**
 * Returns an object's values, keeping their type.
 *
 * @param object - The object to read.
 * @returns The object's values.
 */
export function objectValues<T extends object>(object: T) {
  // oxlint-disable-next-line no-unsafe-type-assertion -- Object.values returns loosely typed values.
  return Object.values(object) as T[keyof T][];
}

/**
 * Converts a string to another case.
 *
 * @param value - The string to convert.
 * @param format - The case to convert to.
 * @returns The converted string.
 */
export function convertCase(value: string, format: "kebab" | "snake" | "camel" | "pascal" | "title" | "sentence") {
  const words = value
    .replaceAll(/(?<lower>[a-z0-9])(?<upper>[A-Z])/gu, "$<lower> $<upper>")
    .replaceAll(/[-_\s]+/gu, " ")
    .trim()
    .toLowerCase();

  switch (format) {
    case "kebab": {
      return words.replaceAll(/\s+/gu, "-");
    }
    case "snake": {
      return words.replaceAll(/\s+/gu, "_");
    }
    case "camel": {
      return words.replaceAll(/\s+(?<character>.)/gu, (_match, character: string) => character.toUpperCase());
    }
    case "pascal": {
      return words.replaceAll(/(?:^|\s+)(?<character>.)/gu, (_match, character: string) => character.toUpperCase());
    }
    case "title": {
      return words.replaceAll(/\b\w/gu, (character) => character.toUpperCase());
    }
    case "sentence": {
      return words.replaceAll(/^(?<character>.)/gu, (character) => character.toUpperCase());
    }
    default: {
      return value;
    }
  }
}
