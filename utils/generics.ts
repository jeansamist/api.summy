// Generic utility to extract only the properties (exclude methods) of a class
export type ModelProps<T> = {
  [K in keyof T as K extends string
    ? K extends `$${string}` // omit $-prefixed
      ? never
      : K extends 'id' | 'createdAt' | 'updatedAt' // omit these
        ? never
        : T[K] extends Function // omit methods
          ? never
          : K
    : never]: T[K]
}
