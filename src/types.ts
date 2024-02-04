type Topic = string | symbol

interface BaseType {
  USE?: Topic;
  DEF?: Topic;
}

interface TypeWithDef<T> extends BaseType {
  DEF: Topic;
  children?: T extends { children: infer C } ? { children?: C } : object
}

interface TypeWithUse<T> extends BaseType {
  USE: Topic;
  children?: T | never
}

type TypeWithDefAndUse<T> = (TypeWithUse<T> | TypeWithDef<T>) & T;

type State = Record<Topic,unknown>
type StateTransformer = (newState?:State) => State

export {type Topic, type TypeWithDefAndUse, type State, type StateTransformer }