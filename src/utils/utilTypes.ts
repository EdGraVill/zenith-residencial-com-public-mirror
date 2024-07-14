export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type ValueOfNestedKey<
  ObjectType extends object,
  Key extends NestedKeyOf<ObjectType>,
> = Key extends `${infer K}.${infer Rest}`
  ? K extends keyof ObjectType
    ? // @ts-expect-error Type 'ObjectType[string]' is not assignable to type 'object'.
      ValueOfNestedKey<ObjectType[K], Rest>
    : never
  : Key extends keyof ObjectType
    ? ObjectType[Key]
    : never;

export type NestedOmit<ObjectType extends object, Key extends string> = {
  [K in keyof ObjectType]: K extends Key
    ? never
    : ObjectType[K] extends object
      ? NestedOmit<ObjectType[K], Key>
      : ObjectType[K];
};
