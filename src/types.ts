type Topic = string | symbol

interface BaseType {
  USE?: Topic;
  DEF?: Topic;
}

interface TypeWithDef<T> extends BaseType {
  DEF: Topic;
  children?: T extends { children: infer C } ? { children?: C } : {}
}

interface TypeWithUse<T> extends BaseType {
  USE: Topic;
  children?: never
}

type TypeWithDefAndUse<T> = (TypeWithUse<T> | TypeWithDef<T>) & T;

export {type Topic, type TypeWithDefAndUse }